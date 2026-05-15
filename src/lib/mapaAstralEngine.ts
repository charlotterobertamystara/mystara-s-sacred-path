// Motor de Mapa Astral — Mystara
// Cálculos astronômicos simplificados + interpretações simbólicas profundas

// ─── Signos e dados ───────────────────────────────────────────────────────────

const SIGNOS = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
] as const;
type Signo = typeof SIGNOS[number];

const SIMBOLOS: Record<string, string> = {
  'Áries': '♈', 'Touro': '♉', 'Gêmeos': '♊', 'Câncer': '♋',
  'Leão': '♌', 'Virgem': '♍', 'Libra': '♎', 'Escorpião': '♏',
  'Sagitário': '♐', 'Capricórnio': '♑', 'Aquário': '♒', 'Peixes': '♓',
};

const ELEMENTOS: Record<string, string> = {
  'Áries': 'Fogo', 'Leão': 'Fogo', 'Sagitário': 'Fogo',
  'Touro': 'Terra', 'Virgem': 'Terra', 'Capricórnio': 'Terra',
  'Gêmeos': 'Ar', 'Libra': 'Ar', 'Aquário': 'Ar',
  'Câncer': 'Água', 'Escorpião': 'Água', 'Peixes': 'Água',
};

const PLANETAS_REGENTES: Record<string, string> = {
  'Áries': 'Marte', 'Touro': 'Vênus', 'Gêmeos': 'Mercúrio',
  'Câncer': 'Lua', 'Leão': 'Sol', 'Virgem': 'Mercúrio',
  'Libra': 'Vênus', 'Escorpião': 'Plutão', 'Sagitário': 'Júpiter',
  'Capricórnio': 'Saturno', 'Aquário': 'Urano', 'Peixes': 'Netuno',
};

// ─── Cálculos Astronômicos ────────────────────────────────────────────────────

function julianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + date.getUTCHours() / 24;
  const a = Math.floor((14 - m) / 12);
  const yr = y + 4800 - a;
  const mo = m + 12 * a - 3;
  return d + Math.floor((153 * mo + 2) / 5) + 365 * yr +
    Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
}

function signFromDegree(deg: number): Signo {
  const norm = ((deg % 360) + 360) % 360;
  return SIGNOS[Math.floor(norm / 30)];
}

function calcularSol(date: Date): Signo {
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return 'Áries';
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return 'Touro';
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return 'Gêmeos';
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return 'Câncer';
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 'Leão';
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 'Virgem';
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return 'Libra';
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return 'Escorpião';
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return 'Sagitário';
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return 'Capricórnio';
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return 'Aquário';
  return 'Peixes';
}

function calcularLua(date: Date): Signo {
  // Referência: Lua em Áries em 2000-01-06 18:14 UTC (Nova Lua)
  const refJD = 2451551.259;
  const jd = julianDay(date);
  const diasDesdeRef = jd - refJD;
  // Período sideral da Lua: 27.321661 dias (mas usamos sinódico para fases)
  // A Lua percorre 360° em 27.321661 dias = 13.1764° por dia
  const grausLua = (diasDesdeRef * 13.1764) % 360;
  return signFromDegree(grausLua);
}

function calcularAscendente(date: Date, horaStr: string): Signo {
  // O ascendente muda ~1 signo a cada 2 horas
  // Referência simplificada baseada na hora local de nascimento
  // Assume nascer do sol em Áries às 06:00
  const [hh, mm] = horaStr.split(':').map(Number);
  const horaDecimal = (isNaN(hh) ? 6 : hh) + (isNaN(mm) ? 0 : mm) / 60;
  // Ajuste pelo dia do ano para aproximar o LST
  const diaDoAno = Math.floor((date.getTime() - new Date(date.getUTCFullYear(), 0, 0).getTime()) / 86400000);
  const offsetDia = (diaDoAno / 365) * 360; // Sol avança ~1°/dia
  const solGrau = (offsetDia + 180) % 360; // Posição aprox do Sol na eclíptica
  // Ascendente = signo que está nascendo no leste
  // Simplificação: às 06:00 o ascendente = signo Solar; a cada 2h avança 1 signo
  const horasDesde6 = ((horaDecimal - 6) + 24) % 24;
  const signOffset = Math.floor(horasDesde6 / 2);
  const solSignIndex = Math.floor(((solGrau % 360) + 360) % 360 / 30);
  const ascIndex = (solSignIndex + signOffset) % 12;
  return SIGNOS[ascIndex];
}

function calcularMercurio(date: Date, sol: Signo): Signo {
  // Mercúrio fica a no máximo 28° do Sol, então está em um dos 3 signos vizinhos
  const solIndex = SIGNOS.indexOf(sol);
  const jd = julianDay(date);
  // Período sinódico de Mercúrio: 115.88 dias
  const refJD = 2451545.0; // J2000.0
  const ciclo = ((jd - refJD) % 115.88 + 115.88) % 115.88;
  const offset = ciclo < 30 ? -1 : ciclo < 80 ? 0 : 1;
  return SIGNOS[((solIndex + offset) + 12) % 12];
}

function calcularVenus(date: Date, sol: Signo): Signo {
  // Vênus fica a no máximo 47° do Sol
  const solIndex = SIGNOS.indexOf(sol);
  const jd = julianDay(date);
  // Período sinódico de Vênus: 583.92 dias
  const refJD = 2451545.0;
  const ciclo = ((jd - refJD) % 583.92 + 583.92) % 583.92;
  const frac = ciclo / 583.92;
  let offset = 0;
  if (frac < 0.15) offset = -1;
  else if (frac < 0.35) offset = 0;
  else if (frac < 0.5) offset = 1;
  else if (frac < 0.65) offset = 0;
  else if (frac < 0.85) offset = -1;
  else offset = 0;
  return SIGNOS[((solIndex + offset) + 12) % 12];
}

function calcularMarte(date: Date): Signo {
  // Marte completa uma órbita em ~687 dias (~22.6 meses)
  // Referência: Marte em Áries em 2000-01-01
  const refJD = 2451545.0;
  const jd = julianDay(date);
  const graus = ((jd - refJD) / 687.0) * 360;
  return signFromDegree(graus);
}

function calcularJupiter(date: Date): Signo {
  // Júpiter completa órbita em ~4332.6 dias (~11.86 anos)
  // Referência: Júpiter em Áries (~2010-06-06, aproximação)
  const refJD = 2455353.0;
  const jd = julianDay(date);
  const graus = ((jd - refJD) / 4332.6) * 360;
  return signFromDegree(graus);
}

function calcularSaturno(date: Date): Signo {
  // Saturno completa órbita em ~10759.2 dias (~29.46 anos)
  // Referência: Saturno em Áries (~1999-03-01)
  const refJD = 2451238.0;
  const jd = julianDay(date);
  const graus = ((jd - refJD) / 10759.2) * 360;
  return signFromDegree(graus);
}

function calcularUrano(date: Date): Signo {
  // Urano: ~30.687 anos por signo (~84 anos total)
  // Referência: Urano em Capricórnio em 1988
  const refJD = 2447161.0;
  const jd = julianDay(date);
  const graus = ((jd - refJD) / 30589.0) * 360;
  return signFromDegree(graus + 270); // começa em Capricórnio (270°)
}

function calcularNetuno(date: Date): Signo {
  // Netuno: ~164.8 anos total, ~13.7 anos por signo
  // Referência: Netuno em Capricórnio em 1984
  const refJD = 2445701.0;
  const jd = julianDay(date);
  const graus = ((jd - refJD) / 60190.0) * 360;
  return signFromDegree(graus + 270);
}

function calcularNodoNorte(date: Date): Signo {
  // Nodo Norte regride 360° em ~18.6 anos
  // Referência: Nodo Norte em Áries em 2000-01
  const refJD = 2451545.0;
  const jd = julianDay(date);
  const graus = -((jd - refJD) / 6793.5) * 360; // Retrógrado
  return signFromDegree(graus);
}

function calcularCasa(ascIndex: number, planeta: number): number {
  // Casa = (posição relativa ao ascendente) + 1
  return ((planeta - ascIndex + 12) % 12) + 1;
}

