import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  SIGNS, SIGN_SYMBOLS, calculateCompatibility, getScoreLabel, getScoreColor,
  getInterpretation, PersonSigns,
} from "@/lib/astro-compatibility-utils";

interface Props {
  open: boolean;
  onClose: () => void;
  userSigns: PersonSigns;
  userName: string;
}

export default function QuickComparisonModal({ open, onClose, userSigns, userName }: Props) {
  const [sun, setSun] = useState("");
  const [moon, setMoon] = useState("");
  const [asc, setAsc] = useState("");
  const [showResult, setShowResult] = useState(false);

  if (!open) return null;

  const partnerSigns: PersonSigns = { sun, moon, ascendant: asc };
  const scores = sun ? calculateCompatibility(userSigns, partnerSigns) : null;
  const canCalc = !!sun;

  const handleCalc = () => {
    if (canCalc) setShowResult(true);
  };

  const handleReset = () => {
    setSun("");
    setMoon("");
    setAsc("");
    setShowResult(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-5 space-y-4"
        >
          {!showResult ? (
            <>
              <div className="text-center">
                <span className="text-3xl">⚡</span>
                <h3 className="font-display text-base tracking-widest text-foreground mt-1">Comparação Rápida</h3>
                <p className="text-xs text-muted-foreground">Digite apenas os signos — resultado instantâneo</p>
              </div>

              <div className="space-y-3">
                <SignSelect label="Sol (obrigatório)" value={sun} onChange={setSun} icon="☉" />
                <SignSelect label="Lua (opcional)" value={moon} onChange={setMoon} icon="☽" />
                <SignSelect label="Ascendente (opcional)" value={asc} onChange={setAsc} icon="↑" />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 font-display tracking-wider text-xs" onClick={handleClose}>Cancelar</Button>
                <Button className="flex-1 font-display tracking-wider text-xs" disabled={!canCalc} onClick={handleCalc}>
                  ⚡ Calcular Agora
                </Button>
              </div>
            </>
          ) : scores && (
            <QuickResult
              scores={scores}
              userSigns={userSigns}
              partnerSigns={partnerSigns}
              userName={userName}
              onReset={handleReset}
              onClose={handleClose}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SignSelect({ label, value, onChange, icon }: { label: string; value: string; onChange: (v: string) => void; icon: string }) {
  return (
    <div>
      <label className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">{icon} {label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1 border-border bg-background text-foreground text-xs">
          <SelectValue placeholder="Selecione um signo" />
        </SelectTrigger>
        <SelectContent>
          {SIGNS.map(s => <SelectItem key={s} value={s}>{SIGN_SYMBOLS[s]} {s}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function QuickResult({ scores, userSigns, partnerSigns, userName, onReset, onClose }: {
  scores: ReturnType<typeof calculateCompatibility>;
  userSigns: PersonSigns;
  partnerSigns: PersonSigns;
  userName: string;
  onReset: () => void;
  onClose: () => void;
}) {
  const { label, emoji, colorClass } = getScoreLabel(scores.overall);
  const scoreColor = getScoreColor(scores.overall);
  const sunInterp = getInterpretation(userSigns.sun, partnerSigns.sun, 'sun');
  const moonInterp = partnerSigns.moon ? getInterpretation(userSigns.moon || userSigns.sun, partnerSigns.moon, 'moon') : null;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="text-center space-y-2">
        <div className="relative mx-auto w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="6"
              strokeDasharray={`${scores.overall * 2.64} 264`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-display" style={{ color: scoreColor }}>{scores.overall}%</span>
            <span className="text-base">{emoji}</span>
          </div>
        </div>
        <p className={`font-display text-sm tracking-wider ${colorClass}`}>{label}</p>
        <p className="text-[10px] text-muted-foreground">
          {userName} ({SIGN_SYMBOLS[userSigns.sun]} {userSigns.sun}) & {SIGN_SYMBOLS[partnerSigns.sun]} {partnerSigns.sun}
        </p>
      </div>

      {/* Brief analysis */}
      <div className="rounded-xl border border-border bg-background/50 p-3 space-y-2">
        <p className="font-display text-[10px] tracking-widest text-primary uppercase">Análise Resumida</p>
        <p className="text-xs text-muted-foreground font-body leading-relaxed">{sunInterp.text}</p>
        {moonInterp && (
          <p className="text-xs text-muted-foreground font-body leading-relaxed">{moonInterp.text}</p>
        )}
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-2 gap-2 text-center">
        {[
          { label: "Sol ☉", score: scores.sunSun },
          { label: "Lua ☽", score: scores.moonMoon },
          { label: "Asc ↑", score: scores.ascAsc },
          { label: "Cruzada ✦", score: scores.crossSunMoon },
        ].map(item => {
          const { colorClass: cc } = getScoreLabel(item.score);
          return (
            <div key={item.label} className="rounded-lg border border-border bg-background/30 p-2">
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
              <p className={`font-display text-sm ${cc}`}>{item.score}%</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1 font-display tracking-wider text-xs" onClick={onReset}>
          Nova Comparação
        </Button>
        <Button variant="outline" className="flex-1 font-display tracking-wider text-xs" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </motion.div>
  );
}
