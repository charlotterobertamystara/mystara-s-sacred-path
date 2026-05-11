export interface Banho {
  nome: string;
  ingredientes: string[];
  preparo: string;
  uso: string;
}

export interface Defumacao {
  nome: string;
  tema: string;
  ingredientes: string[];
  modo: string;
}

export interface TopicoBanhos {
  id: string;
  titulo: string;
  icon: string;
  descricao: string;
  banhos: Banho[];
}

export interface TopicoDefumacoes {
  id: string;
  titulo: string;
  icon: string;
  descricao: string;
  defumacoes: Defumacao[];
}

export const topicosBanhos: TopicoBanhos[] = [
  {
    id: "amor",
    titulo: "Amor & Relacionamentos",
    icon: "🌹",
    descricao: "Banhos para atrair, fortalecer e harmonizar o amor",
    banhos: [
      { nome: "Banho de Rosas e Canela", ingredientes: ["Pétalas de rosa vermelha", "Canela em pau", "Mel"], preparo: "Ferva 1L de água, adicione as pétalas e a canela. Abafe por 15 min. Coe e acrescente 1 colher de mel.", uso: "Após o banho de higiene, despeje do pescoço para baixo mentalizando amor e doçura." },
      { nome: "Banho de Jasmim e Ylang-Ylang", ingredientes: ["Flores de jasmim", "3 gotas de óleo de ylang-ylang", "Açúcar cristal"], preparo: "Infusão das flores em 1L de água quente por 10 min. Adicione o óleo e uma pitada de açúcar.", uso: "Despeje sobre o corpo visualizando conexões afetivas profundas." },
      { nome: "Banho de Manjericão e Rosa Branca", ingredientes: ["Manjericão fresco", "Pétalas de rosa branca", "Alfazema"], preparo: "Macere as ervas em água morna por 20 min. Coe.", uso: "Use para purificar bloqueios emocionais e abrir o coração." },
      { nome: "Banho de Cravo e Pétalas de Rosa", ingredientes: ["Cravos-da-índia", "Pétalas de rosa rosa", "Gengibre ralado"], preparo: "Ferva os cravos e gengibre por 5 min. Retire do fogo, acrescente as pétalas e abafe por 10 min.", uso: "Banho para reavivar a paixão e aquecer os sentimentos." },
      { nome: "Banho de Camomila e Lavanda", ingredientes: ["Camomila seca", "Lavanda", "Erva-doce"], preparo: "Infusão em 1L de água quente por 15 min. Coe.", uso: "Banho para harmonizar relações e acalmar conflitos amorosos." },
      { nome: "Banho de Orquídea e Mel", ingredientes: ["Pétalas de orquídea", "Mel", "Água de rosas"], preparo: "Misture os ingredientes em água morna. Deixe repousar 10 min.", uso: "Despeje do pescoço para baixo para elevar a autoestima e atratividade." },
      { nome: "Banho de Pétalas com Cardamomo", ingredientes: ["Pétalas de rosa vermelha e branca", "Cardamomo", "Noz-moscada ralada"], preparo: "Ferva os temperos por 3 min, adicione as pétalas, abafe 10 min. Coe.", uso: "Banho para despertar magnetismo pessoal e carisma." },
      { nome: "Banho de Hortelã e Rosas", ingredientes: ["Hortelã fresca", "Pétalas de rosa", "Alecrim"], preparo: "Macere tudo em 1L de água morna por 15 min. Coe.", uso: "Banho para renovar energias de um relacionamento estagnado." },
      { nome: "Banho de Dama-da-Noite", ingredientes: ["Flores de dama-da-noite", "Canela em pó", "Baunilha"], preparo: "Infusão das flores com canela em 1L de água morna. Adicione essência de baunilha.", uso: "Use à noite para atrair romance e sensualidade." },
      { nome: "Banho de Girassol e Açafrão", ingredientes: ["Pétalas de girassol", "Açafrão-da-terra", "Mel"], preparo: "Ferva o açafrão por 5 min, adicione pétalas, abafe 10 min. Coe e adicione mel.", uso: "Banho solar para irradiar amor-próprio e confiança." },
    ],
  },
  {
    id: "saude",
    titulo: "Saúde & Vitalidade",
    icon: "💚",
    descricao: "Banhos para fortalecer o corpo e restaurar a vitalidade",
    banhos: [
      { nome: "Banho de Alecrim e Eucalipto", ingredientes: ["Alecrim fresco", "Folhas de eucalipto", "Hortelã"], preparo: "Ferva 1L de água, adicione as ervas e abafe por 15 min. Coe.", uso: "Banho revitalizante para recuperar energia e disposição." },
      { nome: "Banho de Arruda e Guiné", ingredientes: ["Arruda", "Guiné (Pipi)", "Sal grosso"], preparo: "Ferva a guiné por 5 min, acrescente arruda e abafe. Coe e adicione um punhado de sal.", uso: "Banho de limpeza profunda para remover energias densas que afetam a saúde." },
      { nome: "Banho de Gengibre e Canela", ingredientes: ["Gengibre fresco ralado", "Canela em pau", "Cravo-da-índia"], preparo: "Ferva todos os ingredientes por 10 min em 1L de água. Coe.", uso: "Banho térmico para estimular a circulação e aquecer o corpo." },
      { nome: "Banho de Camomila e Erva-Cidreira", ingredientes: ["Camomila", "Erva-cidreira", "Capim-limão"], preparo: "Infusão em 1L de água quente por 15 min. Coe.", uso: "Banho calmante que auxilia no combate à insônia e tensão." },
      { nome: "Banho de Boldo e Hortelã", ingredientes: ["Folhas de boldo", "Hortelã-pimenta", "Manjericão"], preparo: "Macere as ervas em água morna por 20 min. Coe.", uso: "Banho digestivo e desintoxicante energético." },
      { nome: "Banho de Babosa e Arnica", ingredientes: ["Gel de babosa (aloe vera)", "Flores de arnica", "Calêndula"], preparo: "Dissolva o gel de babosa em 1L de água morna com infusão de arnica e calêndula.", uso: "Banho regenerador para recuperação física e cicatrização energética." },
      { nome: "Banho de Louro e Cúrcuma", ingredientes: ["Folhas de louro", "Cúrcuma em pó", "Alecrim"], preparo: "Ferva o louro por 5 min, adicione cúrcuma e alecrim. Abafe 10 min. Coe.", uso: "Banho anti-inflamatório energético e fortalecedor." },
      { nome: "Banho de Sálvia e Tomilho", ingredientes: ["Sálvia fresca", "Tomilho", "Orégano"], preparo: "Infusão em 1L de água quente por 15 min. Coe.", uso: "Banho purificador para fortalecer o sistema imunológico energético." },
      { nome: "Banho de Capim-Santo e Maracujá", ingredientes: ["Capim-santo", "Folhas de maracujá", "Melissa"], preparo: "Macere em 1L de água morna por 20 min. Coe.", uso: "Banho relaxante profundo para restauração do corpo e mente." },
      { nome: "Banho de Erva-de-São-João", ingredientes: ["Erva-de-São-João (Hipérico)", "Lavanda", "Camomila"], preparo: "Infusão em 1L de água quente por 15 min. Coe.", uso: "Banho luminoso para revitalizar ânimo e disposição geral." },
    ],
  },
  {
    id: "prosperidade",
    titulo: "Prosperidade Financeira",
    icon: "✦",
    descricao: "Banhos para atrair abundância e abrir caminhos de prosperidade",
    banhos: [
      { nome: "Banho de Canela e Louro", ingredientes: ["Canela em pau", "Folhas de louro", "Cravo-da-índia"], preparo: "Ferva 1L de água com canela e cravo por 5 min. Adicione louro e abafe 10 min. Coe.", uso: "Banho clássico de atração de prosperidade. Use às segundas-feiras." },
      { nome: "Banho de Manjericão e Anis-Estrelado", ingredientes: ["Manjericão fresco", "Anis-estrelado", "Noz-moscada"], preparo: "Infusão em 1L de água quente por 15 min. Coe.", uso: "Banho para abrir novos caminhos profissionais e financeiros." },
      { nome: "Banho de Alecrim e Hortelã", ingredientes: ["Alecrim", "Hortelã", "Canela em pó"], preparo: "Macere as ervas em 1L de água morna por 20 min. Adicione canela. Coe.", uso: "Banho para clareza mental nas decisões financeiras." },
      { nome: "Banho de Cravo e Gengibre", ingredientes: ["Cravo-da-índia", "Gengibre fresco", "Folhas de louro"], preparo: "Ferva tudo por 10 min em 1L de água. Coe.", uso: "Banho de ativação para negócios e empreendimentos." },
      { nome: "Banho de Trigo e Mel", ingredientes: ["Grãos de trigo", "Mel", "Canela em pau"], preparo: "Ferva os grãos de trigo por 10 min. Coe, adicione mel e canela.", uso: "Banho de fartura e abundância material." },
      { nome: "Banho de Patchouli e Sândalo", ingredientes: ["5 gotas de óleo de patchouli", "3 gotas de sândalo", "Folhas de louro"], preparo: "Infusão do louro em 1L de água. Coe e adicione os óleos.", uso: "Banho magnético para atrair oportunidades financeiras." },
      { nome: "Banho de Açafrão e Girassol", ingredientes: ["Açafrão-da-terra", "Pétalas de girassol", "Mel"], preparo: "Ferva o açafrão por 5 min, adicione pétalas, abafe 10 min. Coe e adicione mel.", uso: "Banho solar para brilhar profissionalmente e atrair reconhecimento." },
      { nome: "Banho de Folha de Pitanga e Canela", ingredientes: ["Folhas de pitangueira", "Canela em pau", "Alecrim"], preparo: "Ferva as folhas de pitanga e canela por 5 min. Adicione alecrim, abafe. Coe.", uso: "Banho brasileiro de prosperidade e sorte nos negócios." },
      { nome: "Banho de Camomila com Ouro", ingredientes: ["Camomila", "Uma bijuteria dourada (para energizar)", "Canela"], preparo: "Infusão de camomila e canela por 15 min. Coloque a peça dourada dentro por 5 min, depois retire.", uso: "Banho energizado com vibração de riqueza e conquista." },
      { nome: "Banho de Erva-Doce e Anis", ingredientes: ["Erva-doce", "Anis-estrelado", "Cravo-da-índia"], preparo: "Infusão em 1L de água quente por 15 min. Coe.", uso: "Banho doce para suavizar os caminhos da prosperidade." },
    ],
  },
  {
    id: "mente",
    titulo: "Equilíbrio Mental",
    icon: "🧠",
    descricao: "Banhos para acalmar a mente, clareza e equilíbrio emocional",
    banhos: [
      { nome: "Banho de Lavanda e Camomila", ingredientes: ["Lavanda seca", "Camomila", "Melissa"], preparo: "Infusão em 1L de água quente por 15 min. Coe.", uso: "Banho calmante para ansiedade e agitação mental." },
      { nome: "Banho de Alecrim e Sálvia", ingredientes: ["Alecrim", "Sálvia branca", "Manjericão"], preparo: "Ferva o alecrim por 3 min. Adicione sálvia e manjericão, abafe 10 min. Coe.", uso: "Banho de clareza e foco para momentos de confusão mental." },
      { nome: "Banho de Erva-Cidreira e Maracujá", ingredientes: ["Erva-cidreira", "Folhas de maracujá", "Capim-limão"], preparo: "Macere em 1L de água morna por 20 min. Coe.", uso: "Banho profundamente relaxante para insônia e pensamentos acelerados." },
      { nome: "Banho de Melissa e Valeriana", ingredientes: ["Melissa", "Raiz de valeriana", "Camomila"], preparo: "Ferva a valeriana por 5 min. Adicione melissa e camomila, abafe 15 min. Coe.", uso: "Banho sedativo natural para noites de grande tensão." },
      { nome: "Banho de Alfazema e Hortelã", ingredientes: ["Alfazema", "Hortelã", "Erva-doce"], preparo: "Infusão em 1L de água quente por 15 min. Coe.", uso: "Banho refrescante para limpar a mente e renovar perspectivas." },
      { nome: "Banho de Rosa Branca e Melissa", ingredientes: ["Pétalas de rosa branca", "Melissa", "Jasmim"], preparo: "Macere as flores e ervas em 1L de água morna por 15 min. Coe.", uso: "Banho suave para curar feridas emocionais e trazer paz interior." },
      { nome: "Banho de Lúpulo e Camomila", ingredientes: ["Flores de lúpulo", "Camomila", "Erva-cidreira"], preparo: "Infusão em 1L de água quente por 20 min. Coe.", uso: "Banho para acalmar crises de pânico e nervosismo." },
      { nome: "Banho de Capim-Santo e Alecrim", ingredientes: ["Capim-santo (capim-limão)", "Alecrim", "Louro"], preparo: "Ferva o capim-santo por 5 min. Adicione alecrim e louro, abafe 10 min. Coe.", uso: "Banho estimulante para combater apatia e desânimo." },
      { nome: "Banho de Anis e Lavanda", ingredientes: ["Anis-estrelado", "Lavanda", "Noz-moscada"], preparo: "Infusão em 1L de água quente por 15 min. Coe.", uso: "Banho para equilibrar emoções e promover autoconhecimento." },
      { nome: "Banho de Arruda e Guiné Mental", ingredientes: ["Arruda", "Guiné", "Sálvia"], preparo: "Ferva a guiné por 5 min. Adicione arruda e sálvia, abafe 10 min. Coe.", uso: "Banho de limpeza pesada para obsessões e pensamentos intrusivos." },
    ],
  },
  {
    id: "fisico",
    titulo: "Equilíbrio Físico",
    icon: "🏛️",
    descricao: "Banhos para harmonizar o corpo, disposição e energia vital",
    banhos: [
      { nome: "Banho de Eucalipto e Menta", ingredientes: ["Folhas de eucalipto", "Menta fresca", "Alecrim"], preparo: "Ferva o eucalipto por 5 min. Adicione menta e alecrim, abafe 10 min. Coe.", uso: "Banho revigorante para desbloqueio respiratório e energético." },
      { nome: "Banho de Gengibre e Cravo", ingredientes: ["Gengibre fresco", "Cravo-da-índia", "Canela em pau"], preparo: "Ferva todos por 10 min em 1L de água. Coe.", uso: "Banho térmico para dores musculares e cansaço físico." },
      { nome: "Banho de Arnica e Calêndula", ingredientes: ["Flores de arnica", "Calêndula", "Confrei"], preparo: "Infusão em 1L de água quente por 15 min. Coe.", uso: "Banho recuperador para pós-exercício e fadiga corporal." },
      { nome: "Banho de Hortelã e Cânfora", ingredientes: ["Hortelã-pimenta", "3 gotas de óleo de cânfora", "Eucalipto"], preparo: "Infusão de hortelã e eucalipto por 15 min. Coe e adicione cânfora.", uso: "Banho estimulante para despertar o corpo e aumentar energia." },
      { nome: "Banho de Cavalinha e Alecrim", ingredientes: ["Cavalinha", "Alecrim", "Urtiga"], preparo: "Ferva a cavalinha por 10 min. Adicione alecrim e urtiga, abafe 10 min. Coe.", uso: "Banho mineralizante para fortalecer ossos e articulações energeticamente." },
      { nome: "Banho de Capim-Limão e Gengibre", ingredientes: ["Capim-limão", "Gengibre", "Limão (casca)"], preparo: "Ferva capim-limão e gengibre por 5 min. Adicione cascas de limão, abafe. Coe.", uso: "Banho desintoxicante para renovação física completa." },
      { nome: "Banho de Louro e Tomilho", ingredientes: ["Folhas de louro", "Tomilho fresco", "Orégano"], preparo: "Infusão em 1L de água quente por 15 min. Coe.", uso: "Banho fortalecedor para imunidade e proteção do corpo." },
      { nome: "Banho de Erva-Mate e Guaraná", ingredientes: ["Erva-mate", "Guaraná em pó", "Canela"], preparo: "Ferva a erva-mate por 5 min. Coe, adicione guaraná e canela.", uso: "Banho energizante para combater letargia e indisposição." },
      { nome: "Banho de Babosa e Camomila Corporal", ingredientes: ["Gel de babosa", "Camomila", "Calêndula"], preparo: "Infusão de camomila e calêndula por 15 min. Coe e misture o gel de babosa.", uso: "Banho hidratante e calmante para a pele e aura." },
      { nome: "Banho de Cúrcuma e Manjericão", ingredientes: ["Cúrcuma fresca ralada", "Manjericão", "Gengibre"], preparo: "Ferva cúrcuma e gengibre por 5 min. Adicione manjericão, abafe 10 min. Coe.", uso: "Banho anti-inflamatório para dores crônicas e rigidez corporal." },
    ],
  },
];