// ─── Interpretações por planeta em cada signo ─────────────────────────────────

const SOL_EM: Record<string, string> = {
  'Áries': 'Sua essência solar brilha em Áries — o pioneiro do zodíaco. Você carrega uma chama de iniciativa e coragem que impulsiona não apenas a si mesmo, mas todos ao seu redor. Sua identidade se forja na ação, na descoberta, no desejo de ser o primeiro a abrir novos caminhos. Há uma vitalidade quase incontida em você, uma necessidade de movimento e conquista que deve ser canalizada com sabedoria. Aprenda a temperar a impulsividade com paciência, e sua capacidade de liderança se tornará imbatível.',
  'Touro': 'Seu Sol em Touro fala de uma essência sólida, sensorial e profundamente conectada à terra e à beleza do mundo material. Você encontra sua identidade mais verdadeira na constância, na criação de segurança e na apreciação das coisas boas da vida. Há uma força serena em você — paciente, persistente e fundamentalmente confiável. Seu desafio é aprender a soltar o que já cumpriu seu ciclo, pois seu apego ao conhecido pode limitar novas expansões. Quando alinhado com sua natureza venusiana, você é capaz de construir beleza e prosperidade duradouras.',
  'Gêmeos': 'Sua essência solar em Gêmeos é a da mente curiosa e ágil que precisa alimentar-se continuamente de novas informações e conexões. Você é comunicativo, versátil e capaz de ver múltiplas perspectivas de qualquer situação — um dom precioso que às vezes se transforma no desafio de não conseguir decidir ou se aprofundar. Você encontra propósito na troca, no aprendizado e na expressão criativa das ideias. Seu maior crescimento vem quando aprofunda o que aprende, transformando versatilidade em sabedoria.',
  'Câncer': 'Sol em Câncer revela uma essência profundamente sensível, intuitiva e orientada ao cuidado. Você encontra sua identidade mais verdadeira no lar, na família e nas conexões afetivas que cultivam senso de pertencimento. Há em você uma capacidade extraordinária de sentir o que os outros precisam antes que falem — uma inteligência emocional que é seu maior tesouro. Seu desafio está em cuidar de si mesmo com a mesma dedicação com que cuida dos outros, e aprender que sua vulnerabilidade é sua força.',
  'Leão': 'Seu Sol encontra-se no próprio lar — em Leão, o signo regido pelo Sol. Isso fala de uma essência luminosa, criativa e naturalmente magnética. Você nasceu para expressar, para brilhar e para inspirar outros com sua generosidade e presença. Há uma nobreza genuína em sua natureza que se revela quando você está alinhado com seu propósito. Seu desafio é garantir que seu brilho nasça da autenticidade e não da necessidade de aprovação. Quando você cria por amor e não por vaidade, sua luz se torna verdadeiramente transformadora.',
  'Virgem': 'Sol em Virgem revela uma essência analítica, dedicada e profundamente orientada ao serviço e à excelência. Você encontra propósito no aperfeiçoamento contínuo, na atenção cuidadosa aos detalhes e na capacidade de organizar o caos. Há uma inteligência prática em você que transforma ideias abstratas em soluções concretas e funcionais. Seu desafio está no autocriticismo excessivo e na busca pela perfeição inatingível. Quando você aceita que errar é parte do crescimento, sua capacidade de realização não tem limites.',
  'Libra': 'Sua essência solar em Libra é a da busca pela harmonia, pela justiça e pela beleza nas relações e no mundo. Você possui um senso estético refinado e uma capacidade diplomática que facilita a paz onde há conflito. Sua identidade se constrói em parceria — você se conhece melhor através do outro. Seu desafio está na indecisão e na tendência de ceder demais para evitar conflitos. Quando você desenvolve o centro interior que lhe permite ser justo consigo mesmo tanto quanto com os outros, sua influência sobre o mundo se torna profundamente transformadora.',
  'Escorpião': 'Sol em Escorpião fala de uma essência intensa, investigativa e fundamentalmente transformadora. Você não se contenta com superfícies — sua natureza mergulha nas profundezas, buscando a verdade oculta em cada situação e pessoa. Há um magnetismo natural em você que atrai e ao mesmo tempo intimida. Você tem a capacidade de morrer e renascer várias vezes ao longo da vida, saindo de cada crise mais forte e sábio. Seu desafio está em soltar o controle e confiar no processo de transformação sem resistência.',
  'Sagitário': 'Sua essência solar em Sagitário é a da expansão, da busca pela verdade e do otimismo filosófico que vê em cada experiência uma oportunidade de crescimento. Você nasceu para explorar — seja através de viagens físicas, estudos, espiritualidade ou filosofia. Há um entusiasmo contagiante em você que inspira os outros a sonharem maior. Seu desafio está em honrar os compromissos que faz e em encontrar profundidade dentro da amplitude que tanto busca.',
  'Capricórnio': 'Sol em Capricórnio revela uma essência ambiciosa, disciplinada e orientada à construção do legado. Você possui uma maturidade natural — muitas vezes foi a criança responsável, o adulto confiável, o pilar que sustenta. Há uma capacidade extraordinária de trabalho e perseverança em você que permite alcançar o que outros desistiram. Seu desafio está em equilibrar a dedicação ao trabalho com o cultivo das relações e do prazer, e em aprender que descanso não é fraqueza.',
  'Aquário': 'Sua essência solar em Aquário é a do visionário que vive um pouco à frente do seu tempo. Você possui uma mente original, humanitária e comprometida com ideais de liberdade e progresso coletivo. Sua identidade se forja na singularidade e na recusa de se encaixar em moldes que não fazem sentido. Seu desafio está no distanciamento emocional que às vezes cria uma barreira entre você e as relações íntimas. Quando você permite que sua humanidade toque o coração além das ideias, sua influência no mundo se torna ainda mais poderosa.',
  'Peixes': 'Sol em Peixes fala de uma essência compassiva, criativa e profundamente conectada ao campo espiritual e à experiência coletiva da humanidade. Você possui uma sensibilidade que beira o místico — absorve atmosferas, energias e emoções ao seu redor com uma permeabilidade única. Sua criatividade é alimentada por esse oceano interior rico e profundo. Seu desafio está em estabelecer limites saudáveis e em não se perder nos outros. Quando você ancora sua sensibilidade com estrutura e discernimento, seu potencial de cura e criação é extraordinário.',
};

