import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { NUMBER_MEANINGS, isMasterNumber } from "@/lib/numerology-utils";

const ALL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

const NUMBER_COMPAT: Record<string, { score: number; title: string; desc: string }> = {
  '1-1': { score: 75, title: 'Dois Líderes', desc: 'Competição ou admiração mútua. Precisam dividir o protagonismo.' },
  '1-3': { score: 90, title: 'Líder e Criativo', desc: 'Parceria dinâmica! O 1 direciona, o 3 inspira.' },
  '1-5': { score: 88, title: 'Líder e Aventureiro', desc: 'Paixão e liberdade. Nunca é entediante.' },
  '2-6': { score: 95, title: 'Diplomata e Cuidador', desc: 'Harmonia perfeita. Lar doce lar.' },
  '3-5': { score: 85, title: 'Criativo e Livre', desc: 'Diversão garantida, mas podem faltar raízes.' },
  '4-8': { score: 88, title: 'Construtor e Realizador', desc: 'Dupla poderosa para negócios e patrimônio.' },
  '6-9': { score: 92, title: 'Cuidador e Humanitário', desc: 'Amor universal. Casal que ajuda o mundo.' },
  '7-11': { score: 95, title: 'Buscador e Iluminador', desc: 'Conexão espiritual profunda. Almas gêmeas.' },
  '11-22': { score: 88, title: 'Mestres Juntos', desc: 'Visão + Construção. Legado transformador.' },
  '22-33': { score: 92, title: 'Construtor e Professor', desc: 'Impacto mundial. Juntos movem montanhas.' },
};

const SPECIAL_COMBOS = [
  { type: 'equal', icon: '⚡', title: 'Números Iguais', desc: 'Espelhamento intenso. Vantagem: entendem-se instintivamente. Desafio: amplificam defeitos.' },
  { type: 'complement', icon: '🌟', title: 'Números Complementares', pairs: ['1+2', '3+5', '4+8', '6+9'], desc: 'Equilibram-se naturalmente.' },
  { type: 'challenge', icon: '🔥', title: 'Números Desafiadores', pairs: ['1+8', '4+5', '2+9'], desc: 'Crescimento através do atrito.' },
  { type: 'master', icon: '💎', title: 'Mestres Juntos', pairs: ['11+22', '11+33', '22+33'], desc: 'Missão espiritual compartilhada.' },
];

function getNumCompat(a: number, b: number): number {
  const key1 = `${Math.min(a, b)}-${Math.max(a, b)}`;
  const key2 = `${a}-${b}`;
  if (NUMBER_COMPAT[key1]) return NUMBER_COMPAT[key1].score;
  if (NUMBER_COMPAT[key2]) return NUMBER_COMPAT[key2].score;
  if (a === b) return 75;
  return Math.max(40, 70 - Math.abs(a - b) * 5);
}

