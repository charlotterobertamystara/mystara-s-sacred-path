// Numerology calculation utilities - Kabbalistic/Pythagorean system

const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

const MASTER_NUMBERS = new Set([11, 22, 33]);

export function reduceToSingleDigit(num: number, keepMasters = true): number {
  if (keepMasters && MASTER_NUMBERS.has(num)) return num;
  while (num > 9 && !(keepMasters && MASTER_NUMBERS.has(num))) {
    num = String(num).split('').reduce((sum, d) => sum + parseInt(d), 0);
  }
  return num;
}

export function getLetterValue(letter: string): number {
  return LETTER_VALUES[letter.toUpperCase()] || 0;
}

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}

// 1. Life Path Number (from birth date)
export function calculateLifePath(birthDate: string): number {
  const [year, month, day] = birthDate.split('-').map(Number);
  const dayReduced = reduceToSingleDigit(day);
  const monthReduced = reduceToSingleDigit(month);
  const yearReduced = reduceToSingleDigit(year);
  return reduceToSingleDigit(dayReduced + monthReduced + yearReduced);
}

// 2. Expression Number (full name)
export function calculateExpression(fullName: string): number {
  const letters = normalizeText(fullName);
  const sum = letters.split('').reduce((acc, l) => acc + getLetterValue(l), 0);
  return reduceToSingleDigit(sum);
}

// 3. Soul Urge Number (vowels only)
export function calculateSoulUrge(fullName: string): number {
  const letters = normalizeText(fullName);
  const sum = letters.split('').filter(l => VOWELS.has(l)).reduce((acc, l) => acc + getLetterValue(l), 0);
  return reduceToSingleDigit(sum);
}

// 4. Personality Number (consonants only)
export function calculatePersonality(fullName: string): number {
  const letters = normalizeText(fullName);
  const sum = letters.split('').filter(l => !VOWELS.has(l)).reduce((acc, l) => acc + getLetterValue(l), 0);
  return reduceToSingleDigit(sum);
}

// 5. Destiny Number (life path + expression)
export function calculateDestiny(lifePath: number, expression: number): number {
  return reduceToSingleDigit(lifePath + expression);
}

// Personal Year
export function calculatePersonalYear(birthDate: string): number {
  const [_, month, day] = birthDate.split('-').map(Number);
  const currentYear = new Date().getFullYear();
  const sum = reduceToSingleDigit(day) + reduceToSingleDigit(month) + reduceToSingleDigit(currentYear);
  return reduceToSingleDigit(sum);
}

// Life Cycles
export function calculateLifeCycles(birthDate: string): { youth: number; maturity: number; wisdom: number; youthEnd: number; maturityEnd: number } {
  const [year, month, day] = birthDate.split('-').map(Number);
  const lifePath = calculateLifePath(birthDate);
  const youthEnd = 36 - lifePath;
  const maturityEnd = youthEnd + 27;

  return {
    youth: reduceToSingleDigit(month),
    maturity: reduceToSingleDigit(day),
    wisdom: reduceToSingleDigit(year),
    youthEnd,
    maturityEnd,
  };
}

export interface NumerologyResult {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  destiny: number;
  personalYear: number;
  cycles: { youth: number; maturity: number; wisdom: number; youthEnd: number; maturityEnd: number };
}

export function calculateFullNumerology(fullName: string, birthDate: string): NumerologyResult {
  const lifePath = calculateLifePath(birthDate);
  const expression = calculateExpression(fullName);
  const soulUrge = calculateSoulUrge(fullName);
  const personality = calculatePersonality(fullName);
  const destiny = calculateDestiny(lifePath, expression);
  const personalYear = calculatePersonalYear(birthDate);
  const cycles = calculateLifeCycles(birthDate);

  return { lifePath, expression, soulUrge, personality, destiny, personalYear, cycles };
}

export function isMasterNumber(num: number): boolean {
  return MASTER_NUMBERS.has(num);
}

