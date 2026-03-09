import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import {
  CompatibilityScores, PersonSigns, SIGN_SYMBOLS, SIGN_ELEMENT,
  getScoreLabel, getScoreColor, getPairIcon, getInterpretation,
  getElementDistribution, getElementComboInterpretation, Element,
} from "@/lib/astro-compatibility-utils";
import PracticalTips from "./PracticalTips";

interface Props {
  userName: string;
  partnerName: string;
  userSigns: PersonSigns;
  partnerSigns: PersonSigns;
  scores: CompatibilityScores;
  relationshipType?: string;
  onBack: () => void;
}

const RELATIONSHIP_FOCUS: Record<string, { title: string; tip: string }> = {
  'parceiro': { title: 'Análise Romântica', tip: 'Foco em conexão emocional, atração e parceria de vida.' },
  'crush': { title: 'Análise de Atração', tip: 'Foco em química, primeira impressão e potencial.' },
  'amigo': { title: 'Análise de Amizade', tip: 'Foco em confiança, diversão e apoio mútuo.' },
  'familiar': { title: 'Análise Familiar', tip: 'Foco em compreensão, paciência e vínculo ancestral.' },
  'colega': { title: 'Análise Profissional', tip: 'Foco em comunicação, complementaridade e objetivos.' },
  'outro': { title: 'Análise Geral', tip: 'Visão ampla de todas as dimensões da compatibilidade.' },
};

export default function CompatibilityResult({ userName, partnerName, userSigns, partnerSigns, scores, relationshipType, onBack }: Props) {
  const { label, emoji, colorClass } = getScoreLabel(scores.overall);
  const scoreColor = getScoreColor(scores.overall);
  const relFocus = RELATIONSHIP_FOCUS[relationshipType || 'outro'] || RELATIONSHIP_FOCUS['outro'];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Overall Score */}
      <Card className="border-border bg-card p-5 text-center space-y-3">
        <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">{relFocus.title}</p>
        <p className="text-[9px] text-muted-foreground italic">{relFocus.tip}</p>
        <div className="relative mx-auto w-28 h-28">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="6"
              strokeDasharray={`${scores.overall * 2.64} 264`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-display" style={{ color: scoreColor }}>{scores.overall}%</span>
            <span className="text-lg">{emoji}</span>
          </div>
        </div>
        <p className={`font-display text-sm tracking-wider ${colorClass}`}>{label}</p>
        <p className="text-xs text-muted-foreground">{userName} & {partnerName}</p>
      </Card>

      {/* Side by Side */}
      <Card className="border-border bg-card p-4">
        <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase mb-3">Comparação</p>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 text-xs">
          <div className="text-center font-display text-primary text-[10px] tracking-wider">{userName}</div>
          <div />
          <div className="text-center font-display text-primary text-[10px] tracking-wider">{partnerName}</div>

          {[
            { icon: '☉', label: 'Sol', u: userSigns.sun, p: partnerSigns.sun, score: scores.sunSun },
            { icon: '☽', label: 'Lua', u: userSigns.moon, p: partnerSigns.moon, score: scores.moonMoon },
            { icon: '↑', label: 'Asc', u: userSigns.ascendant, p: partnerSigns.ascendant, score: scores.ascAsc },
          ].map(row => (
            <Row key={row.label} {...row} />
          ))}
        </div>
      </Card>

      {/* Detailed Analysis */}
      <DetailCard
        title="Compatibilidade de Personalidade"
        icon="☉"
        sign1={userSigns.sun}
        sign2={partnerSigns.sun}
        score={scores.sunSun}
        type="sun"
      />
      <DetailCard
        title="Compatibilidade Emocional"
        icon="☽"
        sign1={userSigns.moon}
        sign2={partnerSigns.moon}
        score={scores.moonMoon}
        type="moon"
      />
      <DetailCard
        title="Primeira Impressão"
        icon="↑"
        sign1={userSigns.ascendant}
        sign2={partnerSigns.ascendant}
        score={scores.ascAsc}
        type="asc"
      />

      {/* Element Distribution */}
      <ElementChart userName={userName} partnerName={partnerName} userSigns={userSigns} partnerSigns={partnerSigns} />

      {/* Practical Tips */}
      <PracticalTips
        userSun={userSigns.sun}
        partnerSun={partnerSigns.sun}
        userName={userName}
        partnerName={partnerName}
        relationshipType={relationshipType}
      />

      <div className="text-center pt-2">
        <Button variant="outline" onClick={onBack} className="font-display tracking-wider text-xs">
          ← Voltar
        </Button>
      </div>
    </motion.div>
  );
}

