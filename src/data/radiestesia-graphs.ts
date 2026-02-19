export interface RadiestesiaGraph {
  id: string;
  name: string;
  description: string;
  usage: string;
  needsNorth: boolean;
  shape: "polygon" | "circles" | "star" | "cross" | "spiral" | "custom";
  crystal: string;
  crystalReason: string;
  svgPath: string; // SVG markup for the graph
}

export const radiestesiaGraphs: RadiestesiaGraph[] = [
  {
    id: "decagono",
    name: "Decágono",
    description: "Gráfico de 10 lados usado para limpeza e proteção energética. Um dos mais versáteis e poderosos da radiestesia.",
    usage: "Limpeza energética de ambientes, pessoas e objetos. Proteção espiritual e descarrego.",
    needsNorth: true,
    shape: "polygon",
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
    id: "desimpregnador",
    name: "Desimpregnador",
    description: "Gráfico especializado em remover energias negativas impregnadas. Ideal para limpeza profunda.",
    usage: "Remoção de cargas negativas acumuladas, limpeza de ambientes pesados e desimpregnação de objetos.",
    needsNorth: true,
    shape: "star",
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
    id: "nove-circulos",
    name: "9 Círculos",
    description: "Gráfico composto por 9 círculos concêntricos. Usado para harmonização geral e equilíbrio energético.",
    usage: "Harmonização de ambientes, equilíbrio dos chakras e fortalecimento do campo áurico.",
    needsNorth: false,
    shape: "circles",
    crystal: "Quartzo Rosa",
    crystalReason: "Promove harmonia, amor próprio e equilíbrio emocional em sintonia com os círculos.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      ${Array.from({length: 9}, (_, i) => 
        `<circle cx="100" cy="100" r="${10 + i * 10}" fill="none" stroke="currentColor" stroke-width="1"/>`
      ).join('')}
    </svg>`
  },
  {
    id: "anti-magia",
    name: "Anti-Magia",
    description: "Gráfico de proteção contra trabalhos espirituais negativos, inveja e mau-olhado.",
    usage: "Proteção contra magia negativa, inveja, olho gordo e trabalhos espirituais direcionados.",
    needsNorth: true,
    shape: "custom",
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
    id: "scap",
    name: "SCAP",
    description: "Sistema de Cura e Amparo Profundo. Gráfico para cura energética e emocional.",
    usage: "Cura emocional, tratamento de traumas, amparo espiritual e recuperação energética.",
    needsNorth: true,
    shape: "custom",
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
    id: "solenoide",
    name: "Solenóide",
    description: "Gráfico espiral que canaliza e direciona energia. Similar ao funcionamento de uma bobina elétrica.",
    usage: "Potencialização de pedidos, direcionamento de energia para objetivos específicos e amplificação de intenções.",
    needsNorth: true,
    shape: "spiral",
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
  {
    id: "cruz-ansata",
    name: "Cruz Ansata (Ankh)",
    description: "Símbolo egípcio da vida eterna. Usado para vitalidade, saúde e renovação energética.",
    usage: "Revitalização, saúde física e espiritual, renovação de energias e longevidade.",
    needsNorth: true,
    shape: "cross",
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
    id: "prosperador",
    name: "Prosperador",
    description: "Gráfico focado em atrair abundância, prosperidade financeira e oportunidades.",
    usage: "Atração de prosperidade, abundância financeira, novos negócios e oportunidades profissionais.",
    needsNorth: true,
    shape: "custom",
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
];
