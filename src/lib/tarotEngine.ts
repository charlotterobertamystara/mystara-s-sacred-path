// Motor de interpretação do Tarot de Marselha — Mystara
// Interpretações baseadas na tradição francesa, psicologia junguiana e simbolismo arquetípico

type Theme = "amor" | "trabalho" | "saude" | "financas" | "espiritual" | "geral";

export interface CardInput {
  name: string;
  position: string;
  reversed: boolean;
}

// ─── Detecção de tema ────────────────────────────────────────────────────────

export function detectTheme(question: string): Theme {
  const q = question.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (/amor|relacionamento|parceiro|namorad|casamento|divorcio|ex |coracao|sentimento|romance|paquera|afeto|noivo|conjugue|separa|reconcili/.test(q)) return "amor";
  if (/saude|doenca|cura|corpo|mente|ansiedade|depressao|bem.estar|terapia|hospital|medico|tratamento|dor|sintoma/.test(q)) return "saude";
  if (/financ|dinheiro|grana|debito|divida|investimento|prosperidade|abundancia|riqueza|pagar|comprar|vender|lucro|prejuizo/.test(q)) return "financas";
  if (/espiritual|alma|proposito|missao|karma|meditacao|despertar|orixas|entidade|espirito|evolucao|energia|frequencia/.test(q)) return "espiritual";
  if (/trabalho|emprego|carreira|profissao|negocio|empresa|chefe|contrato|demissao|promocao|concurso|projeto|cliente/.test(q)) return "trabalho";
  return "geral";
}

// ─── Frases de abertura por tema ─────────────────────────────────────────────

const ABERTURA: Record<Theme, string[]> = {
  amor: [
    "O coração tem linguagens que a mente muitas vezes não alcança, e o Tarot nos convida a mergulhar nessas profundezas. Sua pergunta sobre o amor chega carregada de sentimento genuíno, e as cartas respondem com a mesma honestidade.",
    "Nas questões do coração, as cartas revelam não apenas o que está acontecendo, mas o que precisa ser compreendido para que o amor floresça com mais verdade e leveza.",
    "O amor é o terreno mais fértil e ao mesmo tempo mais desafiador da experiência humana. As cartas que surgiram escolheram revelar camadas importantes dessa jornada afetiva que você está vivendo.",
  ],
  trabalho: [
    "A vida profissional é um dos espelhos mais honestos de quem somos e do que desejamos criar no mundo. As cartas que chegaram trazem orientações precisas para esse momento da sua trajetória.",
    "Seu questionamento sobre carreira e trabalho é profundo — vai além do emprego em si e toca na sua identidade e no legado que deseja construir. As cartas enxergam essa dimensão toda.",
    "O trabalho, quando alinhado à nossa essência, torna-se chamado. As cartas respondem sobre sua situação profissional trazendo clareza sobre o que está funcionando e o que pede mudança.",
  ],
  saude: [
    "O corpo carrega memórias, emoções e padrões que a mente consciente às vezes não alcança. As cartas respondem sobre sua saúde com cuidado e profundidade.",
    "Saúde é equilíbrio entre corpo, mente e espírito. As cartas que se revelaram trazem mensagens sobre esse equilíbrio tão fundamental para a vida plena.",
    "Quando perguntamos sobre saúde ao Tarot, recebemos orientações sobre os padrões energéticos e emocionais que influenciam o bem-estar físico e mental.",
  ],
  financas: [
    "A relação com o dinheiro vai muito além dos números — ela revela crenças, medos e possibilidades que carregamos há muito tempo. As cartas iluminam essa dimensão com clareza.",
    "As finanças são reflexo da nossa relação com abundância, merecimento e segurança. O Tarot responde sobre esse campo com uma profundidade que vai além do material.",
    "Sua pergunta sobre finanças chegou no momento certo. As cartas revelam tanto os padrões atuais quanto os caminhos que podem transformar sua relação com a prosperidade.",
  ],
  espiritual: [
    "A alma conhece caminhos que a lógica ainda não mapeou. Sua pergunta espiritual convoca as cartas a revelar os movimentos mais sutis e profundos da sua jornada interior.",
    "O despertar espiritual acontece em ondas — às vezes suaves, às vezes avassaladoras. As cartas que chegaram falam diretamente ao seu momento evolutivo.",
    "Em questões espirituais, o Tarot atua como espelho da alma, refletindo verdades que já habitam em você, mas que ainda esperam reconhecimento consciente.",
  ],
  geral: [
    "Cada pergunta que fazemos ao Tarot nasce de uma necessidade real de compreensão. As cartas que emergiram para você carregam mensagens precisas e chegam no momento exato.",
    "O Tarot de Marselha não responde com certezas absolutas — ele ilumina possibilidades, revela padrões e aponta caminhos. E as cartas que surgiram para você têm muito a dizer.",
    "A vida é um tecido complexo de forças visíveis e invisíveis. As cartas que chegaram convidam você a olhar para essa trama com mais clareza e discernimento.",
  ],
};

// ─── Frases de posição ────────────────────────────────────────────────────────

const POSICAO_INTRO: Record<string, string[]> = {
  "Situação Atual": [
    "No centro da sua situação presente, revelando o que de fato está acontecendo agora, surge",
    "Como espelho do momento que você está vivendo, a energia dominante é representada por",
    "O retrato fiel do seu agora, com tudo que ele carrega de força e desafio, é mostrado por",
  ],
  "Influência / Desafio": [
    "A força que tanto influencia quanto desafia sua jornada nesse momento é representada por",
    "Como o principal obstáculo ou a tensão criativa que molda essa situação, surge",
    "Aquilo que ao mesmo tempo atrapalha e convida ao crescimento se revela em",
  ],
  "Conselho / Caminho": [
    "O conselho mais precioso que as cartas trazem para você agora vem através de",
    "Como orientação e direção para navegar essa situação com mais sabedoria, surge",
    "O caminho que pede para ser percorrido, a ação que pede para ser tomada, é iluminada por",
  ],
  "Passado": [
    "As raízes dessa situação, o que plantou as sementes do momento atual, se revela em",
    "Olhando para o que ficou para trás e ainda ecoa no presente, as cartas mostram",
    "A influência do passado que ainda pulsa nessa situação é trazida à luz por",
  ],
  "Futuro Próximo": [
    "O horizonte que se desenha para os próximos passos da sua jornada é iluminado por",
    "Como tendência e direção para o futuro próximo, caso os padrões atuais se mantenham, surge",
    "O que está se formando no horizonte da sua vida, a energia do que está por vir, é revelada em",
  ],
  "Carta 1": [
    "A primeira mensagem que as cartas trazem para você vem através de",
    "Como ponto de partida dessa leitura, a energia central é representada por",
    "A voz principal dessa tiragem se expressa através de",
  ],
  "Carta 2": [
    "A segunda camada de compreensão é revelada por",
    "Como desdobramento e complemento da primeira mensagem, surge",
    "A segunda voz dessa tiragem, trazendo nova perspectiva, é",
  ],
  "Carta 3": [
    "O terceiro e poderoso elemento dessa leitura é revelado em",
    "Como síntese e conclusão dessa jornada pelas cartas, surge",
    "A mensagem final e integradora dessa tiragem vem através de",
  ],
  "Carta 4": [
    "A quarta dimensão dessa leitura, trazendo profundidade adicional, é revelada em",
    "Um quarto olhar sobre sua situação se manifesta através de",
    "Mais uma camada preciosa de orientação emerge com",
  ],
  "Carta 5": [
    "O quinto e derradeiro elemento que completa essa leitura surge em",
    "Como arremate e resposta final das cartas, se revela",
    "A última e poderosa mensagem dessa tiragem vem através de",
  ],
};

function getPositionIntro(position: string): string {
  const options = POSICAO_INTRO[position] || POSICAO_INTRO["Carta 1"];
  return options[Math.floor(Math.random() * options.length)];
}

// ─── Dados ricos dos Arcanos Maiores ─────────────────────────────────────────

interface CardContext {
  upright: Record<Theme, string[]>;
  reversed: Record<Theme, string[]>;
  combinacao?: string; // insight quando combinada com outras cartas
}

