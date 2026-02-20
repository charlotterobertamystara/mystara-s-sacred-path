export interface RadiestesiaGraph {
  id: string;
  name: string;
  description: string;
  usage: string;
  needsNorth: boolean;
  shape: "polygon" | "circles" | "star" | "cross" | "spiral" | "custom";
  crystal: string;
  crystalReason: string;
  category: "limpeza" | "protecao" | "cura" | "prosperidade" | "amor" | "espiritualidade" | "saude" | "harmonizacao";
  svgPath: string;
}

export const categoryLabels: Record<RadiestesiaGraph["category"], string> = {
  limpeza: "Limpeza",
  protecao: "Proteção",
  cura: "Cura",
  prosperidade: "Prosperidade",
  amor: "Amor",
  espiritualidade: "Espiritualidade",
  saude: "Saúde",
  harmonizacao: "Harmonização",
};

export const radiestesiaGraphs: RadiestesiaGraph[] = [
  // ─── LIMPEZA ────────────────────────────────────────────────────────────────
  {
    id: "desimpregnador",
    name: "Desimpregnador",
    description: "Gráfico especializado em remover energias negativas impregnadas. Ideal para limpeza profunda de pessoas, ambientes e objetos.",
    usage: "Remoção de cargas negativas acumuladas, limpeza de ambientes pesados, desimpregnação de objetos e pessoas.",
    needsNorth: true,
    shape: "star",
    category: "limpeza",
    crystal: "Ametista",
    crystalReason: "Transmuta energias negativas em positivas e eleva a vibração espiritual.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      ${Array.from({length: 8}, (_, i) => {
        const angle = (i * 45 - 90) * Math.PI / 180;
        return `<line x1="100" y1="100" x2="${100 + 90 * Math.cos(angle)}" y2="${100 + 90 * Math.sin(angle)}" stroke="currentColor" stroke-width="1.5"/>`;
      }).join('')}
      <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "decagono",
    name: "Decágono",
    description: "Gráfico de 10 lados, um dos mais versáteis e poderosos da radiestesia. Excelente para limpeza energética profunda.",
    usage: "Limpeza energética de ambientes, pessoas e objetos. Proteção espiritual e descarrego.",
    needsNorth: true,
    shape: "polygon",
    category: "limpeza",
    crystal: "Turmalina Negra",
    crystalReason: "Potencializa a absorção de energias densas e proteção contra negatividade.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="${Array.from({length: 10}, (_, i) => {
        const angle = (i * 36 - 90) * Math.PI / 180;
        return `${100 + 85 * Math.cos(angle)},${100 + 85 * Math.sin(angle)}`;
      }).join(' ')}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${Array.from({length: 10}, (_, i) => {
        const angle = (i * 36 - 90) * Math.PI / 180;
        return `${100 + 55 * Math.cos(angle)},${100 + 55 * Math.sin(angle)}`;
      }).join(' ')}" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "decagono-duplo",
    name: "Decágono Duplo",
    description: "Versão amplificada do Decágono, com dois polígonos de 10 lados sobrepostos e rotacionados. Poder de limpeza superior.",
    usage: "Limpeza profunda e urgente, ambientes muito carregados, situações de baixa vibração persistente.",
    needsNorth: true,
    shape: "polygon",
    category: "limpeza",
    crystal: "Turmalina Negra",
    crystalReason: "Amplifica a capacidade de absorção e neutralização de energias densas.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="${Array.from({length: 10}, (_, i) => {
        const angle = (i * 36 - 90) * Math.PI / 180;
        return `${100 + 85 * Math.cos(angle)},${100 + 85 * Math.sin(angle)}`;
      }).join(' ')}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${Array.from({length: 10}, (_, i) => {
        const angle = (i * 36 - 72) * Math.PI / 180;
        return `${100 + 85 * Math.cos(angle)},${100 + 85 * Math.sin(angle)}`;
      }).join(' ')}" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "turbilhao",
    name: "Turbilhão",
    description: "Gráfico em espiral turbilhonada que cria um vórtice energético de limpeza. Remove energias estagnadas com força centrífuga.",
    usage: "Limpeza de energias estagnadas, desbloqueio de fluxos energéticos e renovação do ambiente.",
    needsNorth: false,
    shape: "spiral",
    category: "limpeza",
    crystal: "Selenita",
    crystalReason: "Cristal de limpeza rápida e intensa, amplia o efeito do vórtice purificador.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="${(() => {
        let d = 'M 100 100';
        for (let i = 0; i < 1080; i += 5) {
          const r = 2 + i * 0.075;
          const a = (i - 90) * Math.PI / 180;
          d += ` L ${100 + r * Math.cos(a)} ${100 + r * Math.sin(a)}`;
        }
        return d;
      })()}" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="4" fill="currentColor"/>
    </svg>`
  },

  // ─── PROTEÇÃO ───────────────────────────────────────────────────────────────
  {
    id: "anti-magia",
    name: "Anti-Magia",
    description: "Gráfico de proteção contra trabalhos espirituais negativos, inveja e mau-olhado.",
    usage: "Proteção contra magia negativa, inveja, olho gordo e trabalhos espirituais direcionados.",
    needsNorth: true,
    shape: "custom",
    category: "protecao",
    crystal: "Obsidiana Negra",
    crystalReason: "Escudo protetor poderoso que reflete energias negativas de volta à origem.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="100,10 190,100 100,190 10,100" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="100,35 165,100 100,165 35,100" fill="none" stroke="currentColor" stroke-width="1"/>
      <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" stroke-width="1"/>
      <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "pentagrama-protecao",
    name: "Pentagrama Protetor",
    description: "Estrela de cinco pontas encerrada em círculo. Símbolo universal de proteção, afasta influências negativas e cria escudo energético.",
    usage: "Proteção pessoal e do lar, escudo contra energias negativas, proteção de crianças e animais.",
    needsNorth: true,
    shape: "star",
    category: "protecao",
    crystal: "Obsidiana Mahogany",
    crystalReason: "Oferece proteção enraizada e estabilidade, afastando influências externas negativas.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${Array.from({length: 5}, (_, i) => {
        const angle = (i * 72 - 90) * Math.PI / 180;
        return `${100 + 80 * Math.cos(angle)},${100 + 80 * Math.sin(angle)}`;
      }).join(' ')}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "escudo-radiestesico",
    name: "Escudo Radiestésico",
    description: "Gráfico em camadas concêntricas com linhas de força protetoras. Cria uma barreira vibracional ao redor do testemunho.",
    usage: "Proteção contínua da aura, escudo familiar, proteção de residências e veículos.",
    needsNorth: true,
    shape: "custom",
    category: "protecao",
    crystal: "Pirita",
    crystalReason: "Cria um escudo energético dourado que repele energias indesejadas.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      ${Array.from({length: 5}, (_, i) => 
        `<circle cx="100" cy="100" r="${20 + i * 15}" fill="none" stroke="currentColor" stroke-width="${i === 4 ? 1.5 : 0.8}"/>`
      ).join('')}
      ${Array.from({length: 12}, (_, i) => {
        const angle = (i * 30) * Math.PI / 180;
        return `<line x1="${100 + 20 * Math.cos(angle)}" y1="${100 + 20 * Math.sin(angle)}" x2="${100 + 80 * Math.cos(angle)}" y2="${100 + 80 * Math.sin(angle)}" stroke="currentColor" stroke-width="0.8"/>`;
      }).join('')}
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
    </svg>`
  },

  // ─── CURA ────────────────────────────────────────────────────────────────────
  {
    id: "scap",
    name: "SCAP",
    description: "Sistema de Cura e Amparo Profundo. Gráfico para cura energética e emocional intensa.",
    usage: "Cura emocional, tratamento de traumas, amparo espiritual e recuperação energética.",
    needsNorth: true,
    shape: "custom",
    category: "cura",
    crystal: "Quartzo Verde",
    crystalReason: "Cristal de cura por excelência, amplifica as propriedades curativas do gráfico.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" stroke-width="1"/>
      <polygon points="100,15 185,100 100,185 15,100" fill="none" stroke="currentColor" stroke-width="1"/>
      <line x1="100" y1="15" x2="100" y2="185" stroke="currentColor" stroke-width="0.8"/>
      <line x1="15" y1="100" x2="185" y2="100" stroke="currentColor" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "anti-dor",
    name: "Anti-Dor",
    description: "Gráfico específico para alívio de dores físicas e energéticas. Atua nos campos vibracionais associados à dor.",
    usage: "Alívio de dores físicas crônicas, dores de cabeça, musculares e articulares no plano energético.",
    needsNorth: true,
    shape: "custom",
    category: "cura",
    crystal: "Ágata Azul",
    crystalReason: "Cristal de alívio, acalma e suaviza as vibrações de dor no campo energético.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" stroke-width="1.5"/>
      ${Array.from({length: 7}, (_, i) => {
        const angle = (i * 180/6) * Math.PI / 180;
        return `<line x1="${100 - 70 * Math.cos(angle)}" y1="${100 - 70 * Math.sin(angle)}" x2="${100 + 70 * Math.cos(angle)}" y2="${100 + 70 * Math.sin(angle)}" stroke="currentColor" stroke-width="0.8"/>`;
      }).join('')}
      <circle cx="100" cy="100" r="25" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "alta-vitalidade",
    name: "Alta Vitalidade",
    description: "Gráfico revitalizante que aumenta o nível de energia vital. Combate o esgotamento e restabelece o vigor energético.",
    usage: "Combate ao cansaço extremo, aumento de energia vital, recuperação pós-doenças e fortalecimento geral.",
    needsNorth: true,
    shape: "star",
    category: "cura",
    crystal: "Cornalina",
    crystalReason: "Cristal de vitalidade e energia, ativa o fogo interior e a força vital.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      ${Array.from({length: 12}, (_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const outerR = i % 2 === 0 ? 85 : 50;
        const nextAngle = ((i+1) * 30 - 90) * Math.PI / 180;
        const nextR = i % 2 === 0 ? 50 : 85;
        return `<line x1="${100 + outerR * Math.cos(angle)}" y1="${100 + outerR * Math.sin(angle)}" x2="${100 + nextR * Math.cos(nextAngle)}" y2="${100 + nextR * Math.sin(nextAngle)}" stroke="currentColor" stroke-width="1.2"/>`;
      }).join('')}
      <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
    </svg>`
  },
  {
    id: "cruz-ansata",
    name: "Cruz Ansata (Ankh)",
    description: "Símbolo egípcio da vida eterna. Usado para vitalidade, saúde e renovação energética profunda.",
    usage: "Revitalização, saúde física e espiritual, renovação de energias e longevidade.",
    needsNorth: true,
    shape: "cross",
    category: "saude",
    crystal: "Cornalina",
    crystalReason: "Cristal de vitalidade que ativa a energia vital e fortalece o corpo energético.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="55" rx="35" ry="40" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <line x1="100" y1="95" x2="100" y2="190" stroke="currentColor" stroke-width="1.5"/>
      <line x1="60" y1="130" x2="140" y2="130" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="130" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "diafragma-1",
    name: "Diafragma I",
    description: "Gráfico de equilíbrio energético que atua como um diafragma vibracional, regulando o fluxo de energia no campo áurico.",
    usage: "Equilíbrio emocional, regulação do sistema nervoso energético, ansiedade e desequilíbrios gerais.",
    needsNorth: true,
    shape: "circles",
    category: "cura",
    crystal: "Quartzo Azul",
    crystalReason: "Acalma e regula o fluxo energético, promovendo equilíbrio e serenidade.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="100" rx="85" ry="50" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <ellipse cx="100" cy="100" rx="60" ry="35" fill="none" stroke="currentColor" stroke-width="1"/>
      <ellipse cx="100" cy="100" rx="35" ry="20" fill="none" stroke="currentColor" stroke-width="1"/>
      <line x1="15" y1="100" x2="185" y2="100" stroke="currentColor" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "diafragma-2",
    name: "Diafragma II",
    description: "Segunda versão do Diafragma, com configuração vertical. Trabalha especificamente nos bloqueios do eixo vertical do campo áurico.",
    usage: "Desbloqueio de chakras, alinhamento do eixo energético, bloqueios emocionais verticais.",
    needsNorth: true,
    shape: "circles",
    category: "cura",
    crystal: "Água-Marinha",
    crystalReason: "Facilita a comunicação entre os centros energéticos e dissolve bloqueios.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="100" rx="50" ry="85" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <ellipse cx="100" cy="100" rx="35" ry="60" fill="none" stroke="currentColor" stroke-width="1"/>
      <ellipse cx="100" cy="100" rx="20" ry="35" fill="none" stroke="currentColor" stroke-width="1"/>
      <line x1="100" y1="15" x2="100" y2="185" stroke="currentColor" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },

  // ─── SAÚDE ───────────────────────────────────────────────────────────────────
  {
    id: "nove-circulos",
    name: "9 Círculos",
    description: "Gráfico composto por 9 círculos concêntricos. Usado para harmonização geral e equilíbrio energético de todo o campo áurico.",
    usage: "Harmonização de ambientes, equilíbrio dos chakras e fortalecimento do campo áurico.",
    needsNorth: false,
    shape: "circles",
    category: "saude",
    crystal: "Quartzo Rosa",
    crystalReason: "Promove harmonia, amor próprio e equilíbrio emocional em sintonia com os círculos.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      ${Array.from({length: 9}, (_, i) => 
        `<circle cx="100" cy="100" r="${10 + i * 10}" fill="none" stroke="currentColor" stroke-width="1"/>`
      ).join('')}
    </svg>`
  },
  {
    id: "trigono",
    name: "Trígono",
    description: "Triângulo equilátero duplo (Estrela de Davi) formando um campo de força triádico. Equilibra as polaridades energéticas.",
    usage: "Equilíbrio de polaridades, harmonização de opostos, estabilização do campo emocional e mental.",
    needsNorth: true,
    shape: "star",
    category: "harmonizacao",
    crystal: "Fluorita",
    crystalReason: "Cristal de equilíbrio mental e emocional, harmoniza os opostos com elegância.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="100,12 188,155 12,155" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="100,188 12,45 188,45" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },

  // ─── PROSPERIDADE ────────────────────────────────────────────────────────────
  {
    id: "prosperador",
    name: "Prosperador",
    description: "Gráfico focado em atrair abundância, prosperidade financeira e oportunidades. Formado por dois hexágonos entrelaçados.",
    usage: "Atração de prosperidade, abundância financeira, novos negócios e oportunidades profissionais.",
    needsNorth: true,
    shape: "custom",
    category: "prosperidade",
    crystal: "Pirita",
    crystalReason: "Conhecida como 'ouro dos tolos', atrai riqueza e prosperidade material.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="${Array.from({length: 6}, (_, i) => {
        const angle = (i * 60 - 90) * Math.PI / 180;
        return `${100 + 85 * Math.cos(angle)},${100 + 85 * Math.sin(angle)}`;
      }).join(' ')}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${Array.from({length: 6}, (_, i) => {
        const angle = (i * 60 - 60) * Math.PI / 180;
        return `${100 + 85 * Math.cos(angle)},${100 + 85 * Math.sin(angle)}`;
      }).join(' ')}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="45" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "turbilhao-prosperador",
    name: "Turbilhão Prosperador",
    description: "Combinação poderosa do vórtice turbilhonado com a geometria do Prosperador. Atrai e acelera o fluxo de abundância.",
    usage: "Aceleração de resultados financeiros, abertura de caminhos profissionais e atração de clientes.",
    needsNorth: true,
    shape: "spiral",
    category: "prosperidade",
    crystal: "Citrino",
    crystalReason: "O 'cristal da fortuna' ativa a lei da atração financeira e amplifica os resultados.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="${(() => {
        let d = 'M 100 100';
        for (let i = 0; i < 720; i += 5) {
          const r = 4 + i * 0.108;
          const a = (i - 90) * Math.PI / 180;
          d += ` L ${100 + r * Math.cos(a)} ${100 + r * Math.sin(a)}`;
        }
        return d;
      })()}" fill="none" stroke="currentColor" stroke-width="1"/>
      <polygon points="${Array.from({length: 6}, (_, i) => {
        const angle = (i * 60 - 90) * Math.PI / 180;
        return `${100 + 85 * Math.cos(angle)},${100 + 85 * Math.sin(angle)}`;
      }).join(' ')}" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="100" cy="100" r="6" fill="currentColor"/>
    </svg>`
  },
  {
    id: "solenoide",
    name: "Solenóide",
    description: "Gráfico espiral que canaliza e direciona energia como uma bobina elétrica. Potencializa pedidos e intenções.",
    usage: "Potencialização de pedidos, direcionamento de energia para objetivos específicos e amplificação de intenções.",
    needsNorth: true,
    shape: "spiral",
    category: "prosperidade",
    crystal: "Citrino",
    crystalReason: "Amplifica a energia de manifestação e atrai prosperidade e realizações.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="${(() => {
        let d = 'M 100 100';
        for (let i = 0; i < 720; i += 5) {
          const r = 5 + i * 0.11;
          const a = (i - 90) * Math.PI / 180;
          d += ` L ${100 + r * Math.cos(a)} ${100 + r * Math.sin(a)}`;
        }
        return d;
      })()}" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },

  // ─── AMOR ────────────────────────────────────────────────────────────────────
  {
    id: "desembaracador-relacionamentos",
    name: "Desembaraçador de Relacionamentos",
    description: "Gráfico que desfaz nós energéticos em relacionamentos. Libera padrões repetitivos, mágoas e karma relacional.",
    usage: "Desbloqueio de relacionamentos, resolução de conflitos energéticos, atração de parceiros e harmonia familiar.",
    needsNorth: true,
    shape: "custom",
    category: "amor",
    crystal: "Quartzo Rosa",
    crystalReason: "O cristal do amor incondicional, dissolve mágoas e abre o coração para receber.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="70" cy="100" r="50" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="130" cy="100" r="50" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="15" fill="none" stroke="currentColor" stroke-width="1"/>
      <line x1="100" y1="50" x2="100" y2="150" stroke="currentColor" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="5" fill="currentColor"/>
    </svg>`
  },
  {
    id: "amor-incondicional",
    name: "Amor Incondicional",
    description: "Gráfico em forma de coração sagrado com espiral de abertura. Trabalha o amor próprio e a receptividade afetiva.",
    usage: "Cura de feridas emocionais, atração de amor saudável, fortalecimento do amor próprio e harmonização de casais.",
    needsNorth: false,
    shape: "custom",
    category: "amor",
    crystal: "Rodocrosita",
    crystalReason: "Cristal do amor romântico e cura emocional, cura o coração e atrai o amor verdadeiro.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 160 C40 120 20 80 40 55 C55 35 80 35 100 55 C120 35 145 35 160 55 C180 80 160 120 100 160Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <path d="M100 140 C55 110 40 80 55 62 C65 50 82 50 100 65 C118 50 135 50 145 62 C160 80 145 110 100 140Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="95" r="18" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <circle cx="100" cy="95" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },

  // ─── ESPIRITUALIDADE ─────────────────────────────────────────────────────────
  {
    id: "flor-da-vida",
    name: "Flor da Vida",
    description: "Padrão sagrado composto por 19 círculos sobrepostos. Contém toda a geometria sagrada do universo e conecta com a criação.",
    usage: "Elevação espiritual, conexão com o divino, meditação profunda, ativação da consciência superior.",
    needsNorth: false,
    shape: "circles",
    category: "espiritualidade",
    crystal: "Quartzo Transparente",
    crystalReason: "O mestre dos cristais amplifica todas as intenções e conecta com a luz universal.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="25" fill="none" stroke="currentColor" stroke-width="1"/>
      ${[0,60,120,180,240,300].map(deg => {
        const a = deg * Math.PI / 180;
        const cx = 100 + 25 * Math.cos(a);
        const cy = 100 + 25 * Math.sin(a);
        return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="25" fill="none" stroke="currentColor" stroke-width="1"/>`;
      }).join('')}
      ${[0,60,120,180,240,300].map(deg => {
        const a = deg * Math.PI / 180;
        const cx = 100 + 50 * Math.cos(a);
        const cy = 100 + 50 * Math.sin(a);
        return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="25" fill="none" stroke="currentColor" stroke-width="1"/>`;
      }).join('')}
      ${[30,90,150,210,270,330].map(deg => {
        const a = deg * Math.PI / 180;
        const cx = 100 + 50 * Math.cos(a);
        const cy = 100 + 50 * Math.sin(a);
        return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="25" fill="none" stroke="currentColor" stroke-width="1"/>`;
      }).join('')}
    </svg>`
  },
  {
    id: "merkaba",
    name: "Merkabá",
    description: "Veículo de luz tridimensional formado por dois tetraedros entrelaçados. Ativa o campo de luz pessoal e a ascensão espiritual.",
    usage: "Ativação espiritual, meditação, viagem astral, proteção multidimensional e elevação de consciência.",
    needsNorth: true,
    shape: "star",
    category: "espiritualidade",
    crystal: "Danburita",
    crystalReason: "Cristal de alta frequência que facilita a conexão com planos espirituais superiores.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="100,10 185,158 15,158" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="100,190 15,42 185,42" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "estrela-8-pontas",
    name: "Estrela de 8 Pontas",
    description: "Octograma sagrado que representa os oito caminhos espirituais. Abre portais de consciência e amplifica a conexão espiritual.",
    usage: "Conexão com guias espirituais, abertura para mensagens do alto, fortalecimento da intuição e mediunidade.",
    needsNorth: true,
    shape: "star",
    category: "espiritualidade",
    crystal: "Selenita",
    crystalReason: "Cristal dos anjos e da luz divina, abre o canal espiritual com proteção e pureza.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      ${Array.from({length: 2}, (_, j) =>
        `<polygon points="${Array.from({length: 4}, (_, i) => {
          const angle = (i * 90 + j * 45 - 90) * Math.PI / 180;
          return `${100 + 88 * Math.cos(angle)},${100 + 88 * Math.sin(angle)}`;
        }).join(' ')}" fill="none" stroke="currentColor" stroke-width="1.5"/>`
      ).join('')}
      <circle cx="100" cy="100" r="35" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },

  // ─── HARMONIZAÇÃO ────────────────────────────────────────────────────────────
  {
    id: "harmonizador-geral",
    name: "Harmonizador Geral",
    description: "Gráfico de uso amplo para harmonização de todas as áreas da vida. Equilibra e organiza os campos energéticos.",
    usage: "Harmonização geral de vida, equilíbrio entre áreas (trabalho, saúde, amor), ambientes discordantes.",
    needsNorth: false,
    shape: "circles",
    category: "harmonizacao",
    crystal: "Fluorita Arco-Íris",
    crystalReason: "Integra e harmoniza todas as frequências do espectro energético com elegância.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      ${Array.from({length: 7}, (_, i) => 
        `<circle cx="100" cy="100" r="${12 + i * 12}" fill="none" stroke="currentColor" stroke-width="${i === 6 ? 1.5 : 0.8}"/>`
      ).join('')}
      ${Array.from({length: 8}, (_, i) => {
        const angle = (i * 45) * Math.PI / 180;
        return `<line x1="${100 + 12 * Math.cos(angle)}" y1="${100 + 12 * Math.sin(angle)}" x2="${100 + 84 * Math.cos(angle)}" y2="${100 + 84 * Math.sin(angle)}" stroke="currentColor" stroke-width="0.7"/>`;
      }).join('')}
      <circle cx="100" cy="100" r="6" fill="currentColor"/>
    </svg>`
  },
  {
    id: "desembaracador-material",
    name: "Desembaraçador Material",
    description: "Gráfico para desfazer bloqueios em questões materiais e práticas. Libera o caminho para conquistas concretas.",
    usage: "Desbloqueio de situações estagnadas, resolução de pendências, conquistas materiais e abertura de caminhos.",
    needsNorth: true,
    shape: "custom",
    category: "harmonizacao",
    crystal: "Turquesa",
    crystalReason: "Cristal de comunicação e abertura de caminhos, facilita a manifestação no plano material.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="160" height="160" rx="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <rect x="45" y="45" width="110" height="110" rx="5" fill="none" stroke="currentColor" stroke-width="1"/>
      <line x1="20" y1="20" x2="180" y2="180" stroke="currentColor" stroke-width="0.8"/>
      <line x1="180" y1="20" x2="20" y2="180" stroke="currentColor" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="25" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1.2"/>
    </svg>`
  },
  {
    id: "harmonia-lar",
    name: "Harmonia do Lar",
    description: "Gráfico especialmente formulado para criar paz e harmonia no ambiente doméstico. Dissolve tensões entre moradores.",
    usage: "Paz familiar, harmonia entre moradores, dissolução de conflitos domésticos e proteção do lar.",
    needsNorth: false,
    shape: "custom",
    category: "harmonizacao",
    crystal: "Ametista",
    crystalReason: "Promove paz, calma e espiritualidade no ambiente doméstico com sua energia suave.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M100,20 L175,85 L175,175 L25,175 L25,85 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <path d="M100,45 L155,90 L155,155 L45,155 L45,90 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="120" r="25" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="120" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "equilibrador-chakras",
    name: "Equilibrador de Chakras",
    description: "Sete círculos alinhados verticalmente representando os sete chakras principais. Alinha e equilibra todo o sistema energético.",
    usage: "Alinhamento e ativação dos chakras, equilíbrio do sistema energético, meditação e saúde integral.",
    needsNorth: true,
    shape: "circles",
    category: "saude",
    crystal: "Arco-Íris de Quartzo",
    crystalReason: "Cristal que trabalha todos os chakras simultaneamente com seu espectro completo.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      ${Array.from({length: 7}, (_, i) => 
        `<circle cx="100" cy="${25 + i * 25}" r="${10}" fill="none" stroke="currentColor" stroke-width="1.2"/>`
      ).join('')}
      <line x1="100" y1="15" x2="100" y2="185" stroke="currentColor" stroke-width="0.8"/>
    </svg>`
  },
  {
    id: "ondas-de-forma",
    name: "Ondas de Forma",
    description: "Séries de ondas concêntricas que geram formas de onda energéticas específicas. Transmite vibrações de equilíbrio e cura.",
    usage: "Transmissão de energia curativa à distância, tratamento de plantas e animais, harmonização de alimentos e água.",
    needsNorth: false,
    shape: "custom",
    category: "harmonizacao",
    crystal: "Quartzo Transparente",
    crystalReason: "Amplifica e transmite as ondas de forma em todas as direções com precisão.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      ${Array.from({length: 8}, (_, i) => {
        const y = 35 + i * 20;
        return `<path d="M10,${y} Q32,${y-15} 55,${y} Q78,${y+15} 100,${y} Q122,${y-15} 145,${y} Q168,${y+15} 190,${y}" fill="none" stroke="currentColor" stroke-width="${i === 0 || i === 7 ? 1.5 : 0.8}"/>`;
      }).join('')}
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "mandala-sagrada",
    name: "Mandala Sagrada",
    description: "Mandala radiônica com geometria sagrada de 12 pétalas. Integra todas as dimensões do ser e promove totalidade.",
    usage: "Integração corpo-mente-espírito, meditação profunda, cura holística e expansão da consciência.",
    needsNorth: false,
    shape: "custom",
    category: "espiritualidade",
    crystal: "Labradorita",
    crystalReason: "A pedra da magia e transformação, abre portais de consciência com proteção total.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" stroke-width="1.5"/>
      ${Array.from({length: 12}, (_, i) => {
        const angle = (i * 30) * Math.PI / 180;
        const x1 = 100 + 30 * Math.cos(angle);
        const y1 = 100 + 30 * Math.sin(angle);
        const x2 = 100 + 85 * Math.cos(angle);
        const y2 = 100 + 85 * Math.sin(angle);
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="currentColor" stroke-width="0.8"/>`;
      }).join('')}
      ${Array.from({length: 12}, (_, i) => {
        const angle = (i * 30) * Math.PI / 180;
        const cx = 100 + 57 * Math.cos(angle);
        const cy = 100 + 57 * Math.sin(angle);
        return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="12" fill="none" stroke="currentColor" stroke-width="0.8"/>`;
      }).join('')}
      <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
];
