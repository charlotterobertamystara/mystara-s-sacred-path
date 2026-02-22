import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { birthDate, birthTime, birthCity, fullName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Você é um astrólogo profissional com décadas de experiência em astrologia ocidental, védica e psicológica. Você possui profundo conhecimento sobre os signos solares, lunares, ascendentes, casas astrológicas, planetas pessoais e transpessoais, aspectos planetários e trânsitos. Você oferece leituras extremamente detalhadas, profundas e transformadoras, sempre com orientações práticas e caminhos de evolução. Sua linguagem é acolhedora, sábia, empática e espiritualmente orientada. Escreva sempre em português do Brasil.

IMPORTANTE: Você deve calcular o mapa astral com base na data, hora e local de nascimento fornecidos, determinando as posições dos planetas, signos e casas astrológicas. Use seus conhecimentos astrológicos para fornecer uma interpretação completa e profunda.`;

    const userPrompt = `Realize uma leitura completa e extremamente profunda do Mapa Astral para:

DADOS DO CONSULENTE:
- Nome: ${fullName || "Consulente"}
- Data de Nascimento: ${birthDate}
- Hora de Nascimento: ${birthTime}
- Local de Nascimento: ${birthCity}

Por favor, faça uma análise COMPLETA e PROFUNDA cobrindo TODOS os seguintes aspectos:

## 1. PANORAMA GERAL DO MAPA
- Signo Solar, Lunar e Ascendente
- Elemento predominante e modalidade
- Visão geral da personalidade e missão de vida

## 2. SOL — Essência e Propósito
- Signo solar e sua casa astrológica
- Missão de vida e propósito central
- Como brilhar e se realizar

## 3. LUA — Emoções e Mundo Interior
- Signo lunar e sua casa astrológica
- Necessidades emocionais profundas
- Relação com a mãe/figura materna e infância
- Como nutrir a alma

## 4. ASCENDENTE — Máscara Social e Caminho de Vida
- Signo ascendente
- Como o mundo te vê
- Aparência e primeira impressão
- Caminho de desenvolvimento pessoal

## 5. MERCÚRIO — Mente e Comunicação
- Signo e casa de Mercúrio
- Estilo de pensamento e aprendizado
- Comunicação e expressão intelectual

## 6. VÊNUS — Amor e Valores
- Signo e casa de Vênus
- Como ama e deseja ser amado(a)
- Valores pessoais e relação com o dinheiro
- Estilo estético e de prazer

## 7. MARTE — Ação e Energia Vital
- Signo e casa de Marte
- Como luta, age e se motiva
- Sexualidade e assertividade
- Como lida com raiva e conflitos

## 8. JÚPITER — Expansão e Sorte
- Signo e casa de Júpiter
- Onde encontra abundância e crescimento
- Filosofia de vida e espiritualidade
- Áreas de maior sorte

## 9. SATURNO — Lições e Maturidade
- Signo e casa de Saturno
- Principais desafios e lições kármicas
- Medos profundos e superação
- Onde precisa de disciplina e estrutura

## 10. URANO, NETUNO E PLUTÃO — Transformação Geracional
- Posições e influências transpessoais
- Transformações profundas necessárias
- Dons espirituais e missão coletiva

## 11. NODO NORTE E NODO SUL — Karma e Destino
- Eixo nodal: de onde vem e para onde vai
- Padrões kármicos a transcender
- Caminho evolutivo da alma

## 12. ANÁLISE DAS CASAS ASTROLÓGICAS
- Áreas da vida em destaque
- Casas mais ocupadas e seu significado
- Casa vazia vs casa ocupada

## 13. ASPECTOS PLANETÁRIOS IMPORTANTES
- Conjunções, oposições, trígonos e quadraturas relevantes
- Padrões de tensão e harmonia
- Configurações especiais (T-quadrado, Grande Trígono, etc.)

## 14. VIDA AFETIVA E RELACIONAMENTOS
- Perfil amoroso detalhado
- Tipo de parceiro(a) ideal
- Desafios nos relacionamentos
- Caminhos para relacionamentos saudáveis

## 15. CARREIRA E VOCAÇÃO
- Talentos naturais e vocação
- Melhores áreas profissionais
- Meio do Céu e sua influência
- Como alcançar sucesso profissional

## 16. SAÚDE E BEM-ESTAR
- Pontos de atenção na saúde
- Relação corpo-mente-espírito
- Práticas recomendadas de autocuidado

## 17. FINANÇAS E PROSPERIDADE
- Relação com dinheiro e abundância
- Melhores formas de gerar riqueza
- Armadilhas financeiras a evitar

## 18. ESPIRITUALIDADE E EVOLUÇÃO
- Caminho espiritual indicado
- Dons intuitivos e mediúnicos
- Práticas espirituais recomendadas
- Missão de alma nesta encarnação

## 19. SÍNTESE E ORIENTAÇÕES FINAIS
- As 3 maiores forças do mapa
- Os 3 maiores desafios a superar
- Conselho central para esta fase da vida
- Afirmação pessoal baseada no mapa
- Melhores caminhos a seguir nos próximos meses

Seja EXTREMAMENTE profundo, detalhado e acolhedor. A leitura deve ser transformadora e oferecer orientações práticas e claras para cada área da vida.`;

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
    console.error("mapa-astral error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
