import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SIGNS, SIGN_SYMBOLS, SIGN_ELEMENT, SIGN_MODALITY, getSignCompatibility, Element, Modality } from "@/lib/astro-compatibility-utils";

const ELEMENT_INFO: Record<Element, { emoji: string; signs: string[]; traits: string; compatible: string; challenging: string; color: string }> = {
  'Fogo': {
    emoji: '🔥', signs: ['Áries', 'Leão', 'Sagitário'],
    traits: 'Paixão, ação, entusiasmo, liderança',
    compatible: 'Fogo (intensidade) e Ar (estímulo)',
    challenging: 'Água (conflito) e Terra (frustração)',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  },
  'Terra': {
    emoji: '🌍', signs: ['Touro', 'Virgem', 'Capricórnio'],
    traits: 'Estabilidade, praticidade, construção',
    compatible: 'Terra (solidez) e Água (nutrição)',
    challenging: 'Fogo (queima) e Ar (dispersão)',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  'Ar': {
    emoji: '💨', signs: ['Gêmeos', 'Libra', 'Aquário'],
    traits: 'Comunicação, ideias, liberdade, social',
    compatible: 'Ar (mental) e Fogo (inspiração)',
    challenging: 'Terra (limitação) e Água (afogamento)',
    color: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  },
  'Água': {
    emoji: '💧', signs: ['Câncer', 'Escorpião', 'Peixes'],
    traits: 'Emoção, intuição, profundidade',
    compatible: 'Água (profundidade) e Terra (contenção)',
    challenging: 'Fogo (evaporação) e Ar (dispersão)',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
};

const MODALITY_INFO: Record<Modality, { emoji: string; signs: string[]; traits: string; dynamics: Record<Modality, string> }> = {
  'Cardeal': {
    emoji: '🌟', signs: ['Áries', 'Câncer', 'Libra', 'Capricórnio'],
    traits: 'Iniciadores, líderes, pioneiros, impulsivos',
    dynamics: {
      'Cardeal': 'Luta por liderança — ambos querem iniciar',
      'Fixo': 'Complementar: um inicia, outro sustenta',
      'Mutável': 'Bom fluxo: inicia e adapta',
    },
  },
  'Fixo': {
    emoji: '⭐', signs: ['Touro', 'Leão', 'Escorpião', 'Aquário'],
    traits: 'Estáveis, persistentes, leais, teimosos',
    dynamics: {
      'Cardeal': 'Complementar: sustenta a iniciativa',
      'Fixo': 'Teimosia mútua vs. lealdade profunda',
      'Mutável': 'Equilíbrio: estabiliza e flexibiliza',
    },
  },
  'Mutável': {
    emoji: '✨', signs: ['Gêmeos', 'Virgem', 'Sagitário', 'Peixes'],
    traits: 'Adaptáveis, flexíveis, versáteis, dispersivos',
    dynamics: {
      'Cardeal': 'Bom: adapta-se à liderança',
      'Fixo': 'Complementar: flexibiliza a rigidez',
      'Mutável': 'Muita flexibilidade, pode faltar foco',
    },
  },
};

const ASPECTS = [
  { symbol: '☌', name: 'Conjunção', degree: '0°', distance: 'Mesmo signo', meaning: 'União, intensidade, fusão', relationship: 'Muito parecidos, espelhamento', example: 'Dois Leões juntos' },
  { symbol: '✱', name: 'Sextil', degree: '60°', distance: '2 signos', meaning: 'Harmonia, facilidade, oportunidade', relationship: 'Complementaridade natural', example: 'Áries e Gêmeos' },
  { symbol: '□', name: 'Quadratura', degree: '90°', distance: '3 signos', meaning: 'Tensão, desafio, crescimento', relationship: 'Atrito que faz crescer', example: 'Áries e Câncer' },
  { symbol: '△', name: 'Trígono', degree: '120°', distance: '4 signos', meaning: 'Fluidez, talento natural, sorte', relationship: 'Conexão fácil e prazerosa', example: 'Áries e Leão (mesmo elemento)' },
  { symbol: '☍', name: 'Oposição', degree: '180°', distance: '6 signos', meaning: 'Polaridade, atração magnética', relationship: '"Opostos se atraem" — complementares', example: 'Áries e Libra' },
];

export default function AstroGuide() {
  const [activeSection, setActiveSection] = useState<'elements' | 'modalities' | 'aspects' | 'matrix'>('elements');
  const [selectedCell, setSelectedCell] = useState<{ sign1: string; sign2: string } | null>(null);

  return (
    <div className="space-y-4">
      {/* Section Toggle */}
      <div className="flex gap-1 bg-muted/30 rounded-lg p-1">
        {[
          { key: 'elements', label: '🔥 Elementos' },
          { key: 'modalities', label: '🌟 Modalidades' },
          { key: 'aspects', label: '△ Aspectos' },
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
          {activeSection === 'elements' && <ElementsSection />}
          {activeSection === 'modalities' && <ModalitiesSection />}
          {activeSection === 'aspects' && <AspectsSection />}
          {activeSection === 'matrix' && <MatrixSection selectedCell={selectedCell} setSelectedCell={setSelectedCell} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ElementsSection() {
  return (
    <div className="space-y-2">
      <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">Guia dos 4 Elementos</p>
      {(Object.entries(ELEMENT_INFO) as [Element, typeof ELEMENT_INFO[Element]][]).map(([el, info]) => (
        <Collapsible key={el}>
          <Card className="border-border bg-card overflow-hidden">
            <CollapsibleTrigger className="w-full p-3 flex items-center justify-between text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg">{info.emoji}</span>
                <div>
                  <p className="font-display text-xs tracking-wider text-foreground">{el}</p>
                  <p className="text-[9px] text-muted-foreground">{info.signs.join(', ')}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {info.signs.map(s => (
                  <span key={s} className={`text-xs px-1.5 py-0.5 rounded ${info.color}`}>{SIGN_SYMBOLS[s]}</span>
                ))}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-3 pb-3 space-y-2 border-t border-border pt-2 text-[10px]">
                <p><span className="text-foreground font-medium">Características:</span> <span className="text-muted-foreground">{info.traits}</span></p>
                <p><span className="text-green-400 font-medium">Compatível com:</span> <span className="text-muted-foreground">{info.compatible}</span></p>
                <p><span className="text-orange-400 font-medium">Desafiador com:</span> <span className="text-muted-foreground">{info.challenging}</span></p>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
}

function ModalitiesSection() {
  return (
    <div className="space-y-2">
      <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">Guia das 3 Modalidades</p>
      {(Object.entries(MODALITY_INFO) as [Modality, typeof MODALITY_INFO[Modality]][]).map(([mod, info]) => (
        <Collapsible key={mod}>
          <Card className="border-border bg-card overflow-hidden">
            <CollapsibleTrigger className="w-full p-3 flex items-center justify-between text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg">{info.emoji}</span>
                <div>
                  <p className="font-display text-xs tracking-wider text-foreground">{mod}</p>
                  <p className="text-[9px] text-muted-foreground">{info.signs.join(', ')}</p>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-3 pb-3 space-y-2 border-t border-border pt-2 text-[10px]">
                <p><span className="text-foreground font-medium">Características:</span> <span className="text-muted-foreground">{info.traits}</span></p>
                <div className="space-y-1 mt-2">
                  {(Object.entries(info.dynamics) as [Modality, string][]).map(([m, d]) => (
                    <p key={m}><span className="text-primary">{mod} + {m}:</span> <span className="text-muted-foreground">{d}</span></p>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
}

function AspectsSection() {
  return (
    <div className="space-y-2">
      <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">Aspectos Astrológicos</p>
      {ASPECTS.map(aspect => (
        <Collapsible key={aspect.name}>
          <Card className="border-border bg-card overflow-hidden">
            <CollapsibleTrigger className="w-full p-3 flex items-center justify-between text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono">{aspect.symbol}</span>
                <div>
                  <p className="font-display text-xs tracking-wider text-foreground">{aspect.name} <span className="text-muted-foreground">({aspect.degree})</span></p>
                  <p className="text-[9px] text-muted-foreground">{aspect.distance}</p>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-3 pb-3 space-y-1 border-t border-border pt-2 text-[10px]">
                <p><span className="text-foreground font-medium">Significado:</span> <span className="text-muted-foreground">{aspect.meaning}</span></p>
                <p><span className="text-foreground font-medium">Em relacionamentos:</span> <span className="text-muted-foreground">{aspect.relationship}</span></p>
                <p><span className="text-foreground font-medium">Exemplo:</span> <span className="text-primary">{aspect.example}</span></p>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
}

function MatrixSection({ selectedCell, setSelectedCell }: { selectedCell: { sign1: string; sign2: string } | null; setSelectedCell: (cell: { sign1: string; sign2: string } | null) => void }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-3">
      <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">Matriz Sol × Sol</p>
      <div className="overflow-x-auto">
        <div className="inline-grid" style={{ gridTemplateColumns: `24px repeat(12, 24px)` }}>
          {/* Header */}
          <div />
          {SIGNS.map(s => (
            <div key={s} className="text-[8px] text-center text-muted-foreground">{SIGN_SYMBOLS[s]}</div>
          ))}
          {/* Rows */}
          {SIGNS.map(sign1 => (
            <>
              <div key={`row-${sign1}`} className="text-[8px] text-muted-foreground flex items-center">{SIGN_SYMBOLS[sign1]}</div>
              {SIGNS.map(sign2 => {
                const score = getSignCompatibility(sign1, sign2);
                return (
                  <button
                    key={`${sign1}-${sign2}`}
                    onClick={() => setSelectedCell({ sign1, sign2 })}
                    className={`w-5 h-5 rounded-sm ${getScoreColor(score)} opacity-70 hover:opacity-100 transition-opacity`}
                    title={`${sign1} × ${sign2}: ${score}%`}
                  />
                );
              })}
            </>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex gap-3 text-[8px] text-muted-foreground justify-center">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500" /> 80-100%</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-yellow-500" /> 60-79%</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-orange-500" /> 40-59%</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500" /> 0-39%</span>
      </div>

      {/* Selected Cell Detail */}
      {selectedCell && (
        <Card className="border-border bg-card p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-display text-xs tracking-wider text-foreground">
              {SIGN_SYMBOLS[selectedCell.sign1]} {selectedCell.sign1} × {SIGN_SYMBOLS[selectedCell.sign2]} {selectedCell.sign2}
            </p>
            <button onClick={() => setSelectedCell(null)} className="text-muted-foreground text-xs">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <p className="text-muted-foreground">Elemento:</p>
              <p className="text-foreground">{SIGN_ELEMENT[selectedCell.sign1]} × {SIGN_ELEMENT[selectedCell.sign2]}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Modalidade:</p>
              <p className="text-foreground">{SIGN_MODALITY[selectedCell.sign1]} × {SIGN_MODALITY[selectedCell.sign2]}</p>
            </div>
          </div>
          <div className="text-center">
            <span className="font-display text-lg text-primary">{getSignCompatibility(selectedCell.sign1, selectedCell.sign2)}%</span>
          </div>
        </Card>
      )}
    </div>
  );
}
