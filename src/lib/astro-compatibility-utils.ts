// === Zodiac Signs & Elements ===
export const SIGNS = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
] as const;

export type ZodiacSign = typeof SIGNS[number];

export const SIGN_SYMBOLS: Record<string, string> = {
  'Áries': '♈', 'Touro': '♉', 'Gêmeos': '♊', 'Câncer': '♋',
  'Leão': '♌', 'Virgem': '♍', 'Libra': '♎', 'Escorpião': '♏',
  'Sagitário': '♐', 'Capricórnio': '♑', 'Aquário': '♒', 'Peixes': '♓',
};

export type Element = 'Fogo' | 'Terra' | 'Ar' | 'Água';
export type Modality = 'Cardeal' | 'Fixo' | 'Mutável';

export const SIGN_ELEMENT: Record<string, Element> = {
  'Áries': 'Fogo', 'Leão': 'Fogo', 'Sagitário': 'Fogo',
  'Touro': 'Terra', 'Virgem': 'Terra', 'Capricórnio': 'Terra',
  'Gêmeos': 'Ar', 'Libra': 'Ar', 'Aquário': 'Ar',
  'Câncer': 'Água', 'Escorpião': 'Água', 'Peixes': 'Água',
};

export const SIGN_MODALITY: Record<string, Modality> = {
  'Áries': 'Cardeal', 'Câncer': 'Cardeal', 'Libra': 'Cardeal', 'Capricórnio': 'Cardeal',
  'Touro': 'Fixo', 'Leão': 'Fixo', 'Escorpião': 'Fixo', 'Aquário': 'Fixo',
  'Gêmeos': 'Mutável', 'Virgem': 'Mutável', 'Sagitário': 'Mutável', 'Peixes': 'Mutável',
};

export const ELEMENT_COLOR: Record<Element, string> = {
  'Fogo': 'hsl(15 80% 55%)',
  'Terra': 'hsl(90 40% 45%)',
  'Ar': 'hsl(200 60% 55%)',
  'Água': 'hsl(220 60% 50%)',
};

// === Compatibility Matrix (element-based) ===
// Same element (trine) = 90-98, Complementary (sextile) = 72-82, Neutral = 50-62, Square = 35-48, Opposition = 40-55

const ELEMENT_COMPAT: Record<string, number> = {
  'Fogo-Fogo': 92, 'Terra-Terra': 90, 'Ar-Ar': 88, 'Água-Água': 94,
  'Fogo-Ar': 80, 'Ar-Fogo': 80,
  'Terra-Água': 78, 'Água-Terra': 78,
  'Fogo-Sagitário': 95,
  'Fogo-Terra': 42, 'Terra-Fogo': 42,
  'Fogo-Água': 38, 'Água-Fogo': 38,
  'Ar-Terra': 45, 'Terra-Ar': 45,
  'Ar-Água': 40, 'Água-Ar': 40,
};

// Specific sign-pair adjustments for more nuance
const SIGN_PAIR_BONUS: Record<string, number> = {
  // Same sign
  ...Object.fromEntries(SIGNS.map(s => [`${s}-${s}`, -5])),
  // Classic pairs (oppositions with magnetism)
  'Áries-Libra': 12, 'Libra-Áries': 12,
  'Touro-Escorpião': 15, 'Escorpião-Touro': 15,
  'Gêmeos-Sagitário': 10, 'Sagitário-Gêmeos': 10,
  'Câncer-Capricórnio': 12, 'Capricórnio-Câncer': 12,
  'Leão-Aquário': 10, 'Aquário-Leão': 10,
  'Virgem-Peixes': 14, 'Peixes-Virgem': 14,
};

export function getSignCompatibility(sign1: string, sign2: string): number {
  if (!sign1 || !sign2) return 50;
  const el1 = SIGN_ELEMENT[sign1];
  const el2 = SIGN_ELEMENT[sign2];
  if (!el1 || !el2) return 50;
  const base = ELEMENT_COMPAT[`${el1}-${el2}`] ?? 55;
  const bonus = SIGN_PAIR_BONUS[`${sign1}-${sign2}`] ?? 0;
  return Math.max(0, Math.min(100, base + bonus));
}

export interface CompatibilityScores {
  overall: number;
  sunSun: number;
  moonMoon: number;
  ascAsc: number;
  crossSunMoon: number;
}

