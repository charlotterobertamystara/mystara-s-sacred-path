import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  SIGNS, SIGN_SYMBOLS, SIGN_ELEMENT, getSignCompatibility,
  getCompatibleSigns, PersonSigns, Element,
} from "@/lib/astro-compatibility-utils";

interface Props {
  userSigns: PersonSigns;
}

type MatchCategory = "amor" | "amizade" | "trabalho";

const CATEGORY_CONFIG: Record<MatchCategory, { icon: string; title: string; desc: string }> = {
  amor: { icon: "💕", title: "Relacionamento Amoroso", desc: "Baseado no seu Sol — conexão de essência" },
  amizade: { icon: "🤝", title: "Amizade Profunda", desc: "Baseado na sua Lua — conexão emocional" },
  trabalho: { icon: "💼", title: "Parceria Profissional", desc: "Baseado no seu Sol — complementaridade" },
};

// Tips per element pair for romantic context
const CONQUEST_TIPS: Record<string, string> = {
  'Fogo': 'Seja direto(a) e entusiasmado(a). Mostre energia e paixão.',
  'Terra': 'Mostre estabilidade e consistência. Vá devagar e com firmeza.',
  'Ar': 'Estimule intelectualmente. Conversas interessantes são a chave.',
  'Água': 'Demonstre profundidade emocional. Seja vulnerável e sincero(a).',
};

// Professional complementarity
const WORK_STRENGTHS: Record<string, string> = {
  'Fogo-Fogo': 'Inovação rápida, mas cuidado com choques de ego.',
  'Fogo-Terra': 'Visão + execução — complemento perfeito se houver paciência.',
  'Fogo-Ar': 'Criatividade explosiva! Ideias brilhantes com energia para executar.',
  'Fogo-Água': 'Intuição + ação. Decisões inteligentes, mas cuidado com atritos.',
  'Terra-Terra': 'Equipe sólida e confiável. Podem faltar ousadia e inovação.',
  'Terra-Ar': 'Planejamento + visão. Equilíbrio entre prática e estratégia.',
  'Terra-Água': 'Cuidado + estrutura. Excelente para projetos de longo prazo.',
  'Ar-Ar': 'Milhares de ideias! Precisam de alguém para executar.',
  'Ar-Água': 'Comunicação + intuição. Bom para áreas criativas.',
  'Água-Água': 'Empatia profunda. Excelente em cuidado, mas podem procrastinar.',
};

function getWorkStrength(el1: Element, el2: Element): string {
  return WORK_STRENGTHS[`${el1}-${el2}`] || WORK_STRENGTHS[`${el2}-${el1}`] || 'Combinação única com potencial a descobrir.';
}