const LUA_EM: Record<string, string> = {
  'Áries': 'Sua Lua em Áries fala de uma vida emocional intensa, rápida e reativa. Você precisa agir para processar sentimentos — a emoção não pode ficar represada. Há uma honestidade emocional direta e às vezes desconcertante, mas também uma capacidade de se recuperar rapidamente das dores. Sua necessidade emocional fundamental é de liberdade e de espaço para ser quem você é sem se submeter.',
  'Touro': 'Lua em Touro é considerada uma posição de exaltação — você possui uma vida emocional estável, sensorial e profundamente conectada ao corpo e aos prazeres simples. Você precisa de segurança material e afetiva para se sentir bem, e constrói essa segurança com paciência e consistência. Suas emoções são sólidas e confiáveis, embora possam ser lentas para se adaptar às mudanças.',
  'Gêmeos': 'Sua Lua em Gêmeos indica uma vida emocional que se processa principalmente através das palavras e da troca intelectual. Você precisa falar sobre o que sente para entendê-lo, e encontra conforto em aprender, comunicar e conectar. Às vezes a mente intervém antes que o sentimento possa ser plenamente vivido — seu crescimento vem ao aprender a simplesmente sentir.',
  'Câncer': 'Lua em Câncer é a posição domiciliar — a Lua rege Câncer e aqui se sente plenamente em casa. Sua vida emocional é rica, intuitiva e profundamente conectada ao lar, à família e à memória afetiva. Você sente tudo com intensidade e possui uma memória emocional extraordinariamente vívida. Seu cuidado pelos outros é genuíno e quase instintivo.',
  'Leão': 'Sua Lua em Leão revela uma vida emocional dramaticamente expressiva e que precisa de reconhecimento para florescer. Você se sente bem quando pode expressar seus sentimentos com grandiosidade e quando recebe a apreciação que tanto busca. Há uma generosidade genuína em seu coração, e uma necessidade de que o amor seja demonstrado com entusiasmo e presença.',
  'Virgem': 'Lua em Virgem indica uma vida emocional que se processa através da análise e do serviço. Você cuida através de atos concretos e precisos, e pode ter dificuldade em simplesmente "deixar fluir" sem querer resolver. Há uma sensibilidade refinada que percebe detalhes que outros perdem. Seu cuidado consigo mesmo e com os outros é cuidadoso e prático.',
  'Libra': 'Sua Lua em Libra revela uma vida emocional que encontra equilíbrio nas relações. Você precisa de harmonia no ambiente e nas conexões para se sentir emocionalmente seguro. Há uma necessidade genuína de parceria e de beleza no cotidiano. Você é emocionalmente diplomático, mas às vezes precisa aprender a nomear e defender suas próprias necessidades.',
  'Escorpião': 'Lua em Escorpião fala de uma vida emocional de extremos — você sente tudo em profundidade e intensidade raramente igualadas. Há uma porosidade às emoções ocultas ao redor e uma capacidade investigativa do mundo emocional. Transformação, crise e renascimento são temas recorrentes na sua vida afetiva. Quando confia, doa-se por inteiro; quando se sente traído, a dor é igualmente total.',
  'Sagitário': 'Sua Lua em Sagitário revela uma vida emocional que precisa de liberdade, expansão e significado. Você processa sentimentos através de filosofia, espiritualidade e aventura. Há um otimismo emocional inato que te permite superar crises com a crença de que algo melhor está por vir. Seu desafio está em comprometer-se emocionalmente sem sentir que está sendo limitado.',
  'Capricórnio': 'Lua em Capricórnio indica uma vida emocional controlada, frequentemente direcionada à responsabilidade antes do prazer. Você foi ensinado — ou aprendeu por necessidade — a conter as emoções e agir com eficiência. Há uma profundidade emocional que raramente aparece na superfície, mas que sustenta uma lealdade e um comprometimento excepcionais. Aprender a se permitir vulnerabilidade é o seu maior presente.',
  'Aquário': 'Sua Lua em Aquário fala de uma vida emocional que se processa através do distanciamento e da racionalização. Você pode se sentir emocionalmente diferente dos outros, como se seus sentimentos seguissem um ritmo e uma lógica que poucos entendem. Há uma necessidade genuína de liberdade emocional e de relações que respeitem sua singularidade.',
  'Peixes': 'Lua em Peixes é uma das posições mais empáticas e permeáveis do zodíaco. Você absorve o que está ao redor — emoções, atmosferas, sofrimentos alheios — com uma facilidade que pode ser ao mesmo tempo seu dom e seu desafio. Criatividade, espiritualidade e compaixão são os maiores recursos desta posição lunar.',
};

const ASCENDENTE_EM: Record<string, string> = {
  'Áries': 'Seu Ascendente em Áries projeta uma presença imediata, enérgica e direta. O mundo te vê como alguém de iniciativa, que parte para a ação sem hesitação excessiva. Há uma jovialidade quase juvenil em sua aparência e na forma como se lança às situações. Você é o tipo de pessoa que parece sempre pronto para começar algo novo. Marte, seu regente, traz uma energia que magnetiza e às vezes provoca.',
  'Touro': 'Ascendente em Touro cria uma presença calma, sensual e confiável. O mundo te percebe como alguém estável, de bom gosto e que inspira segurança. Há uma elegância natural em sua forma de ser que atrai as pessoas. Vênus como regente do seu Ascendente presenteia você com uma aparência harmoniosa e uma atitude conciliadora que abre portas.',
  'Gêmeos': 'Seu Ascendente em Gêmeos projeta uma presença curiosa, comunicativa e sempre em movimento. O mundo te percebe como alguém inteligente, expressivo e socialmente ágil. Você parece sempre ter algo interessante a dizer, e cria pontes entre diferentes pessoas e ideias com naturalidade. Mercúrio como regente traz uma agilidade mental que outros percebem imediatamente.',
  'Câncer': 'Ascendente em Câncer projeta uma presença acolhedora, receptiva e emocionalmente intuitiva. O mundo te vê como alguém seguro, carinhoso e em quem se pode confiar os segredos do coração. Há uma sensibilidade visível em você que convida as pessoas a se abrirem. A Lua como regente faz sua expressão exterior mudar com as fases e os momentos.',
  'Leão': 'Seu Ascendente em Leão cria uma presença magnética, confiante e naturalmente dramática. O mundo te percebe como alguém de presença marcante, que entra em um ambiente e é notado. Há uma nobreza e um calor em sua expressão que inspira admiração. O Sol como regente presenteia você com uma energia vital visível e uma capacidade natural de liderar pela inspiração.',
  'Virgem': 'Ascendente em Virgem projeta uma presença discreta, observadora e analítica. O mundo te percebe como alguém confiável, detalhista e que transmite competência. Há uma fineza e uma modéstia em sua expressão exterior que pode esconder a profundidade interior. Mercúrio como regente faz você se expressar com precisão e clareza.',
  'Libra': 'Seu Ascendente em Libra cria uma presença harmoniosa, estética e diplomaticamente encantadora. O mundo te percebe como alguém elegante, equilibrado e fácil de conviver. Há uma graça natural em sua forma de se relacionar que abre portas nos ambientes mais variados. Vênus como regente presenteia você com um charme natural e uma sensibilidade ao belo.',
  'Escorpião': 'Ascendente em Escorpião projeta uma presença intensa, magnética e um tanto misteriosa. O mundo te percebe como alguém profundo, que não revela facilmente o que pensa e sente, o que cria uma aura de mistério irresistível. Há um poder em seu olhar e em sua presença que outros sentem mesmo sem conseguir nomear. Plutão como co-regente amplifica sua capacidade transformadora.',
  'Sagitário': 'Seu Ascendente em Sagitário cria uma presença expansiva, otimista e aventureira. O mundo te percebe como alguém aberto, filosófico e que inspira fé e entusiasmo. Há uma generosidade e uma franqueza em sua expressão exterior que as pessoas encontram refrescantes. Júpiter como regente amplia sua presença e sua capacidade de atrair oportunidades.',
  'Capricórnio': 'Ascendente em Capricórnio projeta uma presença séria, competente e naturalmente respeitosa. O mundo te percebe como alguém confiável, responsável e que sabe o que quer. Há uma maturidade em sua expressão exterior que frequentemente faz você parecer mais velho ou mais sábio do que sua idade indica. Saturno como regente traz uma autoridade silenciosa à sua presença.',
  'Aquário': 'Seu Ascendente em Aquário cria uma presença singular, inovadora e levemente fora do convencional. O mundo te percebe como alguém diferente, à frente do seu tempo, e frequentemente intrigante. Há uma originalidade em seu estilo e em sua forma de pensar que te torna memorável. Urano como regente presenteia você com uma capacidade de surpreender e de desafiar o status quo.',
  'Peixes': 'Ascendente em Peixes projeta uma presença suave, etérea e misteriosamente encantadora. O mundo te percebe como alguém sensível, artístico e com algo indefinível que fascina. Há uma qualidade camaleônica em você que permite adaptar-se a diferentes ambientes e pessoas com facilidade. Netuno como regente presenteia você com uma imaginação e uma espiritualidade visíveis na sua forma de ser.',
};