export interface PersonSigns {
  sun: string;
  moon: string;
  ascendant: string;
}

export function calculateCompatibility(user: PersonSigns, partner: PersonSigns): CompatibilityScores {
  const sunSun = getSignCompatibility(user.sun, partner.sun);
  const moonMoon = getSignCompatibility(user.moon, partner.moon);
  const ascAsc = getSignCompatibility(user.ascendant, partner.ascendant);
  const cross1 = getSignCompatibility(user.sun, partner.moon);
  const cross2 = getSignCompatibility(user.moon, partner.sun);
  const crossSunMoon = Math.round((cross1 + cross2) / 2);
  const overall = Math.round(sunSun * 0.3 + moonMoon * 0.3 + ascAsc * 0.2 + crossSunMoon * 0.2);
  return { overall, sunSun, moonMoon, ascAsc, crossSunMoon };
}

export function getScoreLabel(score: number): { label: string; emoji: string; colorClass: string } {
  if (score >= 80) return { label: 'Excelente', emoji: '💚', colorClass: 'text-green-400' };
  if (score >= 60) return { label: 'Boa', emoji: '💛', colorClass: 'text-yellow-400' };
  if (score >= 40) return { label: 'Desafiadora', emoji: '🧡', colorClass: 'text-orange-400' };
  return { label: 'Complexa', emoji: '💔', colorClass: 'text-red-400' };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'hsl(120 50% 45%)';
  if (score >= 60) return 'hsl(45 90% 55%)';
  if (score >= 40) return 'hsl(30 90% 55%)';
  return 'hsl(0 70% 50%)';
}

export function getPairIcon(score: number): string {
  if (score >= 80) return '✓✓';
  if (score >= 60) return '✓';
  if (score >= 40) return '~';
  return '⚠';
}

// Estimate sun sign from birth date
export function estimateSunSign(birthDate: string): string {
  const d = new Date(birthDate + 'T12:00:00');
  const month = d.getMonth() + 1;
  const day = d.getDate();
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Áries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Touro';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gêmeos';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Câncer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leão';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgem';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Escorpião';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagitário';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricórnio';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquário';
  return 'Peixes';
}

// Compatible signs by element
export function getCompatibleSigns(sign: string): { high: string[]; good: string[]; challenging: string[] } {
  const el = SIGN_ELEMENT[sign];
  if (!el) return { high: [], good: [], challenging: [] };
  const high = SIGNS.filter(s => SIGN_ELEMENT[s] === el && s !== sign);
  const complementary: Record<Element, Element> = { 'Fogo': 'Ar', 'Ar': 'Fogo', 'Terra': 'Água', 'Água': 'Terra' };
  const good = SIGNS.filter(s => SIGN_ELEMENT[s] === complementary[el]);
  const challenging = SIGNS.filter(s => !high.includes(s) && !good.includes(s) && s !== sign);
  return { high: [...high], good: [...good], challenging: [...challenging] };
}