const MAJOR_CONTEXT: Record<string, CardContext> = {
  "O Louco": {
    upright: {
      amor: [
        "O Louco no amor convida a um salto de fé. Há uma energia de leveza e abertura para o novo que pode ser exatamente o que esse relacionamento precisa. Se está sozinho, uma conexão inesperada pode surgir de onde menos espera. O importante é não deixar o medo da vulnerabilidade impedir a entrega.",
        "Em termos afetivos, O Louco traz a mensagem de soltar o controle e confiar no fluxo. Às vezes o amor mais transformador chega de formas que a lógica não planejou. Esteja aberto para o imprevisível, sem abandonar o bom senso.",
      ],
      trabalho: [
        "No campo profissional, O Louco sugere um momento propício para dar um salto de coragem. Um novo projeto, uma virada de carreira ou uma oportunidade fora do convencional pode estar batendo à sua porta. A mensagem é: acredite no seu potencial e aja.",
        "O Louco no trabalho representa energia empreendedora e inovadora. É hora de pensar fora da caixa, de propor algo novo, de não ter medo de parecer diferente. Sua originalidade é justamente o que pode te diferenciar nesse momento.",
      ],
      saude: [
        "O Louco na saúde pede leveza e movimento. Muitas vezes o estresse mental é o maior inimigo do corpo — e essa carta convida você a recuperar a alegria, a espontaneidade e o prazer de estar vivo. Atividades físicas lúdicas, contato com a natureza e momentos de descontração são indicados.",
        "Esta carta na saúde sugere revisar hábitos que foram adotados por obrigação e não por prazer. O bem-estar vem quando conseguimos nos reconectar com o que genuinamente nos faz bem, sem pressão nem julgamento.",
      ],
      financas: [
        "Nas finanças, O Louco pede atenção — sua energia de impulsividade pode levar a decisões financeiras não planejadas. Antes de investir em algo novo ou fazer um gasto grande, analise com calma. A novidade que parece promissora precisa de fundamentos sólidos.",
        "O Louco financeiro também pode indicar uma oportunidade de ganho inesperada ou um novo caminho de renda que surge de forma inusitada. Fique atento a possibilidades fora do comum, mas avalie os riscos com responsabilidade.",
      ],
      espiritual: [
        "Espiritualmente, O Louco é o arquétipo do buscador. Representa a alma que se lança na jornada sem mapa, confiando plenamente na Providência Divina. É o espírito que diz sim à vida antes de saber exatamente para onde vai. Uma fase de expansão e aventura espiritual se anuncia.",
        "O Louco no aspecto espiritual fala da inocência sagrada — o estado de não-saber que paradoxalmente abre as maiores portas do despertar. Você pode estar sendo chamado a soltar antigas certezas para receber insights que transformarão sua visão de mundo.",
      ],
      geral: [
        "O Louco anuncia um momento de transição e começo. Algo novo está chegando ou precisa ser iniciado — e a mensagem das cartas é que você tem todo o potencial necessário para esse salto. Confie na vida e dê o primeiro passo.",
        "Esta carta fala de energia nova, de movimento, de não deixar o passado pesar mais do que deve. O Louco é o eterno principiante — aquele que vê o mundo com olhos frescos e encontra possibilidades onde outros só veem obstáculos.",
      ],
    },
    reversed: {
      amor: [
        "Invertido no amor, O Louco pode indicar impulsividade emocional ou medo de se comprometer. Talvez haja uma fuga das responsabilidades afetivas, um movimento de não-enraizamento que dificulta a construção de algo duradouro. Vale refletir sobre padrões de esquiva emocional.",
        "O Louco invertido em questões amorosas também pode apontar para uma decisão precipitada tomada sem maturidade suficiente. Algo foi iniciado sem bases sólidas e agora pede revisão e mais cuidado.",
      ],
      trabalho: [
        "No trabalho invertido, O Louco indica risco de irresponsabilidade ou fuga das obrigações. Pode apontar para uma mudança feita sem planejamento que gerou instabilidade. É hora de retomar as rédeas e agir com mais estratégia.",
        "O Louco invertido profissional pode representar um projeto abandonado antes de concluído, ou energia dispersa que não se transforma em resultado concreto. Foco e comprometimento são as palavras de ordem.",
      ],
      saude: [
        "Na saúde invertida, O Louco pede cuidado com negligências. A imprudência com o corpo — excesso, falta de sono, descuido com a alimentação — começa a cobrar seu preço. É momento de tratar a própria saúde com mais seriedade e carinho.",
        "O Louco invertido na saúde também pode apontar para ansiedade e agitação mental que impedem o descanso adequado. Práticas de aterramento e rotinas mais estáveis são indicadas.",
      ],
      financas: [
        "Nas finanças, O Louco invertido é um sinal importante de alerta. Gastos impulsivos, investimentos sem pesquisa ou decisões financeiras tomadas no calor da emoção podem estar gerando instabilidade. Revise os gastos e estabeleça um plano mais consciente.",
        "Esta carta invertida financeira também pode indicar perda de dinheiro por ingenuidade ou por não ter lido as condições com atenção. Aprendizado precioso sobre gestão e responsabilidade financeira está sendo adquirido.",
      ],
      espiritual: [
        "O Louco invertido espiritualmente pode indicar dispersão ou escapismo — uma busca espiritual que foge da vida real em vez de aprofundá-la. A espiritualidade genuína não nos afasta das responsabilidades, mas nos ajuda a assumi-las com mais graça.",
        "Esta carta invertida no campo espiritual também pode apontar para uma fase de confusão e falta de direcionamento na jornada. Tome um tempo para silenciar e reconectar com o que realmente ressoa com sua alma.",
      ],
      geral: [
        "O Louco invertido indica que algo foi iniciado sem a preparação adequada, ou que um movimento importante está sendo bloqueado pelo medo. Há uma tensão entre o desejo de avançar e a resistência interna ou externa que precisa ser reconhecida e trabalhada.",
        "Esta carta invertida pede revisão — de planos, de atitudes, de comportamentos que estão gerando caos desnecessário. Antes de dar o próximo passo, certifique-se de que as bases estão mais sólidas.",
      ],
    },
  },
  "O Mago": {
    upright: {
      amor: [
        "O Mago no amor traz a mensagem de que você tem o poder de criar a conexão que deseja. Não espere que as coisas simplesmente aconteçam — use sua presença, sua comunicação e seu carisma para construir o relacionamento que quer. A atração que sente tem base real e pode ser cultivada com intenção.",
        "Em questões amorosas, O Mago representa alguém que usa todas as suas ferramentas — inteligência emocional, comunicação, charme — para criar conexões significativas. Esta carta pode também indicar que uma pessoa carismática e hábil está entrando ou já está presente na sua vida afetiva.",
      ],
      trabalho: [
        "O Mago no trabalho é um sinal extremamente positivo. Você tem todas as ferramentas, habilidades e recursos para alcançar seus objetivos profissionais. O momento pede ação consciente e uso inteligente do que já possui. Sua capacidade de transformar ideias em realidade está em alta.",
        "Esta carta no trabalho também fala de liderança e influência. Você possui a habilidade de inspirar outros, de apresentar projetos com persuasão e de criar resultados concretos. Confie no seu talento e não minimize suas capacidades.",
      ],
      saude: [
        "O Mago na saúde indica que você tem o poder de influenciar positivamente seu bem-estar. A mente sobre a matéria é um dos temas dessa carta — pensamentos e intenções conscientes têm impacto direto no corpo. Práticas integrativas, visualizações e uma postura proativa em relação à saúde são indicadas.",
        "Esta carta também pode indicar que um profissional de saúde competente e habilidoso pode aparecer em sua vida para oferecer a orientação correta. Seja receptivo a novas abordagens terapêuticas.",
      ],
      financas: [
        "O Mago nas finanças é excelente — indica habilidade para criar oportunidades de ganho, para negociar bem e para transformar ideias em fontes de renda. Você tem mais capacidade de gerar prosperidade do que imagina. Este é um bom momento para empreender, negociar ou apresentar suas habilidades.",
        "Nas finanças, O Mago também fala de usar a comunicação e a inteligência estratégica a seu favor. Negociações, apresentações e propostas têm boas chances de sucesso agora.",
      ],
      espiritual: [
        "O Mago espiritualmente representa o alquimista da consciência — aquele que transforma o chumbo da inconsciência em ouro do despertar. Você está num momento em que tem o poder de co-criar sua realidade de forma mais consciente e alinhada.",
        "Esta carta espiritual fala dos quatro elementos em equilíbrio — fogo, água, terra e ar — e da sua capacidade de integrá-los. Um momento de grande clareza sobre sua missão e suas ferramentas espirituais.",
      ],
      geral: [
        "O Mago é uma das cartas mais poderosas do baralho. Ela diz: você tem tudo o que precisa. As ferramentas, o talento e o momento são favoráveis. Agora é hora de colocar a intenção em prática com determinação e habilidade.",
        "Esta carta lembra que o poder de transformação está em suas mãos. Não espere por condições perfeitas — o que você já tem é suficiente para dar o próximo passo importante.",
      ],
    },
    reversed: {
      amor: [
        "O Mago invertido no amor pode indicar manipulação ou desonestidade em um relacionamento. Há possibilidade de que alguém esteja usando o charme de forma calculada. É hora de observar as ações, não apenas as palavras. Confie na sua intuição sobre os reais interesses da outra pessoa.",
        "Invertido em questões afetivas, O Mago também pode representar bloqueio na comunicação ou uso inadequado do poder pessoal no relacionamento. Conversa franca e transparência são urgentemente necessárias.",
      ],
      trabalho: [
        "No trabalho invertido, O Mago aponta para potencial desperdiçado ou habilidades que não estão sendo usadas de forma ética. Pode indicar alguém que usa sua habilidade de persuasão de maneira desonesta, ou você mesmo que está subutilizando seus talentos.",
        "O Mago invertido profissional também pode indicar um período de bloqueio criativo onde as habilidades parecem inacessíveis. É passageiro — trabalhe sua autoconfiança e busque apoio.",
      ],
      saude: [
        "O Mago invertido na saúde pode apontar para o uso incorreto de medicamentos, ou para uma abordagem de saúde que não está funcionando como deveria. Busque uma segunda opinião se necessário e não confie em promessas milagrosas.",
        "Esta carta invertida também pode indicar que a mente está criando bloqueios psicossomáticos. Trabalhar as crenças limitantes sobre saúde pode ser mais eficaz do que qualquer remédio.",
      ],
      financas: [
        "O Mago invertido nas finanças é um alerta sobre possíveis golpes ou negócios duvidosos. Alguém pode estar usando habilidade de persuasão para te enganar financeiramente. Desconfie de promessas muito boas para ser verdade.",
        "Invertido no campo financeiro, O Mago também pode indicar talentos que não estão sendo monetizados ou oportunidades de renda sendo perdidas por insegurança ou procrastinação.",
      ],
      espiritual: [
        "O Mago invertido espiritualmente pode indicar o charlatanismo — seja próprio ou de alguém ao redor que se passa por mais iluminado do que é. Cuidado com ego espiritual e com o uso da espiritualidade para obter poder sobre outros.",
        "Espiritualmente invertido, O Mago também pode apontar para um momento de desconexão das próprias capacidades. A fonte do poder interior ainda está lá — mas precisa ser reconectada com humildade e prática.",
      ],
      geral: [
        "O Mago invertido pede atenção para o uso do poder. Seja o próprio poder sendo mal utilizado ou o poder de outros sendo direcionado de forma prejudicial à sua vida. Clareza de intenções é urgente.",
        "Esta carta invertida também pode indicar bloqueio na expressão das capacidades. Algo está impedindo que seu potencial se manifeste — pode ser medo, descrença ou influências externas limitantes.",
      ],
    },
  },
  "A Papisa": {
    upright: {
      amor: [
        "A Papisa no amor pede silêncio e paciência. Nem tudo precisa ser dito ou resolvido agora — às vezes o amor mais profundo se desenvolve no espaço do mistério e da espera. Confie na sua intuição sobre essa pessoa ou situação afetiva. Ela sabe mais do que imagina.",
        "Em questões amorosas, A Papisa sugere que há mais acontecendo do que aparece na superfície. Segredos, camadas não reveladas, sentimentos não expressos fazem parte do quadro. Não pressione — deixe as coisas se revelarem no tempo certo.",
      ],
      trabalho: [
        "A Papisa no trabalho sugere um momento de observação antes da ação. Há informações que ainda não chegaram até você e que são essenciais para tomar a decisão certa. Escute mais, fale menos. Sua intuição profissional é um guia valioso agora.",
        "Esta carta no trabalho também pode indicar que seu talento é mais reconhecido em silêncio do que em discursos. Sua competência fala por si — não há necessidade de se afirmar com força. O momento pede profundidade, não volume.",
      ],
      saude: [
        "A Papisa na saúde convida a ouvir os sinais sutis do corpo com mais atenção. Seu corpo está comunicando algo importante — talvez em forma de intuições, sonhos ou sintomas físicos que pedem interpretação mais profunda. Terapias complementares e abordagens integrativas são favorecidas.",
        "Esta carta também fala do poder do inconsciente na saúde. Padrões emocionais não resolvidos podem estar influenciando o bem-estar físico. Psicoterapia, meditação e práticas de autorevelação podem trazer insights curativos.",
      ],
      financas: [
        "A Papisa nas finanças pede cautela e coleta de informações antes de agir. Não tome decisões financeiras importantes baseadas apenas no que aparece na superfície. Pesquise, investigue, ouça especialistas. A paciência agora protege seu patrimônio.",
        "Esta carta financeira também indica que há recursos ou oportunidades ainda ocultos que se revelarão no tempo certo. Não é momento de agir impulsivamente — é momento de aguardar com discernimento.",
      ],
      espiritual: [
        "A Papisa é uma das cartas mais espirituais do baralho. Ela representa o acesso direto ao conhecimento sagrado interior — aquela voz profunda que sabe a verdade antes que a mente a processe. Você está sendo chamado a aprofundar sua vida espiritual, a sentar em silêncio e a ouvir.",
        "Espiritualmente, A Papisa simboliza os mistérios iniciáticos — o conhecimento que não pode ser ensinado, apenas vivido. Um momento de revelação interior, de acesso a dimensões mais profundas da consciência, está se aproximando ou já está acontecendo.",
      ],
      geral: [
        "A Papisa pede que você confie mais na sua intuição. Há uma sabedoria interna que está disponível para você nesse momento — mas ela exige silêncio, pausa e atenção. Resista à pressão de decidir rápido ou de se explicar para todos.",
        "Esta carta fala de paciência e de confiança no processo. Nem tudo que você deseja saber está disponível agora, e tudo bem. A revelação virá no momento certo, e quando vier, você estará preparado para recebê-la.",
      ],
    },
    reversed: {
      amor: [
        "A Papisa invertida no amor pode indicar segredos prejudiciais, mentiras ou informações sendo deliberadamente ocultadas. Há algo nessa relação que não está sendo dito e que precisa vir à luz para que uma base saudável seja possível.",
        "Invertida em questões afetivas, também pode apontar para intuições sendo ignoradas. Você provavelmente já sente que algo não está certo — mas está racionalizando em vez de agir a partir dessa percepção.",
      ],
      trabalho: [
        "A Papisa invertida no trabalho indica informações ocultas que estão afetando negativamente sua posição. Há movimentos acontecendo nos bastidores que você não tem acesso. Aumente sua percepção e procure fontes confiáveis de informação.",
        "Também pode indicar que sua intuição profissional está sendo bloqueada pelo excesso de análise ou pela pressão externa. Volte a confiar no seu julgamento interior.",
      ],
      saude: [
        "A Papisa invertida na saúde sugere que sinais importantes do corpo estão sendo ignorados ou mal interpretados. Preste mais atenção aos sintomas sutis antes que se tornem mais sérios. Busque uma segunda opinião médica se necessário.",
        "Esta carta invertida também pode apontar para resistência em olhar para as causas emocionais de um problema físico. O corpo fala — ouvi-lo com honestidade é o primeiro passo para a cura.",
      ],
      financas: [
        "A Papisa invertida nas finanças indica que informações importantes estão sendo ocultadas de você em uma negociação ou contrato. Leia as letras miúdas, questione o que parece ambíguo e não assine nada sem ter certeza.",
        "Invertida no campo financeiro, também pode indicar sabotagem de si mesmo — uma resistência inconsciente em olhar honestamente para a situação financeira. Conhecimento é poder: enfrente os números com coragem.",
      ],
      espiritual: [
        "A Papisa invertida espiritualmente aponta para desconexão da voz interior. O ego, as opiniões alheias ou o medo estão falando mais alto do que a própria intuição. Período de reencontro com a prática espiritual que genuinamente ressoa com sua alma.",
        "Esta carta invertida também pode indicar o uso do misticismo como fuga da realidade — usar a espiritualidade para evitar questões práticas que precisam de atenção. Integração entre o espiritual e o cotidiano é o que se pede.",
      ],
      geral: [
        "A Papisa invertida indica desconexão da sabedoria interior e possível exposição a informações falsas ou incompletas. Revise o que tem sido tomado como verdade sem questionamento.",
        "Esta carta invertida também pode apontar para impaciência — querer respostas antes que o processo madure. Forçar o ritmo agora pode causar mais danos do que a espera cuidadosa.",
      ],
    },
  },
  "A Imperatriz": {
    upright: {
      amor: [
        "A Imperatriz no amor é uma das cartas mais amorosas e férteis do baralho. Ela representa amor que nutre, cuida, alimenta e cresce. Um relacionamento governado por essa energia tem calor genuíno, sensualidade, afeto profundo e disposição de construir junto. Se está sozinho, amor está se aproximando.",
        "Em questões afetivas, A Imperatriz convida a amar com generosidade e a se deixar amar sem bloqueios. A vulnerabilidade que ela representa não é fraqueza — é a maior força em um relacionamento. Abra o coração para dar e receber plenamente.",
      ],
      trabalho: [
        "A Imperatriz no trabalho traz energia criativa abundante. É uma carta excelente para projetos que envolvem arte, estética, comunicação, cuidado, culinária, moda, natureza ou qualquer área relacionada ao feminino sagrado. Sua criatividade está em seu pico — use isso.",
        "Esta carta no campo profissional também indica que seu ambiente de trabalho pode se tornar mais próspero e fértil. Novas oportunidades, crescimento de projetos existentes e reconhecimento pelo cuidado que você coloca no seu trabalho.",
      ],
      saude: [
        "A Imperatriz na saúde é profundamente positiva. Ela representa o corpo em sua plenitude — conectado à natureza, bem nutrido, descansado e em equilíbrio. Convida a cuidar do corpo como um templo sagrado: alimentação natural, descanso, prazer sensorial, contato com a terra.",
        "Esta carta na saúde também fala de fertilidade e ciclos naturais. Para mulheres, pode indicar um momento favorável relacionado a questões femininas. Para todos, aponta para a importância de respeitar os próprios ciclos de energia e regeneração.",
      ],
      financas: [
        "A Imperatriz nas finanças é um sinal de abundância e crescimento. O que você planta agora tem grandes chances de prosperar. Investimentos em beleza, nutrição, bem-estar, arte e produtos naturais são especialmente favorecidos.",
        "Esta carta financeira também indica que a prosperidade vem através da generosidade e do compartilhamento. Quanto mais você circula o que tem com intenção de nutrir, mais retorna multiplicado.",
      ],
      espiritual: [
        "A Imperatriz espiritualmente representa a Grande Mãe — a força criadora de tudo que existe. Você está sendo convidado a reconectar com a espiritualidade da natureza, com os ciclos lunares, com as estações e com a magia do cotidiano.",
        "Esta carta espiritual também fala de abundância interior — a riqueza que emerge quando estamos alinhados com nossa essência criativa e com o fluxo da vida. Um período de florescimento espiritual rico em presentes e revelações.",
      ],
      geral: [
        "A Imperatriz anuncia um período de fertilidade, crescimento e abundância. O que foi plantado com cuidado e amor começa a florescer. Esta é uma das cartas mais promissoras do baralho — ela traz a energia da vida se manifestando plenamente.",
        "Esta carta lembra que cuidar de si mesmo não é egoísmo, é sabedoria. Quando você está nutrido e florescendo, tem muito mais para oferecer ao mundo. Invista em você — corpo, alma, criatividade e bem-estar.",
      ],
    },
    reversed: {
      amor: [
        "A Imperatriz invertida no amor pode indicar dependência emocional sufocante ou dificuldade em dar ao outro o espaço que precisa. O cuidado excessivo pode se tornar controle. Revise se seus padrões afetivos nutrem ou aprisionam.",
        "Invertida em questões amorosas, também pode apontar para negligência afetiva — um relacionamento que não está recebendo o cuidado e a atenção que merece. O amor precisa ser regado.",
      ],
      trabalho: [
        "A Imperatriz invertida no trabalho pode indicar bloqueio criativo, procrastinação ou um período onde os projetos não estão florescendo como esperado. Reveja o ambiente de trabalho — ele nutre ou drena sua criatividade?",
        "Também pode indicar dificuldades em projetos relacionados a criatividade, arte ou cuidado. As sementes foram plantadas, mas o solo precisa de mais atenção e nutrição.",
      ],
      saude: [
        "A Imperatriz invertida na saúde pede atenção especial ao autocuidado. Você está negligenciando o corpo — seja por excesso de trabalho, stress ou falta de limites. O corpo está pedindo pausa, nutrição e descanso real.",
        "Esta carta invertida também pode apontar para questões relacionadas à fertilidade, ao sistema hormonal feminino ou a desequilíbrios que têm origem em emoções não processadas.",
      ],
      financas: [
        "A Imperatriz invertida nas finanças indica gastos excessivos em supérfluos ou uma relação com o dinheiro baseada em compensação emocional. Comprar para preencher vazios afetivos é um padrão que precisa ser reconhecido.",
        "Também pode indicar que abundância que poderia estar chegando está sendo bloqueada por crenças de inmerecimento ou por falta de cuidado com o que já se tem.",
      ],
      espiritual: [
        "A Imperatriz invertida espiritualmente aponta para desconexão da natureza e dos próprios ciclos. O ritmo frenético moderno está cortando o fio que une o espiritual ao natural. Voltar ao simples — terra, plantas, silêncio, rituais cotidianos — é urgente.",
        "Esta carta invertida também pode indicar bloqueio na expressão criativa espiritual. Há uma fonte de sabedoria e beleza em você que está reprimida e precisa fluir.",
      ],
      geral: [
        "A Imperatriz invertida pede que você olhe para onde está negligenciando cuidado — consigo mesmo, com seus projetos, com seus relacionamentos. O que não é nutrido definha.",
        "Esta carta invertida também pode indicar um período de menor prosperidade que serve de convite para revisar a relação com a abundância e o merecimento.",
      ],
    },
  },
  "O Imperador": {
    upright: {
      amor: [
        "O Imperador no amor representa estabilidade, proteção e compromisso. Um parceiro que aparece com essa energia é confiável, responsável e capaz de criar uma base sólida para o relacionamento. Se está sozinho, pode indicar que você precisa ser mais estruturado em suas escolhas afetivas.",
        "Em questões amorosas, O Imperador também pode apontar para a necessidade de estabelecer limites claros no relacionamento. Estrutura e regras combinadas entre o casal fortalecem em vez de enrijecer.",
      ],
      trabalho: [
        "O Imperador no trabalho é uma carta de liderança e autoridade. Você está no momento certo para assumir posições de maior responsabilidade, para liderar equipes e para estruturar processos. Sua capacidade organizacional é seu maior trunfo agora.",
        "Esta carta no campo profissional também indica que disciplina e consistência são as chaves para o sucesso atual. Não há atalho — há construção metódica e duradoura.",
      ],
      saude: [
        "O Imperador na saúde fala de estrutura e disciplina. Rotinas saudáveis, constância nos exercícios, horários regulares de sono e alimentação — esses pilares são essenciais agora. A saúde precisa de estrutura para prosperar.",
        "Esta carta também pode indicar a presença de um médico ou terapeuta com autoridade e experiência que pode oferecer o suporte necessário.",
      ],
      financas: [
        "O Imperador nas finanças é excelente — representa capacidade de construir patrimônio sólido com disciplina e planejamento. Organize seu orçamento, tenha um plano financeiro claro e execute-o com consistência. Resultados concretos vêm para quem age com método.",
        "Esta carta financeira também favorece negociações com autoridade, investimentos em estrutura (imóveis, negócios sólidos) e tomada de decisões firmes.",
      ],
      espiritual: [
        "O Imperador espiritualmente representa a força do pai — a estrutura que sustenta o crescimento espiritual. Convida a estabelecer uma prática espiritual consistente e disciplinada, em vez de buscar experiências intensas e passageiras.",
        "Esta carta espiritual também fala da integração da espiritualidade com a vida prática — de ser um ser espiritual no mundo material, com responsabilidade e integridade.",
      ],
      geral: [
        "O Imperador anuncia um período de estruturação e consolidação. É hora de organizar, planejar e construir com método. Tudo que foi sendo postergado ou deixado à solta precisa ganhar forma e ordem agora.",
        "Esta carta fala de força, liderança e responsabilidade. Você tem a capacidade de criar resultados concretos e duradouros quando age com determinação e planejamento.",
      ],
    },
    reversed: {
      amor: [
        "O Imperador invertido no amor pode indicar autoritarismo, controle excessivo ou rigidez que sufoca o relacionamento. Há uma necessidade de ter razão que prejudica a conexão real. Trabalhe a capacidade de ceder sem perder a essência.",
        "Invertido em questões afetivas, também pode apontar para imaturidade emocional mascarada de força. Dificuldade em assumir responsabilidade pelos próprios erros dentro do relacionamento.",
      ],
      trabalho: [
        "O Imperador invertido no trabalho indica conflitos com figuras de autoridade, abuso de poder ou falta de estrutura que compromete os resultados. Reveja como você exerce ou recebe autoridade no ambiente profissional.",
        "Também pode indicar rigidez que impede adaptação — um apego a formas antigas de fazer as coisas que não funciona mais no contexto atual.",
      ],
      saude: [
        "O Imperador invertido na saúde aponta para falta de disciplina com hábitos saudáveis ou para o extremo oposto — rigidez e controle obsessivo com a saúde. Equilíbrio é a palavra-chave.",
        "Esta carta invertida também pode indicar problemas ósseos, articulares ou relacionados a estruturas do corpo — metáforas físicas para o que precisa ser mais flexível ou mais firme.",
      ],
      financas: [
        "O Imperador invertido nas finanças indica desorganização, falta de planejamento ou abuso de autoridade em questões financeiras. Alguém pode estar exercendo controle indevido sobre seus recursos.",
        "Também pode apontar para rigidez que impede crescimento — apego a formas antigas de gerar ou guardar dinheiro que não funcionam mais.",
      ],
      espiritual: [
        "O Imperador invertido espiritualmente pode indicar dogmatismo — apego a doutrinas rígidas que impedem o crescimento espiritual genuíno. A espiritualidade verdadeira tem estrutura mas também tem movimento e adaptação.",
        "Esta carta invertida também pode apontar para dificuldades com a figura do pai ou com figuras de autoridade que influenciaram negativamente a jornada espiritual.",
      ],
      geral: [
        "O Imperador invertido pede revisão de como você lida com autoridade e estrutura — seja a própria, seja a de outros. Equilíbrio entre firmeza e flexibilidade é o que o momento exige.",
        "Esta carta invertida também indica que a falta de planejamento está gerando problemas que poderiam ser evitados. Hora de assumir as rédeas com mais responsabilidade.",
      ],
    },
  },
  "A Papessa": {
    upright: {
      amor: ["Em questões de amor, A Papessa convida à paciência e à profundidade. O verdadeiro amor não se revela na superfície — ele se aprofunda com o tempo e com a honestidade.", "Esta carta no amor fala de uma conexão que vai além do superficial. Há laços espirituais e emocionais profundos a serem cultivados com cuidado e respeito mútuo."],
      trabalho: ["No trabalho, A Papessa indica que o momento exige observação e acúmulo de conhecimento antes da ação. Estude, pesquise, aprofunde-se — sua hora de agir chegará mais fortalecida.", "Esta carta profissional também fala de trabalho nos bastidores que está sendo mais valioso do que parece. Sua contribuição silenciosa tem mais impacto do que imagina."],
      saude: ["A Papessa na saúde convida à atenção aos sinais sutis do organismo. Pratique a escuta interna.", "Esta carta na saúde favorece terapias integrativas, meditação e práticas que trabalham a conexão mente-corpo."],
      financas: ["Nas finanças, A Papessa pede pesquisa profunda antes de qualquer decisão. O que parece claro pode ter camadas que precisam ser investigadas.", "Esta carta financeira também pode indicar recursos ocultos ou oportunidades que ainda não se revelaram completamente."],
      espiritual: ["A Papessa é a carta da sacerdotisa interior. Representa o acesso direto ao sagrado através do silêncio, da contemplação e da escuta profunda.", "Espiritualmente, você está sendo iniciado em novos mistérios. Confie no processo, mesmo que não compreenda tudo ainda."],
      geral: ["A Papessa pede silêncio e paciência. Nem tudo precisa ser resolvido agora — confie no ritmo natural das coisas.", "Esta carta indica um período de interiorização e acúmulo de sabedoria que se revelará muito valioso em breve."],
    },
    reversed: {
      amor: ["A Papessa invertida no amor indica segredos que estão prejudicando a relação ou intuições importantes sendo ignoradas.", "Invertida em questões afetivas, aponta para desconexão da própria sabedoria interior sobre o relacionamento."],
      trabalho: ["A Papessa invertida no trabalho indica informações ocultas que estão impactando negativamente sua posição. Investigue antes de agir.", "Também pode apontar para conhecimento não aplicado ou habilidades subutilizadas."],
      saude: ["A Papessa invertida na saúde sugere que sinais do corpo estão sendo ignorados. Não postergue cuidados necessários.", "Esta carta invertida também pode indicar resistência em olhar para as causas emocionais de questões físicas."],
      financas: ["A Papessa invertida nas finanças indica informações incompletas em uma negociação importante. Busque mais dados antes de decidir.", "Também pode apontar para oportunidades financeiras sendo perdidas por falta de pesquisa e aprofundamento."],
      espiritual: ["A Papessa invertida espiritualmente indica desconexão da intuição e da voz interior. O mundo externo está falando mais alto do que a sabedoria interna.", "Esta carta invertida também pode apontar para uso do misticismo como fuga em vez de ferramenta de autoconhecimento."],
      geral: ["A Papessa invertida indica que informações importantes estão sendo ocultadas ou que a intuição está sendo ignorada. Revise o que está tomando como verdade sem questionar.", "Esta carta invertida também pode apontar para impaciência que força respostas antes que o processo amadureça naturalmente."],
    },
  },
};