export const NUMBER_MEANINGS: Record<number, {
  title: string;
  keywords: string[];
  description: string;
  challenges: string;
  mission: string;
  compatibility: number[];
}> = {
  1: {
    title: "O Líder",
    keywords: ["Independência", "Originalidade", "Pioneirismo", "Ambição"],
    description: "Você é uma alma pioneira, destinada a liderar e inovar. Possui força de vontade indomável e criatividade única. Sua energia é a de quem abre caminhos onde ninguém ousou antes.",
    challenges: "Egoísmo, teimosia, isolamento. Aprender a cooperar sem perder sua essência.",
    mission: "Ser líder pelo exemplo, inspirar outros com coragem e originalidade.",
    compatibility: [1, 3, 5, 9],
  },
  2: {
    title: "O Diplomata",
    keywords: ["Cooperação", "Sensibilidade", "Equilíbrio", "Intuição"],
    description: "Sua essência vibra na dualidade e no equilíbrio. Você é o mediador nato, capaz de unir opostos com gentileza. Sua força está na parceria e na empatia profunda.",
    challenges: "Dependência emocional, indecisão, hipersensibilidade.",
    mission: "Trazer harmonia e paz onde houver conflito, ser ponte entre mundos.",
    compatibility: [2, 4, 6, 8],
  },
  3: {
    title: "O Criativo",
    keywords: ["Expressão", "Alegria", "Comunicação", "Inspiração"],
    description: "Você carrega a chama sagrada da criatividade. A comunicação é seu dom divino — seja através da palavra, da arte ou do riso. Sua presença ilumina ambientes.",
    challenges: "Dispersão, superficialidade, fuga da responsabilidade.",
    mission: "Expressar a beleza da existência e inspirar alegria nos outros.",
    compatibility: [1, 3, 5, 9],
  },
  4: {
    title: "O Construtor",
    keywords: ["Estabilidade", "Trabalho", "Ordem", "Disciplina"],
    description: "Você é o alicerce sobre o qual se constroem impérios. Sua determinação e senso prático transformam sonhos em realidade material. A terra é seu elemento.",
    challenges: "Rigidez, controle excessivo, resistência a mudanças.",
    mission: "Construir bases sólidas que perdurem para as próximas gerações.",
    compatibility: [2, 4, 6, 8],
  },
  5: {
    title: "O Aventureiro",
    keywords: ["Liberdade", "Mudança", "Versatilidade", "Experiência"],
    description: "Sua alma anseia por liberdade e experiências. Você é o viajante do zodíaco numerológico, sempre em busca do próximo horizonte. A adaptabilidade é sua maior força.",
    challenges: "Inquietude, excessos, dificuldade com compromissos.",
    mission: "Vivenciar a liberdade com sabedoria e compartilhar suas descobertas.",
    compatibility: [1, 3, 5, 7],
  },
  6: {
    title: "O Responsável",
    keywords: ["Amor", "Família", "Harmonia", "Cura"],
    description: "Você é o guardião do lar e do coração. Seu dom é nutrir, curar e trazer beleza ao mundo. O amor em todas as formas é seu combustível sagrado.",
    challenges: "Perfeccionismo, controle, sacrifício excessivo pelo outro.",
    mission: "Servir ao amor incondicional, curar através da compaixão e beleza.",
    compatibility: [2, 4, 6, 9],
  },
  7: {
    title: "O Místico",
    keywords: ["Sabedoria", "Introspecção", "Espiritualidade", "Análise"],
    description: "Você é o buscador eterno da verdade oculta. Sua mente penetra véus que outros sequer percebem. A solidão é seu santuário e a sabedoria, seu tesouro.",
    challenges: "Isolamento, frieza, cinismo, desconexão emocional.",
    mission: "Buscar a verdade profunda e iluminar o caminho dos que buscam.",
    compatibility: [5, 7, 9, 11],
  },
  8: {
    title: "O Poderoso",
    keywords: ["Abundância", "Poder", "Realização", "Karma"],
    description: "Você vibra na frequência da manifestação material e do poder. O universo lhe deu a capacidade de transformar energia em matéria. O karma é seu professor.",
    challenges: "Ganância, autoritarismo, desequilíbrio entre material e espiritual.",
    mission: "Usar o poder material para servir ao bem maior, equilibrar dar e receber.",
    compatibility: [2, 4, 6, 8],
  },
  9: {
    title: "O Humanitário",
    keywords: ["Compaixão", "Universalidade", "Completude", "Sabedoria"],
    description: "Você carrega a sabedoria de todos os números anteriores. Sua alma é antiga e compassiva. O serviço à humanidade é seu chamado mais profundo.",
    challenges: "Mártir, dispersão, dificuldade em deixar ir.",
    mission: "Servir à humanidade com amor universal, encerrar ciclos kármicos.",
    compatibility: [1, 3, 6, 9],
  },
  11: {
    title: "O Mestre Iluminador",
    keywords: ["Iluminação", "Intuição Superior", "Inspiração", "Canal Espiritual"],
    description: "Número mestre da iluminação espiritual. Você é um canal entre o divino e o terreno. Sua intuição beira a clarividência e sua presença eleva a consciência coletiva.",
    challenges: "Extrema sensibilidade, ansiedade, dificuldade em se ancorar na realidade.",
    mission: "Ser farol de luz espiritual, elevar a consciência coletiva através do exemplo.",
    compatibility: [7, 9, 11, 22],
  },
  22: {
    title: "O Mestre Construtor",
    keywords: ["Visão Global", "Realização Magistral", "Poder Criativo", "Legado"],
    description: "O mais poderoso dos números mestres. Você tem a visão do 11 combinada com a capacidade de construção do 4. Pode literalmente mudar o mundo.",
    challenges: "Pressão interna avassaladora, perfeccionismo paralisante.",
    mission: "Construir algo grandioso que beneficie toda a humanidade.",
    compatibility: [4, 8, 11, 22],
  },
  33: {
    title: "O Mestre Curador",
    keywords: ["Amor Cósmico", "Cura Universal", "Sacrifício Sagrado", "Compaixão Divina"],
    description: "O número da maestria espiritual suprema. Combina a iluminação do 11 com a construção do 22, elevados ao amor incondicional do 6. Extremamente raro.",
    challenges: "Carregar o peso do mundo, sacrifício extremo, idealismo inalcançável.",
    mission: "Curar a humanidade através do amor puro e da compaixão infinita.",
    compatibility: [6, 9, 11, 33],
  },
};