const MERCURIO_EM: Record<string, string> = {
  'Áries': 'Mercúrio em Áries fala de uma mente rápida, direta e impaciente com rodeios. Você pensa e decide com velocidade, e prefere a comunicação direta à diplomacia. Sua forma de pensar é pioneira — você frequentemente chega a conclusões antes dos outros, embora possa perder nuances importantes na pressa.',
  'Touro': 'Mercúrio em Touro indica uma mente deliberada, prática e que não apressa conclusões. Você processa informações com cuidado, chega a decisões bem fundamentadas e possui uma memória de longo prazo excepcional. Sua comunicação é clara e confiável, mesmo que não seja a mais rápida.',
  'Gêmeos': 'Mercúrio no domicílio — em Gêmeos — está em seu ponto de maior expressão. Você possui uma mente brilhante, veloz e capaz de processar múltiplas informações simultaneamente. A comunicação é seu talento natural, e o aprendizado acontece com prazer e facilidade.',
  'Câncer': 'Mercúrio em Câncer indica uma mente intuitiva e emocional. Você processa informações através de sentimentos e memórias — a lógica pura raramente é suficiente sem o componente afetivo. Sua comunicação é empática e muitas vezes poética.',
  'Leão': 'Mercúrio em Leão fala de uma comunicação dramática, criativa e persuasiva. Você pensa em grande escala, ama contar histórias e tem o dom de tornar qualquer assunto cativante. Sua mente é orientada à expressão e ao impacto.',
  'Virgem': 'Mercúrio em Virgem é também uma posição de domicílio e exaltação. Sua mente é analítica, precisa e orientada ao detalhe com uma eficiência rara. Você possui uma capacidade extraordinária de organizar informações e identificar erros que outros passariam despercebido.',
  'Libra': 'Mercúrio em Libra indica uma mente equilibrada e orientada à harmonia nas ideias. Você possui o dom de ver todos os lados de uma questão, o que o torna um mediador e negociador natural. Sua comunicação é diplomática e estética.',
  'Escorpião': 'Mercúrio em Escorpião fala de uma mente investigativa e que vai além das superfícies. Você tem capacidade de detectar motivações ocultas, padrões disfarçados e verdades que outros preferem não ver. Sua comunicação é intensa e estratégica.',
  'Sagitário': 'Mercúrio em Sagitário indica uma mente filosófica, expansiva e orientada ao grande quadro. Você pensa em conceitos amplos e princípios universais mais do que em detalhes práticos. Sua comunicação é entusiasmada e inspiradora.',
  'Capricórnio': 'Mercúrio em Capricórnio fala de uma mente disciplinada, estratégica e orientada aos resultados concretos. Você pensa com eficiência e expressa apenas o que é relevante. Sua comunicação é respeitada por sua seriedade e consistência.',
  'Aquário': 'Mercúrio em Aquário indica uma mente visionária, original e frequentemente à frente do tempo. Você pensa de forma não-linear, chegando a insights surpreendentes através de conexões que outros não fariam. Sua comunicação tem um toque único que estimula o pensamento.',
  'Peixes': 'Mercúrio em Peixes fala de uma mente intuitiva, imaginativa e que pensa em imagens e metáforas mais do que em conceitos lineares. Sua comunicação é frequentemente poética, inspirada e conectada a dimensões sutis da realidade.',
};

const VENUS_EM: Record<string, string> = {
  'Áries': 'Vênus em Áries ama com intensidade e prontidão. Você vai atrás do que deseja sem rodeios, e o cortejo é direto e apaixonado. Há um charme espontâneo que seduz pela autenticidade. Seu desafio é cultivar paciência nas relações, deixando o amor amadurecer além da fase inicial da conquista.',
  'Touro': 'Vênus em Touro — no próprio domicílio — é uma das posições mais sensuais e afetivamente generosas do zodíaco. Você ama com estabilidade, lealdade e um prazer refinado nas coisas boas da vida. Seus relacionamentos são construídos para durar, com uma base sólida de segurança e conforto mútuo.',
  'Gêmeos': 'Vênus em Gêmeos ama através das palavras, das ideias e da leveza no contato. Você precisa de estimulação intelectual no romance, e a comunicação é seu maior afrodisíaco. Há uma juventude e uma versatilidade em sua expressão amorosa que torna você encantante e difícil de prever.',
  'Câncer': 'Vênus em Câncer ama com profundidade e dedicação quase materna. Você nutre os relacionamentos com cuidado, lealdade e uma sensibilidade refinada às necessidades do outro. O lar e a família são centrais em sua visão de amor. Sua vulnerabilidade é, paradoxalmente, seu maior atrativo.',
  'Leão': 'Vênus em Leão ama com generosidade, drama e uma necessidade genuína de ser o protagonista do coração do outro. Você é romanticamente expressivo, presenteador e apaixonado. Há uma nobreza em seu afeto que faz as pessoas ao seu lado sentirem que são especiais.',
  'Virgem': 'Vênus em Virgem demonstra amor através de atos de cuidado e serviço. Você não é o tipo de expressão amorosa exuberante, mas é profundamente dedicado e atencioso. Você ama de forma prática, notando e antecipando necessidades com um carinho silencioso e constante.',
  'Libra': 'Vênus em Libra — outro domicílio — traz um amor elegante, harmonioso e profundamente orientado à parceria. Você foi feito para os relacionamentos e os cultiva com arte, equilíbrio e um senso refinado do que o outro precisa. A reciprocidade é essencial para você se sentir completo no amor.',
  'Escorpião': 'Vênus em Escorpião ama com uma intensidade avassaladora — ou por inteiro, ou não ama. Não há meio-termo em seus relacionamentos: a fusão total é o que você busca e o que o assusta ao mesmo tempo. Há uma magnetismo erótico e emocional nesta posição que raramente passa despercebido.',
  'Sagitário': 'Vênus em Sagitário ama de forma expansiva, aventureira e com um entusiasmo que ilumina o relacionamento. Você precisa de liberdade dentro do amor e de um parceiro que compartilhe da curiosidade pelo mundo. Há uma generosidade espiritual em seu afeto.',
  'Capricórnio': 'Vênus em Capricórnio ama com responsabilidade, lealdade e uma visão de longo prazo. Você não se entrega facilmente, mas quando o faz, é com um comprometimento raramente encontrado. Há uma seriedade em seu amor que constrói estruturas afetivas duradouras.',
  'Aquário': 'Vênus em Aquário ama de forma singular, com uma mistura de amizade profunda, liberdade e originalidade. Você não é convencional no amor e precisa de um parceiro que respeite sua independência e singularidade. Há uma qualidade vanguardista em seus relacionamentos.',
  'Peixes': 'Vênus em Peixes — posição de exaltação — traz o amor mais transcendente e compassivo do zodíaco. Você ama sem fronteiras e com uma entrega que pode beirar o sacrifício. Há uma qualidade mística e poética em seus relacionamentos. Seu desafio é manter o discernimento enquanto se abre completamente.',
};

const MARTE_EM: Record<string, string> = {
  'Áries': 'Marte em Áries — no domicílio — expressa uma energia de ação indomável, direta e pioneira. Você age por instinto e coragem, e raramente deixa o medo paralisar. Há uma vitalidade física marcante e uma capacidade de iniciativa que impressiona. O desafio é cultivar paciência e estratégia além da força bruta.',
  'Touro': 'Marte em Touro age de forma persistente, metódica e determinada. Você não começa algo que não vai terminar, e possui uma resistência física e psicológica notável. Sua ação é lenta mas segura, como uma pedra que não recua.',
  'Gêmeos': 'Marte em Gêmeos age através da palavra e da agilidade mental. Sua energia vai para múltiplas direções simultaneamente, o que pode ser dispersivo mas também versátil. Você debate, convence e age através da comunicação.',
  'Câncer': 'Marte em Câncer age de forma protetora e indireta. Sua energia é canalizada para defender o lar, a família e o que ama. A motivação é emocional mais do que racional, o que cria uma determinação surpreendentemente poderosa.',
  'Leão': 'Marte em Leão age com estilo, paixão e uma necessidade de que a ação seja notada. Você tem uma energia criativa e performática — faz as coisas com garra e procura deixar uma marca. A generosidade guia muitas de suas ações.',
  'Virgem': 'Marte em Virgem age com precisão, eficiência e um senso apurado de onde cada esforço deve ser aplicado. Você trabalha meticulosamente e com um padrão de qualidade elevado. Sua energia vai para o aperfeiçoamento e para o serviço útil.',
  'Libra': 'Marte em Libra age de forma diplomática e orientada à cooperação. Você age melhor em parceria e busca o equilíbrio mesmo em situações de conflito. Às vezes a indecisão pode bloquear a ação — confiar em seu julgamento é essencial.',
  'Escorpião': 'Marte em Escorpião — co-regente tradicional — age com uma intensidade e uma determinação que raramente desiste. Você possui uma força de vontade quase inabalável e uma capacidade estratégica de esperar o momento exato para agir. Sua energia transformadora é profunda.',
  'Sagitário': 'Marte em Sagitário age com entusiasmo, otimismo e uma energia aventureira. Você é melhor quando tem liberdade para explorar e testar limites. Sua ação é inspirada por uma visão maior e por ideais que valem a pena defender.',
  'Capricórnio': 'Marte em Capricórnio — exaltado — age com disciplina, ambição e uma paciência estratégica rara. Você sabe que as grandes conquistas exigem tempo e não desiste por cansaço. Sua energia é orientada ao resultado concreto e duradouro.',
  'Aquário': 'Marte em Aquário age de forma inovadora e coletiva. Sua energia é direcionada a causas maiores do que o benefício pessoal, e você age melhor quando luta por princípios ou pelo grupo. Há uma originalidade em sua forma de resolver problemas.',
  'Peixes': 'Marte em Peixes age de forma fluida, intuitiva e às vezes indistinta. Sua energia se expressa melhor através da arte, da espiritualidade e do cuidado. Pode haver dificuldade em afirmar os próprios desejos — aprender a agir com intenção clara é o crescimento desta posição.',
};

