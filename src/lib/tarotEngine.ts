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

function interpretCard(card: CardInput, theme: Theme, pick: number): string {
  const cardName = card.name;
  const context = MAJOR_CONTEXT[cardName];

  if (context) {
    const options = card.reversed ? context.reversed[theme] : context.upright[theme];
    const text = options[pick % options.length];
    if (card.reversed) {
      return `**${cardName}** aparece invertida — e quando uma carta se apresenta assim, ela não traz má sorte, mas sim um convite a olhar para sombras e bloqueios que pedem consciência. ${text}`;
    }
    return text;
  }

  // Para Arcanos Menores — interpretação por naipe
  const suitMap: Record<string, string> = {
    copas: "copas", "de Copas": "copas", "Ás de Copas": "copas",
    espadas: "espadas", "de Espadas": "espadas", "Ás de Espadas": "espadas",
    ouros: "ouros", "de Ouros": "ouros", "Ás de Ouros": "ouros",
    paus: "paus", "de Paus": "paus", "Ás de Paus": "paus",
  };

  let suitKey = "";
  for (const [key, val] of Object.entries(suitMap)) {
    if (cardName.toLowerCase().includes(key.toLowerCase())) {
      suitKey = val;
      break;
    }
  }

  if (suitKey && SUIT_DATA[suitKey]) {
    const suitInfo = SUIT_DATA[suitKey];
    const baseText = card.reversed ? suitInfo.reversed[theme] : suitInfo.upright[theme];
    const numberInsight = getNumberInsight(cardName);
    if (card.reversed) {
      return `**${cardName}** invertida, do naipe de ${suitKey.charAt(0).toUpperCase() + suitKey.slice(1)} (elemento ${suitInfo.element}), traz uma mensagem que merece atenção particular: ${baseText}${numberInsight ? " " + numberInsight : ""}`;
    }
    return `**${cardName}**, do naipe de ${suitKey.charAt(0).toUpperCase() + suitKey.slice(1)} (elemento ${suitInfo.element}), carrega a seguinte mensagem: ${baseText}${numberInsight ? " " + numberInsight : ""}`;
  }

  // Fallback genérico
  const fallback = card.reversed
    ? `**${cardName}** invertida traz um convite importante a revisar padrões e libertar o que já não serve. Há uma transformação pedindo passagem.`
    : `**${cardName}** traz uma energia significativa para esse momento. Observe os temas e padrões que ela evoca em sua vida atual.`;
  return fallback;
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
  reading += `Sua pergunta: "${question}"\n\n`;

  // Interpretação de cada carta
  cards.forEach((card, index) => {
    const posIntro = getPositionIntro(card.position);
    const cardText = interpretCard(card, theme, index);
    reading += `✦ ${card.position.toUpperCase()}\n`;
    reading += `${posIntro} ${card.name}${card.reversed ? " (invertida)" : ""}.\n\n`;
    reading += `${cardText}\n\n`;
  });

  // Síntese
  reading += `✦ VISÃO INTEGRADA\n\n`;
  reading += getSynthesis(cards, theme) + "\n\n";

  // Orientação final
  reading += `✦ ORIENTAÇÃO\n\n`;
  reading += getFinalOrientation(theme, hasReversed);

  return reading;
}