// ─── Dados por naipe (Arcanos Menores) ───────────────────────────────────────

interface SuitData {
  element: string;
  realm: string;
  upright: Record<Theme, string>;
  reversed: Record<Theme, string>;
}

const SUIT_DATA: Record<string, SuitData> = {
  copas: {
    element: "Água",
    realm: "emoções, relacionamentos, intuição, mundo interior",
    upright: {
      amor: "Os Copas no amor sempre trazem emoção genuína e profundidade afetiva. Esta carta do naipe de Copas indica que os sentimentos são reais e merecem atenção e cuidado.",
      trabalho: "No trabalho, os Copas indicam que a dimensão emocional está impactando o campo profissional. Questões de relacionamento com colegas, satisfação pessoal com o que faz ou intuição sobre o caminho a seguir estão em evidência.",
      saude: "Nos Copas, a saúde é vista pela lente emocional. Emoções não expressas ou relacionamentos não resolvidos podem estar afetando o bem-estar físico. Trabalhar o mundo interior é fundamental.",
      financas: "Os Copas nas finanças indicam que as decisões financeiras estão sendo influenciadas por emoções. Seja generosidade genuína ou gastos compensatórios, a emoção e o dinheiro estão entrelaçados.",
      espiritual: "Os Copas espiritualmente representam o fluxo do amor divino através da alma. É um convite a abrir o coração para receber e transmitir amor em suas formas mais elevadas.",
      geral: "Os Copas falam de emoções, relacionamentos e do mundo interior. Esta carta traz mensagens sobre sentimentos que precisam ser reconhecidos, expressos ou integrados.",
    },
    reversed: {
      amor: "Os Copas invertidos no amor indicam bloqueio emocional, medo de vulnerabilidade ou sentimentos reprimidos que estão impedindo conexões genuínas.",
      trabalho: "Invertidos no trabalho, os Copas apontam para desequilíbrio emocional que está afetando o desempenho profissional. Questões não resolvidas de relacionamento no ambiente de trabalho.",
      saude: "Os Copas invertidos na saúde indicam que emoções reprimidas estão se manifestando como sintomas físicos. Expressar e processar sentimentos é essencial para a recuperação.",
      financas: "Invertidos nas finanças, os Copas podem indicar gastos emocionais ou decisões financeiras baseadas em estados emocionais instáveis.",
      espiritual: "Os Copas invertidos espiritualmente apontam para fechamento do coração ou dificuldade em receber amor — seja humano ou divino.",
      geral: "Os Copas invertidos indicam emoções bloqueadas ou mal canalizadas que precisam de atenção e expressão adequada.",
    },
  },
  espadas: {
    element: "Ar",
    realm: "mente, conflito, verdade, comunicação, desafio",
    upright: {
      amor: "As Espadas no amor trazem clareza — às vezes dolorosa, mas necessária. Esta carta indica que a verdade precisa ser dita ou que uma decisão difícil, mas correta, está sendo chamada.",
      trabalho: "No trabalho, as Espadas indicam um período de desafios, conflitos ou cortes necessários. Há situações que pedem decisão firme e clareza mental, mesmo que o processo seja difícil.",
      saude: "Nas Espadas, a saúde está relacionada à mente — stress, ansiedade, padrões de pensamento negativos ou decisões difíceis que impactam o bem-estar. A clareza mental é fundamental para a saúde.",
      financas: "As Espadas nas finanças indicam que decisões difíceis e cortes necessários precisam ser feitos. Clareza e coragem para enfrentar a realidade financeira são urgentes.",
      espiritual: "As Espadas espiritualmente representam o poder discriminativo da mente — a capacidade de separar o real do ilusório, a verdade da ilusão. Um processo de clarificação espiritual pode ser intenso mas libertador.",
      geral: "As Espadas falam de mente, verdade e desafio. Esta carta indica que há uma situação que pede clareza, decisão e coragem para enfrentar a realidade sem rodeios.",
    },
    reversed: {
      amor: "As Espadas invertidas no amor indicam comunicação bloqueada, conflitos não resolvidos ou crueldade velada que precisa ser reconhecida e tratada.",
      trabalho: "Invertidas no trabalho, as Espadas apontam para conflitos não resolvidos, comunicação agressiva ou decisões sendo postergadas de forma prejudicial.",
      saude: "As Espadas invertidas na saúde indicam agitação mental excessiva, insônia ou ansiedade que precisa de atenção urgente.",
      financas: "Invertidas nas finanças, as Espadas podem indicar perdas que estão sendo negadas ou decisões difíceis que estão sendo evitadas.",
      espiritual: "As Espadas invertidas espiritualmente apontam para pensamentos negativos ou crenças limitantes que estão bloqueando o crescimento espiritual.",
      geral: "As Espadas invertidas indicam conflito interno ou externo não resolvido que precisa de atenção e clareza para ser superado.",
    },
  },
  ouros: {
    element: "Terra",
    realm: "matéria, prosperidade, corpo, trabalho prático, recursos",
    upright: {
      amor: "Os Ouros no amor falam de um amor que se manifesta no plano concreto — através de atos de cuidado, suporte prático, construção de vida material juntos. Esta carta convida a expressar amor através de ações e comprometimento concreto.",
      trabalho: "No trabalho, os Ouros são excelentes — indicam produtividade, resultados concretos e crescimento material. Seu esforço está sendo reconhecido e os frutos do trabalho começam a se manifestar.",
      saude: "Nos Ouros, a saúde é vista pelo plano físico — cuidados concretos com o corpo, alimentação, exercícios e rotinas saudáveis. Esta carta favorece recuperação e vitalidade quando há cuidado prático.",
      financas: "Os Ouros nas finanças são sempre positivos para questões materiais. Indicam prosperidade, solidez, crescimento financeiro e bom julgamento em questões de dinheiro e recursos.",
      espiritual: "Os Ouros espiritualmente representam a sacralidade da matéria — encontrar o divino no cotidiano, no trabalho bem feito, no cuidado com o corpo e com a terra.",
      geral: "Os Ouros falam de manifestação no plano concreto — de resultados, recursos e prosperidade material. Esta carta indica que esforços práticos estão dando frutos.",
    },
    reversed: {
      amor: "Os Ouros invertidos no amor indicam materialismo que sufoca o afeto, ou um relacionamento onde o foco excessivo no prático deixa o emocional de lado.",
      trabalho: "Invertidos no trabalho, os Ouros apontam para estagnação, queda de produtividade ou perdas materiais que precisam de atenção imediata.",
      saude: "Os Ouros invertidos na saúde indicam negligência com o corpo ou falta de recursos para cuidados necessários.",
      financas: "Invertidos nas finanças, os Ouros podem indicar perdas, mau uso de recursos ou uma fase de menor prosperidade que exige ajuste.",
      espiritual: "Os Ouros invertidos espiritualmente apontam para materialismo excessivo ou dificuldade em encontrar o sagrado no cotidiano.",
      geral: "Os Ouros invertidos indicam problemas no plano material — financeiro, físico ou prático — que precisam de atenção e ajuste.",
    },
  },
  paus: {
    element: "Fogo",
    realm: "fogo, criatividade, ambição, energia vital, ação",
    upright: {
      amor: "Os Paus no amor trazem paixão, vitalidade e energia criativa para o relacionamento. Esta carta indica um amor apaixonado, com muita atração e energia compartilhada, mas que também precisa de direção.",
      trabalho: "No trabalho, os Paus são a carta do empreendedorismo e da criatividade em ação. Seu fogo interior está aceso e pronto para criar, inovar e liderar. Use essa energia com direção.",
      saude: "Nos Paus, a saúde está relacionada à energia vital e ao fogo interior. Quando estão em equilíbrio, trazem vitalidade e vigor. Esta carta convida a cuidar da sua energia e entusiasmo.",
      financas: "Os Paus nas finanças indicam crescimento através da iniciativa e da criatividade. Novas fontes de renda ou projetos empreendedores têm boas chances de prosperidade.",
      espiritual: "Os Paus espiritualmente representam o fogo do espírito — a força vital que anima a busca, o entusiasmo pela vida e o desejo de crescer e evoluir.",
      geral: "Os Paus falam de fogo, iniciativa e ação criativa. Esta carta convida ao movimento, à ousadia e ao uso positivo da própria energia e entusiasmo.",
    },
    reversed: {
      amor: "Os Paus invertidos no amor indicam paixão que queima de forma destrutiva, ego em conflito ou energia dispersa que não cria conexão real.",
      trabalho: "Invertidos no trabalho, os Paus apontam para bloqueio criativo, projetos estagnados ou energia sendo desperdiçada em conflitos improdutivos.",
      saude: "Os Paus invertidos na saúde indicam esgotamento da energia vital, burnout ou uso excessivo do fogo interior sem recarga adequada.",
      financas: "Invertidos nas finanças, os Paus podem indicar projetos que não decolam ou energia empreendedora mal direcionada que gera gastos sem retorno.",
      espiritual: "Os Paus invertidos espiritualmente apontam para perda de entusiasmo na jornada espiritual ou para o ego espiritual — usar a espiritualidade para se sentir superior.",
      geral: "Os Paus invertidos indicam fogo que perdeu direção — energia bloqueada ou mal canalizada que precisa encontrar um propósito claro.",
    },
  },
};

