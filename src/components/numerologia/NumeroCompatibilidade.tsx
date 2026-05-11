import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  calculateLifePath, calculateExpression, calculateSoulUrge,
  reduceToSingleDigit, NUMBER_MEANINGS, isMasterNumber,
} from "@/lib/numerology-utils";

interface Props {
  userFullName: string;
  userBirthDate: string;
}

// Numerological compatibility matrix
const NUM_COMPAT: Record<string, number> = {};
function initCompatMatrix() {
  const high = [
    [1,1,85],[1,3,90],[1,5,88],[1,9,80],
    [2,2,82],[2,4,85],[2,6,90],[2,8,78],
    [3,3,80],[3,5,85],[3,6,82],[3,9,88],
    [4,4,80],[4,6,82],[4,8,88],[4,22,92],
    [5,5,75],[5,7,80],[5,9,78],
    [6,6,85],[6,9,90],[6,33,95],
    [7,7,82],[7,9,85],[7,11,90],
    [8,8,78],[8,22,88],
    [9,9,85],[9,11,88],[9,33,92],
    [11,11,90],[11,22,88],[11,33,92],
    [22,22,85],[22,33,90],
    [33,33,95],
  ];
  high.forEach(([a, b, s]) => {
    NUM_COMPAT[`${a}-${b}`] = s;
    NUM_COMPAT[`${b}-${a}`] = s;
  });
}
initCompatMatrix();

function getNumCompat(a: number, b: number): number {
  return NUM_COMPAT[`${a}-${b}`] ?? (a === b ? 80 : Math.max(40, 70 - Math.abs(a - b) * 5));
}

