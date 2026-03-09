import SunCalc from 'suncalc';

// Zodiac signs with their corresponding degree ranges
const ZODIAC_SIGNS = [
  { name: 'Áries', symbol: '♈', element: 'Fogo', start: 0, end: 30 },
  { name: 'Touro', symbol: '♉', element: 'Terra', start: 30, end: 60 },
  { name: 'Gêmeos', symbol: '♊', element: 'Ar', start: 60, end: 90 },
  { name: 'Câncer', symbol: '♋', element: 'Água', start: 90, end: 120 },
  { name: 'Leão', symbol: '♌', element: 'Fogo', start: 120, end: 150 },
  { name: 'Virgem', symbol: '♍', element: 'Terra', start: 150, end: 180 },
  { name: 'Libra', symbol: '♎', element: 'Ar', start: 180, end: 210 },
  { name: 'Escorpião', symbol: '♏', element: 'Água', start: 210, end: 240 },
  { name: 'Sagitário', symbol: '♐', element: 'Fogo', start: 240, end: 270 },
  { name: 'Capricórnio', symbol: '♑', element: 'Terra', start: 270, end: 300 },
  { name: 'Aquário', symbol: '♒', element: 'Ar', start: 300, end: 330 },
  { name: 'Peixes', symbol: '♓', element: 'Água', start: 330, end: 360 },
];

export interface MoonPhaseInfo {
  phase: string;
  phaseName: string;
  illumination: number;
  emoji: string;
  energy: 'receptiva' | 'ativa';
  bestFor: string[];
  angle: number;
}

export interface MoonSignInfo {
  name: string;
  symbol: string;
  element: string;
}

export interface DayLunarInfo {
  date: Date;
  phase: MoonPhaseInfo;
  sign: MoonSignInfo;
  isNewMoon: boolean;
  isFullMoon: boolean;
  isEclipse: boolean;
}

export function getMoonPhase(date: Date): MoonPhaseInfo {
  const moonIllum = SunCalc.getMoonIllumination(date);
  const phase = moonIllum.phase;
  const illumination = Math.round(moonIllum.fraction * 100);
  const angle = moonIllum.angle;

  let phaseName: string;
  let emoji: string;
  let energy: 'receptiva' | 'ativa';
  let bestFor: string[];

  if (phase < 0.03 || phase > 0.97) {
    phaseName = 'Lua Nova';
    emoji = '🌑';
    energy = 'receptiva';
    bestFor = ['Novos começos', 'Plantar intenções', 'Introspecção', 'Meditação'];
  } else if (phase < 0.22) {
    phaseName = 'Lua Crescente';
    emoji = '🌒';
    energy = 'ativa';
    bestFor = ['Crescimento', 'Ação', 'Construção', 'Manifestação'];
  } else if (phase < 0.28) {
    phaseName = 'Quarto Crescente';
    emoji = '🌓';
    energy = 'ativa';
    bestFor = ['Decisões', 'Superar obstáculos', 'Compromisso'];
  } else if (phase < 0.47) {
    phaseName = 'Lua Gibosa Crescente';
    emoji = '🌔';
    energy = 'ativa';
    bestFor = ['Refinamento', 'Ajustes', 'Preparação'];
  } else if (phase < 0.53) {
    phaseName = 'Lua Cheia';
    emoji = '🌕';
    energy = 'ativa';
    bestFor = ['Manifestação', 'Colheita', 'Celebração', 'Liberação'];
  } else if (phase < 0.72) {
    phaseName = 'Lua Gibosa Minguante';
    emoji = '🌖';
    energy = 'receptiva';
    bestFor = ['Gratidão', 'Compartilhar', 'Ensinar'];
  } else if (phase < 0.78) {
    phaseName = 'Quarto Minguante';
    emoji = '🌗';
    energy = 'receptiva';
    bestFor = ['Soltar', 'Liberar', 'Perdoar'];
  } else {
    phaseName = 'Lua Minguante';
    emoji = '🌘';
    energy = 'receptiva';
    bestFor = ['Descanso', 'Limpeza', 'Encerramento', 'Banimento'];
  }

  return {
    phase: phase.toFixed(2),
    phaseName,
    illumination,
    emoji,
    energy,
    bestFor,
    angle,
  };
}