// ─── Síntese de múltiplas cartas ─────────────────────────────────────────────

function getSynthesis(cards: CardInput[], theme: Theme): string {
  const count = cards.length;
  if (count === 1) {
    return "Esta única carta carrega toda a força da mensagem. Ela não deixa dúvida sobre o que precisa ser visto, compreendido e integrado nesse momento da sua jornada.";
  }
  if (count === 3) {
    const syntheses: Record<Theme, string[]> = {
      amor: [
        "Juntas, essas três cartas contam a história completa do seu momento afetivo — de onde veio, onde está e para onde pode ir. O amor que você busca ou que está construindo tem uma trajetória clara se você ouvir e agir a partir dessa orientação.",
        "A leitura das três cartas juntas revela um padrão importante em seu mundo afetivo. O fio que conecta as três mensagens aponta para uma transformação que o amor está convidando você a fazer — interna antes de externa.",
      ],
      trabalho: [
        "As três cartas em conjunto desenham o panorama atual da sua vida profissional com clareza. Há um movimento acontecendo que, quando compreendido, pode ser direcionado de forma muito mais efetiva.",
        "A sequência dessas três cartas no campo profissional revela tanto os recursos que você já tem quanto os que ainda precisam ser desenvolvidos para que seus objetivos se concretizem.",
      ],
      saude: [
        "As três cartas juntas revelam um retrato completo do seu bem-estar — não apenas físico, mas emocional e energético. A saúde plena que você busca emerge quando todos esses aspectos são cuidados com atenção.",
        "A sequência dessas três cartas no campo da saúde aponta para uma jornada de recuperação e equilíbrio que tem tanto desafios quanto recursos poderosos. Siga as orientações com constância.",
      ],
      financas: [
        "As três cartas juntas pintam um quadro claro da sua situação financeira atual e das possibilidades que se desenham. Há mais opções do que parece quando você olha com essa perspectiva mais ampla.",
        "A sequência financeira dessas três cartas revela padrões que estão influenciando sua prosperidade — alguns para manter, outros para transformar.",
      ],
      espiritual: [
        "Essas três cartas juntas são como os três portais de uma iniciação espiritual — cada uma abre uma dimensão diferente da sua jornada interior. A mensagem integrada é profunda e merece contemplação.",
        "A tríade dessas cartas na jornada espiritual revela o estado da sua alma em múltiplos níveis — o que está sendo liberado, o que está se manifestando e o que está sendo chamado para integrar.",
      ],
      geral: [
        "A leitura das três cartas em conjunto revela uma história coerente e significativa. Há um fio condutor que conecta passado, presente e possibilidade futura de forma muito clara.",
        "Essas três cartas juntas formam um mapa precioso para o momento que você está vivendo. A sabedoria de cada uma se amplia quando vista em relação às outras duas.",
      ],
    };
    const options = syntheses[theme];
    return options[Math.floor(Math.random() * options.length)];
  }
  if (count === 5) {
    const syntheses: Record<Theme, string[]> = {
      amor: ["Com cinco cartas reveladas, o quadro afetivo se mostra em toda sua complexidade e riqueza. Cada carta adicionou uma camada essencial de compreensão. O amor é sempre uma jornada de autoconhecimento — e essa leitura confirma isso com clareza.", "A leitura completa de cinco cartas sobre seu campo amoroso revela não apenas o que está acontecendo, mas por que está acontecendo e o que está sendo chamado para mudar ou fortalecer."],
      trabalho: ["Cinco cartas sobre sua situação profissional formam um diagnóstico poderoso. Há aspectos do passado que explicam o presente, desafios que estão forjando novas capacidades e um futuro que pede passos concretos agora.", "Esta leitura completa sobre sua carreira revela múltiplas dimensões de um momento de transformação profissional. As orientações presentes nessas cinco cartas, seguidas com sabedoria, podem mudar o curso da sua trajetória."],
      saude: ["Cinco perspectivas sobre sua saúde formam um panorama integrador. Corpo, mente, emoções, hábitos e perspectivas futuras estão todos representados. A saúde plena emerge quando todos esses aspectos são harmonizados.", "Esta leitura ampla sobre seu bem-estar revela a complexidade do que você está vivendo — e também a riqueza dos recursos que você tem para atravessar esse período com mais saúde e consciência."],
      financas: ["Cinco cartas sobre finanças oferecem uma visão estratégica completa. Do passado que moldou sua relação com o dinheiro, ao presente com seus desafios e recursos, até as possibilidades que se desenham, essa leitura ilumina o caminho da prosperidade.", "A leitura completa financeira com cinco cartas revela padrões profundos e abre perspectivas. As transformações que estão sendo pedidas, quando realizadas, têm potencial de mudança duradoura na sua vida material."],
      espiritual: ["Cinco portais espirituais se abriram para você nessa leitura. Cada carta tocou em um aspecto diferente da sua jornada de alma. A mensagem integrada é rica, profunda e merece tempo de contemplação e aplicação.", "Esta leitura espiritual ampla revela o estado evolutivo da sua alma com precisão e compaixão. Há desafios que são iniciações e recursos que estão esperando para ser ativados."],
      geral: ["Com cinco cartas, o quadro da sua situação se revela em toda sua profundidade e dimensionalidade. Há muito mais acontecendo do que aparece na superfície — e essa leitura ajuda a navegar esse terreno com mais clareza.", "A leitura completa de cinco cartas oferece um mapa abrangente do momento que você está vivendo. Cada aspecto — passado, desafio, conselho, influências — foi iluminado pelas cartas com precisão."],
    };
    const options = syntheses[theme];
    return options[Math.floor(Math.random() * options.length)];
  }
  return "As cartas juntas formam uma mensagem coerente e significativa sobre o momento que você está vivendo.";
}