const JUPITER_EM: Record<string, string> = {
  'Áries': 'Júpiter em Áries expande sua vida através da coragem, da iniciativa e da disposição de ser o primeiro. As maiores bênçãos chegam quando você lidera, começa novos projetos e age com ousadia. A sorte te favorece nos começos.',
  'Touro': 'Júpiter em Touro expande através da estabilidade, dos recursos materiais e do prazer sensorial. A prosperidade chega de forma consistente e duradoura quando você constrói com paciência. Você tem um dom natural para atrair abundância através da criação de valor concreto.',
  'Gêmeos': 'Júpiter em Gêmeos expande através do conhecimento, da comunicação e das conexões. Você aprende facilmente e tem muitas oportunidades através do que comunica e das pessoas com quem se relaciona. A sorte está nas palavras, nas ideias e nas redes.',
  'Câncer': 'Júpiter em Câncer — exaltado — expande através do lar, da família e do cultivo emocional. Você tem uma capacidade especial de criar ambientes de abundância e cuidado. As bênçãos chegam através das relações íntimas e do desenvolvimento da sensibilidade.',
  'Leão': 'Júpiter em Leão expande através da criatividade, da expressão pessoal e da generosidade. Você tem um talento especial para inspirar outros com seu carisma e visão. As oportunidades chegam quando você brilha com autenticidade.',
  'Virgem': 'Júpiter em Virgem expande através do serviço, do aperfeiçoamento e da atenção aos detalhes. As maiores oportunidades chegam quando você aplica seu talento analítico a problemas que precisam de soluções precisas e úteis.',
  'Libra': 'Júpiter em Libra expande através das parcerias, da arte e da busca pela harmonia. Você tem uma capacidade especial de prosperar através de relacionamentos e colaborações. A justiça e a beleza são os temas pelos quais suas maiores bênçãos se manifestam.',
  'Escorpião': 'Júpiter em Escorpião expande através da transformação profunda, da investigação e dos recursos compartilhados. Há uma capacidade especial de regeneração após crises — cada queda é seguida de uma ascensão maior. Os segredos do mundo estão acessíveis a você.',
  'Sagitário': 'Júpiter em Sagitário — domicílio — é a posição mais expansiva e abençoada do zodíaco. Você foi feito para crescer, explorar e expandir horizontes em todas as direções. A fé e o otimismo são seus maiores trunfos para atrair oportunidades.',
  'Capricórnio': 'Júpiter em Capricórnio expande através da disciplina, da construção estruturada e da responsabilidade. Você prospera quando investe esforço consistente em objetivos de longo prazo. As recompensas chegam de forma sólida e duradoura.',
  'Aquário': 'Júpiter em Aquário expande através da inovação, da comunidade e dos ideais humanitários. Você tem uma capacidade especial de trazer visões do futuro para o presente e de prosperar em ambientes de liberdade e originalidade.',
  'Peixes': 'Júpiter em Peixes — outro domicílio — expande através da espiritualidade, da compaixão e da criatividade. Você tem uma conexão especial com o invisível e uma capacidade de receber inspiração de fontes que transcendem o racional. A fé é seu maior recurso.',
};

const SATURNO_EM: Record<string, string> = {
  'Áries': 'Saturno em Áries traz a lição do controle da impulsividade e do desenvolvimento de paciência estratégica. Você aprende que ação efetiva requer preparação. O maior crescimento vem da coragem disciplinada — não do impulso descontrolado.',
  'Touro': 'Saturno em Touro ensina sobre a relação com recursos, estabilidade e o valor do que é construído lentamente. Você aprende que a verdadeira segurança vem de dentro e não pode ser comprada. Paciência e perseverança são suas ferramentas de crescimento.',
  'Gêmeos': 'Saturno em Gêmeos traz a lição da comunicação responsável e do pensamento profundo. Você aprende a qualidade sobre a quantidade nas palavras e nas informações. O desenvolvimento do pensamento sistemático é seu maior crescimento.',
  'Câncer': 'Saturno em Câncer ensina sobre fronteiras emocionais e a arte de cuidar sem perder a si mesmo. Frequentemente há padrões familiares de responsabilidade precoce que precisam ser examinados. O amadurecimento emocional é profundo e transformador.',
  'Leão': 'Saturno em Leão traz a lição da expressão autêntica além da necessidade de aprovação. Você aprende que o verdadeiro brilho não precisa de validação externa. A criatividade que nasce do interior — não do ego — é a conquista desta posição.',
  'Virgem': 'Saturno em Virgem ensina sobre discernimento, serviço e os limites da perfeição. Você aprende que a excelência tem limites saudáveis e que o autoconhecimento vem de aceitar a imperfeição. O crescimento está no equilíbrio entre o ideal e o possível.',
  'Libra': 'Saturno em Libra — exaltado — traz a lição das parcerias responsáveis e do equilíbrio genuíno. Você aprende sobre compromisso, justiça e o valor das relações construídas com maturidade. As parcerias mais duradouras da sua vida são forjadas com consciência.',
  'Escorpião': 'Saturno em Escorpião ensina sobre o poder e sua sombra, sobre perda e regeneração. Você aprende a lidar com as forças mais profundas e às vezes mais sombrias da existência humana. A transformação forçada pelas circunstâncias é o caminho desta posição.',
  'Sagitário': 'Saturno em Sagitário traz a lição da sabedoria responsável e da fé fundamentada. Você aprende a distinguir entre crença genuína e fuga. O crescimento vem de comprometer-se com uma visão de mundo que seja ao mesmo tempo expansiva e enraizada na realidade.',
  'Capricórnio': 'Saturno em Capricórnio — domicílio — é a posição de maior expressão do planeta. Você possui uma capacidade natural de estrutura, disciplina e construção de legado que pode conquistar o que quiser com paciência e comprometimento consistente.',
  'Aquário': 'Saturno em Aquário — outro domicílio — traz a lição da liberdade responsável e da inovação com estrutura. Você aprende a construir o futuro de forma sustentável, equilibrando originalidade com responsabilidade coletiva.',
  'Peixes': 'Saturno em Peixes ensina sobre o discernimento espiritual e os limites da compaixão. Você aprende a distinguir entre sacrifício genuíno e auto-abandono. O crescimento vem de ancorar a espiritualidade em ações concretas e escolhas conscientes.',
};

// ─── Casas Astrológicas ───────────────────────────────────────────────────────