export const topicoDefumacoes: TopicoDefumacoes = {
  id: "defumacoes",
  titulo: "Defumações de Ambiente",
  icon: "💨",
  descricao: "Defumações para limpar, proteger e energizar espaços",
  defumacoes: [
    {
      nome: "Defumação de Início de Mês",
      tema: "Renovação mensal",
      ingredientes: ["Alecrim", "Louro", "Canela em pau", "Cravo-da-índia"],
      modo: "Acenda o carvão vegetal e adicione as ervas aos poucos. Passe em todos os cômodos no sentido horário, começando pela porta de entrada. Faça no primeiro dia de cada mês para renovar as energias do lar.",
    },
    {
      nome: "Defumação de Início de Semana",
      tema: "Proteção semanal",
      ingredientes: ["Sálvia branca", "Alfazema", "Manjericão"],
      modo: "Às segundas-feiras pela manhã, acenda o carvão e adicione as ervas. Passe em cada cômodo por pelo menos 30 segundos. Mantenha uma janela aberta para a fumaça sair levando as energias densas.",
    },
    {
      nome: "Defumação de Mês de Nascimento",
      tema: "Renovação pessoal anual",
      ingredientes: ["Rosa branca (pétalas secas)", "Benjoim", "Mirra", "Lavanda", "Canela"],
      modo: "Faça no primeiro dia do seu mês de nascimento. Acenda o carvão e adicione as ervas. Passe por todo o ambiente e também em volta do seu corpo (sem encostar). Mentalize renovação e agradeça pelo novo ciclo.",
    },
    {
      nome: "Defumação para Afastar Energias Negativas",
      tema: "Limpeza pesada",
      ingredientes: ["Arruda", "Guiné (Pipi)", "Sal grosso", "Alecrim", "Eucalipto"],
      modo: "Acenda o carvão em local ventilado. Adicione as ervas e o sal grosso. Passe por todos os cantos da casa, incluindo banheiros e áreas de serviço. Abra as janelas após a defumação. Ideal para quando sentir o ambiente pesado.",
    },
    {
      nome: "Defumação de Harmonia e Paz",
      tema: "Equilíbrio do lar",
      ingredientes: ["Camomila seca", "Alfazema", "Erva-doce", "Benjoim"],
      modo: "Acenda o carvão e adicione as ervas suavemente. Passe pelos cômodos com calma, mentalizando paz e harmonia para todos os moradores. Ideal após discussões ou períodos de tensão no lar.",
    },
  ],
};