// ─── Orientação final ─────────────────────────────────────────────────────────

function getFinalOrientation(theme: Theme, hasReversed: boolean): string {
  const orientations: Record<Theme, string[]> = {
    amor: [
      "O amor verdadeiro — seja por si mesmo ou por outro — sempre encontra seu caminho quando somos honestos com o que realmente sentimos e desejamos. Que essa leitura ilumine não apenas o relacionamento, mas o que você precisa crescer dentro de si para que o amor floresça em sua melhor versão.",
      "Lembre-se: o Tarot não determina seu destino — ele ilumina o que já existe. O poder de transformar sua vida afetiva está em suas mãos. Use a sabedoria dessas cartas como bússola, não como sentença.",
    ],
    trabalho: [
      "Sua jornada profissional é também uma jornada de autodescoberta. Que essas cartas te ajudem a ver com clareza onde investir energia, o que soltar e quais passos dar com mais coragem e intenção.",
      "O trabalho que serve ao mundo e ao mesmo tempo te realiza existe — e as cartas indicaram pistas importantes sobre como chegar lá. Siga as orientações com ação concreta e persistência.",
    ],
    saude: [
      "A saúde plena é uma dança entre corpo, mente e espírito. Que as mensagens dessas cartas te inspire a cuidar de todas essas dimensões com carinho, constância e inteligência.",
      "O corpo é sagrado e merece atenção amorosa. Que essa leitura te apoie a criar escolhas mais saudáveis e sustentáveis, não por obrigação, mas por amor genuíno a si mesmo.",
    ],
    financas: [
      "A prosperidade verdadeira nasce de dentro — de crenças, de hábitos e de uma relação saudável com o que você tem e com o que deseja criar. Que essas cartas abram novos caminhos para sua relação com a abundância.",
      "Lembre-se: riqueza não é apenas dinheiro. É tempo, saúde, relacionamentos e paz interior. Que essa leitura te ajude a construir prosperidade em todas as suas formas.",
    ],
    espiritual: [
      "A jornada espiritual não tem destino final — ela é uma espiral que se aprofunda continuamente. Que as mensagens dessas cartas te acompanhem nos próximos passos desta sagrada jornada interior.",
      "Tudo o que você busca espiritual já está dentro de você, esperando reconhecimento. Que essa leitura te ajude a remover os véus que ainda obscurecem a visão da sua própria luz.",
    ],
    geral: [
      "O Tarot não prevê um futuro fixo — ele revela as energias e tendências presentes para que você possa fazer escolhas mais conscientes. Use essa leitura como ferramenta de autoconhecimento e navegue com mais sabedoria.",
      "Que a sabedoria dessas cartas te acompanhe. Cada insight recebido é um convite à ação consciente — pequenas mudanças nos padrões de pensamento e comportamento que podem transformar toda uma trajetória.",
    ],
  };
  const options = orientations[theme];
  const base = options[Math.floor(Math.random() * options.length)];
  if (hasReversed) {
    return base + " As cartas invertidas que apareceram na sua tiragem não são mau presságio — são pontos de transformação que pedem atenção especial. Neles está escondido um dos maiores presentes dessa leitura.";
  }
  return base;
}

// ─── Interpretação individual de carta ───────────────────────────────────────

// ─── Interpretações específicas por carta (Arcanos Menores) ─────────────────
// Cada carta tem sua própria mensagem, não apenas a mensagem genérica do naipe.