const CASAS_DESC: Record<number, { area: string; desc: string }> = {
  1: { area: 'Identidade e Aparência', desc: 'A Casa 1 é o "eu" que o mundo vê — sua personalidade imediata, aparência e a energia que projeta em novos começos.' },
  2: { area: 'Recursos e Valores', desc: 'A Casa 2 governa seus recursos materiais, financeiros e seus valores mais fundamentais — o que você considera valioso e seguro.' },
  3: { area: 'Comunicação e Aprendizado', desc: 'A Casa 3 rege a mente cotidiana, a comunicação, os estudos iniciais e os relacionamentos com irmãos e vizinhança.' },
  4: { area: 'Lar e Raízes', desc: 'A Casa 4 governa o lar, a família, as raízes e o fundamento emocional — onde você recarrega e onde se sente verdadeiramente em casa.' },
  5: { area: 'Criatividade e Prazer', desc: 'A Casa 5 rege a expressão criativa, o romance, os filhos e o prazer — onde você brinca, cria e se expressa com alegria.' },
  6: { area: 'Saúde e Rotina', desc: 'A Casa 6 governa a saúde, as rotinas diárias e o trabalho cotidiano — os hábitos que constroem ou minam seu bem-estar.' },
  7: { area: 'Parcerias', desc: 'A Casa 7 rege relacionamentos significativos — amor, casamento, sócios — e o que você busca no outro como complemento.' },
  8: { area: 'Transformação e Partilha', desc: 'A Casa 8 governa a transformação profunda, heranças, recursos compartilhados, sexualidade e os ciclos de morte e renascimento.' },
  9: { area: 'Expansão e Filosofia', desc: 'A Casa 9 rege viagens longas, filosofia, espiritualidade, ensino superior e a busca pelo significado maior da existência.' },
  10: { area: 'Carreira e Legado', desc: 'A Casa 10 governa a carreira, a reputação pública e o legado que você constrói no mundo — o que deixará para a posteridade.' },
  11: { area: 'Comunidade e Ideais', desc: 'A Casa 11 rege os grupos, as amizades profundas, os ideais coletivos e os sonhos que transcendem o individual.' },
  12: { area: 'Espiritualidade e Inconsciente', desc: 'A Casa 12 governa o inconsciente profundo, a espiritualidade, o isolamento e os padrões ocultos que atuam por trás das cenas da vida.' },
};

// ─── Nodos Lunares ────────────────────────────────────────────────────────────

const NODO_NORTE_EM: Record<string, { norte: string; sul: string }> = {
  'Áries': {
    norte: 'Nodo Norte em Áries convida você a desenvolver autonomia, coragem e iniciativa nesta encarnação. O caminho evolutivo passa por aprender a agir por si mesmo, liderar com confiança e afirmar sua identidade sem depender da aprovação alheia.',
    sul: 'O Nodo Sul em Libra indica que em vidas passadas você foi o mediador, o diplomata que sempre colocou o outro antes de si. Agora é hora de equilibrar essa sabedoria relacional com uma afirmação mais corajosa do self.',
  },
  'Touro': {
    norte: 'Nodo Norte em Touro convida ao desenvolvimento da estabilidade, do prazer simples e da conexão com o corpo e com a terra. Aprender a valorizar o que é concreto e nutrir-se do presente é o caminho evolutivo.',
    sul: 'O Nodo Sul em Escorpião traz memórias de crises, transformações e intensidade. O aprendizado agora é encontrar paz na simplicidade e no que é estável.',
  },
  'Gêmeos': {
    norte: 'Nodo Norte em Gêmeos convida ao desenvolvimento da curiosidade, da comunicação e da abertura para diferentes perspectivas. O caminho evolutivo está na coleta de informações e nas conexões variadas.',
    sul: 'O Nodo Sul em Sagitário traz uma sabedoria filosófica de vidas anteriores. Agora é hora de descer das grandes verdades e encontrar valor no cotidiano e nas conversas simples.',
  },
  'Câncer': {
    norte: 'Nodo Norte em Câncer convida ao desenvolvimento da sensibilidade, do cuidado e da conexão com as raízes. O caminho evolutivo passa pelo cultivo do lar interior e pela expressão vulnerável das emoções.',
    sul: 'O Nodo Sul em Capricórnio traz habilidades de estrutura e disciplina de vidas passadas. Agora é hora de equilibrar a competência com a ternura.',
  },
  'Leão': {
    norte: 'Nodo Norte em Leão convida ao desenvolvimento da criatividade, da expressão pessoal e da capacidade de brilhar com autenticidade. O caminho evolutivo está em permitir-se ser visto e apreciado.',
    sul: 'O Nodo Sul em Aquário traz uma sabedoria coletiva e desapegada. Agora é hora de personificar e criar, não apenas teorizar e pertencer ao grupo.',
  },
  'Virgem': {
    norte: 'Nodo Norte em Virgem convida ao desenvolvimento da análise, do serviço e da atenção aos detalhes da vida cotidiana. O caminho evolutivo está no trabalho concreto e no cuidado com corpo e saúde.',
    sul: 'O Nodo Sul em Peixes traz uma espiritualidade e uma sensibilidade profunda de vidas anteriores. Agora é hora de ancorar esses dons na realidade prática.',
  },
  'Libra': {
    norte: 'Nodo Norte em Libra convida ao desenvolvimento das parcerias, da diplomacia e da busca pela harmonia. O caminho evolutivo está no aprendizado das relações e na arte do equilíbrio.',
    sul: 'O Nodo Sul em Áries traz uma energia de ação solitária e pioneira de vidas passadas. Agora é hora de aprender a cooperar e a compartilhar o caminho.',
  },
  'Escorpião': {
    norte: 'Nodo Norte em Escorpião convida ao mergulho na profundidade, à transformação e ao desenvolvimento do poder interior. O caminho evolutivo está em abraçar a intensidade como catalisadora do crescimento.',
    sul: 'O Nodo Sul em Touro traz habilidades de estabilidade e recursos materiais de vidas anteriores. Agora é hora de ir além do conforto e arriscar a transformação.',
  },
  'Sagitário': {
    norte: 'Nodo Norte em Sagitário convida à expansão, à busca pelo significado e à abertura filosófica. O caminho evolutivo está nas grandes viagens — internas e externas — e na construção de uma visão de mundo abrangente.',
    sul: 'O Nodo Sul em Gêmeos traz uma mente ágil e comunicativa de vidas anteriores. Agora é hora de sintetizar toda essa informação em sabedoria.',
  },
  'Capricórnio': {
    norte: 'Nodo Norte em Capricórnio convida à construção de estruturas, ao desenvolvimento da disciplina e ao estabelecimento de um legado concreto no mundo. O caminho evolutivo está na responsabilidade e na realização material.',
    sul: 'O Nodo Sul em Câncer traz uma sabedoria emocional e familiar de vidas anteriores. Agora é hora de trazer essa nutrição para o mundo público.',
  },
  'Aquário': {
    norte: 'Nodo Norte em Aquário convida ao desenvolvimento da originalidade, da visão coletiva e da inovação. O caminho evolutivo está em contribuir para um futuro mais livre e igualitário.',
    sul: 'O Nodo Sul em Leão traz uma história de criação pessoal e expressão individual. Agora é hora de colocar os dons a serviço do coletivo.',
  },
  'Peixes': {
    norte: 'Nodo Norte em Peixes convida ao desenvolvimento da compaixão, da fé e da conexão espiritual. O caminho evolutivo está em soltar o controle e confiar na corrente maior da vida.',
    sul: 'O Nodo Sul em Virgem traz habilidades de análise e serviço de vidas anteriores. Agora é hora de integrar esses dons práticos com a entrega espiritual.',
  },
};

// ─── Síntese final ────────────────────────────────────────────────────────────

function getSyntheseFinal(sol: Signo, lua: Signo, asc: Signo, elementoSol: string): string {
  const elementoLua = ELEMENTOS[lua] || 'Água';
  const elementoAsc = ELEMENTOS[asc] || 'Fogo';

  const combinacao = elementoSol === elementoLua
    ? `Seu Sol e sua Lua compartilham o elemento ${elementoSol}, criando uma harmonia interna entre sua essência consciente e seu mundo emocional. Você tende a agir e sentir de forma alinhada, o que confere uma coerência que os outros percebem como confiabilidade.`
    : `Seu Sol em ${elementoSol} e sua Lua em ${elementoLua} criam uma tensão criativa entre sua identidade consciente e seu mundo emocional. Esta polaridade, quando integrada, torna-se uma das suas maiores fontes de riqueza interior — você é capaz de acessar perspectivas que pessoas com natureza mais uniforme raramente alcançam.`;

  return `${combinacao} Seu Ascendente em ${asc} (elemento ${elementoAsc}) completa o quadro, definindo como você se apresenta ao mundo antes que as pessoas conheçam sua profundidade. Juntos, esses três pontos — Sol em ${sol}, Lua em ${lua} e Ascendente em ${asc} — formam a tríade fundamental da sua personalidade astrológica, um mapa único que ninguém mais possui exatamente igual.`;
}