export default function NumeroGuide() {
  const [activeSection, setActiveSection] = useState<'numbers' | 'combos' | 'matrix'>('numbers');
  const [selectedCell, setSelectedCell] = useState<{ n1: number; n2: number } | null>(null);

  return (
    <div className="space-y-4">
      {/* Section Toggle */}
      <div className="flex gap-1 bg-muted/30 rounded-lg p-1">
        {[
          { key: 'numbers', label: '🔢 Números' },
          { key: 'combos', label: '✨ Combinações' },
          { key: 'matrix', label: '⊞ Matriz' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key as any)}
            className={`flex-1 text-[9px] font-display tracking-wider py-1.5 rounded-md transition-all ${
              activeSection === key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {activeSection === 'numbers' && <NumbersSection />}
          {activeSection === 'combos' && <CombosSection />}
          {activeSection === 'matrix' && <MatrixSection selectedCell={selectedCell} setSelectedCell={setSelectedCell} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function NumbersSection() {
  return (
    <div className="space-y-2">
      <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">Guia dos Números</p>
      {ALL_NUMBERS.map(num => {
        const info = NUMBER_MEANINGS[num];
        if (!info) return null;
        const isMaster = isMasterNumber(num);
        return (
          <Collapsible key={num}>
            <Card className={`border-border bg-card overflow-hidden ${isMaster ? 'ring-1 ring-primary/50' : ''}`}>
              <CollapsibleTrigger className="w-full p-3 flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-display text-sm ${isMaster ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                    {num}
                  </span>
                  <div>
                    <p className="font-display text-xs tracking-wider text-foreground">{info.title}</p>
                    {isMaster && <span className="text-[8px] text-primary">NÚMERO MESTRE</span>}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-3 pb-3 space-y-2 border-t border-border pt-2 text-[10px]">
                  <p className="text-muted-foreground">{info.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {info.keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[9px]">{kw}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-green-400 font-medium text-[9px]">Compatível com:</p>
                      <p className="text-muted-foreground">{info.compatible?.join(', ') || '3, 5, 6'}</p>
                    </div>
                    <div>
                      <p className="text-orange-400 font-medium text-[9px]">Desafiador com:</p>
                      <p className="text-muted-foreground">{info.challenging?.join(', ') || '4, 8'}</p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  );
}

function CombosSection() {
  return (
    <div className="space-y-3">
      <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">Combinações Especiais</p>
      {SPECIAL_COMBOS.map(combo => (
        <Card key={combo.type} className="border-border bg-card p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{combo.icon}</span>
            <p className="font-display text-xs tracking-wider text-foreground">{combo.title}</p>
          </div>
          {combo.pairs && (
            <div className="flex flex-wrap gap-1">
              {combo.pairs.map(p => (
                <span key={p} className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[9px]">{p}</span>
              ))}
            </div>
          )}
          <p className="text-[10px] text-muted-foreground">{combo.desc}</p>
        </Card>
      ))}

      {/* Featured Combos */}
      <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase mt-4">Combinações Destacadas</p>
      {Object.entries(NUMBER_COMPAT).slice(0, 6).map(([key, info]) => {
        const [n1, n2] = key.split('-').map(Number);
        return (
          <Card key={key} className="border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-display text-xs ${isMasterNumber(n1) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>{n1}</span>
                  <span className="text-muted-foreground">+</span>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-display text-xs ${isMasterNumber(n2) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>{n2}</span>
                </div>
                <p className="font-display text-xs tracking-wider text-foreground">{info.title}</p>
              </div>
              <span className={`font-display text-sm ${info.score >= 80 ? 'text-green-400' : info.score >= 60 ? 'text-yellow-400' : 'text-orange-400'}`}>{info.score}%</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{info.desc}</p>
          </Card>
        );
      })}
    </div>
  );
}

function MatrixSection({ selectedCell, setSelectedCell }: { selectedCell: { n1: number; n2: number } | null; setSelectedCell: (cell: { n1: number; n2: number } | null) => void }) {
  const baseNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-3">
      <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">Matriz de Compatibilidade</p>
      <div className="overflow-x-auto">
        <div className="inline-grid" style={{ gridTemplateColumns: `24px repeat(${baseNumbers.length}, 22px)` }}>
          {/* Header */}
          <div />
          {baseNumbers.map(n => (
            <div key={n} className={`text-[8px] text-center ${isMasterNumber(n) ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{n}</div>
          ))}
          {/* Rows */}
          {baseNumbers.map(n1 => (
            <>
              <div key={`row-${n1}`} className={`text-[8px] flex items-center ${isMasterNumber(n1) ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{n1}</div>
              {baseNumbers.map(n2 => {
                const score = getNumCompat(n1, n2);
                return (
                  <button
                    key={`${n1}-${n2}`}
                    onClick={() => setSelectedCell({ n1, n2 })}
                    className={`w-5 h-5 rounded-sm ${getScoreColor(score)} opacity-70 hover:opacity-100 transition-opacity`}
                    title={`${n1} × ${n2}: ${score}%`}
                  />
                );
              })}
            </>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex gap-3 text-[8px] text-muted-foreground justify-center">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500" /> 80+%</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-yellow-500" /> 60-79%</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-orange-500" /> 40-59%</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500" /> &lt;40%</span>
      </div>

      {/* Selected Cell Detail */}
      {selectedCell && (
        <Card className="border-border bg-card p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center font-display text-xs ${isMasterNumber(selectedCell.n1) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>{selectedCell.n1}</span>
              <span className="text-muted-foreground">×</span>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center font-display text-xs ${isMasterNumber(selectedCell.n2) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>{selectedCell.n2}</span>
            </div>
            <button onClick={() => setSelectedCell(null)} className="text-muted-foreground text-xs">✕</button>
          </div>
          <div className="text-center">
            <span className="font-display text-xl text-primary">{getNumCompat(selectedCell.n1, selectedCell.n2)}%</span>
          </div>
          <p className="text-[10px] text-muted-foreground text-center">
            {NUMBER_MEANINGS[selectedCell.n1]?.title} + {NUMBER_MEANINGS[selectedCell.n2]?.title}
          </p>
        </Card>
      )}
    </div>
  );
}