const SPECIFIC_MINOR: Record<string, Record<Theme, string[]>> = {

  // ── PAUS ─────────────────────────────────────────────────────────────────
  "Ás de Paus": {
    financas: ["O Ás de Paus é uma centelha — uma ideia ou oportunidade nova está surgindo para transformar sua situação financeira. O potencial existe, mas ele precisa de ação. Não espere que o dinheiro venha; crie o movimento que o atrai.", "Uma nova iniciativa ou projeto tem o poder de mudar sua realidade financeira. O Ás de Paus convida você a confiar na faísca criativa que está dentro de você e agir com coragem."],
    trabalho: ["Uma nova fase profissional começa — seja um projeto, um cargo ou até um novo negócio. O Ás de Paus traz a energia do pioneirismo; é hora de apostar na sua ideia.", "Há uma oportunidade de trabalho ou empreendimento surgindo. O Ás de Paus diz: não deixe o medo apagar essa chama. Comece."],
    amor: ["Um novo amor ou uma renovação intensa está chegando. O Ás de Paus traz paixão, atração e o início excitante de uma conexão que pode transformar sua vida afetiva.", "A faísca do desejo e da conexão se acende. O Ás de Paus indica que há espaço para um novo amor entrar — ou para reignitar o que já existe."],
    saude: ["O Ás de Paus traz energia vital renovada. É um bom momento para começar uma nova rotina de cuidado com o corpo — exercício, alimentação ou prática terapêutica.", "Uma nova abordagem à saúde pode transformar seu bem-estar. O Ás de Paus traz disposição e vontade de recomeçar."],
    espiritual: ["Uma nova jornada espiritual se abre. O Ás de Paus é a chama do despertar — algo novo em sua busca interior está começando.", "A centelha divina em você está se acendendo. O Ás de Paus convida a um novo início no caminho espiritual — uma prática, um estudo, uma iluminação."],
    geral: ["O Ás de Paus traz a energia do começo puro — uma oportunidade, uma ideia, uma faísca. A mensagem é: aja agora, antes que o momento passe.", "Uma nova fase começa com força e criatividade. O Ás de Paus pede que você confie em sua iniciativa e dê o primeiro passo."],
  },
  "Dois de Paus": {
    financas: ["O Dois de Paus mostra alguém que já deu um primeiro passo e agora precisa decidir o caminho. Há duas direções financeiras à sua frente — analise antes de escolher.", "Você está em um ponto de bifurcação financeira. O Dois de Paus indica que há poder em suas mãos, mas a expansão real exige que você escolha e se comprometa com um caminho."],
    trabalho: ["O Dois de Paus indica que você está no início de uma expansão — talvez planejando um novo projeto ou considerando uma parceria. Mantenha o foco na visão de longo prazo.", "Há uma decisão profissional importante se aproximando. O Dois de Paus diz: você tem o poder, agora use-o com estratégia."],
    amor: ["Você está na encruzilhada do amor — avaliando se um relacionamento tem futuro ou se há algo novo no horizonte. O Dois de Paus pede honestidade com você mesmo.", "O Dois de Paus traz uma pausa reflexiva no amor. Antes de avançar, certifique-se de que seus planos e os da outra pessoa estão alinhados."],
    saude: ["O Dois de Paus sugere um momento de avaliação da saúde — talvez entre dois tratamentos ou abordagens. Busque informação antes de decidir.", "Há uma decisão sobre saúde ou bem-estar que precisa ser tomada com calma. O Dois de Paus pede planejamento, não pressa."],
    espiritual: ["O Dois de Paus indica um momento de contemplação espiritual — você está entre dois caminhos ou sistemas de crença. Reserve tempo para sentir, não apenas pensar.", "Você está expandindo sua perspectiva espiritual. O Dois de Paus convida a olhar além do familiar e a planejar uma jornada interior mais profunda."],
    geral: ["O Dois de Paus indica que você está no ponto de partida de algo maior. Há poder em suas mãos — mas é preciso escolher a direção e se comprometer.", "Uma decisão importante está à sua frente. O Dois de Paus pede visão estratégica e coragem para se expandir."],
  },
  "Três de Paus": {
    financas: ["O Três de Paus mostra que os primeiros investimentos ou esforços estão começando a dar frutos. Aguarde com confiança — o que você plantou está crescendo.", "Há sinais de progresso financeiro vindo do horizonte. O Três de Paus indica expansão — talvez de um negócio, uma nova fonte de renda ou um projeto que começou a se firmar."],
    trabalho: ["O Três de Paus indica que seus projetos estão avançando. Há colaborações e oportunidades chegando — esteja aberto para parcerias e expansões profissionais.", "Você está vendo os primeiros resultados do seu esforço. O Três de Paus convida a continuar com confiança — o sucesso está se construindo."],
    amor: ["O Três de Paus traz expansão no amor — talvez um relacionamento se aprofundando, uma decisão de seguir em frente ou novas possibilidades surgindo.", "O amor está se expandindo. O Três de Paus pode indicar uma nova fase em um relacionamento ou a chegada de alguém que amplia seus horizontes afetivos."],
    saude: ["O Três de Paus indica progresso na saúde. Tratamentos ou mudanças de hábito estão trazendo resultados — continue no caminho.", "Há expansão de vitalidade chegando. O Três de Paus indica que suas ações de cuidado estão dando resultado — não desanime."],
    espiritual: ["O Três de Paus indica que sua jornada espiritual está se expandindo — novos conhecimentos, práticas ou mestres podem entrar em sua vida.", "Você está colhendo os primeiros frutos de uma jornada espiritual. O Três de Paus convida a avançar com confiança."],
    geral: ["O Três de Paus traz a energia da expansão e do progresso. Algo que você iniciou está crescendo — confie no processo.", "Os primeiros resultados estão chegando. O Três de Paus pede que você continue com confiança e olhe para o horizonte com otimismo."],
  },
  "Quatro de Paus": {
    financas: ["O Quatro de Paus traz celebração e estabilidade conquistada. Há uma conquista financeira para comemorar — um patamar de segurança sendo alcançado.", "Este é um momento de estabilidade e colheita. O Quatro de Paus indica que o trabalho duro está se consolidando em fundações sólidas."],
    trabalho: ["O Quatro de Paus anuncia uma conquista profissional — uma entrega, uma promoção ou um projeto concluído com sucesso. Comemore.", "Há harmonia e reconhecimento no trabalho. O Quatro de Paus indica um período de celebração e estabilidade profissional."],
    amor: ["O Quatro de Paus é uma das cartas mais felizes para o amor — traz celebração, comprometimento e a alegria de um lar construído a dois.", "Um momento de celebração no amor está chegando. O Quatro de Paus indica festa, compromisso e a construção de algo sólido e feliz."],
    saude: ["O Quatro de Paus traz saúde estável e vitalidade recuperada. É um momento de celebrar o bem-estar e solidificar novos hábitos saudáveis.", "Há estabilidade e harmonia na saúde. O Quatro de Paus convida a celebrar o equilíbrio conquistado."],
    espiritual: ["O Quatro de Paus indica chegada — um santuário interior, uma prática estável, uma celebração espiritual. Você encontrou uma base sólida.", "Uma fase de paz e integração espiritual. O Quatro de Paus convida a celebrar o caminho percorrido."],
    geral: ["O Quatro de Paus traz celebração, estabilidade e conquista. Um ciclo se completa com sucesso — comemore antes de seguir em frente.", "Há harmonia e alegria nesse momento. O Quatro de Paus pede que você reconheça o que foi conquistado."],
  },
  "Cinco de Paus": {
    financas: ["O Cinco de Paus indica uma disputa ou competição financeira. Há conflitos em torno de recursos, contratos ou oportunidades — é preciso defender seu espaço com estratégia.", "A situação financeira está tensa e competitiva. O Cinco de Paus pede que você não recue, mas também que não desperdice energia em batalhas desnecessárias."],
    trabalho: ["O Cinco de Paus mostra competição e conflito no ambiente de trabalho. Há discordâncias, disputas ou falta de cooperação — mantenha o foco no que realmente importa.", "O ambiente profissional está agitado. O Cinco de Paus pede discernimento para saber quais batalhas valem sua energia."],
    amor: ["O Cinco de Paus indica conflitos e desentendimentos no amor. Há tensão e competição — talvez ciúmes, brigas ou mal-entendidos precisando ser resolvidos.", "Há um período de conflito no amor. O Cinco de Paus pede que você e a outra pessoa decidam se preferem lutar um contra o outro ou juntos."],
    saude: ["O Cinco de Paus indica uma fase de resistência física — o corpo está lutando contra algo. Pode ser estresse, conflito interno ou um desafio de saúde que exige atenção.", "Há tensão no corpo. O Cinco de Paus pede que você reduza o conflito interno e externo que está consumindo sua energia vital."],
    espiritual: ["O Cinco de Paus mostra um conflito espiritual — dúvidas, batalhas internas ou choques de crença. Não fuja desse embate; ele é parte necessária do crescimento.", "A jornada espiritual passa por uma fase de teste e conflito. O Cinco de Paus convida a questionar, mas não a desistir."],
    geral: ["O Cinco de Paus indica tensão, conflito e competição. Há uma batalha sendo travada — o desafio é agir com estratégia, não com reatividade.", "Um período de turbulência e disputas. O Cinco de Paus pede foco e discernimento para navegar os conflitos sem perder energia."],
  },
  "Seis de Paus": {
    financas: ["O Seis de Paus é a carta da vitória — uma conquista financeira está chegando. Reconhecimento, sucesso e colheita de esforços anteriores se manifestam.", "Você está vencendo a batalha financeira. O Seis de Paus anuncia que o esforço e a persistência estão prestes a ser recompensados publicamente."],
    trabalho: ["O Seis de Paus traz reconhecimento e vitória profissional. Um projeto bem-sucedido, uma promoção ou elogio público está no horizonte.", "Há uma conquista profissional sendo celebrada. O Seis de Paus confirma que você está no caminho certo."],
    amor: ["O Seis de Paus traz uma fase de triunfo e celebração no amor — seja o início de uma relação especial ou o reconhecimento do valor dentro de um relacionamento existente.", "Há reciprocidade e vitória no amor. O Seis de Paus indica que você se sente visto e valorizado."],
    saude: ["O Seis de Paus anuncia recuperação e vitória na saúde. Um tratamento que estava difícil começa a mostrar resultados positivos.", "Há progresso significativo na saúde. O Seis de Paus é uma carta de triunfo — seu corpo está respondendo bem."],
    espiritual: ["O Seis de Paus indica um momento de clareza e conquista espiritual. Você superou um desafio interno e está em um novo patamar de consciência.", "Há uma vitória espiritual sendo celebrada. O Seis de Paus confirma que seu caminho está correto."],
    geral: ["O Seis de Paus anuncia triunfo e reconhecimento. Uma fase difícil passou e você sai vencedor — receba essa conquista com gratidão.", "Vitória e reconhecimento estão chegando. O Seis de Paus confirma que você está colhendo os frutos do esforço."],
  },
  "Sete de Paus": {
    financas: ["O Sete de Paus mostra que você está defendendo sua posição financeira contra pressões externas. Há desafios e competição, mas você tem o que é preciso para se manter.", "Você está sendo desafiado financeiramente por muitas frentes ao mesmo tempo. O Sete de Paus pede resiliência — defenda o que é seu sem deixar o medo paralisá-lo."],
    trabalho: ["O Sete de Paus indica que você está sendo desafiado no trabalho — talvez por concorrentes, críticos ou situações que exigem que você defenda suas ideias e posição.", "Há pressão no ambiente profissional. O Sete de Paus pede que você se mantenha firme e defenda sua visão com confiança."],
    amor: ["O Sete de Paus indica um momento de pressão no amor — talvez ciúmes de fora, julgamentos de terceiros ou a necessidade de defender a relação de interferências.", "Há desafios externos no amor. O Sete de Paus pede que você defenda o que sente com coragem, sem deixar que opiniões alheias contaminem a relação."],
    saude: ["O Sete de Paus indica um momento de resistência na saúde — o corpo está lutando, mas tem força. Mantenha os cuidados e não desanime.", "Há uma fase de resistência física ou emocional. O Sete de Paus pede que você persista nas práticas de saúde mesmo quando parecer difícil."],
    espiritual: ["O Sete de Paus mostra um momento de defesa espiritual — crenças sendo questionadas, ou a necessidade de manter sua fé diante de pressões do mundo.", "Você está defendendo sua jornada interior contra dúvidas e críticas externas. O Sete de Paus pede firmeza."],
    geral: ["O Sete de Paus indica resistência e defesa. Você está em posição de vantagem, mas precisa se manter firme diante das pressões que surgem.", "Há desafios que exigem coragem para defender sua posição. O Sete de Paus confirma que você tem a força necessária."],
  },
  "Oito de Paus": {
    financas: ["O Oito de Paus anuncia movimento rápido nas finanças — dinheiro em movimento, oportunidades surgindo rapidamente, contratos ou transações se concretizando.", "A situação financeira está se acelerando. O Oito de Paus pede que você esteja pronto para agir rápido — as oportunidades vêm e vão em alta velocidade agora."],
    trabalho: ["O Oito de Paus indica um período de intensa atividade profissional — projetos avançando, comunicações rápidas, viagens ou decisões que precisam ser tomadas com agilidade.", "Tudo está se movendo rápido no trabalho. O Oito de Paus pede foco e ação — agora não é hora de hesitar."],
    amor: ["O Oito de Paus pode indicar um novo amor chegando rapidamente, mensagens inesperadas ou um relacionamento que avança de forma acelerada.", "Há movimento rápido no amor. O Oito de Paus pode trazer notícias, encontros ou desenvolvimentos que surpreendem pela velocidade."],
    saude: ["O Oito de Paus traz recuperação rápida — tratamentos que começam a funcionar com velocidade. Há energia e movimento positivo no corpo.", "A saúde está em movimento de recuperação acelerada. O Oito de Paus indica que as mudanças estão acontecendo."],
    espiritual: ["O Oito de Paus indica uma fase de insights rápidos e revelações — como se as peças estivessem se encaixando com velocidade surpreendente.", "Há uma aceleração espiritual. O Oito de Paus traz revelações, clareza e movimento interior intenso."],
    geral: ["O Oito de Paus é velocidade pura — coisas que estavam estagnadas agora se movem com força. Esteja pronto para agir rápido.", "Movimento, velocidade e ação. O Oito de Paus indica que o momento de agir é agora."],
  },
  "Nove de Paus": {
    financas: ["O Nove de Paus mostra alguém que está exausto, mas ainda de pé. Você passou por muitos desafios financeiros e carrega as cicatrizes disso — mas ainda há reserva para continuar.", "Você está quase no fim de uma fase financeira difícil. O Nove de Paus pede perseverança — não desista quando já percorreu quase todo o caminho."],
    trabalho: ["O Nove de Paus indica cansaço profissional acumulado — você está guardado, defensivo e precavido depois de várias batalhas no trabalho.", "Você está resistindo com garra, mas sentindo o peso de uma fase longa e desafiadora no trabalho. O Nove de Paus pede que você não ceda à exaustão — o fim está próximo."],
    amor: ["O Nove de Paus traz a energia de quem já foi machucado e agora tem muros no coração. Há proteção excessiva que pode estar impedindo conexões verdadeiras.", "Há cansaço e desconfiança no amor. O Nove de Paus pede que você questione: os muros que ergueu ainda estão protegendo, ou estão aprisionando?"],
    saude: ["O Nove de Paus indica resistência física e emocional, mas também esgotamento acumulado. O corpo está pedindo mais descanso e cuidado.", "Você está resistindo, mas com custo alto de energia. O Nove de Paus pede atenção aos sinais de esgotamento antes que se tornem adoecimento."],
    espiritual: ["O Nove de Paus mostra uma fase de provação espiritual — você foi testado repetidamente e está cansado, mas mais sábio. A perseverança tem um propósito.", "Você está próximo de uma importante conclusão espiritual. O Nove de Paus pede que você não abandone a jornada agora."],
    geral: ["O Nove de Paus indica que você está chegando quase ao fim de uma fase difícil — não desista agora. A resiliência que você desenvolveu é um tesouro.", "Perseverança diante do cansaço. O Nove de Paus pede que você se mantenha firme — o fim da fase desafiadora está próximo."],
  },
  "Dez de Paus": {
    financas: ["O Dez de Paus revela o peso esmagador de responsabilidades financeiras acumuladas. Você carrega dívidas, compromissos ou obrigações que estão além do que pode sustentar sozinho. Esta carta não traz crescimento — traz o convite urgente a examinar o que pode ser delegado, renegociado ou simplesmente deixado para trás. Continuar carregando tudo sem ajuda levará ao colapso.", "Você está no limite. O Dez de Paus mostra que a carga financeira sobre seus ombros é enorme — talvez dívidas acumuladas, obrigações que não pediu para assumir, ou o peso de sustentar uma situação que não é mais viável. A questão não é trabalhar mais; é aprender a soltar o que não é seu para carregar."],
    trabalho: ["O Dez de Paus indica esgotamento no trabalho — responsabilidades excessivas, tarefas acumuladas e a sensação de que o fardo é grande demais. É hora de delegar, pedir ajuda ou repensar o que está carregando.", "Você assumiu mais do que deveria no trabalho. O Dez de Paus pede que você estabeleça limites — ninguém consegue carregar tudo sozinho por tempo indeterminado."],
    amor: ["O Dez de Paus no amor indica que um dos lados está carregando um fardo desproporcional na relação — responsabilidades, preocupações ou emoções que deveriam ser divididas.", "Você está carregando o relacionamento nas costas. O Dez de Paus pede um reequilíbrio — amor real divide o peso, não multiplica."],
    saude: ["O Dez de Paus é um alerta sério de esgotamento físico e emocional. O corpo está carregando um fardo enorme — estresse, tensões acumuladas, fadiga crônica. É hora de parar antes que o colapso force a parada.", "O peso que você carrega está adoecendo seu corpo. O Dez de Paus exige que você coloque o fardo no chão — descanso não é luxo, é necessidade urgente."],
    espiritual: ["O Dez de Paus indica que você está carregando apegos, crenças pesadas ou responsabilidades espirituais que não são suas. Há uma libertação necessária.", "Há um fardo espiritual que você precisa soltar. O Dez de Paus pede que você examine o que está carregando por obrigação e não por amor."],
    geral: ["O Dez de Paus mostra o peso máximo — você está carregando mais do que pode ou deve. A mensagem central desta carta é: coloque parte desse fardo no chão. Peça ajuda. Delegue. Solte o que não é seu.", "Você chegou ao limite do que consegue carregar sozinho. O Dez de Paus não é derrota — é o aviso necessário para que você reorganize suas responsabilidades antes do colapso."],
  },
  "Valete de Paus": {
    financas: ["O Valete de Paus traz uma energia jovem e entusiasmada em relação a dinheiro — pode indicar uma ideia nova, um aprendizado sobre finanças ou o início de um empreendimento.", "Há uma faísca de empreendedorismo. O Valete de Paus representa o jovem que está começando a entender seu potencial criativo para gerar renda."],
    trabalho: ["O Valete de Paus é o aprendiz entusiasmado — traz energia nova, ideias frescas e a disposição para aprender. Uma fase de aprendizado ou novo começo profissional.", "Há entusiasmo e criatividade em um novo papel profissional. O Valete de Paus indica que você está desenvolvendo suas habilidades com energia e curiosidade."],
    amor: ["O Valete de Paus traz a energia de um novo amor cheio de faísca e aventura — ou uma fase de renovação apaixonada num relacionamento.", "Há paixão jovem e espontânea chegando. O Valete de Paus indica uma conexão vibrante, cheia de energia e novidade."],
    saude: ["O Valete de Paus traz energia e entusiasmo para novos hábitos de saúde. É uma boa fase para começar uma atividade física ou prática de bem-estar.", "Há vitalidade jovem. O Valete de Paus convida a mover o corpo com alegria e curiosidade."],
    espiritual: ["O Valete de Paus é o estudante espiritual — curioso, entusiasmado, em busca do conhecimento. Uma fase de exploração e descobertas.", "Há uma abertura espiritual nova. O Valete de Paus convida a explorar práticas e conhecimentos com olhos de aprendiz."],
    geral: ["O Valete de Paus traz energia jovem, entusiasta e criativa. Um começo cheio de potencial — abrace a curiosidade e a ação.", "Há uma energia vibrante e cheia de potencial. O Valete de Paus pede que você aja com entusiasmo e não perca o fôlego."],
  },
  "Cavaleiro de Paus": {
    financas: ["O Cavaleiro de Paus indica movimento rápido nas finanças — uma oportunidade que exige ação imediata. Não demore; esta janela não ficará aberta por muito tempo.", "Há uma energia de urgência financeira — seja para aproveitar uma oportunidade ou para resolver uma situação que não pode esperar."],
    trabalho: ["O Cavaleiro de Paus representa alguém em plena ação — movimentos rápidos, decisões ousadas, projetos que avançam com velocidade. Cuidado para não ser impulsivo demais.", "Há dinamismo e velocidade no trabalho. O Cavaleiro de Paus pede que você canalise essa energia com foco, sem perder a direção."],
    amor: ["O Cavaleiro de Paus no amor indica paixão intensa e rápida — um relacionamento que avança rapidamente. Aproveite a energia, mas certifique-se de que há profundidade além da faísca.", "Há uma conexão apaixonada e intensa chegando. O Cavaleiro de Paus traz aventura e emoção no amor."],
    saude: ["O Cavaleiro de Paus indica alta energia e disposição física. Bom momento para atividades que exigem força e movimento. Cuidado com excesso ou imprudência.", "Há vitalidade e energia em alta. O Cavaleiro de Paus convida ao movimento — use essa energia de forma consciente."],
    espiritual: ["O Cavaleiro de Paus representa uma jornada espiritual acelerada — insights rápidos, transformações intensas. Aja com o coração, mas não esqueça o discernimento.", "Há uma fase de expansão espiritual intensa. O Cavaleiro de Paus convida à aventura interior com coragem."],
    geral: ["O Cavaleiro de Paus é ação pura — velocidade, coragem e movimento. Este é o momento de avançar com força. Não espere a hora perfeita.", "Há uma energia impetuosa pedindo ação agora. O Cavaleiro de Paus confirma: o momento de mover é este."],
  },
  "Rainha de Paus": {
    financas: ["A Rainha de Paus é a empreendedora natural — criativa, carismática e confiante. Ela diz que você tem todos os recursos internos para prosperar; confie no seu poder.", "Há uma energia de liderança e autoconfiança nas finanças. A Rainha de Paus convida você a assumir as rédeas com confiança e criatividade."],
    trabalho: ["A Rainha de Paus representa uma liderança carismática, criativa e magnética. Ela convida você a brilhar no seu papel, liderando pelo exemplo e pela força do caráter.", "Há poder e carisma em seu ambiente de trabalho. A Rainha de Paus confirma que você tem o que é preciso para se destacar."],
    amor: ["A Rainha de Paus é apaixonada, vibrante e independente no amor. Ela ama com intensidade, mas nunca perde sua própria essência.", "Há uma energia magnética no amor. A Rainha de Paus convida a ser você mesmo com plenitude — é exatamente isso que atrai."],
    saude: ["A Rainha de Paus traz vitalidade, autoconfiança e energia solar para a saúde. Cuide-se com a mesma paixão que você dedica ao que ama.", "Há força e vitalidade disponíveis. A Rainha de Paus convida ao autocuidado com alegria e amor próprio."],
    espiritual: ["A Rainha de Paus é a sacerdotisa solar — conectada ao fogo sagrado, ao poder criativo e à luz interior. Sua espiritualidade é vivida, não apenas pensada.", "Há poder espiritual genuíno em você. A Rainha de Paus convida a expressá-lo com confiança e alegria."],
    geral: ["A Rainha de Paus traz confiança, carisma e poder criativo. Seja quem você é com plenitude — essa é a sua maior força.", "Há uma energia magnética e poderosa disponível para você. A Rainha de Paus confirma: você tem o que precisa."],
  },
  "Rei de Paus": {
    financas: ["O Rei de Paus é o líder visionário que transforma ideias em prosperidade real. Ele convida você a assumir o comando da sua vida financeira com visão e determinação.", "Há uma oportunidade de exercer liderança financeira. O Rei de Paus diz: tome as decisões, assuma o risco calculado e construa com visão de longo prazo."],
    trabalho: ["O Rei de Paus representa o líder nato — aquele que inspira, dirige e conquista com paixão. Há uma posição de liderança ou reconhecimento de autoridade se aproximando.", "Há reconhecimento de sua capacidade de liderança. O Rei de Paus convida a assumir o papel que é seu com dignidade e visão."],
    amor: ["O Rei de Paus ama com intensidade e lealdade, mas sem perder sua independência. No amor, ele representa uma parceria entre iguais, baseada em respeito e paixão.", "Há uma energia de maturidade e intensidade no amor. O Rei de Paus indica uma conexão com alguém forte, apaixonado e leal."],
    saude: ["O Rei de Paus traz vitalidade madura e consistente. Há energia para realizar, mas também sabedoria para não se queimar. Equilíbrio entre fogo e moderação.", "Há saúde robusta disponível. O Rei de Paus convida a manter a vitalidade com consistência e autoconhecimento."],
    espiritual: ["O Rei de Paus representa a maestria espiritual — aquele que não apenas conhece o caminho, mas o vive e o ensina. Há uma fase de liderança espiritual se aproximando.", "Há uma maturidade espiritual sendo reconhecida. O Rei de Paus convida a compartilhar sua sabedoria com o mundo."],
    geral: ["O Rei de Paus é liderança, visão e domínio da energia criativa. Você está em posição de comando — exerça esse poder com sabedoria.", "Há autoridade e poder disponíveis para você. O Rei de Paus confirma que você tem a visão e a força para liderar."],
  },

  // ── COPAS ─────────────────────────────────────────────────────────────────
  "Ás de Copas": {
    financas: ["O Ás de Copas nas finanças indica que uma nova fonte de abundância flui do coração — um presente, uma oportunidade que nasce de conexões genuínas, ou o início de uma fase de prosperidade emocional.", "Há uma abertura emocional que cria espaço para a abundância entrar. O Ás de Copas convida você a receber com o coração aberto."],
    trabalho: ["O Ás de Copas traz o início de um trabalho que alimenta a alma — seja uma nova vocação, um projeto que ressoa emocionalmente, ou uma conexão com colegas que transforma o ambiente.", "Há uma abertura emocional no trabalho. O Ás de Copas indica que uma nova fase cheia de significado e conexão está começando."],
    amor: ["O Ás de Copas é a carta do amor em sua forma mais pura — um novo amor chegando, um coração se abrindo, ou uma renovação profunda dentro de um relacionamento existente.", "Há um transbordamento de amor e emoção chegando. O Ás de Copas anuncia uma nova fase emocional belíssima."],
    saude: ["O Ás de Copas traz cura emocional profunda — um coração que se abre, um bloqueio que se dissolve, uma paz que começa a se instalar.", "Há uma abertura para a cura. O Ás de Copas indica que o coração está pronto para sair de um período de dor."],
    espiritual: ["O Ás de Copas é o cálice sagrado — a abertura para a graça, a intuição e o amor divino. Uma conexão espiritual profunda está disponível para você.", "Há um derramamento de graça espiritual. O Ás de Copas indica que sua alma está pronta para receber."],
    geral: ["O Ás de Copas é pura abertura do coração — amor, emoção e graça disponíveis em sua forma mais pura. Esteja aberto para receber.", "Há uma nova onda emocional chegando. O Ás de Copas convida à vulnerabilidade e à abertura."],
  },
  "Dez de Copas": {
    financas: ["O Dez de Copas nas finanças indica que a prosperidade que verdadeiramente importa está chegando — não apenas dinheiro, mas a segurança emocional e familiar que o sustenta.", "Há uma fase de realização completa se aproximando — onde as finanças se estabilizam e a vida familiar florescente que você deseja se torna realidade."],
    trabalho: ["O Dez de Copas no trabalho traz realização — o sentimento de que seu trabalho contribui para uma vida feliz e significativa.", "Há harmonia e felicidade em relação ao trabalho e ao que ele possibilita na sua vida. O Dez de Copas confirma que você está no caminho certo."],
    amor: ["O Dez de Copas é a realização plena do amor — felicidade familiar, harmonia, a sensação de que seu lar está completo e abençoado. Uma das cartas mais belas do Tarot.", "Há uma fase de plenitude e alegria no amor e na família chegando. O Dez de Copas anuncia paz, harmonia e amor genuíno."],
    saude: ["O Dez de Copas traz saúde emocional e alegria de viver. Há um equilíbrio profundo sendo alcançado — mente, coração e corpo em harmonia.", "Há bem-estar genuíno chegando. O Dez de Copas indica que a saúde emocional está sendo restaurada."],
    espiritual: ["O Dez de Copas representa a realização espiritual no plano humano — a vivência do paraíso aqui na Terra, através do amor, da família e da comunidade.", "Há uma bênção espiritual se manifestando na vida concreta. O Dez de Copas confirma que você está colhendo os frutos de um caminho amoroso."],
    geral: ["O Dez de Copas é a felicidade plena — amor, família, harmonia e realização emocional. Esta carta confirma que o que você almeja no coração está próximo de se tornar realidade.", "Há realização completa disponível para você. O Dez de Copas é uma das melhores cartas do Tarot — abrace a plenitude que se aproxima."],
  },

  // ── ESPADAS ──────────────────────────────────────────────────────────────
  "Ás de Espadas": {
    financas: ["O Ás de Espadas nas finanças traz clareza cortante — a verdade sobre sua situação financeira está prestes a vir à tona. Enfrente os números com honestidade e use essa clareza para agir.", "Há uma revelação financeira importante. O Ás de Espadas convida à honestidade total com você mesmo — sem ilusões, com o poder da verdade."],
    trabalho: ["O Ás de Espadas traz clareza mental e decisão. Uma verdade importante sobre sua situação profissional está emergindo — e a clareza, mesmo que doa, liberta.", "Há uma decisão precisa e necessária no trabalho. O Ás de Espadas convida ao pensamento claro e à ação corajosa."],
    amor: ["O Ás de Espadas no amor traz a verdade à tona — uma conversa necessária, uma decisão que precisa ser tomada ou uma clareza dolorosa que liberta.", "Há uma revelação ou decisão importante no amor. O Ás de Espadas convida à honestidade radical, mesmo que seja difícil."],
    saude: ["O Ás de Espadas indica uma clareza sobre a saúde — talvez um diagnóstico, uma decisão de tratamento ou uma verdade sobre hábitos que precisam mudar.", "Há clareza e decisão necessárias em relação à saúde. O Ás de Espadas convida à honestidade e à ação precisa."],
    espiritual: ["O Ás de Espadas é o raio da verdade — um insight poderoso, uma revelação espiritual que corta as ilusões e traz clareza sobre o caminho.", "Há uma iluminação chegando. O Ás de Espadas indica que a verdade está prestes a se revelar de forma poderosa."],
    geral: ["O Ás de Espadas é poder mental e clareza pura. A verdade surge com força — pode cortar, mas também liberta. Esteja pronto para ver as coisas como elas realmente são.", "Há clareza e poder disponíveis para você. O Ás de Espadas convida à decisão corajosa baseada na verdade."],
  },
  "Três de Espadas": {
    financas: ["O Três de Espadas nas finanças indica uma perda ou dor financeira — uma traição, um projeto que não deu certo, ou o fim doloroso de uma fase. A dor é real, mas necessária para a cura.", "Há uma mágoa financeira que precisa ser reconhecida e processada. O Três de Espadas não deixa espaço para negação — sinta a dor, para poder seguir em frente."],
    trabalho: ["O Três de Espadas indica desgosto no trabalho — uma traição, uma demissão, um projeto perdido. A dor é legítima e precisa ser sentida antes de ser superada.", "Há uma decepção profissional que dói. O Três de Espadas convida a não suprimir essa dor — ela é parte do processo de transformação."],
    amor: ["O Três de Espadas é a carta da dor do coração — separação, traição, mágoa profunda. Esta dor, embora real, não é o fim; ela abre espaço para o que é mais autêntico.", "Há um desgosto no amor que não pode ser ignorado. O Três de Espadas convida a sentir a dor com honestidade — é o primeiro passo para a cura."],
    saude: ["O Três de Espadas indica dor emocional que está afetando o corpo — ansiedade, depressão, mágoas não resolvidas se manifestando fisicamente.", "Há uma dor emocional profunda. O Três de Espadas convida a buscar apoio — essa dor precisa ser cuidada, não escondida."],
    espiritual: ["O Três de Espadas mostra a dor que purifica — um momento de sofrimento que, quando atravessado com consciência, transforma profundamente.", "Há uma noite escura da alma. O Três de Espadas convida a não fugir da dor espiritual — ela carrega uma transformação necessária."],
    geral: ["O Três de Espadas é dor, separação e mágoa. Não há como contornar — mas há como atravessar. Permita-se sentir, para que a cura possa começar.", "Há uma dor que precisa ser reconhecida. O Três de Espadas diz: não fuja, sinta — e do outro lado da dor está a liberdade."],
  },
  "Dez de Espadas": {
    financas: ["O Dez de Espadas nas finanças indica um fim doloroso — uma crise, uma falência de um plano ou uma situação que chegou ao fundo do poço. Mas o Dez de Espadas também é a alvorada após a noite mais escura: a partir daqui, só melhora.", "Você está no ponto mais difícil de uma crise financeira. O Dez de Espadas diz: isso aqui é o fundo — e do fundo, a única direção é para cima."],
    trabalho: ["O Dez de Espadas indica o fim abrupto e doloroso de um ciclo profissional. Uma demissão, um fracasso, uma traição. Mas toda noite tem fim — e este ciclo está se encerrando para que algo melhor possa começar.", "Há uma conclusão dolorosa no trabalho. O Dez de Espadas indica que um capítulo difícil está fechando — e um novo, mais iluminado, está prestes a começar."],
    amor: ["O Dez de Espadas no amor indica o fim definitivo de um relacionamento ou de uma ilusão. A dor é intensa, mas há algo verdadeiro emergindo das cinzas.", "Há uma conclusão dolorosa no amor. O Dez de Espadas diz: este ciclo terminou — e esse fim, por mais que doa, é o que abre espaço para algo real."],
    saude: ["O Dez de Espadas indica que o ponto de crise na saúde foi atingido. Este pode ser um alerta urgente para buscar ajuda — e também um indicativo de que a partir daqui, a recuperação começa.", "Há um ponto crítico na saúde que precisa de atenção imediata. O Dez de Espadas pede que você não ignore o que seu corpo está dizendo."],
    espiritual: ["O Dez de Espadas representa a morte do ego — um colapso de crenças ou identidades que já não servem. É doloroso, mas é o limiar da transformação mais profunda.", "Há uma desestruturação espiritual que leva ao renascimento. O Dez de Espadas indica que o que está sendo destruído precisava ser destruído."],
    geral: ["O Dez de Espadas é o fim de um ciclo difícil — doloroso, mas necessário. Esta carta diz: você sobreviveu à noite mais escura. A alvorada está chegando.", "Há um encerramento definitivo e doloroso. O Dez de Espadas indica que o pior ficou para trás — a recuperação começa agora."],
  },

  // ── OUROS ────────────────────────────────────────────────────────────────
  "Ás de Ouros": {
    financas: ["O Ás de Ouros é a semente da prosperidade — uma nova oportunidade financeira concreta está surgindo. Seja um novo emprego, um negócio ou um investimento, há um terreno fértil para plantar.", "Há uma nova oportunidade material se apresentando. O Ás de Ouros convida a agir com os pés no chão e plantar as sementes da prosperidade com cuidado."],
    trabalho: ["O Ás de Ouros traz o início de uma nova jornada profissional — um emprego, um projeto ou um contrato que representa uma fundação sólida.", "Há uma nova oportunidade concreta no trabalho. O Ás de Ouros indica que os recursos necessários para uma nova fase estão disponíveis."],
    amor: ["O Ás de Ouros no amor indica uma nova relação que tem base concreta — estabilidade, cuidado mútuo e o desejo de construir algo real juntos.", "Há uma conexão que promete solidez e cuidado. O Ás de Ouros indica um amor que se constrói com atenção e comprometimento."],
    saude: ["O Ás de Ouros indica o início de uma nova abordagem à saúde — um tratamento que começa a dar frutos, hábitos mais saudáveis se solidificando.", "Há uma semente de saúde e bem-estar sendo plantada. O Ás de Ouros convida a cuidar do corpo com consistência."],
    espiritual: ["O Ás de Ouros convida a espiritualidade que se manifesta na matéria — a graça que se vive no cotidiano, no cuidado com o corpo e com o mundo.", "Há uma conexão entre o espiritual e o material se abrindo. O Ás de Ouros lembra que o sagrado também vive na terra."],
    geral: ["O Ás de Ouros é abundância em sua forma mais concreta — uma nova oportunidade, um novo começo material. O terreno está fértil; plante com cuidado.", "Há uma nova fase de prosperidade e solidez começando. O Ás de Ouros convida à ação concreta e com os pés no chão."],
  },
  "Dez de Ouros": {
    financas: ["O Dez de Ouros é uma das cartas mais prósperas do Tarot. Ele indica riqueza estabelecida, herança, abundância familiar e segurança financeira duradoura. O que você está construindo agora tem potencial para beneficiar não só você, mas as gerações que virão.", "Há uma fase de prosperidade sólida e duradoura chegando. O Dez de Ouros confirma que a abundância que você busca é alcançável — e que está muito mais próxima do que parece."],
    trabalho: ["O Dez de Ouros no trabalho indica realização material plena — uma carreira estabelecida, reconhecimento de legado e a satisfação de ter construído algo duradouro.", "Há uma fase de colheita profissional significativa chegando. O Dez de Ouros confirma que seus esforços estão criando uma base sólida e duradoura."],
    amor: ["O Dez de Ouros indica um amor que se manifesta como família, herança e lar — um relacionamento que vai além da paixão e cria raízes profundas.", "Há uma riqueza emocional e familiar se consolidando. O Dez de Ouros anuncia uma fase de amor maduro, generoso e estável."],
    saude: ["O Dez de Ouros traz saúde e bem-estar que se transmite para gerações — hábitos saudáveis criados agora que beneficiarão toda a família.", "Há uma fase de vitalidade e saúde duradoura chegando. O Dez de Ouros convida ao cuidado com o corpo como legado."],
    espiritual: ["O Dez de Ouros indica que a riqueza espiritual se manifesta no plano material — há uma bênção concreta chegando, resultado de um longo caminho de fé e trabalho.", "Há uma prosperidade que vem da conexão com os ancestrais e com a terra. O Dez de Ouros representa o sagrado manifestado na vida cotidiana."],
    geral: ["O Dez de Ouros é a realização material completa — abundância, segurança, legado e família próspera. É a carta que diz: você pode ter tudo que realmente importa.", "Há riqueza e plenitude chegando em todos os aspectos. O Dez de Ouros é uma das melhores cartas para a vida material — abrace essa energia."],
  },
};