// ─── Função principal ─────────────────────────────────────────────────────────

export interface MapaInput {
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:MM
  birthCity: string;
}

export function generateMapaAstral(input: MapaInput): string {
  const { fullName, birthDate, birthTime, birthCity } = input;

  const date = new Date(`${birthDate}T${birthTime || '12:00'}:00Z`);
  const sol = calcularSol(date);
  const lua = calcularLua(date);
  const asc = calcularAscendente(date, birthTime || '12:00');
  const mercurio = calcularMercurio(date, sol);
  const venus = calcularVenus(date, sol);
  const marte = calcularMarte(date);
  const jupiter = calcularJupiter(date);
  const saturno = calcularSaturno(date);
  const urano = calcularUrano(date);
  const netuno = calcularNetuno(date);
  const nodoNorte = calcularNodoNorte(date);
  const nodoSul = SIGNOS[(SIGNOS.indexOf(nodoNorte) + 6) % 12];

  const elementoSol = ELEMENTOS[sol] || 'Fogo';
  const elementoLua = ELEMENTOS[lua] || 'Água';
  const elementoAsc = ELEMENTOS[asc] || 'Fogo';

  const ascIndex = SIGNOS.indexOf(asc);
  const solCasa = calcularCasa(ascIndex, SIGNOS.indexOf(sol));
  const luaCasa = calcularCasa(ascIndex, SIGNOS.indexOf(lua));
  const mercurioCasa = calcularCasa(ascIndex, SIGNOS.indexOf(mercurio));
  const venusCasa = calcularCasa(ascIndex, SIGNOS.indexOf(venus));
  const marteCasa = calcularCasa(ascIndex, SIGNOS.indexOf(marte));
  const jupiterCasa = calcularCasa(ascIndex, SIGNOS.indexOf(jupiter));
  const saturnoCasa = calcularCasa(ascIndex, SIGNOS.indexOf(saturno));

  const nodoData = NODO_NORTE_EM[nodoNorte] || NODO_NORTE_EM['Áries'];

  const lines: string[] = [];

  // ── Cabeçalho
  lines.push(`## ☉ Mapa Astral de ${fullName}`);
  lines.push(`**Data:** ${birthDate} · **Hora:** ${birthTime} · **Local:** ${birthCity}`);
  lines.push('');

  // ── Panorama Geral
  lines.push('## Panorama Geral');
  lines.push(`${fullName}, seu mapa astral é um retrato celeste único do momento em que você chegou ao mundo. Cada planeta, cada signo e cada casa falam de facetas diferentes de quem você é e do que veio aprender e oferecer nesta existência.`);
  lines.push('');
  lines.push(`**Sua configuração fundamental:**`);
  lines.push(`- ${SIMBOLOS[sol]} **Sol em ${sol}** (Casa ${solCasa}) — ${elementoSol}`);
  lines.push(`- ${SIMBOLOS[lua]} **Lua em ${lua}** (Casa ${luaCasa}) — ${elementoLua}`);
  lines.push(`- ${SIMBOLOS[asc]} **Ascendente em ${asc}** — ${elementoAsc}`);
  lines.push(`- ☿ **Mercúrio em ${mercurio}** (Casa ${mercurioCasa})`);
  lines.push(`- ♀ **Vênus em ${venus}** (Casa ${venusCasa})`);
  lines.push(`- ♂ **Marte em ${marte}** (Casa ${marteCasa})`);
  lines.push(`- ♃ **Júpiter em ${jupiter}** (Casa ${jupiterCasa})`);
  lines.push(`- ♄ **Saturno em ${saturno}** (Casa ${saturnoCasa})`);
  lines.push(`- ⛢ **Urano em ${urano}** · ♆ **Netuno em ${netuno}`);
  lines.push(`- ☊ **Nodo Norte em ${nodoNorte}** / Nodo Sul em ${nodoSul}`);
  lines.push('');

  // ── Sol
  lines.push('## ☀ Sol — Sua Essência');
  lines.push(`**${sol} ${SIMBOLOS[sol]} · ${elementoSol} · Regente: ${PLANETAS_REGENTES[sol]} · Casa ${solCasa}**`);
  lines.push('');
  lines.push(SOL_EM[sol] || '');
  lines.push('');

  // ── Lua
  lines.push('## ☽ Lua — Seu Mundo Emocional');
  lines.push(`**${lua} ${SIMBOLOS[lua]} · ${elementoLua} · Casa ${luaCasa}**`);
  lines.push('');
  lines.push(LUA_EM[lua] || '');
  lines.push('');

  // ── Ascendente
  lines.push('## ⇡ Ascendente — Sua Máscara Social');
  lines.push(`**${asc} ${SIMBOLOS[asc]} · ${elementoAsc} · Regente: ${PLANETAS_REGENTES[asc]}**`);
  lines.push('');
  lines.push(ASCENDENTE_EM[asc] || '');
  lines.push('');

  // ── Mercúrio
  lines.push('## ☿ Mercúrio — Mente e Comunicação');
  lines.push(`**${mercurio} ${SIMBOLOS[mercurio]} · Casa ${mercurioCasa}**`);
  lines.push('');
  lines.push(MERCURIO_EM[mercurio] || '');
  lines.push('');

  // ── Vênus
  lines.push('## ♀ Vênus — Amor e Atração');
  lines.push(`**${venus} ${SIMBOLOS[venus]} · Casa ${venusCasa}**`);
  lines.push('');
  lines.push(VENUS_EM[venus] || '');
  lines.push('');

  // ── Marte
  lines.push('## ♂ Marte — Ação e Desejo');
  lines.push(`**${marte} ${SIMBOLOS[marte]} · Casa ${marteCasa}**`);
  lines.push('');
  lines.push(MARTE_EM[marte] || '');
  lines.push('');

  // ── Júpiter
  lines.push('## ♃ Júpiter — Expansão e Bênçãos');
  lines.push(`**${jupiter} ${SIMBOLOS[jupiter]} · Casa ${jupiterCasa}**`);
  lines.push('');
  lines.push(JUPITER_EM[jupiter] || '');
  lines.push('');

  // ── Saturno
  lines.push('## ♄ Saturno — Lições e Estrutura');
  lines.push(`**${saturno} ${SIMBOLOS[saturno]} · Casa ${saturnoCasa}**`);
  lines.push('');
  lines.push(SATURNO_EM[saturno] || '');
  lines.push('');

  // ── Transpessoais
  lines.push('## ⛢ Planetas Transpessoais');
  lines.push(`**Urano em ${urano} ${SIMBOLOS[urano]}** — O planeta da revolução e originalidade marca sua geração com temas de ${urano === 'Áries' ? 'identidade e autonomia' : urano === 'Touro' ? 'transformação dos valores e da economia' : urano === 'Gêmeos' ? 'revolução na comunicação e tecnologia' : urano === 'Câncer' ? 'transformação do lar e da família' : urano === 'Leão' ? 'revolução criativa e da expressão pessoal' : urano === 'Virgem' ? 'inovação na saúde e nos serviços' : urano === 'Libra' ? 'transformação nas relações e na justiça' : urano === 'Escorpião' ? 'revolução nas estruturas de poder e sexualidade' : urano === 'Sagitário' ? 'transformação da filosofia e espiritualidade' : urano === 'Capricórnio' ? 'revolução nas estruturas e governo' : urano === 'Aquário' ? 'avanços tecnológicos e humanitários' : 'dissolução de fronteiras e despertar espiritual'}.`);
  lines.push('');
  lines.push(`**Netuno em ${netuno} ${SIMBOLOS[netuno]}** — O planeta da espiritualidade e dos sonhos marca sua geração com uma sensibilidade especial para temas de ${netuno === 'Capricórnio' ? 'espiritualização das estruturas e responsabilidade coletiva' : netuno === 'Aquário' ? 'utopias coletivas e espiritualidade tecnológica' : netuno === 'Peixes' ? 'dissolução de fronteiras e compaixão universal' : netuno === 'Áries' ? 'espiritualidade guerreira e idealismo de ação' : 'transcendência e compaixão coletiva'}.`);
  lines.push('');

  // ── Nodos
  lines.push('## ☊ Nodos Lunares — Karma e Destino');
  lines.push(`**Nodo Norte em ${nodoNorte} ${SIMBOLOS[nodoNorte]} / Nodo Sul em ${nodoSul} ${SIMBOLOS[nodoSul]}**`);
  lines.push('');
  lines.push(nodoData.norte);
  lines.push('');
  lines.push(nodoData.sul);
  lines.push('');

  // ── Casas
  lines.push('## ⌂ Casas Astrológicas');
  lines.push(`O Ascendente em ${asc} define o início da Casa 1 e a sequência das demais casas no seu mapa. Abaixo, as áreas temáticas de cada casa e como elas se expressam na sua vida:`);
  lines.push('');
  [1, 4, 7, 10].forEach(n => {
    const signoIndex = ((ascIndex + n - 1) % 12);
    const signo = SIGNOS[signoIndex];
    const casa = CASAS_DESC[n];
    lines.push(`**Casa ${n} — ${signo} ${SIMBOLOS[signo]}** · *${casa.area}* — ${casa.desc}`);
    lines.push('');
  });

  // ── Aspectos
  lines.push('## ✦ Aspectos Planetários Principais');
  lines.push(`Os aspectos revelam como os planetas se comunicam entre si no seu mapa.`);
  lines.push('');
  const aspecto1 = ELEMENTOS[sol] === ELEMENTOS[lua]
    ? `**Sol em ${sol} em trígono com Lua em ${lua}** — Harmonia natural entre sua identidade consciente e seu mundo emocional. Você age e sente de forma mais integrada do que a maioria.`
    : `**Sol em ${sol} em tensão criativa com Lua em ${lua}** — Há uma polaridade entre o que você é e o que sente, o que cria uma riqueza interior profunda e uma motivação de crescimento constante.`;
  lines.push(aspecto1);
  lines.push('');
  lines.push(`**${sol} e ${asc}** — A interação entre seu Sol e Ascendente define a autenticidade com que você se apresenta ao mundo. Em seu caso, há uma coerência entre quem você é internamente e a impressão que projeta.`);
  lines.push('');

  // ── Vida Afetiva
  lines.push('## ♡ Vida Afetiva');
  lines.push(`Sua vida afetiva é moldada principalmente pela posição de **Vênus em ${venus}** e pela **Casa 7** (Parcerias), que começa no signo ${SIGNOS[(ascIndex + 6) % 12]}.`);
  lines.push('');
  lines.push(`No amor, você tende a buscar ${venus === 'Áries' || venus === 'Sagitário' || venus === 'Leão' ? 'parceiros apaixonados, espontâneos e que correspondam à sua intensidade' : venus === 'Touro' || venus === 'Câncer' || venus === 'Capricórnio' ? 'estabilidade, lealdade e profundidade afetiva' : venus === 'Gêmeos' || venus === 'Libra' || venus === 'Aquário' ? 'parceiros que estimulem intelectualmente e que valorizem a liberdade' : 'profundidade emocional, intensidade e uma conexão que vá além da superfície'}. ${VENUS_EM[venus]?.split('.')[0] || ''}.`);
  lines.push('');

  // ── Carreira
  lines.push('## ★ Carreira e Vocação');
  lines.push(`A **Casa 10** (Carreira/Midcéu) está no signo ${SIGNOS[(ascIndex + 9) % 12]}, indicando que sua reputação pública e vocação têm as qualidades desse signo.`);
  lines.push('');
  lines.push(`**Júpiter em ${jupiter}** (Casa ${jupiterCasa}) aponta onde a expansão e as oportunidades profissionais são mais naturais. **Saturno em ${saturno}** (Casa ${saturnoCasa}) indica onde você deve desenvolver estrutura e disciplina para colher resultados duradouros.`);
  lines.push('');
  lines.push(`Seus talentos naturais para a carreira incluem as qualidades de ${sol} (${elementoSol}), que indicam ${elementoSol === 'Fogo' ? 'liderança, iniciativa e capacidade de inspirar' : elementoSol === 'Terra' ? 'praticidade, construção e habilidade para criar valor concreto' : elementoSol === 'Ar' ? 'comunicação, mediação e capacidade intelectual' : 'empatia, intuição e capacidade de cuidar'}.`);
  lines.push('');

  // ── Saúde
  lines.push('## ✚ Saúde e Bem-estar');
  lines.push(`No mapa astral, a **Casa 6** (Saúde e Rotinas) começa no signo ${SIGNOS[(ascIndex + 5) % 12]}.`);
  lines.push('');
  lines.push(`Seu elemento solar — **${elementoSol}** — dá pistas sobre as tendências de saúde: ${elementoSol === 'Fogo' ? 'signos de Fogo tendem a queimar intensamente e precisam de moderação, descanso adequado e atenção ao sistema nervoso' : elementoSol === 'Terra' ? 'signos de Terra tendem à solidez mas podem acumular tensões no corpo; o movimento regular e a conexão com a natureza são essenciais' : elementoSol === 'Ar' ? 'signos de Ar tendem a viver muito na mente; ancorar no corpo através de práticas físicas e respiração é fundamental' : 'signos de Água são altamente sensíveis ao ambiente emocional; fronteiras saudáveis e práticas de purificação energética são essenciais'}.`);
  lines.push('');

  // ── Finanças
  lines.push('## ◆ Finanças e Prosperidade');
  lines.push(`A **Casa 2** (Recursos) começa no signo ${SIGNOS[(ascIndex + 1) % 12]}, revelando sua relação natural com dinheiro e valores.`);
  lines.push('');
  lines.push(`**Júpiter em ${jupiter}** indica onde a prosperidade se expande mais naturalmente — ${JUPITER_EM[jupiter]?.split('.')[0] || ''}. Para ativar a abundância, trabalhe com as qualidades expansivas desta posição.`);
  lines.push('');

  // ── Espiritualidade
  lines.push('## ◎ Espiritualidade e Propósito');
  lines.push(`A **Casa 12** (Espiritualidade) começa no signo ${SIGNOS[(ascIndex + 11) % 12]}, e os **Nodos Lunares** em ${nodoNorte}/${nodoSul} apontam sua direção evolutiva nesta encarnação.`);
  lines.push('');
  lines.push(`Sua jornada espiritual é marcada pela busca de ${sol === 'Escorpião' || sol === 'Peixes' || sol === 'Câncer' ? 'profundidade, transcendência e conexão com o invisível' : sol === 'Sagitário' || sol === 'Aquário' || sol === 'Gêmeos' ? 'sabedoria, visão expansiva e integração de diferentes tradições' : 'enraizamento espiritual, disciplina e manifestação da espiritualidade na vida cotidiana'}. O Nodo Norte em ${nodoNorte} é sua bússola kármica.`);
  lines.push('');

  // ── Síntese Final
  lines.push('## ⊕ Síntese Final');
  lines.push(getSyntheseFinal(sol, lua, asc, elementoSol));
  lines.push('');
  lines.push(`${fullName}, este mapa é um mapa de possibilidades — não de destinos fixos. Os planetas descrevem tendências e potenciais, mas é você quem, com suas escolhas conscientes, determina como essas energias se manifestarão. Use este mapa como um espelho de autoconhecimento e como uma bússola para navegar sua jornada com mais clareza, sabedoria e propósito.`);
  lines.push('');
  lines.push(`✦ *Que os astros iluminem seu caminho* ✦`);

  return lines.join('\n');
}
