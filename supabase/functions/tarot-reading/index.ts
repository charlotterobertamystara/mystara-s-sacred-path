import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { question, cards } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const cardsList = cards
      .map(
        (c: { name: string; position: string; reversed: boolean }, i: number) =>
          `Carta ${i + 1} — ${c.name}${c.reversed ? " (invertida)" : ""} — Posição: ${c.position}`
      )
      .join("\n");

    const systemPrompt = `Você é um tarólogo experiente especializado no Tarot de Marselha, com profundo conhecimento dos 22 Arcanos Maiores, dos 56 Arcanos Menores e de toda sua simbologia arquetípica tradicional. Você oferece leituras simbólicas, profundas e compassivas, sempre respeitando o livre-arbítrio do consulente. Sua linguagem é humanizada, empática, acolhedora e calorosa — como um conselheiro sábio que genuinamente se importa com o bem-estar do consulente. Independentemente da natureza da pergunta (amor, saúde, trabalho, finanças, espiritualidade), você responde com sensibilidade, sem julgamentos, validando as emoções do consulente. Escreva sempre em português do Brasil.`;

    const userPrompt = `Realize uma leitura de Tarot de Marselha para a seguinte situação:

PERGUNTA / INTENÇÃO DO CONSULENTE:
"${question}"

CARTAS TIRADAS:
${cardsList}

Por favor, faça:
1. Uma INTRODUÇÃO GERAL acolhedora e empática da leitura, conectando as cartas entre si e com a pergunta, validando os sentimentos do consulente
2. A INTERPRETAÇÃO INDIVIDUAL de cada carta em sua posição, explicando como ela responde à situação apresentada de forma humanizada e sensível
3. Uma SÍNTESE FINAL com a mensagem principal da tiragem e orientações práticas, encorajando o consulente com gentileza
4. O SIGNIFICADO PROFISSIONAL INDIVIDUAL de cada carta selecionada, explicando brevemente o significado geral da carta (direita ou invertida conforme tirada), suas palavras-chave, elemento e arquétipo

Seja profundo, simbólico, humanizado e acolhedor. Use linguagem do Tarot de Marselha tradicional. Trate o consulente com genuína empatia e calor humano.`;

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
    console.error("tarot-reading error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