function interpretCard(card: CardInput, theme: Theme, pick: number): string {
  const cardName = card.name;

  // 1. Arcanos Maiores — interpretação específica por carta
  const context = MAJOR_CONTEXT[cardName];
  if (context) {
    const options = card.reversed ? context.reversed[theme] : context.upright[theme];
    const text = options[pick % options.length];
    if (card.reversed) {
      return `**${cardName}** aparece invertida — e quando uma carta se apresenta assim, ela não traz má sorte, mas sim um convite a olhar para sombras e bloqueios que pedem consciência. ${text}`;
    }
    return text;
  }

  // 2. Arcanos Menores — interpretação específica por carta (lookup prioritário)
  const specificEntry = SPECIFIC_MINOR[cardName];
  if (specificEntry) {
    const options = specificEntry[theme];
    const text = options[pick % options.length];
    if (card.reversed) {
      return `**${cardName}** aparece invertida. Quando esta carta se inverte, a energia se volta para dentro — pode indicar resistência, bloqueio ou exagero do tema central. ${text} Neste momento invertido, a carta convida a questionar o que está impedindo esse fluxo de se expressar livremente.`;
    }
    return text;
  }

  // 3. Fallback por naipe — para cartas não listadas no SPECIFIC_MINOR
  const suitMap: Record<string, string> = {
    "de Copas": "copas", "de Espadas": "espadas",
    "de Ouros": "ouros", "de Paus": "paus",
  };

  let suitKey = "";
  for (const [key, val] of Object.entries(suitMap)) {
    if (cardName.includes(key)) { suitKey = val; break; }
  }

  if (suitKey && SUIT_DATA[suitKey]) {
    const suitInfo = SUIT_DATA[suitKey];
    const baseText = card.reversed ? suitInfo.reversed[theme] : suitInfo.upright[theme];
    const numberInsight = getNumberInsight(cardName);
    const elemName = suitInfo.element;

    if (card.reversed) {
      return `**${cardName}** invertida carrega uma energia de ${suitKey} (elemento ${elemName}) que pede revisão: ${baseText}${numberInsight ? " " + numberInsight : ""}`;
    }
    return `**${cardName}** traz a energia de ${suitKey} (elemento ${elemName}): ${baseText}${numberInsight ? " " + numberInsight : ""}`;
  }

  // 4. Fallback genérico
  return card.reversed
    ? `**${cardName}** invertida convida a olhar para bloqueios internos que estão impedindo o fluxo natural dessa energia em sua vida.`
    : `**${cardName}** traz uma mensagem poderosa para esse momento. Observe o que ela desperta em você — o inconsciente já sabe o que precisa.`;
}

