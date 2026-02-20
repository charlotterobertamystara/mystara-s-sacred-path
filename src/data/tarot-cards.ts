export interface TarotCard {
  id: number;
  number: string;
  name: string;
  nameOriginal: string;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  symbol: string;
  element: string;
  archetype: string;
}

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 0,
    number: "0",
    name: "O Louco",
    nameOriginal: "Le Mat",
    keywords: ["liberdade", "novo começo", "aventura", "espontaneidade"],
    uprightMeaning:
      "O Louco representa o início de uma jornada, a pureza da alma que parte sem medo para o desconhecido. Traz energia de renovação, desapego do passado e fé na vida. É o espírito livre que age por intuição e coragem, abraçando o novo com leveza.",
    reversedMeaning:
      "Invertido, indica imprudência, irresponsabilidade ou medo de dar o próximo passo. Pode apontar para um bloqueio na capacidade de se reinventar, ou uma fuga da realidade sem propósito claro.",
    symbol: "🃏",
    element: "Ar / Éter",
    archetype: "O Espírito Livre",
  },
  {
    id: 1,
    number: "I",
    name: "O Mago",
    nameOriginal: "Le Bateleur",
    keywords: ["vontade", "habilidade", "manifestação", "poder pessoal"],
    uprightMeaning:
      "O Mago é o mestre da manifestação. Representa a capacidade de transformar pensamentos em realidade usando todos os recursos disponíveis. Traz clareza de intenção, força de vontade e habilidade prática para concretizar objetivos.",
    reversedMeaning:
      "Invertido, aponta para manipulação, uso inadequado do poder ou falta de confiança nas próprias capacidades. Pode indicar potencial desperdiçado ou intenções desonestas.",
    symbol: "🌟",
    element: "Fogo / Ar",
    archetype: "O Criador",
  },
  {
    id: 2,
    number: "II",
    name: "A Papisa",
    nameOriginal: "La Papesse",
    keywords: ["intuição", "mistério", "sabedoria interior", "paciência"],
    uprightMeaning:
      "A Papisa guarda os segredos do inconsciente. Representa a sabedoria que vem do silêncio, da escuta interior e da conexão com os mistérios sagrados. Pede paciência, introspecção e confiança na voz interior.",
    reversedMeaning:
      "Invertido, indica segredos escondidos de forma prejudicial, ignorância intuitiva ou conhecimento sendo usado de maneira errada. Pode apontar para desconexão do próprio eu profundo.",
    symbol: "📖",
    element: "Água",
    archetype: "A Sacerdotisa",
  },
  {
    id: 3,
    number: "III",
    name: "A Imperatriz",
    nameOriginal: "L'Impératrice",
    keywords: ["fertilidade", "abundância", "criatividade", "maternidade"],
    uprightMeaning:
      "A Imperatriz é a Deusa-Mãe em toda sua plenitude. Representa fertilidade, criatividade exuberante, conexão com a natureza e abundância material. Traz energia de cuidado, beleza, sensualidade e amor incondicional.",
    reversedMeaning:
      "Invertido, pode indicar dependência emocional, sufocamento afetivo ou bloqueio criativo. Às vezes aponta para negligência com o corpo ou dificuldades relacionadas à maternidade e feminilidade.",
    symbol: "🌺",
    element: "Terra / Vênus",
    archetype: "A Grande Mãe",
  },
  {
    id: 4,
    number: "IV",
    name: "O Imperador",
    nameOriginal: "L'Empereur",
    keywords: ["autoridade", "estrutura", "liderança", "estabilidade"],
    uprightMeaning:
      "O Imperador representa a autoridade justa, a estrutura que sustenta e a força que protege. Traz energia de liderança responsável, disciplina, organização e capacidade de construir algo sólido e duradouro no mundo material.",
    reversedMeaning:
      "Invertido, indica autoritarismo, rigidez excessiva ou abuso de poder. Pode apontar para dificuldades com figuras de autoridade, falta de estrutura ou resistência a estabelecer limites saudáveis.",
    symbol: "👑",
    element: "Fogo / Áries",
    archetype: "O Pai",
  },
  {
    id: 5,
    number: "V",
    name: "O Papa",
    nameOriginal: "Le Pape",
    keywords: ["tradição", "espiritualidade", "ensinamento", "conformidade"],
    uprightMeaning:
      "O Papa é o guardião da tradição sagrada e da transmissão do conhecimento espiritual. Representa o mestre espiritual, a fé institucional e a sabedoria passada de geração em geração. Traz a energia da orientação, ritual e pertencimento.",
    reversedMeaning:
      "Invertido, pode indicar dogmatismo, conformismo excessivo ou ruptura necessária com tradições limitantes. Às vezes aponta para hipocrisia religiosa ou resistência a questionar crenças estabelecidas.",
    symbol: "✝️",
    element: "Terra / Touro",
    archetype: "O Hierofante",
  },
  {
    id: 6,
    number: "VI",
    name: "Os Amantes",
    nameOriginal: "L'Amoureux",
    keywords: ["escolha", "amor", "união", "valores"],
    uprightMeaning:
      "Os Amantes falam sobre escolhas profundas que definem quem somos. Representa o amor em suas múltiplas dimensões, a necessidade de alinhar escolhas com valores pessoais e a bênção de uniões verdadeiras, sejam afetivas ou de propósito.",
    reversedMeaning:
      "Invertido, indica indecisão, relacionamentos desequilibrados ou escolhas feitas por medo em vez de amor. Pode apontar para conflito interno entre desejo e dever.",
    symbol: "💞",
    element: "Ar / Gêmeos",
    archetype: "O Amante",
  },
  {
    id: 7,
    number: "VII",
    name: "O Carro",
    nameOriginal: "Le Chariot",
    keywords: ["vitória", "controle", "determinação", "movimento"],
    uprightMeaning:
      "O Carro simboliza a vitória conquistada pela determinação e pelo domínio sobre forças opostas. Representa o avanço com direção clara, a capacidade de manter o curso mesmo sob pressão e o triunfo do esforço focado.",
    reversedMeaning:
      "Invertido, indica falta de direção, agressividade descontrolada ou obstáculos que impedem o avanço. Pode apontar para vitórias efêmeras conquistadas pelos meios errados.",
    symbol: "⚡",
    element: "Água / Câncer",
    archetype: "O Guerreiro",
  },
  {
    id: 8,
    number: "VIII",
    name: "A Justiça",
    nameOriginal: "La Justice",
    keywords: ["equilíbrio", "verdade", "lei", "consequências"],
    uprightMeaning:
      "A Justiça representa o equilíbrio cósmico e a lei de causa e efeito. Traz a energia da verdade imparcial, das decisões justas e da necessidade de honrar compromissos. Indica que cada ação tem suas consequências e que a verdade sempre prevalece.",
    reversedMeaning:
      "Invertido, aponta para injustiça, desequilíbrio ou fuga da responsabilidade pelas próprias ações. Pode indicar julgamentos parciais ou situações onde a verdade está sendo distorcida.",
    symbol: "⚖️",
    element: "Ar / Libra",
    archetype: "A Árbitro",
  },
  {
    id: 9,
    number: "IX",
    name: "O Eremita",
    nameOriginal: "L'Hermite",
    keywords: ["solidão", "busca interior", "sabedoria", "retiro"],
    uprightMeaning:
      "O Eremita representa a jornada interior em busca da luz própria. Simboliza a sabedoria que vem da reflexão solitária, do retiro espiritual e da conexão com a voz interior. É o guia que ilumina o caminho com sua própria lâmpada.",
    reversedMeaning:
      "Invertido, pode indicar isolamento excessivo e nocivo, recusa em receber ajuda ou sabedoria negada ao mundo. Às vezes aponta para solidão não escolhida ou paranoia.",
    symbol: "🕯️",
    element: "Terra / Virgem",
    archetype: "O Sábio",
  },
  {
    id: 10,
    number: "X",
    name: "A Roda da Fortuna",
    nameOriginal: "La Roue de Fortune",
    keywords: ["ciclos", "destino", "mudança", "sorte"],
    uprightMeaning:
      "A Roda da Fortuna representa os ciclos inevitáveis da vida e as reviravoltas do destino. Traz a mensagem de que tudo muda, que os momentos difíceis passam e os bons também. Convida a abraçar o fluxo da vida com sabedoria.",
    reversedMeaning:
      "Invertido, indica resistência à mudança, má sorte temporária ou sensação de estar preso em ciclos repetitivos negativos. Pode apontar para a necessidade de tomar as rédeas do próprio destino.",
    symbol: "🎡",
    element: "Fogo / Júpiter",
    archetype: "O Destino",
  },
  {
    id: 11,
    number: "XI",
    name: "A Força",
    nameOriginal: "La Force",
    keywords: ["coragem", "paciência", "autocontrole", "compaixão"],
    uprightMeaning:
      "A Força não é a força bruta, mas a do coração. Representa a capacidade de domar instintos com amor, de enfrentar medos com coragem suave e de manter a calma diante das tempestades. É a força que nasce da compaixão e da fé.",
    reversedMeaning:
      "Invertido, indica fraqueza interior, medo que paralisa ou abuso da força sobre outros e sobre si mesmo. Pode apontar para insegurança profunda disfarçada de agressividade.",
    symbol: "🦁",
    element: "Fogo / Leão",
    archetype: "A Corajosa",
  },
  {
    id: 12,
    number: "XII",
    name: "O Enforcado",
    nameOriginal: "Le Pendu",
    keywords: ["rendição", "suspensão", "novo ponto de vista", "sacrifício"],
    uprightMeaning:
      "O Enforcado convida a olhar o mundo de um ângulo completamente diferente. Representa a sabedoria que vem da pausa voluntária, do sacrifício consciente e da disposição de soltar o controle. Às vezes é preciso parar tudo para enxergar a verdade.",
    reversedMeaning:
      "Invertido, indica estagnação por resistência, sacrifícios em vão ou recusa em mudar a perspectiva. Pode apontar para martírio desnecessário ou apego a situações que precisam ser liberadas.",
    symbol: "🔄",
    element: "Água / Netuno",
    archetype: "O Mártir",
  },
  {
    id: 13,
    number: "XIII",
    name: "A Morte",
    nameOriginal: "La Mort",
    keywords: ["transformação", "fim de ciclo", "renovação", "transição"],
    uprightMeaning:
      "A Morte raramente representa morte física — é a grande transformação. Representa o fim necessário de algo para que o novo possa nascer. Traz a energia da libertação profunda, da mudança inevitável e da coragem de deixar ir o que já não serve.",
    reversedMeaning:
      "Invertido, indica resistência dolorosa à transformação, medo da mudança ou incapacidade de soltar o passado. Pode apontar para estagnação ou mudanças que estão sendo adiadas por medo.",
    symbol: "🌙",
    element: "Água / Escorpião",
    archetype: "O Transformador",
  },
  {
    id: 14,
    number: "XIV",
    name: "A Temperança",
    nameOriginal: "La Tempérance",
    keywords: ["equilíbrio", "moderação", "paciência", "harmonia"],
    uprightMeaning:
      "A Temperança é o arquétipo do alquimista interior. Representa a capacidade de equilibrar opostos, de misturar com sabedoria e criar harmonia onde havia conflito. Traz energia de cura, paciência e a arte de encontrar o meio-termo perfeito.",
    reversedMeaning:
      "Invertido, indica desequilíbrio, excessos ou incapacidade de mesclar elementos diferentes da vida de forma harmoniosa. Pode apontar para impaciência ou falta de moderação.",
    symbol: "⚗️",
    element: "Fogo / Sagitário",
    archetype: "O Alquimista",
  },
  {
    id: 15,
    number: "XV",
    name: "O Diabo",
    nameOriginal: "Le Diable",
    keywords: ["sombra", "apego", "materialismo", "libertação"],
    uprightMeaning:
      "O Diabo representa as correntes que criamos nós mesmos: vícios, apegos, ilusões e sombras internas. É um convite à consciência sobre o que nos prende. Paradoxalmente, ao reconhecer nossas correntes, damos o primeiro passo para a liberdade.",
    reversedMeaning:
      "Invertido, pode indicar o início da libertação de padrões limitantes, ou pode apontar para negação de problemas sérios. Às vezes representa a sombra sendo projetada nos outros.",
    symbol: "🔱",
    element: "Terra / Capricórnio",
    archetype: "A Sombra",
  },
  {
    id: 16,
    number: "XVI",
    name: "A Torre",
    nameOriginal: "La Maison Dieu",
    keywords: ["ruptura", "revelação", "colapso", "libertação súbita"],
    uprightMeaning:
      "A Torre representa a desestruturação do que foi construído sobre bases falsas. Pode ser assustadora, mas é libertadora — o raio que cai destrói para liberar. Traz revelações súbitas, mudanças abruptas e a queda de estruturas que precisavam ser derrubadas.",
    reversedMeaning:
      "Invertido, indica que uma crise está sendo evitada com custo alto, ou que a destruição necessária está sendo adiada. Às vezes aponta para colapso interno que ainda não se manifestou externamente.",
    symbol: "⚡",
    element: "Fogo / Marte",
    archetype: "O Libertador",
  },
  {
    id: 17,
    number: "XVII",
    name: "A Estrela",
    nameOriginal: "L'Étoile",
    keywords: ["esperança", "renovação", "inspiração", "cura"],
    uprightMeaning:
      "A Estrela é a carta da esperança após a tempestade. Representa a cura que vem após grandes provações, a fé restaurada e a conexão com o divino. Traz inspiração, generosidade, clareza sobre o propósito e a certeza de que o caminho está iluminado.",
    reversedMeaning:
      "Invertido, indica desesperança, perda de fé ou desconexão do próprio propósito. Pode apontar para otimismo ingênuo ou expectativas irrealistas que geram decepção.",
    symbol: "⭐",
    element: "Ar / Aquário",
    archetype: "A Esperança",
  },
  {
    id: 18,
    number: "XVIII",
    name: "A Lua",
    nameOriginal: "La Lune",
    keywords: ["ilusão", "inconsciente", "medo", "intuição profunda"],
    uprightMeaning:
      "A Lua governa o reino das sombras, dos sonhos e do inconsciente profundo. Representa os medos que habitam nas profundezas, as ilusões que confundem a percepção e a intuição que só fala no silêncio da noite. Pede atenção aos sonhos e ao que está oculto.",
    reversedMeaning:
      "Invertido, pode indicar início de clareza após confusão, ou mergulho mais profundo em ilusões e medos. Às vezes aponta para segredos sendo revelados de forma perturbadora.",
    symbol: "🌙",
    element: "Água / Peixes",
    archetype: "O Inconsciente",
  },
  {
    id: 19,
    number: "XIX",
    name: "O Sol",
    nameOriginal: "Le Soleil",
    keywords: ["alegria", "sucesso", "clareza", "vitalidade"],
    uprightMeaning:
      "O Sol é a carta da luz plena, da alegria autêntica e do sucesso conquistado com integridade. Representa clareza mental, saúde, otimismo e a capacidade de irradiar calor para si mesmo e para o mundo. É a carta mais luminosa do baralho.",
    reversedMeaning:
      "Invertido, indica que o sucesso está bloqueado temporariamente, ou que há arrogância disfarçada de confiança. Pode apontar para alegria artificial ou dificuldade em ver as coisas com clareza.",
    symbol: "☀️",
    element: "Fogo / Sol",
    archetype: "A Criança Divina",
  },
  {
    id: 20,
    number: "XX",
    name: "O Julgamento",
    nameOriginal: "Le Jugement",
    keywords: ["chamado", "renovação", "absolvição", "despertar"],
    uprightMeaning:
      "O Julgamento é o grande chamado ao despertar. Representa a renovação que vem de ouvir a voz da alma, de deixar o passado para trás com consciência e de responder ao chamado do seu propósito mais elevado. É a ressurreição do ser.",
    reversedMeaning:
      "Invertido, indica resistência ao chamado interior, autopunição excessiva ou incapacidade de perdoar a si mesmo e seguir em frente. Pode apontar para julgamentos injustos.",
    symbol: "📯",
    element: "Fogo / Plutão",
    archetype: "O Desperto",
  },
  {
    id: 21,
    number: "XXI",
    name: "O Mundo",
    nameOriginal: "Le Monde",
    keywords: ["conclusão", "integração", "realização", "totalidade"],
    uprightMeaning:
      "O Mundo é a conclusão gloriosa de um grande ciclo. Representa a integração de todos os aspectos do ser, a realização plena, o sentimento de estar no lugar certo na hora certa. Traz energia de completude, sucesso total e harmonia com o cosmos.",
    reversedMeaning:
      "Invertido, indica que um ciclo ainda não foi completamente encerrado, ou que há resistência em celebrar as conquistas. Pode apontar para sensação de incompletude apesar do sucesso aparente.",
    symbol: "🌍",
    element: "Terra / Saturno",
    archetype: "O Integrado",
  },
];
