import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { situacao } = await req.json();

    if (!situacao) {
      return new Response(JSON.stringify({ error: "Situação não informada" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY não configurada" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `Você é um mestre em radiestesia e radiônica com profundo conhecimento em:
- Gráficos radiônicos e suas propriedades energéticas específicas
- Cristais e suas vibrações: quartzo, ametista, turmalina, selenita, citrino, obsidiana, pedra da lua, lápis-lazúli, entre outros
- Chakras e centros de energia do corpo humano
- Harmonização de ambientes e campos áuricos
- Técnicas de dowsing e uso do pêndulo
- Radiônica aplicada: saúde, relacionamentos, prosperidade, proteção espiritual
- Limpeza e proteção energética de pessoas e espaços
- Geometria sagrada e suas aplicações práticas

O usuário vai descrever uma situação que deseja harmonizar. Sua tarefa é:
1. Analisar a situação com empatia e acolhimento profundo
2. Indicar até 3 gráficos radiônicos ideais para a situação, explicando detalhadamente o porquê de cada um
3. Para cada gráfico, recomendar um cristal que potencializa o trabalho, com instruções específicas de uso e programação
4. Dar orientações práticas detalhadas de como usar os gráficos (tempo, posição, intenção)
5. Sugerir uma afirmação/intenção poderosa para potencializar o trabalho radiônico

Use linguagem acolhedora, humanizada e espiritual. Responda em português brasileiro.

Lista de gráficos disponíveis: Alfabeto, Alta Vitalidade, Amplificador Radiestésico, Antahkarana, Anti-Dor, Anti-Magia, Anti-Ondas, Ba-Gua, Compensador Mindtron, Contra Espírito Maligno, Cruz Ansata, Cruz Cósmica, Cruz São Mauro, Decágono Duplo, Desembaraçador Material, Desembaraçador de Relacionamentos, Desimpregnador, Diafragma I, Diafragma II, Dinamização, Energia Divina, Escudo Mágico, Escudo Protetor, Espiral Cósmica, Figura Humana, Filtro Telúrico, Forma Iavé, Gerador Holográfico Cone, Gerador Holográfico Piramidal, Gerador Holográfico Quadrado, Harmonia, Hiranya, HRIM, Iavé, Justiça Divina, Keiti, Kit Cromo, KLIM, KRIM, Labirinto de Damiens, Losango Solar, Luxor, Magnetron, Mesa de Damiens, Nove Círculos, OM, Ômega-Alfa, Pirâmide Plana, Pirâmide Tao, Programador Físico, Prosperador, Psico, Quadrado Mágico, Quadrata, RAD Radiestesia, Regulador Intestinal, Rejuvenescedor, Relax-Sono, Revitalizador de Chacras, SCAP Cabalístico, SCAP, Shin, Sorte e Sucesso, SOS Saúde, SRIM, Teleradiador, Tetragramaton, Tri-Círculo, Trigono, Triquetra, Triturador, Turbilhão Júpiter, Turbilhão Prosperador, Turbilhão Sol, Turbilhão Vênus, Turbilhão, Vesica Piscis, Yoshua.`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemini-1.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: situacao },
          ],
          max_tokens: 2000,
        }),
      }
    );

    const data = await response.json();
    const orientacao = data?.choices?.[0]?.message?.content || "Não foi possível gerar a orientação no momento. Tente novamente.";

    return new Response(JSON.stringify({ orientacao }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
