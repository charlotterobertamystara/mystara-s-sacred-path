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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(
      authHeader.replace("Bearer ", "")
    );
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get current credits
    const { data: credits } = await supabaseAdmin
      .from("user_credits")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!credits) {
      // Create credits for existing user
      await supabaseAdmin.from("user_credits").insert({
        user_id: userId,
        credits_remaining: 5,
      });
      // Consume 1
      await supabaseAdmin.from("user_credits").update({
        credits_remaining: 4,
        total_credits_used: 1,
      }).eq("user_id", userId);

      return new Response(JSON.stringify({ success: true, credits_remaining: 4 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // -1 means unlimited (premium)
    if (credits.credits_remaining === -1) {
      await supabaseAdmin.from("user_credits").update({
        total_credits_used: credits.total_credits_used + 1,
      }).eq("user_id", userId);

      return new Response(JSON.stringify({ success: true, credits_remaining: -1 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (credits.credits_remaining <= 0) {
      return new Response(JSON.stringify({ 
        error: "Créditos insuficientes. Assine o plano premium para uso ilimitado.",
        credits_remaining: 0,
      }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Consume 1 credit
    await supabaseAdmin.from("user_credits").update({
      credits_remaining: credits.credits_remaining - 1,
      total_credits_used: credits.total_credits_used + 1,
    }).eq("user_id", userId);

    return new Response(JSON.stringify({
      success: true,
      credits_remaining: credits.credits_remaining - 1,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("consume-credit error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
