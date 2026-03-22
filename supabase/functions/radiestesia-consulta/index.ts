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

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `Você é um mestre em radiestesia e radiônica. O usuário vai descrever uma situação que deseja harmonizar. Sua tarefa é:

1. Analisar a situação com empatia e acolhimento.
2. Indicar até 3 gráficos radiônicos ideais para a situação, explicando brevemente o porquê de cada um.
3. Para cada gráfico, recomendar um cristal que potencializa o trabalho.
4. Dar orientações práticas de como usar os gráficos.

Use linguagem acolhedora, humanizada e espiritual. Responda em português brasileiro.

Lista de gráficos disponíveis: Alfabeto, Alta Vitalidade, Amplificador Radiestésico, Antahkarana, Anti-Dor, Anti-Magia, Anti-Ondas, Ba-Gua, Compensador Mindtron, Contra Espírito Maligno, Cruz Ansata, Cruz Cósmica, Cruz São Mauro, Decágono Duplo, Desembaraçador Material, Desembaraçador de Relacionamentos, Desimpregnador, Diafragma I, Diafragma II, Dinamização, Energia Divina, Escudo Mágico, Escudo Protetor, Espiral Cósmica, Figura Humana, Filtro Telúrico, Forma Iavé, Gerador Holográfico Cone, Gerador Holográfico Piramidal, Gerador Holográfico Quadrado, Harmonia, Hiranya, HRIM, Iavé, Justiça Divina, Keiti, Kit Cromo, KLIM, KRIM, Labirinto de Damiens, Losango Solar, Luxor, Magnetron, Mesa de Damiens, Nove Círculos, OM, Ômega-Alfa, Pirâmide Plana, Pirâmide Tao, Programador Físico, Prosperador, Psico, Quadrado Mágico, Quadrata, RAD Radiestesia, Regulador Intestinal, Rejuvenescedor, Relax-Sono, Revitalizador de Chacras, SCAP Cabalístico, SCAP, Shin, Sorte e Sucesso, SOS Saúde, SRIM, Teleradiador, Tetragramaton, Tri-Círculo, Trigono, Triquetra, Triturador, Turbilhão Júpiter, Turbilhão Prosperador, Turbilhão Sol, Turbilhão Vênus, Turbilhão, Vesica Piscis, Yoshua.`
          },
          {
            role: "user",
            content: situacao,
          },
        ],
        model: "google/gemini-2.5-flash",
      }),
    });

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