export default function NumeroCompatibilidade({ userFullName, userBirthDate }: Props) {
  const [partnerName, setPartnerName] = useState("");
  const [partnerBirthDate, setPartnerBirthDate] = useState("");
  const [showResult, setShowResult] = useState(false);

  const canCalc = partnerName.trim() && partnerBirthDate;

  const handleCalc = () => {
    if (canCalc) setShowResult(true);
  };

  if (!showResult) {
    return (
      <Card className="border-border bg-card p-4 space-y-4">
        <div className="text-center">
          <span className="text-2xl">🔗</span>
          <p className="font-display text-sm tracking-widest text-foreground mt-1">Compatibilidade Numerológica</p>
          <p className="text-[10px] text-muted-foreground">Compare seus números sagrados com outra pessoa</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">Nome completo da pessoa</label>
            <Input
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="Nome completo de nascimento"
              className="mt-1 border-border bg-background font-body text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">Data de nascimento</label>
            <Input
              type="date"
              value={partnerBirthDate}
              onChange={(e) => setPartnerBirthDate(e.target.value)}
              className="mt-1 border-border bg-background text-foreground"
            />
          </div>
        </div>

        <Button className="w-full font-display tracking-wider text-xs" disabled={!canCalc} onClick={handleCalc}>
          🔢 Calcular Compatibilidade
        </Button>
      </Card>
    );
  }

  // Calculate numbers
  const userLP = calculateLifePath(userBirthDate);
  const userExpr = calculateExpression(userFullName);
  const userSoul = calculateSoulUrge(userFullName);

  const partnerLP = calculateLifePath(partnerBirthDate);
  const partnerExpr = calculateExpression(partnerName);
  const partnerSoul = calculateSoulUrge(partnerName);

  const lpCompat = getNumCompat(userLP, partnerLP);
  const exprCompat = getNumCompat(userExpr, partnerExpr);
  const soulCompat = getNumCompat(userSoul, partnerSoul);
  const overall = Math.round(lpCompat * 0.4 + exprCompat * 0.3 + soulCompat * 0.3);

  const getLabel = (score: number) => {
    if (score >= 80) return { label: 'Excelente', emoji: '💚', color: 'text-green-400', bg: 'bg-green-500' };
    if (score >= 60) return { label: 'Boa', emoji: '💛', color: 'text-yellow-400', bg: 'bg-yellow-500' };
    if (score >= 40) return { label: 'Desafiadora', emoji: '🧡', color: 'text-orange-400', bg: 'bg-orange-500' };
    return { label: 'Complexa', emoji: '💔', color: 'text-red-400', bg: 'bg-red-500' };
  };

  const ov = getLabel(overall);

  const getRelationshipText = (n1: number, n2: number): string => {
    const m1 = NUMBER_MEANINGS[n1];
    const m2 = NUMBER_MEANINGS[n2];
    if (!m1 || !m2) return '';
    const compat = getNumCompat(n1, n2);
    if (compat >= 80) return `${m1.title} e ${m2.title} vibram em harmonia. Uma combinação naturalmente poderosa.`;
    if (compat >= 60) return `${m1.title} e ${m2.title} se complementam, criando equilíbrio entre suas energias.`;
    return `${m1.title} e ${m2.title} trazem desafios de crescimento. As diferenças podem ser enriquecedoras.`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Overall */}
      <Card className="border-border bg-card p-5 text-center space-y-3">
        <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">Compatibilidade Numerológica</p>
        <div className="relative mx-auto w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <circle cx="50" cy="50" r="42" fill="none"
              stroke={overall >= 80 ? 'hsl(120 50% 45%)' : overall >= 60 ? 'hsl(45 90% 55%)' : overall >= 40 ? 'hsl(30 90% 55%)' : 'hsl(0 70% 50%)'}
              strokeWidth="6" strokeDasharray={`${overall * 2.64} 264`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-display ${ov.color}`}>{overall}%</span>
            <span className="text-base">{ov.emoji}</span>
          </div>
        </div>
        <p className={`font-display text-sm tracking-wider ${ov.color}`}>{ov.label}</p>
        <p className="text-xs text-muted-foreground">
          {userFullName.split(' ')[0]} & {partnerName.split(' ')[0]}
        </p>
      </Card>

      {/* Side by Side Numbers */}
      <Card className="border-border bg-card p-4 space-y-3">
        <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">Comparação de Números</p>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 text-center text-xs">
          <p className="font-display text-primary text-[10px]">{userFullName.split(' ')[0]}</p>
          <p />
          <p className="font-display text-primary text-[10px]">{partnerName.split(' ')[0]}</p>

          {[
            { label: '🛤️ Caminho', u: userLP, p: partnerLP, score: lpCompat },
            { label: '🗣️ Expressão', u: userExpr, p: partnerExpr, score: exprCompat },
            { label: '💎 Alma', u: userSoul, p: partnerSoul, score: soulCompat },
          ].map(row => {
            const lbl = getLabel(row.score);
            return (
              <NumberRow key={row.label} {...row} colorClass={lbl.color} />
            );
          })}
        </div>
      </Card>

      {/* Detailed */}
      {[
        { title: 'Caminho de Vida', icon: '🛤️', u: userLP, p: partnerLP, score: lpCompat, desc: 'Missão de vida e propósito' },
        { title: 'Expressão', icon: '🗣️', u: userExpr, p: partnerExpr, score: exprCompat, desc: 'Talentos e como se expressam' },
        { title: 'Alma', icon: '💎', u: userSoul, p: partnerSoul, score: soulCompat, desc: 'Desejos profundos e motivações' },
      ].map(item => {
        const lbl = getLabel(item.score);
        return (
          <Card key={item.title} className="border-border bg-card p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-xs tracking-wider text-foreground">{item.icon} {item.title}</p>
                <p className="text-[9px] text-muted-foreground">{item.desc}</p>
              </div>
              <span className={`font-display text-sm ${lbl.color}`}>{item.score}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-primary font-display ${isMasterNumber(item.u) ? 'ring-2 ring-primary' : ''}`}>
                {item.u}
              </span>
              <span className={`text-sm ${lbl.color}`}>{lbl.emoji}</span>
              <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-primary font-display ${isMasterNumber(item.p) ? 'ring-2 ring-primary' : ''}`}>
                {item.p}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-body leading-relaxed">
              {getRelationshipText(item.u, item.p)}
            </p>
          </Card>
        );
      })}

      <Button variant="outline" className="w-full font-display tracking-wider text-xs" onClick={() => setShowResult(false)}>
        ← Nova Comparação
      </Button>
    </motion.div>
  );
}

function NumberRow({ label, u, p, score, colorClass }: {
  label: string; u: number; p: number; score: number; colorClass: string;
}) {
  return (
    <>
      <div className="flex items-center justify-center rounded-lg border border-border bg-background p-2">
        <span className={`font-display ${isMasterNumber(u) ? 'text-primary font-bold' : 'text-foreground'}`}>{u}</span>
      </div>
      <div className="flex flex-col items-center justify-center">
        <span className="text-[9px] text-muted-foreground">{label}</span>
        <span className={`font-display text-xs ${colorClass}`}>{score}%</span>
      </div>
      <div className="flex items-center justify-center rounded-lg border border-border bg-background p-2">
        <span className={`font-display ${isMasterNumber(p) ? 'text-primary font-bold' : 'text-foreground'}`}>{p}</span>
      </div>
    </>
  );
}