function Row({ icon, u, p, score }: { icon: string; label: string; u: string; p: string; score: number }) {
  const pairIcon = getPairIcon(score);
  const { colorClass } = getScoreLabel(score);
  return (
    <>
      <div className="flex items-center justify-center gap-1 rounded-lg border border-border bg-background p-2">
        <span>{icon}</span>
        <span className="text-foreground">{SIGN_SYMBOLS[u]} {u || '—'}</span>
      </div>
      <div className={`flex items-center justify-center text-sm font-bold ${colorClass}`}>{pairIcon}</div>
      <div className="flex items-center justify-center gap-1 rounded-lg border border-border bg-background p-2">
        <span>{icon}</span>
        <span className="text-foreground">{SIGN_SYMBOLS[p]} {p || '—'}</span>
      </div>
    </>
  );
}

function DetailCard({ title, icon, sign1, sign2, score, type }: {
  title: string; icon: string; sign1: string; sign2: string; score: number; type: 'sun' | 'moon' | 'asc';
}) {
  const [open, setOpen] = useState(false);
  const { label, colorClass } = getScoreLabel(score);
  const interp = getInterpretation(sign1, sign2, type);

  if (!sign1 || !sign2) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-border bg-card overflow-hidden">
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <div>
              <p className="font-display text-xs tracking-wider text-foreground">{title}</p>
              <p className="text-[10px] text-muted-foreground">{sign1} + {sign2}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`font-display text-sm ${colorClass}`}>{score}%</span>
            <p className={`text-[10px] ${colorClass}`}>{label}</p>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
            <p className="text-xs text-muted-foreground font-body leading-relaxed">{interp.text}</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="font-display text-[10px] tracking-wider text-green-400 uppercase mb-1">Pontos Fortes</p>
                {interp.strengths.map((s, i) => <p key={i} className="text-[10px] text-muted-foreground">✦ {s}</p>)}
              </div>
              <div>
                <p className="font-display text-[10px] tracking-wider text-orange-400 uppercase mb-1">Desafios</p>
                {interp.challenges.map((c, i) => <p key={i} className="text-[10px] text-muted-foreground">⚡ {c}</p>)}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function ElementChart({ userName, partnerName, userSigns, partnerSigns }: {
  userName: string; partnerName: string; userSigns: PersonSigns; partnerSigns: PersonSigns;
}) {
  const userDist = getElementDistribution(userSigns);
  const partnerDist = getElementDistribution(partnerSigns);
  const elements: Element[] = ['Fogo', 'Terra', 'Ar', 'Água'];
  const colors: Record<Element, string> = {
    'Fogo': 'bg-orange-500', 'Terra': 'bg-green-600', 'Ar': 'bg-sky-400', 'Água': 'bg-blue-500',
  };

  // Find dominant elements
  const userDom = elements.reduce((a, b) => userDist[a] >= userDist[b] ? a : b);
  const partnerDom = elements.reduce((a, b) => partnerDist[a] >= partnerDist[b] ? a : b);

  return (
    <Card className="border-border bg-card p-4 space-y-3">
      <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">Elementos</p>
      <div className="space-y-2">
        {elements.map(el => (
          <div key={el} className="space-y-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{el === 'Fogo' ? '🔥' : el === 'Terra' ? '🌍' : el === 'Ar' ? '💨' : '🌊'} {el}</span>
              <span>{userDist[el]} vs {partnerDist[el]}</span>
            </div>
            <div className="flex gap-1 h-2">
              <div className={`${colors[el]} rounded-full transition-all`} style={{ width: `${(userDist[el] / 3) * 100}%`, opacity: 0.7 }} />
              <div className={`${colors[el]} rounded-full transition-all`} style={{ width: `${(partnerDist[el] / 3) * 100}%`, opacity: 0.4 }} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground font-body italic">
        {getElementComboInterpretation(userDom, partnerDom)}
      </p>
    </Card>
  );
}
