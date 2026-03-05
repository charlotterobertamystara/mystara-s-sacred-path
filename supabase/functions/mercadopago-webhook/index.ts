import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    console.log("Webhook received:", JSON.stringify(body));

    const MP_ACCESS_TOKEN = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    if (!MP_ACCESS_TOKEN) throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Handle payment notifications
    if (body.type === "payment") {
      const paymentId = body.data?.id;
      if (!paymentId) return new Response("OK", { headers: corsHeaders });

      const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
      });
      const payment = await paymentRes.json();

      const userId = payment.external_reference;
      if (!userId) return new Response("OK", { headers: corsHeaders });

      // Record transaction
      await supabaseAdmin.from("payment_transactions").insert({
        user_id: userId,
        mp_payment_id: String(paymentId),
        amount: payment.transaction_amount,
        currency: payment.currency_id || "BRL",
        status: payment.status,
        description: payment.description || "Assinatura Mystara",
      });

      // If payment approved, activate subscription
      if (payment.status === "approved") {
        await supabaseAdmin.from("subscriptions").upsert({
          user_id: userId,
          status: "active",
          plan_type: "premium",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }, { onConflict: "user_id" });

        // Set unlimited credits (-1 = unlimited)
        await supabaseAdmin.from("user_credits").upsert({
          user_id: userId,
          credits_remaining: -1,
        }, { onConflict: "user_id" });
      }
    }

    // Handle subscription (preapproval) notifications
    if (body.type === "subscription_preapproval") {
      const preapprovalId = body.data?.id;
      if (!preapprovalId) return new Response("OK", { headers: corsHeaders });

      const preRes = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
        headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
      });
      const preapproval = await preRes.json();

      const userId = preapproval.external_reference;
      if (!userId) return new Response("OK", { headers: corsHeaders });

      const statusMap: Record<string, string> = {
        authorized: "active",
        paused: "paused",
        cancelled: "cancelled",
        pending: "pending",
      };

      const newStatus = statusMap[preapproval.status] || preapproval.status;

      await supabaseAdmin.from("subscriptions").upsert({
        user_id: userId,
        mp_preapproval_id: preapprovalId,
        status: newStatus,
        plan_type: newStatus === "active" ? "premium" : "free",
      }, { onConflict: "user_id" });

      if (newStatus === "active") {
        await supabaseAdmin.from("user_credits").upsert({
          user_id: userId,
          credits_remaining: -1,
        }, { onConflict: "user_id" });
      } else if (newStatus === "cancelled") {
        // Reset to free plan credits
        await supabaseAdmin.from("user_credits").upsert({
          user_id: userId,
          credits_remaining: 0,
        }, { onConflict: "user_id" });
      }
    }

    return new Response("OK", { headers: corsHeaders });
  } catch (e) {
    console.error("webhook error:", e);
    return new Response("Error", { status: 500, headers: corsHeaders });
  }
});