// Simplified moon sign calculation based on lunar longitude
// This is an approximation - for precise calculations, an ephemeris would be needed
export function getMoonSign(date: Date): MoonSignInfo {
  const moonPos = SunCalc.getMoonPosition(date, -23.5505, -46.6333); // São Paulo as default
  
  // Convert moon altitude and azimuth to approximate ecliptic longitude
  // This is a simplified calculation
  const daysSinceEpoch = (date.getTime() - new Date('2000-01-01').getTime()) / (1000 * 60 * 60 * 24);
  const meanLongitude = (218.32 + 13.17639648 * daysSinceEpoch) % 360;
  const normalizedLongitude = meanLongitude < 0 ? meanLongitude + 360 : meanLongitude;
  
  const sign = ZODIAC_SIGNS.find(s => normalizedLongitude >= s.start && normalizedLongitude < s.end) || ZODIAC_SIGNS[0];
  
  return {
    name: sign.name,
    symbol: sign.symbol,
    element: sign.element,
  };
}

export function getDayLunarInfo(date: Date): DayLunarInfo {
  const phase = getMoonPhase(date);
  const sign = getMoonSign(date);
  
  return {
    date,
    phase,
    sign,
    isNewMoon: phase.phaseName === 'Lua Nova',
    isFullMoon: phase.phaseName === 'Lua Cheia',
    isEclipse: false, // Would need external API for eclipse data
  };
}

export function getMonthLunarData(year: number, month: number): DayLunarInfo[] {
  const days: DayLunarInfo[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day, 12, 0, 0);
    days.push(getDayLunarInfo(date));
  }
  
  return days;
}

export function getNextFullMoon(fromDate: Date = new Date()): Date {
  const date = new Date(fromDate);
  for (let i = 0; i < 30; i++) {
    const phase = getMoonPhase(date);
    if (phase.phaseName === 'Lua Cheia') {
      return date;
    }
    date.setDate(date.getDate() + 1);
  }
  return date;
}

export function getNextNewMoon(fromDate: Date = new Date()): Date {
  const date = new Date(fromDate);
  for (let i = 0; i < 30; i++) {
    const phase = getMoonPhase(date);
    if (phase.phaseName === 'Lua Nova') {
      return date;
    }
    date.setDate(date.getDate() + 1);
  }
  return date;
}

export function calculateBirthMoonPhase(birthDate: Date): string {
  const phase = getMoonPhase(birthDate);
  return phase.phaseName;
}

export function calculateLunarSign(birthDate: Date): MoonSignInfo {
  return getMoonSign(birthDate);
}

// Lunar node calculation (simplified - North Node)
export function calculateLunarNode(birthDate: Date): 'Norte' | 'Sul' {
  const daysSinceEpoch = (birthDate.getTime() - new Date('2000-01-01').getTime()) / (1000 * 60 * 60 * 24);
  const nodeCycle = daysSinceEpoch % 6798.4; // Node cycle ~18.6 years
  return nodeCycle < 3399.2 ? 'Norte' : 'Sul';
}

export function getLunarHouse(birthDate: Date, birthTime?: string): string {
  // Simplified - would need birth time and location for accurate calculation
  if (!birthTime) return 'Casa 4 (estimada)';
  
  const hours = parseInt(birthTime.split(':')[0]);
  const houseIndex = Math.floor((hours + 6) / 2) % 12 + 1;
  return `Casa ${houseIndex}`;
}

export const MOON_PHASE_COLORS = {
  'Lua Nova': { primary: 'hsl(230 50% 25%)', secondary: 'hsl(230 60% 15%)' },
  'Lua Crescente': { primary: 'hsl(45 60% 55%)', secondary: 'hsl(45 50% 35%)' },
  'Quarto Crescente': { primary: 'hsl(45 70% 60%)', secondary: 'hsl(45 60% 40%)' },
  'Lua Gibosa Crescente': { primary: 'hsl(45 80% 65%)', secondary: 'hsl(45 70% 50%)' },
  'Lua Cheia': { primary: 'hsl(45 90% 75%)', secondary: 'hsl(45 80% 60%)' },
  'Lua Gibosa Minguante': { primary: 'hsl(230 40% 55%)', secondary: 'hsl(230 40% 40%)' },
  'Quarto Minguante': { primary: 'hsl(230 50% 50%)', secondary: 'hsl(230 50% 35%)' },
  'Lua Minguante': { primary: 'hsl(230 60% 40%)', secondary: 'hsl(230 60% 25%)' },
};