// Interpretations for sign pairs
export function getInterpretation(sign1: string, sign2: string, type: 'sun' | 'moon' | 'asc'): {
  text: string; strengths: string[]; challenges: string[];
} {
  const el1 = SIGN_ELEMENT[sign1] || 'Fogo';
  const el2 = SIGN_ELEMENT[sign2] || 'Fogo';
  const score = getSignCompatibility(sign1, sign2);

  const typeLabel = type === 'sun' ? 'personalidade' : type === 'moon' ? 'emocional' : 'primeira impressão';

  if (el1 === el2) {
    return {
      text: `${sign1} e ${sign2} compartilham o elemento ${el1}, criando uma conexão ${typeLabel} natural e intuitiva. Vocês se entendem instintivamente e valorizam as mesmas qualidades essenciais.`,
      strengths: ['Compreensão mútua profunda', 'Valores semelhantes', 'Comunicação fluida', 'Energia compatível'],
      challenges: ['Podem espelhar defeitos', 'Falta de complementaridade', 'Rotina por excesso de semelhança'],
    };
  }

  const compMap: Record<string, string> = {
    'Fogo-Ar': 'estimulante e inspiradora', 'Ar-Fogo': 'estimulante e inspiradora',
    'Terra-Água': 'nutritiva e estável', 'Água-Terra': 'nutritiva e estável',
    'Fogo-Terra': 'desafiadora mas construtiva', 'Terra-Fogo': 'desafiadora mas construtiva',
    'Fogo-Água': 'intensa e transformadora', 'Água-Fogo': 'intensa e transformadora',
    'Ar-Terra': 'complementar com esforço', 'Terra-Ar': 'complementar com esforço',
    'Ar-Água': 'complexa e evolutiva', 'Água-Ar': 'complexa e evolutiva',
  };
  const dynamic = compMap[`${el1}-${el2}`] || 'única';

  return {
    text: `${sign1} (${el1}) e ${sign2} (${el2}) formam uma dinâmica ${dynamic}. Enquanto ${sign1} traz ${getElementQuality(el1)}, ${sign2} oferece ${getElementQuality(el2)}. No aspecto ${typeLabel}, essa combinação ${score >= 60 ? 'favorece o crescimento mútuo' : 'exige paciência e compreensão'}.`,
    strengths: score >= 60
      ? ['Crescimento através das diferenças', 'Equilíbrio complementar', 'Estímulo mútuo']
      : ['Aprendizado profundo', 'Transformação pessoal', 'Resiliência do vínculo'],
    challenges: score >= 60
      ? ['Diferenças de ritmo', 'Necessidades distintas por vezes']
      : ['Comunicação exige esforço', 'Visões de mundo diferentes', 'Necessidade de paciência extra'],
  };
}

function getElementQuality(el: Element): string {
  const q: Record<Element, string> = {
    'Fogo': 'paixão, entusiasmo e iniciativa',
    'Terra': 'estabilidade, praticidade e segurança',
    'Ar': 'leveza, comunicação e ideias',
    'Água': 'profundidade emocional, intuição e cuidado',
  };
  return q[el] || '';
}

// Element distribution
export function getElementDistribution(signs: PersonSigns): Record<Element, number> {
  const dist: Record<Element, number> = { 'Fogo': 0, 'Terra': 0, 'Ar': 0, 'Água': 0 };
  [signs.sun, signs.moon, signs.ascendant].forEach(s => {
    const el = SIGN_ELEMENT[s];
    if (el) dist[el]++;
  });
  return dist;
}

// Element combo interpretation
export function getElementComboInterpretation(el1: Element, el2: Element): string {
  const combos: Record<string, string> = {
    'Fogo-Fogo': 'Paixão intensa e energia abundante, mas possíveis conflitos de ego.',
    'Terra-Terra': 'Estabilidade sólida e segurança mútua, mas risco de estagnação.',
    'Ar-Ar': 'Comunicação excepcional e liberdade mental, mas podem faltar raízes.',
    'Água-Água': 'Conexão emocional profundíssima, mas podem se afogar em emoções.',
    'Fogo-Ar': 'Combinação estimulante! O ar alimenta o fogo — criatividade e entusiasmo.',
    'Ar-Fogo': 'Combinação estimulante! O ar alimenta o fogo — criatividade e entusiasmo.',
    'Terra-Água': 'Estabilidade emocional. A água nutre a terra, criando um jardim fértil.',
    'Água-Terra': 'Estabilidade emocional. A água nutre a terra, criando um jardim fértil.',
    'Fogo-Terra': 'O fogo pode aquecer ou queimar a terra. Equilíbrio entre ação e paciência.',
    'Terra-Fogo': 'O fogo pode aquecer ou queimar a terra. Equilíbrio entre ação e paciência.',
    'Fogo-Água': 'Vapor! Transformação intensa. Paixão e emoção em ebulição constante.',
    'Água-Fogo': 'Vapor! Transformação intensa. Paixão e emoção em ebulição constante.',
    'Ar-Terra': 'A mente encontra a matéria. Bom para projetos, desafiador para emoções.',
    'Terra-Ar': 'A mente encontra a matéria. Bom para projetos, desafiador para emoções.',
    'Ar-Água': 'Ondas mentais e emocionais. Rica em nuances, mas pode gerar confusão.',
    'Água-Ar': 'Ondas mentais e emocionais. Rica em nuances, mas pode gerar confusão.',
  };
  return combos[`${el1}-${el2}`] || 'Uma combinação única com muito a descobrir.';
}
