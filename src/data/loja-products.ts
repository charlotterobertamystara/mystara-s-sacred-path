export interface Product {
  id: number;
  categoria: "livros" | "cristais" | "tarot" | "runas";
  nome: string;
  descricao: string;
  preco: string;
  imagem: string;
  link: string;
}

export const products: Product[] = [
  // ── Livros ──
  {
    id: 1,
    categoria: "livros",
    nome: "Radiestesia Prática",
    descricao: "Guia completo para iniciantes em radiestesia",
    preco: "R$ 59,90",
    imagem: "/placeholder.svg",
    link: "https://exemplo.com/livro-radiestesia",
  },
  {
    id: 2,
    categoria: "livros",
    nome: "Tarot — A Jornada do Herói",
    descricao: "Interpretações profundas dos 78 arcanos",
    preco: "R$ 74,90",
    imagem: "/placeholder.svg",
    link: "https://exemplo.com/livro-tarot",
  },
  {
    id: 3,
    categoria: "livros",
    nome: "Numerologia Sagrada",
    descricao: "Desvende os mistérios dos números",
    preco: "R$ 49,90",
    imagem: "/placeholder.svg",
    link: "https://exemplo.com/livro-numerologia",
  },

  // ── Cristais e Itens ──
  {
    id: 4,
    categoria: "cristais",
    nome: "Ametista Bruta",
    descricao: "Pedra de proteção e intuição espiritual",
    preco: "R$ 35,00",
    imagem: "/placeholder.svg",
    link: "https://exemplo.com/ametista",
  },
  {
    id: 5,
    categoria: "cristais",
    nome: "Quartzo Rosa Polido",
    descricao: "Cristal do amor incondicional",
    preco: "R$ 28,00",
    imagem: "/placeholder.svg",
    link: "https://exemplo.com/quartzo-rosa",
  },
  {
    id: 6,
    categoria: "cristais",
    nome: "Turmalina Negra",
    descricao: "Proteção energética e aterramento",
    preco: "R$ 42,00",
    imagem: "/placeholder.svg",
    link: "https://exemplo.com/turmalina",
  },

  // ── Deck de Tarot ──
  {
    id: 7,
    categoria: "tarot",
    nome: "Deck Rider-Waite Clássico",
    descricao: "78 cartas com simbologia tradicional",
    preco: "R$ 89,90",
    imagem: "/placeholder.svg",
    link: "https://exemplo.com/deck-rider",
  },
  {
    id: 8,
    categoria: "tarot",
    nome: "Deck Tarot de Marselha",
    descricao: "Edição premium com acabamento dourado",
    preco: "R$ 119,90",
    imagem: "/placeholder.svg",
    link: "https://exemplo.com/deck-marselha",
  },

  // ── Runas ──
  {
    id: 9,
    categoria: "runas",
    nome: "Jogo de Runas em Ametista",
    descricao: "25 runas Elder Futhark esculpidas à mão",
    preco: "R$ 120,00",
    imagem: "/placeholder.svg",
    link: "https://exemplo.com/runas-ametista",
  },
  {
    id: 10,
    categoria: "runas",
    nome: "Runas em Madeira de Lei",
    descricao: "Set completo com bolsa de veludo",
    preco: "R$ 85,00",
    imagem: "/placeholder.svg",
    link: "https://exemplo.com/runas-madeira",
  },

  // ── Radiestesia ──
  {
    id: 11,
    categoria: "radiestesia",
    nome: "Pêndulo de Cristal Quartzo",
    descricao: "Pêndulo lapidado para uso radiestésico",
    preco: "R$ 55,00",
    imagem: "/placeholder.svg",
    link: "https://exemplo.com/pendulo-quartzo",
  },
  {
    id: 12,
    categoria: "radiestesia",
    nome: "Pêndulo de Metal Dourado",
    descricao: "Pêndulo cônico em latão com corrente",
    preco: "R$ 45,00",
    imagem: "/placeholder.svg",
    link: "https://exemplo.com/pendulo-metal",
  },
  {
    id: 13,
    categoria: "radiestesia",
    nome: "Gráfico Decágono em MDF",
    descricao: "Gráfico radiônico para limpeza energética",
    preco: "R$ 68,00",
    imagem: "/placeholder.svg",
    link: "https://exemplo.com/grafico-decagono",
  },
  {
    id: 14,
    categoria: "radiestesia",
    nome: "Gráfico Mesa Damiens em MDF",
    descricao: "Mesa radiônica completa em MDF premium",
    preco: "R$ 150,00",
    imagem: "/placeholder.svg",
    link: "https://exemplo.com/mesa-damiens-mdf",
  },
];

export const categorias = [
  { key: "livros" as const, label: "Livros", icon: "📚" },
  { key: "cristais" as const, label: "Cristais e Itens", icon: "◆" },
  { key: "tarot" as const, label: "Deck de Tarot", icon: "🂡" },
  { key: "runas" as const, label: "Runas", icon: "ᚱ" },
  { key: "radiestesia" as const, label: "Radiestesia", icon: "◎" },
];