function getNumberInsight(cardName: string): string {
  const insights: Record<string, string> = {
    "Ás": "O Ás representa o início puro, a semente do potencial máximo desse naipe — toda sua energia está disponível em estado virginal.",
    "Dois": "O Dois fala de escolha, equilíbrio e a dança entre dois princípios. Uma decisão ou parceria está em jogo.",
    "Três": "O Três representa criação, síntese e o fruto que emerge da união. Há algo novo nascendo.",
    "Quatro": "O Quatro traz estabilidade, estrutura e consolidação. É hora de solidificar o que foi construído.",
    "Cinco": "O Cinco representa desafio, conflito e mudança. Um período de tensão que prepara para um novo nível.",
    "Seis": "O Seis traz harmonia, equilíbrio restaurado e fluxo. Um período mais suave após a tensão.",
    "Sete": "O Sete representa reflexão, avaliação e um momento de escolha interior importante.",
    "Oito": "O Oito traz movimento, dinâmica e o resultado das escolhas feitas. As coisas estão se acelerando.",
    "Nove": "O Nove representa maturidade, completude e o ponto de chegada antes do novo começo.",
    "Dez": "O Dez é o ponto de culminância — o fim de um ciclo completo e o prenúncio do próximo.",
    "Valete": "O Valete (Pajem) representa a energia jovem, receptiva e aprendiz. Uma nova fase de aprendizado se anuncia.",
    "Cavaleiro": "O Cavaleiro traz movimento, ação e a jornada em direção ao objetivo. Algo está em movimento.",
    "Rainha": "A Rainha representa a maestria madura e o poder que cria a partir de dentro, com sabedoria.",
    "Rei": "O Rei representa a maestria plena e o poder que se manifesta no mundo com autoridade e responsabilidade.",
  };

  for (const [key, val] of Object.entries(insights)) {
    if (cardName.startsWith(key)) return val;
  }
  return "";
}

// ─── Função principal de interpretação ───────────────────────────────────────

export function interpretTarot(question: string, cards: CardInput[]): string {
  const theme = detectTheme(question);
  const hasReversed = cards.some((c) => c.reversed);

  // Escolher variações aleatórias para evitar repetição
  const aberturas = ABERTURA[theme];
  const abertura = aberturas[Math.floor(Math.random() * aberturas.length)];

  let reading = `✦ A MENSAGEM DAS CARTAS\n\n${abertura}\n\n`;

  // Interpretação de cada carta — direto ao ponto, sem intro mecânica
  cards.forEach((card, index) => {
    const cardText = interpretCard(card, theme, index);
    const reversedLabel = card.reversed ? " (invertida)" : "";
    reading += `✦ ${card.name.toUpperCase()}${reversedLabel}\n\n`;
    reading += `${cardText}\n\n`;
  });

  // Síntese
  reading += `✦ VISÃO INTEGRADA\n\n`;
  reading += getSynthesis(cards, theme) + "\n\n";

  // Orientação final
  reading += `✦ O QUE AS CARTAS PEDEM DE VOCÊ\n\n`;
  reading += getFinalOrientation(theme, hasReversed);

  return reading;
}
