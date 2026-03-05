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

// Helper: generate polygon points
const polyPoints = (n: number, cx: number, cy: number, r: number, offsetDeg = -90) =>
  Array.from({ length: n }, (_, i) => {
    const a = ((i * 360) / n + offsetDeg) * (Math.PI / 180);
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

export const radiestesiaGraphs: RadiestesiaGraph[] = [
  // ─── LIMPEZA ────────────────────────────────────────────────────────────────
  {
    id: "desimpregnador",
    name: "Desimpregnador",
    description: "Gráfico composto por um Decágono, quatro círculos concêntricos e 72 setas centrífugas. Criado pelos irmãos Servranx para limpeza energética profunda.",
    usage: "Limpeza de testemunhos, cristais, objetos e campo áurico. Desimpregnação de energias sutis deletérias. Colocar o objeto/testemunho no centro.",
    needsNorth: true,
    shape: "custom",
    category: "limpeza",
    crystal: "Ametista",
    crystalReason: "Transmuta energias negativas em positivas e eleva a vibração espiritual.",
    svgPath: (() => {
      // Desimpregnador original: Decágono + 4 círculos concêntricos + 72 setas centrífugas
      const dec = `<polygon points="${polyPoints(10, 100, 100, 88)}" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
      const circles = [20, 30, 40, 50].map(r =>
        `<circle cx="100" cy="100" r="${r}" fill="none" stroke="currentColor" stroke-width="0.8"/>`
      ).join("");
      // 72 setas radiando do círculo interno para fora (centrífugas)
      const arrows = Array.from({ length: 72 }, (_, i) => {
        const a = (i * 5) * Math.PI / 180;
        const x1 = 100 + 50 * Math.cos(a);
        const y1 = 100 + 50 * Math.sin(a);
        const x2 = 100 + 82 * Math.cos(a);
        const y2 = 100 + 82 * Math.sin(a);
        // Arrowhead
        const tipLen = 4;
        const aL = a + 0.3;
        const aR = a - 0.3;
        const ax1 = x2 - tipLen * Math.cos(aL);
        const ay1 = y2 - tipLen * Math.sin(aL);
        const ax2 = x2 - tipLen * Math.cos(aR);
        const ay2 = y2 - tipLen * Math.sin(aR);
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="currentColor" stroke-width="0.4"/>` +
          `<polyline points="${ax1.toFixed(1)},${ay1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${ax2.toFixed(1)},${ay2.toFixed(1)}" fill="none" stroke="currentColor" stroke-width="0.4"/>`;
      }).join("");
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${dec}${circles}${arrows}<circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="0.8"/></svg>`;
    })()
  },
  {
    id: "decagono",
    name: "Decágono",
    description: "Polígono de 10 lados, um dos gráficos mais importantes da radiestesia. Criado pelos irmãos Servranx. Potencializa e sintoniza energias.",
    usage: "Ativação, amplificação e potencialização de testemunhos. Usado antes de qualquer trabalho radiônico para potencializar o pedido.",
    needsNorth: true,
    shape: "polygon",
    category: "limpeza",
    crystal: "Turmalina Negra",
    crystalReason: "Potencializa a absorção de energias densas e proteção contra negatividade.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="${polyPoints(10, 100, 100, 88)}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "decagono-duplo",
    name: "Decágono Duplo",
    description: "Dois Decágonos sobrepostos rotacionados 18° entre si. Versão amplificada com poder de limpeza e potencialização superior.",
    usage: "Limpeza profunda e urgente, ambientes muito carregados, potencialização máxima de testemunhos.",
    needsNorth: true,
    shape: "polygon",
    category: "limpeza",
    crystal: "Turmalina Negra",
    crystalReason: "Amplifica a capacidade de absorção e neutralização de energias densas.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="${polyPoints(10, 100, 100, 88, -90)}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${polyPoints(10, 100, 100, 88, -72)}" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "turbilhao",
    name: "Turbilhão",
    description: "Gráfico em vórtice com múltiplos braços curvos espiralando do centro para fora, criando um campo de força centrífuga para materialização.",
    usage: "Materialização de pedidos, limpeza de energias estagnadas, desbloqueio de fluxos. Gráfico materializador.",
    needsNorth: false,
    shape: "spiral",
    category: "limpeza",
    crystal: "Selenita",
    crystalReason: "Cristal de limpeza rápida e intensa, amplia o efeito do vórtice purificador.",
    svgPath: (() => {
      // Turbilhão original: múltiplos braços espirais curvando do centro para fora
      const numArms = 12;
      const arms = Array.from({ length: numArms }, (_, arm) => {
        const startAngle = (arm * 360) / numArms;
        let d = "";
        const steps = 60;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const r = 5 + t * 85;
          const angle = (startAngle + t * 180) * Math.PI / 180;
          const x = 100 + r * Math.cos(angle);
          const y = 100 + r * Math.sin(angle);
          d += s === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`;
        }
        return `<path d="${d}" fill="none" stroke="currentColor" stroke-width="0.8"/>`;
      }).join("");
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" stroke-width="1"/>
      ${arms}
      <circle cx="100" cy="100" r="4" fill="currentColor"/>
    </svg>`;
    })()
  },

  // ─── PROTEÇÃO ───────────────────────────────────────────────────────────────
  {
    id: "anti-magia",
    name: "Anti-Magia",
    description: "Baseado no Selo de Salomão (hexagrama): dois triângulos equiláteros sobrepostos dentro de círculos concêntricos. Proteção contra trabalhos negativos.",
    usage: "Proteção contra magia negativa, inveja, olho gordo e trabalhos espirituais direcionados.",
    needsNorth: true,
    shape: "custom",
    category: "protecao",
    crystal: "Obsidiana Negra",
    crystalReason: "Escudo protetor poderoso que reflete energias negativas de volta à origem.",
    svgPath: (() => {
      // Selo de Salomão: dois triângulos equiláteros formando hexagrama dentro de 3 círculos
      const tri1 = polyPoints(3, 100, 100, 78, -90);
      const tri2 = polyPoints(3, 100, 100, 78, 30);
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <polygon points="${tri1}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${tri2}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`;
    })()
  },
  {
    id: "pentagrama-protecao",
    name: "Pentagrama Protetor",
    description: "Estrela de cinco pontas (pentagrama) inscrita em um círculo. Símbolo universal de proteção usado desde a antiguidade.",
    usage: "Proteção pessoal e do lar, escudo contra energias negativas, proteção de crianças e animais.",
    needsNorth: true,
    shape: "star",
    category: "protecao",
    crystal: "Obsidiana Mahogany",
    crystalReason: "Oferece proteção enraizada e estabilidade, afastando influências externas negativas.",
    svgPath: (() => {
      // Pentagrama: estrela de 5 pontas formada conectando vértices alternados
      const pts = Array.from({ length: 5 }, (_, i) => {
        const a = (i * 72 - 90) * Math.PI / 180;
        return [100 + 85 * Math.cos(a), 100 + 85 * Math.sin(a)];
      });
      // Connect: 0->2->4->1->3->0
      const order = [0, 2, 4, 1, 3];
      const starPath = order.map((idx, i) =>
        `${i === 0 ? "M" : "L"}${pts[idx][0].toFixed(1)},${pts[idx][1].toFixed(1)}`
      ).join(" ") + " Z";
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <path d="${starPath}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`;
    })()
  },
  {
    id: "escudo-radiestesico",
    name: "Escudo Radiestésico",
    description: "Combinação do Desenho de Luxor com Nove Círculos. Gráfico composto de grande poder protetor com múltiplas camadas concêntricas.",
    usage: "Proteção contínua da aura, escudo familiar, proteção de residências e veículos.",
    needsNorth: true,
    shape: "custom",
    category: "protecao",
    crystal: "Pirita",
    crystalReason: "Cria um escudo energético dourado que repele energias indesejadas.",
    svgPath: (() => {
      // Luxor + 9 Círculos: 9 círculos concêntricos + cruz cardinal + diagonais
      const circles = Array.from({ length: 9 }, (_, i) =>
        `<circle cx="100" cy="100" r="${10 + i * 9}" fill="none" stroke="currentColor" stroke-width="${i === 8 ? 1.5 : 0.7}"/>`
      ).join("");
      // Cruz cardinal
      const cross = `<line x1="100" y1="18" x2="100" y2="182" stroke="currentColor" stroke-width="1"/>
      <line x1="18" y1="100" x2="182" y2="100" stroke="currentColor" stroke-width="1"/>`;
      // Diagonais
      const diag = `<line x1="42" y1="42" x2="158" y2="158" stroke="currentColor" stroke-width="0.7"/>
      <line x1="158" y1="42" x2="42" y2="158" stroke="currentColor" stroke-width="0.7"/>`;
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${circles}${cross}${diag}</svg>`;
    })()
  },

  // ─── CURA ────────────────────────────────────────────────────────────────────
  {
    id: "scap",
    name: "SCAP",
    description: "Símbolo Compensador André Phillipe. Criado pelo engenheiro eletrônico e radiestesista francês André Phillipe. Gráfico de limpeza, proteção e elevação energética.",
    usage: "Limpeza energética, proteção, tratamento de estresse, ansiedade, fadiga. Colocar testemunho no centro.",
    needsNorth: true,
    shape: "custom",
    category: "cura",
    crystal: "Quartzo Verde",
    crystalReason: "Cristal de cura por excelência, amplifica as propriedades curativas do gráfico.",
    svgPath: (() => {
      // SCAP original: círculo externo dividido em 4 quadrantes por uma cruz,
      // com semicírculos em cada quadrante e um quadrado central rotacionado 45°
      const R = 88;
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="${R}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <!-- Cruz cardinal dividindo em 4 quadrantes -->
      <line x1="100" y1="${100 - R}" x2="100" y2="${100 + R}" stroke="currentColor" stroke-width="1.2"/>
      <line x1="${100 - R}" y1="100" x2="${100 + R}" y2="100" stroke="currentColor" stroke-width="1.2"/>
      <!-- Semicírculos internos nos 4 quadrantes -->
      <path d="M100,56 A44,44 0 0,1 144,100" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M144,100 A44,44 0 0,1 100,144" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M100,144 A44,44 0 0,1 56,100" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M56,100 A44,44 0 0,1 100,56" fill="none" stroke="currentColor" stroke-width="1"/>
      <!-- Semicírculos menores -->
      <path d="M100,72 A28,28 0 0,1 128,100" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <path d="M128,100 A28,28 0 0,1 100,128" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <path d="M100,128 A28,28 0 0,1 72,100" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <path d="M72,100 A28,28 0 0,1 100,72" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <!-- Quadrado central rotacionado 45° -->
      <polygon points="100,80 120,100 100,120 80,100" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`;
    })()
  },
  {
    id: "anti-dor",
    name: "Anti-Dor",
    description: "Gráfico radiônico específico para alívio de dores. Círculo com linhas irradiantes formando setores e círculos concêntricos internos.",
    usage: "Alívio de dores físicas crônicas, dores de cabeça, musculares e articulares no plano energético.",
    needsNorth: true,
    shape: "custom",
    category: "cura",
    crystal: "Ágata Azul",
    crystalReason: "Cristal de alívio, acalma e suaviza as vibrações de dor no campo energético.",
    svgPath: (() => {
      // Anti-Dor: círculo externo + linhas irradiantes dividindo em setores + círculos concêntricos
      const R = 88;
      const lines = Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30) * Math.PI / 180;
        return `<line x1="${(100 + 15 * Math.cos(a)).toFixed(1)}" y1="${(100 + 15 * Math.sin(a)).toFixed(1)}" x2="${(100 + R * Math.cos(a)).toFixed(1)}" y2="${(100 + R * Math.sin(a)).toFixed(1)}" stroke="currentColor" stroke-width="0.8"/>`;
      }).join("");
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="${R}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="38" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="15" fill="none" stroke="currentColor" stroke-width="0.8"/>
      ${lines}
      <circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`;
    })()
  },
  {
    id: "alta-vitalidade",
    name: "Alta Vitalidade",
    description: "Estrela de 12 pontas formada por linhas alternadas entre raio externo e interno. Gráfico revitalizante que aumenta a energia vital.",
    usage: "Combate ao cansaço extremo, aumento de energia vital, recuperação pós-doenças e fortalecimento geral.",
    needsNorth: true,
    shape: "star",
    category: "cura",
    crystal: "Cornalina",
    crystalReason: "Cristal de vitalidade e energia, ativa o fogo interior e a força vital.",
    svgPath: (() => {
      // Estrela de 12 pontas: vértices alternando entre raio externo e interno
      const pts = Array.from({ length: 24 }, (_, i) => {
        const a = (i * 15 - 90) * Math.PI / 180;
        const r = i % 2 === 0 ? 88 : 45;
        return `${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`;
      }).join(" ");
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" stroke-width="1"/>
      <polygon points="${pts}" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`;
    })()
  },
  {
    id: "cruz-ansata",
    name: "Cruz Ansata",
    description: "Gráfico composto por Decágono (potencializador), Cruz Ankh (cruz da vida egípcia) e Pilha Magnética (4 semi-esferas canalizadoras).",
    usage: "Cura energética, problemas de saúde, revitalização. Testemunho no centro do Decágono, problema escrito acima da Cruz.",
    needsNorth: true,
    shape: "cross",
    category: "saude",
    crystal: "Cornalina",
    crystalReason: "Cristal de vitalidade que ativa a energia vital e fortalece o corpo energético.",
    svgPath: (() => {
      // Cruz Ansata: Pilha Magnética no topo (4 semicírculos) + Ankh no meio + Decágono na base
      const decPts = polyPoints(10, 100, 155, 35, -90);
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Pilha Magnética: 4 semicírculos no topo -->
      <path d="M82,22 A6,6 0 1,1 82,34" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M92,22 A6,6 0 1,1 92,34" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M102,22 A6,6 0 1,1 102,34" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M112,22 A6,6 0 1,1 112,34" fill="none" stroke="currentColor" stroke-width="1"/>
      <!-- Anel/Laço oval da Ankh -->
      <ellipse cx="100" cy="52" rx="20" ry="18" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <!-- Haste vertical -->
      <line x1="100" y1="70" x2="100" y2="190" stroke="currentColor" stroke-width="1.5"/>
      <!-- Braços horizontais da Cruz -->
      <line x1="68" y1="105" x2="132" y2="105" stroke="currentColor" stroke-width="1.5"/>
      <!-- Decágono na base -->
      <polygon points="${decPts}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="155" r="4" fill="none" stroke="currentColor" stroke-width="0.8"/>
    </svg>`;
    })()
  },
  {
    id: "diafragma-1",
    name: "Diafragma I",
    description: "Gráfico de limpeza com elipses concêntricas horizontais, semelhante a um diafragma de câmera. Remove energias densas e dissonantes.",
    usage: "Limpeza energética, remoção de energias densas de objetos e locais, desimpregnação.",
    needsNorth: true,
    shape: "circles",
    category: "cura",
    crystal: "Quartzo Azul",
    crystalReason: "Acalma e regula o fluxo energético, promovendo equilíbrio e serenidade.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="100" rx="90" ry="50" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <ellipse cx="100" cy="100" rx="72" ry="40" fill="none" stroke="currentColor" stroke-width="1"/>
      <ellipse cx="100" cy="100" rx="54" ry="30" fill="none" stroke="currentColor" stroke-width="1"/>
      <ellipse cx="100" cy="100" rx="36" ry="20" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <ellipse cx="100" cy="100" rx="18" ry="10" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" stroke-width="0.6"/>
      <circle cx="100" cy="100" r="3" fill="currentColor"/>
    </svg>`
  },
  {
    id: "diafragma-2",
    name: "Diafragma II",
    description: "Segunda versão do Diafragma, com elipses concêntricas verticais. Trabalha nos bloqueios do eixo vertical do campo áurico.",
    usage: "Desbloqueio de chakras, alinhamento do eixo energético, bloqueios emocionais verticais.",
    needsNorth: true,
    shape: "circles",
    category: "cura",
    crystal: "Água-Marinha",
    crystalReason: "Facilita a comunicação entre os centros energéticos e dissolve bloqueios.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="100" rx="50" ry="90" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <ellipse cx="100" cy="100" rx="40" ry="72" fill="none" stroke="currentColor" stroke-width="1"/>
      <ellipse cx="100" cy="100" rx="30" ry="54" fill="none" stroke="currentColor" stroke-width="1"/>
      <ellipse cx="100" cy="100" rx="20" ry="36" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <ellipse cx="100" cy="100" rx="10" ry="18" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" stroke-width="0.6"/>
      <circle cx="100" cy="100" r="3" fill="currentColor"/>
    </svg>`
  },

  // ─── SAÚDE ───────────────────────────────────────────────────────────────────
  {
    id: "nove-circulos",
    name: "9 Círculos",
    description: "Gráfico composto por 9 círculos concêntricos. Um dos gráficos protetores mais conhecidos da radiestesia, usado também no Escudo Radiestésico.",
    usage: "Proteção de ambientes, harmonização geral, equilíbrio dos chakras e fortalecimento do campo áurico.",
    needsNorth: false,
    shape: "circles",
    category: "saude",
    crystal: "Quartzo Rosa",
    crystalReason: "Promove harmonia, amor próprio e equilíbrio emocional em sintonia com os círculos.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      ${Array.from({ length: 9 }, (_, i) =>
        `<circle cx="100" cy="100" r="${10 + i * 10}" fill="none" stroke="currentColor" stroke-width="${i === 8 ? 1.5 : 0.8}"/>`
      ).join("")}
      <circle cx="100" cy="100" r="3" fill="currentColor"/>
    </svg>`
  },
  {
    id: "trigono",
    name: "Trígono",
    description: "Dois triângulos equiláteros sobrepostos formando a Estrela de Davi (hexagrama). Equilibra polaridades energéticas opostas.",
    usage: "Equilíbrio de polaridades, harmonização de opostos, estabilização do campo emocional e mental.",
    needsNorth: true,
    shape: "star",
    category: "harmonizacao",
    crystal: "Fluorita",
    crystalReason: "Cristal de equilíbrio mental e emocional, harmoniza os opostos com elegância.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="${polyPoints(3, 100, 100, 88, -90)}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${polyPoints(3, 100, 100, 88, 30)}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },

  // ─── PROSPERIDADE ────────────────────────────────────────────────────────────
  {
    id: "prosperador",
    name: "Prosperador",
    description: "Dois hexágonos entrelaçados (rotacionados 30° entre si) formando uma estrela de 12 pontas. Atrai abundância e prosperidade.",
    usage: "Atração de prosperidade, abundância financeira, novos negócios e oportunidades profissionais.",
    needsNorth: true,
    shape: "custom",
    category: "prosperidade",
    crystal: "Pirita",
    crystalReason: "Conhecida como 'ouro dos tolos', atrai riqueza e prosperidade material.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="${polyPoints(6, 100, 100, 88, -90)}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${polyPoints(6, 100, 100, 88, -60)}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "turbilhao-prosperador",
    name: "Turbilhão Prosperador",
    description: "Combinação do vórtice do Turbilhão com a geometria hexagonal do Prosperador. Atrai e acelera o fluxo de abundância.",
    usage: "Aceleração de resultados financeiros, abertura de caminhos profissionais e atração de clientes.",
    needsNorth: true,
    shape: "spiral",
    category: "prosperidade",
    crystal: "Citrino",
    crystalReason: "O 'cristal da fortuna' ativa a lei da atração financeira e amplifica os resultados.",
    svgPath: (() => {
      // Espiral com hexágono sobreposto
      const spiral = (() => {
        let d = "M100,100";
        for (let i = 0; i < 720; i += 4) {
          const r = 3 + i * 0.115;
          const a = (i - 90) * Math.PI / 180;
          d += ` L${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`;
        }
        return d;
      })();
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="${spiral}" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <polygon points="${polyPoints(6, 100, 100, 88, -90)}" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="100" cy="100" r="4" fill="currentColor"/>
    </svg>`;
    })()
  },
  {
    id: "solenoide",
    name: "Solenóide",
    description: "Gráfico em formato de bobina/solenóide que canaliza e direciona energia como uma bobina eletromagnética.",
    usage: "Potencialização de pedidos, direcionamento de energia para objetivos específicos e amplificação de intenções.",
    needsNorth: true,
    shape: "spiral",
    category: "prosperidade",
    crystal: "Citrino",
    crystalReason: "Amplifica a energia de manifestação e atrai prosperidade e realizações.",
    svgPath: (() => {
      // Solenóide: formato de bobina — série de elipses sobrepostas verticalmente
      const coils = Array.from({ length: 12 }, (_, i) => {
        const y = 20 + i * 14;
        const rx = 55;
        const ry = 8;
        return `<ellipse cx="100" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="currentColor" stroke-width="0.8"/>`;
      }).join("");
      // Linhas laterais conectando
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <line x1="45" y1="20" x2="45" y2="174" stroke="currentColor" stroke-width="1"/>
      <line x1="155" y1="20" x2="155" y2="174" stroke="currentColor" stroke-width="1"/>
      ${coils}
      <circle cx="100" cy="97" r="4" fill="currentColor"/>
    </svg>`;
    })()
  },

  // ─── AMOR ────────────────────────────────────────────────────────────────────
  {
    id: "desembaracador-relacionamentos",
    name: "Desembaraçador de Relacionamentos",
    description: "Gráfico com dois círculos entrelaçados (Vesica Piscis) e linha divisória central. Desfaz nós energéticos em relacionamentos.",
    usage: "Desbloqueio de relacionamentos, resolução de conflitos energéticos, harmonização entre pessoas.",
    needsNorth: true,
    shape: "custom",
    category: "amor",
    crystal: "Quartzo Rosa",
    crystalReason: "O cristal do amor incondicional, dissolve mágoas e abre o coração para receber.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="72" cy="100" r="52" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="128" cy="100" r="52" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <line x1="100" y1="52" x2="100" y2="148" stroke="currentColor" stroke-width="0.8" stroke-dasharray="3,2"/>
      <circle cx="100" cy="100" r="5" fill="currentColor"/>
    </svg>`
  },
  {
    id: "amor-incondicional",
    name: "Amor Incondicional",
    description: "Vesica Piscis — interseção sagrada de dois círculos iguais dentro de um círculo maior. Símbolo universal da união divina.",
    usage: "Cura de feridas emocionais, atração de amor saudável, fortalecimento do amor próprio e harmonização de casais.",
    needsNorth: false,
    shape: "custom",
    category: "amor",
    crystal: "Rodocrosita",
    crystalReason: "Cristal do amor romântico e cura emocional, cura o coração e atrai o amor verdadeiro.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="75" cy="100" r="50" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="125" cy="100" r="50" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <line x1="100" y1="30" x2="100" y2="170" stroke="currentColor" stroke-width="0.5" stroke-dasharray="3,3"/>
      <circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },

  // ─── ESPIRITUALIDADE ─────────────────────────────────────────────────────────
  {
    id: "flor-da-vida",
    name: "Flor da Vida",
    description: "Padrão de geometria sagrada composto por 19 círculos sobrepostos de mesmo raio, formando pétalas simétricas. Contém toda a geometria sagrada do universo.",
    usage: "Elevação espiritual, conexão com o divino, meditação profunda, ativação da consciência superior.",
    needsNorth: false,
    shape: "circles",
    category: "espiritualidade",
    crystal: "Quartzo Transparente",
    crystalReason: "O mestre dos cristais amplifica todas as intenções e conecta com a luz universal.",
    svgPath: (() => {
      // Flor da Vida: 19 círculos — 1 central + 6 na 1ª camada + 12 na 2ª camada
      const r = 22;
      const circles: string[] = [];
      // Centro
      circles.push(`<circle cx="100" cy="100" r="${r}" fill="none" stroke="currentColor" stroke-width="0.8"/>`);
      // 1ª camada: 6 círculos
      for (let i = 0; i < 6; i++) {
        const a = (i * 60) * Math.PI / 180;
        const cx = 100 + r * Math.cos(a);
        const cy = 100 + r * Math.sin(a);
        circles.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="none" stroke="currentColor" stroke-width="0.8"/>`);
      }
      // 2ª camada: 12 círculos (6 nos vértices + 6 entre)
      for (let i = 0; i < 6; i++) {
        const a = (i * 60) * Math.PI / 180;
        const cx = 100 + 2 * r * Math.cos(a);
        const cy = 100 + 2 * r * Math.sin(a);
        circles.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="none" stroke="currentColor" stroke-width="0.8"/>`);
      }
      for (let i = 0; i < 6; i++) {
        const a = (i * 60 + 30) * Math.PI / 180;
        const d = r * Math.sqrt(3);
        const cx = 100 + d * Math.cos(a);
        const cy = 100 + d * Math.sin(a);
        circles.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="none" stroke="currentColor" stroke-width="0.8"/>`);
      }
      // Círculo externo delimitador
      circles.push(`<circle cx="100" cy="100" r="${r * 3}" fill="none" stroke="currentColor" stroke-width="1.5"/>`);
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${circles.join("")}</svg>`;
    })()
  },
  {
    id: "merkaba",
    name: "Merkabá",
    description: "Dois tetraedros entrelaçados projetados em 2D como dois triângulos equiláteros sobrepostos. Veículo de luz para ascensão espiritual.",
    usage: "Ativação espiritual, meditação, viagem astral, proteção multidimensional e elevação de consciência.",
    needsNorth: true,
    shape: "star",
    category: "espiritualidade",
    crystal: "Danburita",
    crystalReason: "Cristal de alta frequência que facilita a conexão com planos espirituais superiores.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="${polyPoints(3, 100, 100, 88, -90)}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${polyPoints(3, 100, 100, 88, 30)}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="38" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "estrela-8-pontas",
    name: "Estrela de 8 Pontas",
    description: "Octograma: dois quadrados sobrepostos rotacionados 45° entre si, inscritos em um círculo. Representa os oito caminhos espirituais.",
    usage: "Conexão com guias espirituais, abertura para mensagens do alto, fortalecimento da intuição e mediunidade.",
    needsNorth: true,
    shape: "star",
    category: "espiritualidade",
    crystal: "Selenita",
    crystalReason: "Cristal dos anjos e da luz divina, abre o canal espiritual com proteção e pureza.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-width="1"/>
      <polygon points="${polyPoints(4, 100, 100, 85, -90)}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${polyPoints(4, 100, 100, 85, -45)}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="35" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },

  // ─── HARMONIZAÇÃO ────────────────────────────────────────────────────────────
  {
    id: "harmonizador-geral",
    name: "Harmonizador Geral",
    description: "Círculos concêntricos com linhas irradiantes dividindo em setores iguais. Equilibra e organiza todos os campos energéticos.",
    usage: "Harmonização geral de vida, equilíbrio entre áreas (trabalho, saúde, amor), ambientes discordantes.",
    needsNorth: false,
    shape: "circles",
    category: "harmonizacao",
    crystal: "Fluorita Arco-Íris",
    crystalReason: "Integra e harmoniza todas as frequências do espectro energético com elegância.",
    svgPath: (() => {
      const circles = Array.from({ length: 7 }, (_, i) =>
        `<circle cx="100" cy="100" r="${12 + i * 12}" fill="none" stroke="currentColor" stroke-width="${i === 6 ? 1.5 : 0.7}"/>`
      ).join("");
      const lines = Array.from({ length: 8 }, (_, i) => {
        const a = (i * 45) * Math.PI / 180;
        return `<line x1="${(100 + 12 * Math.cos(a)).toFixed(1)}" y1="${(100 + 12 * Math.sin(a)).toFixed(1)}" x2="${(100 + 84 * Math.cos(a)).toFixed(1)}" y2="${(100 + 84 * Math.sin(a)).toFixed(1)}" stroke="currentColor" stroke-width="0.7"/>`;
      }).join("");
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${circles}${lines}<circle cx="100" cy="100" r="4" fill="currentColor"/></svg>`;
    })()
  },
  {
    id: "desembaracador-material",
    name: "Desembaraçador Material",
    description: "Hexágono com Estrela de Davi (dois triângulos) e círculo central. Desfaz bloqueios em questões materiais e práticas.",
    usage: "Desbloqueio de situações estagnadas, resolução de pendências, conquistas materiais e abertura de caminhos.",
    needsNorth: true,
    shape: "custom",
    category: "harmonizacao",
    crystal: "Turquesa",
    crystalReason: "Cristal de comunicação e abertura de caminhos, facilita a manifestação no plano material.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <polygon points="${polyPoints(6, 100, 100, 88, -90)}" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <polygon points="${polyPoints(3, 100, 100, 75, -90)}" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <polygon points="${polyPoints(3, 100, 100, 75, 30)}" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "harmonia-lar",
    name: "Harmonia do Lar",
    description: "Círculos concêntricos com losangos (quadrados rotacionados 45°) inscritos. Cria paz e harmonia no ambiente doméstico.",
    usage: "Paz familiar, harmonia entre moradores, dissolução de conflitos domésticos e proteção do lar.",
    needsNorth: false,
    shape: "custom",
    category: "harmonizacao",
    crystal: "Ametista",
    crystalReason: "Promove paz, calma e espiritualidade no ambiente doméstico com sua energia suave.",
    svgPath: (() => {
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="100" cy="100" r="38" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <!-- Losango externo -->
      <polygon points="100,12 188,100 100,188 12,100" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <!-- Losango interno -->
      <polygon points="100,38 162,100 100,162 38,100" fill="none" stroke="currentColor" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`;
    })()
  },
  {
    id: "equilibrador-chakras",
    name: "Equilibrador de Chakras",
    description: "Sete círculos alinhados verticalmente sobre um eixo central, representando os sete chakras principais.",
    usage: "Alinhamento e ativação dos chakras, equilíbrio do sistema energético, meditação e saúde integral.",
    needsNorth: true,
    shape: "circles",
    category: "saude",
    crystal: "Arco-Íris de Quartzo",
    crystalReason: "Cristal que trabalha todos os chakras simultaneamente com seu espectro completo.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <line x1="100" y1="15" x2="100" y2="185" stroke="currentColor" stroke-width="0.8"/>
      ${Array.from({ length: 7 }, (_, i) =>
        `<circle cx="100" cy="${25 + i * 25}" r="12" fill="none" stroke="currentColor" stroke-width="1.2"/>`
      ).join("")}
    </svg>`
  },
  {
    id: "ondas-de-forma",
    name: "Ondas de Forma",
    description: "Séries de ondas senoidais paralelas que geram padrões vibratórios específicos. Transmite energia de equilíbrio e cura.",
    usage: "Transmissão de energia curativa à distância, tratamento de plantas e animais, harmonização de alimentos e água.",
    needsNorth: false,
    shape: "custom",
    category: "harmonizacao",
    crystal: "Quartzo Transparente",
    crystalReason: "Amplifica e transmite as ondas de forma em todas as direções com precisão.",
    svgPath: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      ${Array.from({ length: 9 }, (_, i) => {
        const y = 25 + i * 19;
        return `<path d="M10,${y} Q32,${y - 14} 55,${y} Q78,${y + 14} 100,${y} Q122,${y - 14} 145,${y} Q168,${y + 14} 190,${y}" fill="none" stroke="currentColor" stroke-width="${i === 0 || i === 8 ? 1.5 : 0.8}"/>`;
      }).join("")}
      <circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="1"/>
    </svg>`
  },
  {
    id: "mandala-sagrada",
    name: "Mandala Sagrada",
    description: "Mandala radiônica com 12 pétalas (círculos) distribuídas ao redor de um centro, dentro de um círculo externo. Geometria sagrada de integração.",
    usage: "Integração corpo-mente-espírito, meditação profunda, cura holística e expansão da consciência.",
    needsNorth: false,
    shape: "custom",
    category: "espiritualidade",
    crystal: "Labradorita",
    crystalReason: "A pedra da magia e transformação, abre portais de consciência com proteção total.",
    svgPath: (() => {
      const outer = `<circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
      const lines = Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30) * Math.PI / 180;
        return `<line x1="${(100 + 28 * Math.cos(a)).toFixed(1)}" y1="${(100 + 28 * Math.sin(a)).toFixed(1)}" x2="${(100 + 87 * Math.cos(a)).toFixed(1)}" y2="${(100 + 87 * Math.sin(a)).toFixed(1)}" stroke="currentColor" stroke-width="0.6"/>`;
      }).join("");
      const petals = Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30) * Math.PI / 180;
        const cx = 100 + 58 * Math.cos(a);
        const cy = 100 + 58 * Math.sin(a);
        return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="14" fill="none" stroke="currentColor" stroke-width="0.8"/>`;
      }).join("");
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${outer}<circle cx="100" cy="100" r="28" fill="none" stroke="currentColor" stroke-width="1"/>${lines}${petals}<circle cx="100" cy="100" r="5" fill="none" stroke="currentColor" stroke-width="1"/></svg>`;
    })()
  },
];
