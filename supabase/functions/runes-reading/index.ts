import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { question, runes } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const runesList = runes
      .map(
        (r: { name: string; position: string; reversed: boolean; canReverse: boolean }, i: number) =>
          `Runa ${i + 1} — ${r.name}${r.reversed && r.canReverse ? " (invertida)" : ""} — Posição: ${r.position}`
      )
      .join("\n");

    const systemPrompt = `Você é um especialista em runas nórdicas do Elder Futhark, com profundo conhecimento da tradição viking, da mitologia nórdica e da simbologia ancestral das 24 runas. Você oferece leituras simbólicas, profundas e respeitosas, sempre honrando a tradição e respeitando o livre-arbítrio do consulente. Sua linguagem é humanizada, empática, acolhedora e calorosa — como um sábio ancião que genuinamente se importa com o bem-estar do consulente. Independentemente da natureza da pergunta (amor, saúde, trabalho, finanças, espiritualidade), você responde com sensibilidade, sem julgamentos, validando as emoções do consulente. Escreva sempre em português do Brasil.`;

    const userPrompt = `Realize uma leitura rúnica do Elder Futhark para a seguinte situação:

PERGUNTA / INTENÇÃO DO CONSULENTE:
"${question}"

RUNAS TIRADAS:
${runesList}

Por favor, faça:
1. Uma INTRODUÇÃO GERAL acolhedora e empática da leitura, conectando as runas entre si e com a pergunta, validando os sentimentos do consulente
2. A INTERPRETAÇÃO INDIVIDUAL de cada runa em sua posição, explicando como ela responde à situação apresentada de forma humanizada e sensível
3. Uma SÍNTESE FINAL com a mensagem principal da tiragem e orientações práticas, encorajando o consulente com gentileza
4. O SIGNIFICADO PROFISSIONAL INDIVIDUAL de cada runa selecionada, explicando brevemente o significado geral da runa (direita ou invertida conforme tirada), seu valor fonético, elemento associado e palavras-chave

Seja profundo, simbólico, humanizado e acolhedor. Use linguagem que honre a tradição nórdica ancestral. Trate o consulente com genuína empatia e calor humano.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos em Configurações." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro ao conectar com a IA." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("runes-reading error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