export const FUNDAMENTALS = [
  {
    title: "História da Numerologia Cabalística",
    content: "A Numerologia Cabalística tem suas raízes na antiga tradição mística judaica da Kabbalah (קבלה), que significa 'receber' em hebraico. Os cabalistas acreditavam que os números são a linguagem divina do universo — cada letra do alfabeto hebraico possui um valor numérico sagrado (Gematria), e através desses números, podemos decifrar os mistérios da criação e do destino humano. Esta tradição milenar foi preservada por gerações de místicos e sábios, passando pela Escola Pitagórica na Grécia, pela alquimia medieval e chegando até nós como um sistema profundo de autoconhecimento."
  },
  {
    title: "A Árvore da Vida",
    content: "Na Kabbalah, a Árvore da Vida (Etz Chaim) é o mapa do universo composto por 10 Sephiroth (emanações divinas) conectadas por 22 caminhos — correspondentes às 22 letras do alfabeto hebraico. Cada Sephirah vibra em uma frequência numérica: Kether (1) é a Coroa, a unidade suprema; Chokmah (2) é a Sabedoria; Binah (3) é o Entendimento; e assim por diante até Malkuth (10), o Reino material. Os números do seu mapa numerológico revelam quais Sephiroth são mais ativas em sua jornada espiritual."
  },
  {
    title: "Significado dos Números 1 a 9",
    content: "1 (Kether) — Início, liderança, individualidade. A faísca divina original.\n2 (Chokmah) — Dualidade, parceria, intuição. O princípio receptivo.\n3 (Binah) — Criatividade, expressão, alegria. O triângulo da manifestação.\n4 (Chesed) — Estrutura, disciplina, trabalho. As quatro fundações.\n5 (Geburah) — Liberdade, mudança, aventura. Os cinco sentidos.\n6 (Tiphareth) — Amor, harmonia, responsabilidade. A beleza central.\n7 (Netzach) — Mistério, sabedoria, introspecção. Os sete dias da criação.\n8 (Hod) — Poder, abundância, karma. O infinito deitado (∞).\n9 (Yesod) — Completude, humanitarismo, compaixão. O fim de um ciclo."
  },
  {
    title: "Números Mestres: 11, 22 e 33",
    content: "Os números mestres são portais de vibração elevada. Não são reduzidos a um único dígito porque carregam uma frequência especial:\n\n11 — O Mestre Iluminador: canal entre o mundo espiritual e material. Porta a intuição amplificada e o dom da inspiração.\n\n22 — O Mestre Construtor: combina a visão espiritual do 11 com a capacidade prática do 4. Pode manifestar sonhos em realidade concreta.\n\n33 — O Mestre Curador: a expressão máxima do amor universal. Reúne a iluminação do 11 e a construção do 22, elevados pela compaixão do 6. Extremamente raro e poderoso."
  },
  {
    title: "Como os Números Influenciam o Destino",
    content: "Cada número em seu mapa numerológico atua em uma dimensão diferente da sua existência:\n\n• Caminho de Vida — sua missão principal nesta encarnação\n• Expressão — seus talentos naturais e como o mundo te vê\n• Alma — seus desejos mais profundos e motivações ocultas\n• Personalidade — a máscara que você apresenta ao mundo\n• Destino — a síntese do seu propósito evolutivo\n• Ano Pessoal — a energia que rege o ciclo anual atual\n\nQuando compreendemos esses números, podemos alinhar nossas ações com nosso propósito cósmico e navegar a vida com maior clareza e confiança."
  },
];
