export interface Rune {
  id: number;
  name: string;
  unicode: string;
  phonetic: string;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  element: string;
  archetype: string;
  /** false = runa não tem posição invertida (ex: Gebo, Isa, etc.) */
  canReverse: boolean;
}

export const ELDER_FUTHARK: Rune[] = [
  {
    id: 0,
    name: "Fehu",
    unicode: "ᚠ",
    phonetic: "F",
    keywords: ["riqueza", "abundância", "gado", "prosperidade"],
    uprightMeaning:
      "Fehu é a runa da riqueza móvel, da abundância que flui e se multiplica. Representa conquistas materiais, recompensas pelo esforço e a energia vital que alimenta novos projetos. Indica um momento fértil para investimentos e crescimento.",
    reversedMeaning:
      "Invertida, aponta para perdas financeiras, desperdício de recursos ou apego excessivo ao material. Pode indicar frustração por recompensas que não chegam ou gastos imprudentes.",
    element: "Fogo",
    archetype: "A Abundância",
    canReverse: true,
  },
  {
    id: 1,
    name: "Uruz",
    unicode: "ᚢ",
    phonetic: "U",
    keywords: ["força", "saúde", "vitalidade", "resistência"],
    uprightMeaning:
      "Uruz carrega a força bruta e primordial do auroque selvagem. Representa saúde robusta, resistência física e emocional, e a energia necessária para superar grandes desafios. É a força que vem de dentro, instintiva e inabalável.",
    reversedMeaning:
      "Invertida, indica fraqueza, doença ou falta de motivação. Pode apontar para força sendo usada de forma destrutiva, brutalidade ou resistência a mudanças necessárias.",
    element: "Terra",
    archetype: "O Auroque",
    canReverse: true,
  },
  {
    id: 2,
    name: "Thurisaz",
    unicode: "ᚦ",
    phonetic: "Th",
    keywords: ["proteção", "defesa", "espinho", "portal"],
    uprightMeaning:
      "Thurisaz é o espinho protetor e a força de Thor. Representa proteção ativa, a capacidade de se defender e o poder de romper barreiras. É uma runa de transição — um portal entre o conhecido e o desconhecido que exige coragem para atravessar.",
    reversedMeaning:
      "Invertida, indica vulnerabilidade, decisões precipitadas ou perigo iminente. Pode apontar para agressividade descontrolada ou recusa em enfrentar obstáculos necessários.",
    element: "Fogo",
    archetype: "O Guardião",
    canReverse: true,
  },
  {
    id: 3,
    name: "Ansuz",
    unicode: "ᚨ",
    phonetic: "A",
    keywords: ["comunicação", "sabedoria", "inspiração", "palavra"],
    uprightMeaning:
      "Ansuz é a runa de Odin, da palavra sagrada e da sabedoria divina. Representa comunicação inspirada, mensagens importantes chegando, aprendizado e a voz da intuição. É o momento de ouvir com atenção e falar com verdade.",
    reversedMeaning:
      "Invertida, indica mal-entendidos, manipulação pela palavra ou bloqueio na comunicação. Pode apontar para conselhos ruins, engano ou desconexão com a própria sabedoria interior.",
    element: "Ar",
    archetype: "O Mensageiro",
    canReverse: true,
  },
  {
    id: 4,
    name: "Raidho",
    unicode: "ᚱ",
    phonetic: "R",
    keywords: ["jornada", "movimento", "ritmo", "ordem"],
    uprightMeaning:
      "Raidho é a runa da jornada — tanto física quanto espiritual. Representa viagens, progresso, o ritmo certo das coisas e a ordem natural do universo. Indica que é hora de se mover, evoluir e confiar no caminho.",
    reversedMeaning:
      "Invertida, indica estagnação, viagens problemáticas ou falta de direção. Pode apontar para desordem, atrasos inesperados ou resistência ao fluxo natural da vida.",
    element: "Ar",
    archetype: "O Viajante",
    canReverse: true,
  },
  {
    id: 5,
    name: "Kenaz",
    unicode: "ᚲ",
    phonetic: "K",
    keywords: ["tocha", "iluminação", "criatividade", "conhecimento"],
    uprightMeaning:
      "Kenaz é a tocha que ilumina a escuridão. Representa conhecimento revelado, criatividade ardente, clareza mental e a capacidade de transformar ideias em realidade. É a chama interior que guia e inspira.",
    reversedMeaning:
      "Invertida, indica escuridão interior, bloqueio criativo ou conhecimento sendo usado de forma prejudicial. Pode apontar para ilusões, confusão ou perda de entusiasmo.",
    element: "Fogo",
    archetype: "A Tocha",
    canReverse: true,
  },
  {
    id: 6,
    name: "Gebo",
    unicode: "ᚷ",
    phonetic: "G",
    keywords: ["presente", "troca", "equilíbrio", "parceria"],
    uprightMeaning:
      "Gebo é a runa do presente sagrado e da troca equilibrada. Representa parcerias, generosidade, contratos justos e o equilíbrio entre dar e receber. Indica que uma relação ou acordo importante está em jogo.",
    reversedMeaning:
      "Gebo não possui posição invertida. Sua energia é sempre de equilíbrio e troca.",
    element: "Ar",
    archetype: "O Presente",
    canReverse: false,
  },
  {
    id: 7,
    name: "Wunjo",
    unicode: "ᚹ",
    phonetic: "W/V",
    keywords: ["alegria", "harmonia", "realização", "bem-estar"],
    uprightMeaning:
      "Wunjo é a runa da alegria verdadeira e da realização. Representa harmonia, felicidade conquistada, senso de pertencimento e a satisfação de estar alinhado com o próprio propósito. É a recompensa após o esforço.",
    reversedMeaning:
      "Invertida, indica infelicidade, alienação, crise existencial ou alegria superficial. Pode apontar para conflitos internos, desilusão ou dificuldade em encontrar prazer na vida.",
    element: "Terra",
    archetype: "A Alegria",
    canReverse: true,
  },
  {
    id: 8,
    name: "Hagalaz",
    unicode: "ᚺ",
    phonetic: "H",
    keywords: ["granizo", "destruição", "transformação", "crise"],
    uprightMeaning:
      "Hagalaz é a tempestade de granizo que destrói para renovar. Representa crises necessárias, eventos inesperados que forçam transformação e a destruição do que já não serve. Após a tempestade, o solo fica fértil para o novo.",
    reversedMeaning:
      "Hagalaz não possui posição invertida. Sua energia transformadora opera sempre, convidando à aceitação do inevitável.",
    element: "Água",
    archetype: "A Tempestade",
    canReverse: false,
  },
  {
    id: 9,
    name: "Nauthiz",
    unicode: "ᚾ",
    phonetic: "N",
    keywords: ["necessidade", "resistência", "restrição", "lição"],
    uprightMeaning:
      "Nauthiz é a runa da necessidade e da resistência forjada pela dificuldade. Representa restrições que ensinam, paciência diante das provações e a força que nasce da escassez. Pede que você encare limitações como mestres.",
    reversedMeaning:
      "Invertida, indica sofrimento desnecessário, vitimismo ou incapacidade de aprender com as dificuldades. Pode apontar para desejos obsessivos ou pobreza de espírito.",
    element: "Fogo",
    archetype: "A Necessidade",
    canReverse: true,
  },
  {
    id: 10,
    name: "Isa",
    unicode: "ᛁ",
    phonetic: "I",
    keywords: ["gelo", "pausa", "imobilidade", "introspecção"],
    uprightMeaning:
      "Isa é o gelo que congela tudo ao redor. Representa pausa necessária, um período de espera e introspecção profunda. Nada se move — e isso é proposital. É hora de parar, refletir e preservar energia para quando o degelo vier.",
    reversedMeaning:
      "Isa não possui posição invertida. O gelo age sempre da mesma forma: pede quietude e paciência.",
    element: "Água",
    archetype: "O Gelo",
    canReverse: false,
  },
  {
    id: 11,
    name: "Jera",
    unicode: "ᛃ",
    phonetic: "J/Y",
    keywords: ["colheita", "ciclo", "recompensa", "estações"],
    uprightMeaning:
      "Jera é a runa da colheita e dos ciclos naturais. Representa a recompensa pelo trabalho feito com dedicação, a passagem do tempo que amadurece tudo e a confiança de que cada estação traz seus frutos. A paciência será recompensada.",
    reversedMeaning:
      "Jera não possui posição invertida. Os ciclos da natureza são sempre justos — você colhe o que plantou.",
    element: "Terra",
    archetype: "A Colheita",
    canReverse: false,
  },
  {
    id: 12,
    name: "Eihwaz",
    unicode: "ᛇ",
    phonetic: "Ei",
    keywords: ["teixo", "resistência", "morte-renascimento", "perseverança"],
    uprightMeaning:
      "Eihwaz é o teixo — a árvore que conecta o mundo dos vivos ao dos mortos. Representa resistência inabalável, transformação profunda, o eixo que sustenta tudo e a capacidade de renascer após grandes provações. É a runa da perseverança espiritual.",
    reversedMeaning:
      "Eihwaz não possui posição invertida. Sua energia de transformação profunda opera sempre, como o eixo da Árvore do Mundo.",
    element: "Todos",
    archetype: "O Eixo do Mundo",
    canReverse: false,
  },
  {
    id: 13,
    name: "Perthro",
    unicode: "ᛈ",
    phonetic: "P",
    keywords: ["mistério", "destino", "sorte", "segredo"],
    uprightMeaning:
      "Perthro é a runa do mistério, do destino e do acaso. Representa o desconhecido, segredos sendo revelados, jogos de sorte e a teia do destino sendo tecida. Indica que forças ocultas estão atuando — confie no mistério.",
    reversedMeaning:
      "Invertida, indica segredos prejudiciais, surpresas desagradáveis ou recusa em aceitar o desconhecido. Pode apontar para vícios, estagnação ou destino sendo forçado.",
    element: "Água",
    archetype: "O Mistério",
    canReverse: true,
  },
  {
    id: 14,
    name: "Algiz",
    unicode: "ᛉ",
    phonetic: "Z",
    keywords: ["proteção", "defesa", "conexão divina", "instinto"],
    uprightMeaning:
      "Algiz é o escudo protetor e a conexão com o sagrado. Representa proteção espiritual, instintos de defesa afiados, a ponte entre o humano e o divino e a capacidade de se manter seguro em tempos turbulentos.",
    reversedMeaning:
      "Invertida, indica vulnerabilidade espiritual, perda de proteção ou desconexão do sagrado. Pode apontar para perigo ignorado ou incapacidade de se defender.",
    element: "Ar",
    archetype: "O Escudo",
    canReverse: true,
  },
  {
    id: 15,
    name: "Sowilo",
    unicode: "ᛊ",
    phonetic: "S",
    keywords: ["sol", "vitória", "energia", "saúde"],
    uprightMeaning:
      "Sowilo é o sol em sua plenitude. Representa vitória, saúde vibrante, sucesso garantido, clareza total e a energia vital em seu ápice. É a runa mais luminosa — tudo o que toca se ilumina e prospera.",
    reversedMeaning:
      "Sowilo não possui posição invertida. O sol sempre brilha — sua energia é de pura luz e vitória.",
    element: "Fogo",
    archetype: "O Sol",
    canReverse: false,
  },
  {
    id: 16,
    name: "Tiwaz",
    unicode: "ᛏ",
    phonetic: "T",
    keywords: ["justiça", "honra", "sacrifício", "liderança"],
    uprightMeaning:
      "Tiwaz é a runa de Tyr, o deus da justiça e da honra. Representa coragem moral, sacrifício pelo bem maior, liderança justa e a capacidade de manter a integridade mesmo quando custa caro. É a bússola ética do guerreiro.",
    reversedMeaning:
      "Invertida, indica injustiça, covardia, desonra ou sacrifícios em vão. Pode apontar para conflitos onde ninguém age com retidão, ou perda de fé nos próprios princípios.",
    element: "Ar",
    archetype: "O Guerreiro Justo",
    canReverse: true,
  },
  {
    id: 17,
    name: "Berkano",
    unicode: "ᛒ",
    phonetic: "B",
    keywords: ["renascimento", "fertilidade", "cuidado", "crescimento"],
    uprightMeaning:
      "Berkano é a bétula — a árvore do renascimento. Representa fertilidade, novos começos gentis, maternidade, cuidado e o crescimento orgânico que vem do amor e da nutrição. É a energia feminina que gera e protege a vida nova.",
    reversedMeaning:
      "Invertida, indica problemas domésticos, bloqueio na fertilidade (literal ou simbólica), ansiedade ou dificuldade em cuidar de si e dos outros. Pode apontar para crescimento estagnado.",
    element: "Terra",
    archetype: "A Mãe Bétula",
    canReverse: true,
  },
  {
    id: 18,
    name: "Ehwaz",
    unicode: "ᛖ",
    phonetic: "E",
    keywords: ["cavalo", "parceria", "confiança", "progresso"],
    uprightMeaning:
      "Ehwaz é o cavalo sagrado que carrega o guerreiro. Representa parceria leal, confiança mútua, progresso constante e a harmonia entre jinete e montaria — entre mente e corpo, entre parceiros. Indica avanço através da cooperação.",
    reversedMeaning:
      "Invertida, indica desconfiança, parcerias desequilibradas ou progresso bloqueado. Pode apontar para traição, inquietação ou falta de harmonia entre partes que deveriam trabalhar juntas.",
    element: "Terra",
    archetype: "O Cavalo",
    canReverse: true,
  },
  {
    id: 19,
    name: "Mannaz",
    unicode: "ᛗ",
    phonetic: "M",
    keywords: ["humanidade", "comunidade", "autoconsciência", "cooperação"],
    uprightMeaning:
      "Mannaz representa a humanidade em sua essência. É a runa da autoconsciência, da inteligência, da cooperação e do reconhecimento de que somos parte de algo maior. Indica que a resposta está na compreensão de si mesmo e na conexão com os outros.",
    reversedMeaning:
      "Invertida, indica isolamento, egocentrismo, manipulação social ou cegueira sobre os próprios defeitos. Pode apontar para falta de empatia ou conflitos interpessoais.",
    element: "Ar",
    archetype: "O Ser Humano",
    canReverse: true,
  },
  {
    id: 20,
    name: "Laguz",
    unicode: "ᛚ",
    phonetic: "L",
    keywords: ["água", "intuição", "fluxo", "inconsciente"],
    uprightMeaning:
      "Laguz é a água em todas as suas formas — rio, mar, lágrima. Representa intuição profunda, fluxo emocional, sonhos e a sabedoria do inconsciente. Pede que você confie no que sente, mesmo quando a lógica não consegue explicar.",
    reversedMeaning:
      "Invertida, indica confusão emocional, medo do inconsciente, obsessões ou falta de contato com os próprios sentimentos. Pode apontar para inundação emocional ou manipulação.",
    element: "Água",
    archetype: "A Água",
    canReverse: true,
  },
  {
    id: 21,
    name: "Ingwaz",
    unicode: "ᛜ",
    phonetic: "Ng",
    keywords: ["semente", "potencial", "gestação", "completude"],
    uprightMeaning:
      "Ingwaz é a semente sagrada plantada na terra fértil. Representa potencial latente, gestação de algo grande, um período de recolhimento necessário antes da manifestação. O fruto está se formando — tenha paciência e fé.",
    reversedMeaning:
      "Ingwaz não possui posição invertida. A semente germina no seu próprio tempo — sempre.",
    element: "Terra / Água",
    archetype: "A Semente",
    canReverse: false,
  },
  {
    id: 22,
    name: "Dagaz",
    unicode: "ᛞ",
    phonetic: "D",
    keywords: ["amanhecer", "despertar", "transformação", "clareza"],
    uprightMeaning:
      "Dagaz é o amanhecer — a transição da escuridão para a luz. Representa despertar espiritual, clareza repentina, transformação radical e positiva e o momento em que tudo muda para melhor. É a aurora de um novo dia na vida.",
    reversedMeaning:
      "Dagaz não possui posição invertida. O amanhecer sempre vem — é inevitável e sempre iluminador.",
    element: "Fogo / Ar",
    archetype: "O Amanhecer",
    canReverse: false,
  },
  {
    id: 23,
    name: "Othala",
    unicode: "ᛟ",
    phonetic: "O",
    keywords: ["herança", "lar", "ancestralidade", "patrimônio"],
    uprightMeaning:
      "Othala é a runa da herança ancestral e do lar sagrado. Representa tradição, patrimônio (material e espiritual), raízes, senso de pertencimento e a sabedoria herdada dos antepassados. Indica conexão com as origens e segurança.",
    reversedMeaning:
      "Invertida, indica problemas familiares, perda de patrimônio, desconexão das raízes ou conflitos de herança. Pode apontar para falta de lar interior ou rejeição da própria história.",
    element: "Terra",
    archetype: "O Lar Ancestral",
    canReverse: true,
  },
];
