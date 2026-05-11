import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autenticado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, data } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY não configurada' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (action === 'analyze_dream') {
      systemPrompt = `Você é uma especialista em análise de sonhos com conhecimentos em simbologia junguiana, mitologia, astrologia e espiritualidade. Analise o sonho a seguir e forneça:
1. Interpretação simbólica dos elementos principais
2. Possíveis mensagens do inconsciente
3. Conexão com a fase lunar atual
4. Sugestões práticas para integração

Responda em português brasileiro, de forma acolhedora e profunda.`;

      userPrompt = `Sonho: "${data.dream_title || 'Sem título'}"
Descrição: ${data.dream_description || 'Sem descrição'}
Símbolos marcantes: ${(data.dream_symbols || []).join(', ') || 'Nenhum informado'}
Emoções presentes: ${(data.dream_emotions || []).join(', ') || 'Nenhuma informada'}
Fase lunar: ${data.moon_phase || 'Desconhecida'}
Lua em: ${data.moon_sign || 'Desconhecido'}`;
    
    } else if (action === 'discover_patterns') {
      const { data: entries, error: entriesError } = await supabaseClient
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false })
        .limit(50);

      if (entriesError) {
        return new Response(JSON.stringify({ error: 'Erro ao buscar entradas' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!entries || entries.length < 3) {
        return new Response(JSON.stringify({ error: 'Você precisa de pelo menos 3 entradas para descobrir padrões.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      systemPrompt = `Você é uma astóloga e analista de padrões comportamentais especializada em ciclos lunares. Analise as entradas de diário a seguir e identifique:
1. Padrões emocionais relacionados às fases da lua
2. Sonhos recorrentes e suas conexões lunares
3. Sincronicidades mais comuns
4. Manifestações bem-sucedidas e as condições lunares
5. Sugestões personalizadas de melhores dias para rituais e intenções
6. Ciclos emocionais e tendências

Responda em português brasileiro, de forma clara e organizada.`;

      const entrySummaries = entries.map((e: any) => ({
        data: e.entry_date,
        tipos: e.entry_types,
        fase_lunar: e.moon_phase,
        lua_em: e.moon_sign,
        emocional: e.emotional_scale,
        energia: e.energy_level,
        sonho: e.dream_title,
        manifestacao: e.manifestation_what,
        status_manifestacao: e.manifestation_status,
        sincronicidade: e.sync_description,
        tags: e.tags,
      }));

      userPrompt = `Entradas do diário lunar (${entries.length} entradas):\n${JSON.stringify(entrySummaries, null, 2)}`;
    
    } else {
      return new Response(JSON.stringify({ error: 'Ação inválida' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemini-2.0-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 2000,
      }),
    });

    const aiData = await aiResponse.json();
    const analysis = aiData.choices?.[0]?.message?.content || 'Não foi possível gerar a análise.';

    // If dream analysis, save to entry
    if (action === 'analyze_dream' && data.entry_id) {
      await supabaseClient
        .from('diary_entries')
        .update({ dream_ai_analysis: analysis })
        .eq('id', data.entry_id)
        .eq('user_id', user.id);
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