export default function IdealMatchSection({ userSigns }: Props) {
  const [category, setCategory] = useState<MatchCategory>("amor");
  const [searchSign, setSearchSign] = useState("");

  const basSign = category === "amizade" ? (userSigns.moon || userSigns.sun) : userSigns.sun;
  const compat = getCompatibleSigns(basSign);
  const topSigns = [...compat.high, ...compat.good].slice(0, 3);
  const config = CATEGORY_CONFIG[category];

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card p-4 space-y-3">
        <div className="text-center">
          <span className="text-2xl">🔮</span>
          <p className="font-display text-sm tracking-widest text-foreground mt-1">Descubra Seu Match Ideal</p>
          <p className="text-[10px] text-muted-foreground">Baseado no seu mapa natal</p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1 bg-muted/30 rounded-lg p-1">
          {(["amor", "amizade", "trabalho"] as MatchCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-1 text-[10px] font-display tracking-wider py-1.5 rounded-md transition-all ${
                category === cat ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].title.split(" ")[0]}
            </button>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground text-center">{config.desc}</p>

        {/* Top 3 Matches */}
        <div className="space-y-2">
          {topSigns.map((sign, i) => {
            const score = getSignCompatibility(basSign, sign);
            const el = SIGN_ELEMENT[sign];
            return (
              <motion.div
                key={sign}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-background/50 p-3 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{SIGN_SYMBOLS[sign]}</span>
                    <div>
                      <p className="font-display text-xs tracking-wider text-foreground">{sign}</p>
                      <p className="text-[9px] text-muted-foreground">{el}</p>
                    </div>
                  </div>
                  <span className={`font-display text-sm ${score >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {score}%
                  </span>
                </div>

                <p className="text-[10px] text-muted-foreground font-body leading-relaxed">
                  {category === "amor" && (
                    <>Com {basSign} e {sign}, a conexão é {score >= 80 ? 'intensa e natural' : 'estimulante e complementar'}. {CONQUEST_TIPS[el!]}</>
                  )}
                  {category === "amizade" && (
                    <>Lua em {basSign} se conecta emocionalmente com {sign}. {score >= 80 ? 'Amizade profunda e duradoura' : 'Conexão rica em aprendizados'}.</>
                  )}
                  {category === "trabalho" && (
                    <>{getWorkStrength(SIGN_ELEMENT[basSign]!, SIGN_ELEMENT[sign]!)}</>
                  )}
                </p>

                {category === "amor" && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <p className="text-[9px] text-green-400 font-display tracking-wider">O que esperar</p>
                      <p className="text-[9px] text-muted-foreground">
                        {score >= 80 ? 'Sintonia natural, paixão genuína' : 'Crescimento mútuo, novas perspectivas'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-orange-400 font-display tracking-wider">Desafio</p>
                      <p className="text-[9px] text-muted-foreground">
                        {el === SIGN_ELEMENT[basSign] ? 'Espelhar defeitos, falta de variedade' : 'Ritmos e prioridades diferentes'}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Search by specific sign */}
      <Card className="border-border bg-card p-4 space-y-3">
        <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">🔍 Buscar por Signo Específico</p>
        <Select value={searchSign} onValueChange={setSearchSign}>
          <SelectTrigger className="border-border bg-background text-foreground text-xs">
            <SelectValue placeholder="Selecione um signo" />
          </SelectTrigger>
          <SelectContent>
            {SIGNS.map(s => <SelectItem key={s} value={s}>{SIGN_SYMBOLS[s]} {s}</SelectItem>)}
          </SelectContent>
        </Select>

        {searchSign && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            {(() => {
              const score = getSignCompatibility(basSign, searchSign);
              const { label, emoji, colorClass } = (() => {
                if (score >= 80) return { label: 'Excelente', emoji: '💚', colorClass: 'text-green-400' };
                if (score >= 60) return { label: 'Boa', emoji: '💛', colorClass: 'text-yellow-400' };
                if (score >= 40) return { label: 'Desafiadora', emoji: '🧡', colorClass: 'text-orange-400' };
                return { label: 'Complexa', emoji: '💔', colorClass: 'text-red-400' };
              })();
              const el = SIGN_ELEMENT[searchSign];

              return (
                <div className="rounded-xl border border-border bg-background/50 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xs tracking-wider text-foreground">
                      {SIGN_SYMBOLS[basSign]} {basSign} + {SIGN_SYMBOLS[searchSign]} {searchSign}
                    </p>
                    <span className={`font-display text-sm ${colorClass}`}>{score}% {emoji}</span>
                  </div>
                  <p className={`text-[10px] ${colorClass} font-display`}>{label}</p>
                  <p className="text-[10px] text-muted-foreground font-body leading-relaxed">
                    {score >= 80 && `${basSign} e ${searchSign} compartilham uma afinidade natural. A energia flui com facilidade, criando uma conexão genuína e estimulante.`}
                    {score >= 60 && score < 80 && `${basSign} e ${searchSign} se complementam de forma interessante. Com boa vontade mútua, essa relação pode ser muito enriquecedora.`}
                    {score >= 40 && score < 60 && `${basSign} e ${searchSign} possuem dinâmicas diferentes que geram desafios, mas também oportunidades de crescimento profundo.`}
                    {score < 40 && `${basSign} e ${searchSign} formam uma combinação complexa. Exige dedicação, mas pode ser transformadora quando há maturidade emocional.`}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[9px] text-green-400 font-display tracking-wider">Funciona</p>
                      <p className="text-[9px] text-muted-foreground">
                        {score >= 60 ? 'Valores alinhados, energia compatível' : 'Aprendizado profundo, crescimento'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-orange-400 font-display tracking-wider">Dica</p>
                      <p className="text-[9px] text-muted-foreground">
                        {CONQUEST_TIPS[el!] || 'Respeitem as diferenças e valorizem os pontos em comum.'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </Card>
    </div>
  );
}
