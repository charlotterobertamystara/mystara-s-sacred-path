import { TarotCard } from "./tarot-cards";

interface SuitInfo {
  suit: string;
  suitOriginal: string;
  element: string;
  symbol: string;
}

const SUITS: SuitInfo[] = [
  { suit: "Copas", suitOriginal: "Coupes", element: "Água", symbol: "🏆" },
  { suit: "Espadas", suitOriginal: "Épées", element: "Ar", symbol: "⚔️" },
  { suit: "Paus", suitOriginal: "Bâtons", element: "Fogo", symbol: "🪄" },
  { suit: "Ouros", suitOriginal: "Deniers", element: "Terra", symbol: "🪙" },
];

interface CardTemplate {
  rank: string;
  rankOriginal: string;
  keywords: string[];
  upright: string;
  reversed: string;
  archetype: string;
}

const COURT_CARDS: Record<string, CardTemplate> = {
  Valete: {
    rank: "Valete",
    rankOriginal: "Valet",
    keywords: ["mensagem", "juventude", "aprendizado", "curiosidade"],
    upright: "O Valete traz mensagens e novas oportunidades de aprendizado. Representa o início de um caminho, a energia jovem e curiosa que se abre para descobertas.",
    reversed: "Invertido, indica imaturidade, mensagens bloqueadas ou falta de preparo para receber o novo.",
    archetype: "O Mensageiro",
  },
  Cavaleiro: {
    rank: "Cavaleiro",
    rankOriginal: "Cavalier",
    keywords: ["ação", "movimento", "busca", "aventura"],
    upright: "O Cavaleiro representa a ação decidida e o movimento em direção a um objetivo. Traz energia de busca ativa, determinação e coragem para avançar.",
    reversed: "Invertido, indica impulsividade, pressa excessiva ou estagnação por falta de direção.",
    archetype: "O Buscador",
  },
  Rainha: {
    rank: "Rainha",
    rankOriginal: "Reine",
    keywords: ["receptividade", "maturidade", "nutrição", "sabedoria"],
    upright: "A Rainha simboliza a maestria receptiva e intuitiva. Representa a capacidade de nutrir, acolher e governar com sabedoria emocional e maturidade.",
    reversed: "Invertido, indica manipulação emocional, insegurança ou dificuldade em expressar qualidades internas.",
    archetype: "A Governante",
  },
  Rei: {
    rank: "Rei",
    rankOriginal: "Roi",
    keywords: ["domínio", "autoridade", "experiência", "liderança"],
    upright: "O Rei representa o domínio maduro e a autoridade conquistada pela experiência. Traz liderança sábia, controle e capacidade de realizar no mundo externo.",
    reversed: "Invertido, indica tirania, rigidez ou abuso de poder. Pode apontar para insegurança disfarçada de autoritarismo.",
    archetype: "O Soberano",
  },
};

const SUIT_MEANINGS: Record<string, Record<string, { keywords: string[]; upright: string; reversed: string; archetype: string }>> = {
  Copas: {
    "Ás": { keywords: ["amor", "emoção", "novo sentimento", "plenitude"], upright: "O Ás de Copas anuncia o transbordamento do coração: um novo amor, uma emoção profunda ou uma conexão espiritual renovada.", reversed: "Invertido, indica bloqueio emocional, amor não correspondido ou dificuldade em se abrir para sentimentos.", archetype: "A Fonte Emocional" },
    "2": { keywords: ["parceria", "união", "atração", "reciprocidade"], upright: "O 2 de Copas celebra a união verdadeira — um encontro de almas, parceria ou reconciliação baseada no respeito mútuo.", reversed: "Invertido, indica desequilíbrio na relação, separação ou expectativas não alinhadas.", archetype: "A União" },
    "3": { keywords: ["celebração", "amizade", "alegria", "comunidade"], upright: "O 3 de Copas convida à celebração e à alegria compartilhada. Representa festas, amizades e momentos de comunhão.", reversed: "Invertido, indica excesso, fofoca ou alegria superficial que mascara problemas mais profundos.", archetype: "A Celebração" },
    "4": { keywords: ["apatia", "introspecção", "insatisfação", "reavaliação"], upright: "O 4 de Copas pede uma pausa para reavaliar o que realmente importa. Há ofertas sendo ignoradas enquanto se busca algo mais profundo.", reversed: "Invertido, indica despertar de nova motivação, aceitação de oportunidades ou fim de um período apático.", archetype: "A Contemplação" },
    "5": { keywords: ["perda", "luto", "decepção", "esperança oculta"], upright: "O 5 de Copas fala de uma perda que dói, mas convida a olhar para o que ainda resta de pé. O luto é necessário, mas não é o fim.", reversed: "Invertido, indica aceitação da perda, recuperação emocional e capacidade de seguir em frente.", archetype: "O Luto" },
    "6": { keywords: ["nostalgia", "memórias", "inocência", "passado"], upright: "O 6 de Copas traz memórias doces e conexão com a inocência do passado. Pode indicar reencontros ou gestos de generosidade pura.", reversed: "Invertido, indica preso ao passado, infantilidade ou incapacidade de viver o presente.", archetype: "A Nostalgia" },
    "7": { keywords: ["ilusão", "fantasia", "escolhas", "tentação"], upright: "O 7 de Copas apresenta múltiplas possibilidades, mas nem todas são reais. Pede discernimento entre sonho e realidade.", reversed: "Invertido, indica clareza de propósito, escolha consciente ou desilusão necessária.", archetype: "A Fantasia" },
    "8": { keywords: ["abandono", "busca", "desapego", "jornada"], upright: "O 8 de Copas marca o momento de deixar para trás o que já não satisfaz para buscar algo mais significativo.", reversed: "Invertido, indica medo de partir, apego ao conhecido ou retorno a situações antigas.", archetype: "A Partida" },
    "9": { keywords: ["realização", "satisfação", "desejo cumprido", "abundância"], upright: "O 9 de Copas é a carta do desejo realizado. Representa satisfação emocional plena, contentamento e gratidão.", reversed: "Invertido, indica materialismo, vaidade ou satisfação superficial que não preenche o vazio interior.", archetype: "O Desejo Realizado" },
    "10": { keywords: ["felicidade", "família", "harmonia", "completude"], upright: "O 10 de Copas é a carta da felicidade completa — família unida, amor duradouro e harmonia emocional plena.", reversed: "Invertido, indica desarmonias familiares, expectativas irrealistas sobre felicidade ou conflitos no lar.", archetype: "A Felicidade Plena" },
  },
  Espadas: {
    "Ás": { keywords: ["clareza", "verdade", "poder mental", "decisão"], upright: "O Ás de Espadas traz clareza mental cortante, uma nova ideia poderosa ou uma verdade revelada que muda tudo.", reversed: "Invertido, indica confusão mental, uso destrutivo do intelecto ou verdade sendo suprimida.", archetype: "A Verdade" },
    "2": { keywords: ["indecisão", "impasse", "equilíbrio", "negação"], upright: "O 2 de Espadas representa um impasse onde a mente evita uma decisão difícil. Pede coragem para enxergar com clareza.", reversed: "Invertido, indica decisão sendo finalmente tomada, excesso de informações ou conflito exposto.", archetype: "O Impasse" },
    "3": { keywords: ["dor", "separação", "tristeza", "liberação"], upright: "O 3 de Espadas fala de uma dor necessária — um coração partido, uma verdade dolorosa ou uma separação que permite crescimento.", reversed: "Invertido, indica início de cura, superação da dor ou negação do sofrimento.", archetype: "A Dor" },
    "4": { keywords: ["descanso", "recuperação", "meditação", "pausa"], upright: "O 4 de Espadas pede recolhimento e descanso após um período turbulento. A mente precisa de silêncio para se recuperar.", reversed: "Invertido, indica inquietação, ansiedade ou retorno prematuro à ação sem descanso adequado.", archetype: "O Repouso" },
    "5": { keywords: ["conflito", "derrota", "desonra", "humilhação"], upright: "O 5 de Espadas fala de um conflito onde a vitória tem gosto amargo. Pode indicar competição desleal ou perda da dignidade.", reversed: "Invertido, indica reconciliação após conflito, lições aprendidas com a derrota ou arrependimento.", archetype: "O Conflito" },
    "6": { keywords: ["transição", "viagem", "alívio", "mudança"], upright: "O 6 de Espadas representa a transição para águas mais calmas — uma mudança necessária que traz alívio gradual.", reversed: "Invertido, indica resistência à mudança, bagagem emocional não resolvida ou viagem adiada.", archetype: "A Travessia" },
    "7": { keywords: ["estratégia", "astúcia", "engano", "diplomacia"], upright: "O 7 de Espadas pede estratégia inteligente, mas alerta sobre desonestidade. Nem tudo é o que parece.", reversed: "Invertido, indica confissão, verdade revelada ou estratégias falhando por falta de honestidade.", archetype: "A Astúcia" },
    "8": { keywords: ["prisão", "limitação", "vitimismo", "restrição"], upright: "O 8 de Espadas mostra uma sensação de aprisionamento que é parcialmente ilusória. As amarras são mais mentais do que reais.", reversed: "Invertido, indica libertação das limitações mentais, nova perspectiva ou fim do ciclo de vitimismo.", archetype: "A Prisão Mental" },
    "9": { keywords: ["angústia", "pesadelo", "ansiedade", "culpa"], upright: "O 9 de Espadas representa as noites em claro, a angústia que devora e os medos que parecem maiores no escuro.", reversed: "Invertido, indica esperança após desespero, busca de ajuda ou medos sendo enfrentados.", archetype: "A Angústia" },
    "10": { keywords: ["fim", "colapso", "transformação radical", "renascimento"], upright: "O 10 de Espadas marca o fundo do poço — mas com a certeza de que não há mais para onde descer. O renascimento é inevitável.", reversed: "Invertido, indica recusa em aceitar o fim, prolongamento do sofrimento ou lenta recuperação.", archetype: "O Fim e Renascimento" },
  },
  Paus: {
    "Ás": { keywords: ["inspiração", "potencial", "criatividade", "início"], upright: "O Ás de Paus traz um sopro de inspiração criativa, um novo projeto ou a faísca de uma paixão que pede para ser vivida.", reversed: "Invertido, indica frustração criativa, falsos começos ou energia desperdiçada sem foco.", archetype: "A Centelha" },
    "2": { keywords: ["planejamento", "decisão", "visão", "domínio"], upright: "O 2 de Paus representa o momento de planejar e decidir o próximo passo com visão estratégica e ambição saudável.", reversed: "Invertido, indica medo de agir, planejamento excessivo sem execução ou falta de visão.", archetype: "O Planejador" },
    "3": { keywords: ["expansão", "visão de longo prazo", "comércio", "exploração"], upright: "O 3 de Paus celebra a expansão dos horizontes — novos territórios, oportunidades internacionais ou visão ampliada.", reversed: "Invertido, indica atrasos na expansão, obstáculos inesperados ou falta de preparação para crescer.", archetype: "A Expansão" },
    "4": { keywords: ["celebração", "estabilidade", "lar", "harmonia"], upright: "O 4 de Paus marca uma celebração merecida — casamento, conclusão de projeto ou reconhecimento comunitário.", reversed: "Invertido, indica instabilidade no lar, celebração adiada ou falta de apoio da comunidade.", archetype: "A Fundação" },
    "5": { keywords: ["competição", "conflito", "desafio", "crescimento"], upright: "O 5 de Paus traz competição saudável e desafios que estimulam o crescimento. A diversidade de opiniões gera evolução.", reversed: "Invertido, indica conflito destrutivo, evitar confrontos necessários ou competição desleal.", archetype: "A Competição" },
    "6": { keywords: ["vitória", "reconhecimento", "triunfo", "liderança"], upright: "O 6 de Paus celebra uma vitória pública, reconhecimento merecido e o triunfo após o esforço dedicado.", reversed: "Invertido, indica arrogância após sucesso, reconhecimento negado ou queda após a glória.", archetype: "O Triunfo" },
    "7": { keywords: ["defesa", "perseverança", "coragem", "resistência"], upright: "O 7 de Paus representa a defesa corajosa de suas posições e valores. A perseverança será testada.", reversed: "Invertido, indica esgotamento, rendição ou luta em batalhas que não valem a pena.", archetype: "O Defensor" },
    "8": { keywords: ["velocidade", "progresso", "alinhamento", "fluxo"], upright: "O 8 de Paus traz movimento rápido e progresso acelerado. As coisas se alinham e fluem com velocidade.", reversed: "Invertido, indica atrasos frustrantes, desalinhamento ou pressa que causa erros.", archetype: "A Velocidade" },
    "9": { keywords: ["resiliência", "proteção", "vigilância", "força"], upright: "O 9 de Paus representa a resiliência de quem já enfrentou muito e continua de pé, vigilante e forte.", reversed: "Invertido, indica paranoia, esgotamento por excesso de vigilância ou recusa em baixar a guarda.", archetype: "O Resiliente" },
    "10": { keywords: ["sobrecarga", "responsabilidade", "peso", "determinação"], upright: "O 10 de Paus fala do peso das responsabilidades acumuladas. É preciso avaliar o que pode ser delegado ou liberado.", reversed: "Invertido, indica libertação de fardos, delegação ou colapso por não pedir ajuda.", archetype: "O Fardo" },
  },
  Ouros: {
    "Ás": { keywords: ["prosperidade", "oportunidade", "materialização", "semente"], upright: "O Ás de Ouros anuncia uma nova oportunidade material — um emprego, investimento ou a semente de prosperidade futura.", reversed: "Invertido, indica oportunidade perdida, ganância ou dificuldade em materializar planos.", archetype: "A Semente de Ouro" },
    "2": { keywords: ["equilíbrio", "adaptação", "flexibilidade", "malabarismo"], upright: "O 2 de Ouros pede equilíbrio entre diferentes áreas da vida — finanças, trabalho e prazer precisam de harmonia.", reversed: "Invertido, indica desequilíbrio financeiro, desorganização ou resistência a mudanças necessárias.", archetype: "O Equilibrista" },
    "3": { keywords: ["trabalho", "habilidade", "colaboração", "mestria"], upright: "O 3 de Ouros celebra a maestria artesanal, o trabalho em equipe e o reconhecimento das habilidades desenvolvidas.", reversed: "Invertido, indica trabalho medíocre, conflitos na equipe ou habilidades não reconhecidas.", archetype: "O Artesão" },
    "4": { keywords: ["segurança", "possessividade", "controle", "estabilidade"], upright: "O 4 de Ouros representa a segurança financeira, mas alerta para a possessividade e o apego excessivo ao material.", reversed: "Invertido, indica generosidade, liberação do apego material ou perdas financeiras por descuido.", archetype: "O Guardião" },
    "5": { keywords: ["escassez", "isolamento", "pobreza", "espiritualidade"], upright: "O 5 de Ouros fala de dificuldades materiais, mas lembra que a ajuda está disponível para quem aceita recebê-la.", reversed: "Invertido, indica recuperação financeira, fim do isolamento ou ajuda inesperada chegando.", archetype: "O Desamparado" },
    "6": { keywords: ["generosidade", "caridade", "justiça", "reciprocidade"], upright: "O 6 de Ouros celebra a generosidade equilibrada — dar e receber com justiça, gratidão e reciprocidade.", reversed: "Invertido, indica dívidas, desequilíbrio no dar e receber ou caridade com segundas intenções.", archetype: "O Generoso" },
    "7": { keywords: ["paciência", "investimento", "espera", "avaliação"], upright: "O 7 de Ouros pede paciência com os resultados. O que foi plantado precisa de tempo para dar frutos.", reversed: "Invertido, indica impaciência, investimentos mal avaliados ou desistir cedo demais.", archetype: "O Agricultor" },
    "8": { keywords: ["dedicação", "aperfeiçoamento", "foco", "artesanato"], upright: "O 8 de Ouros celebra a dedicação ao trabalho bem-feito, o aperfeiçoamento constante e o foco na qualidade.", reversed: "Invertido, indica perfeccionismo paralisante, trabalho sem paixão ou esforço sem recompensa.", archetype: "O Aprendiz" },
    "9": { keywords: ["abundância", "luxo", "independência", "autoconfiança"], upright: "O 9 de Ouros representa a abundância conquistada por mérito próprio — conforto, independência e prazer refinado.", reversed: "Invertido, indica ostentação, solidão apesar da riqueza ou dependência financeira.", archetype: "A Abundância" },
    "10": { keywords: ["herança", "legado", "família", "riqueza duradoura"], upright: "O 10 de Ouros celebra a riqueza que transcende gerações — legado familiar, estabilidade e prosperidade duradoura.", reversed: "Invertido, indica conflitos por herança, instabilidade financeira familiar ou valores materialistas.", archetype: "O Legado" },
  },
};

function generateMinorArcana(): TarotCard[] {
  const cards: TarotCard[] = [];
  let id = 22; // Start after Major Arcana

  for (const suit of SUITS) {
    // Number cards (Ace to 10)
    const ranks = ["Ás", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    for (const rank of ranks) {
      const meaning = SUIT_MEANINGS[suit.suit][rank];
      cards.push({
        id: id++,
        number: rank === "Ás" ? "Ás" : rank,
        name: `${rank === "Ás" ? "Ás" : rank} de ${suit.suit}`,
        nameOriginal: `${rank === "Ás" ? "As" : rank} de ${suit.suitOriginal}`,
        keywords: meaning.keywords,
        uprightMeaning: meaning.upright,
        reversedMeaning: meaning.reversed,
        symbol: suit.symbol,
        element: suit.element,
        archetype: meaning.archetype,
      });
    }

    // Court cards
    for (const [courtName, template] of Object.entries(COURT_CARDS)) {
      const suitFlavors: Record<string, Record<string, { kw: string[]; up: string; rev: string }>> = {
        Copas: {
          Valete: { kw: ["mensagem de amor", "intuição jovem", "romance", "sensibilidade"], up: "O Valete de Copas traz uma mensagem do coração — um convite ao amor, uma intuição que pede atenção ou o início de um caminho emocional.", rev: "Invertido, indica imaturidade emocional, sedução vazia ou mensagens sentimentais que confundem." },
          Cavaleiro: { kw: ["romance", "proposta", "idealismo", "charme"], up: "O Cavaleiro de Copas chega com uma proposta romântica ou um convite irresistível. Representa o idealista apaixonado que segue o coração.", rev: "Invertido, indica ilusão romântica, promessas vazias ou fuga da realidade através da fantasia." },
          Rainha: { kw: ["compaixão", "intuição", "cuidado", "empatia"], up: "A Rainha de Copas é a mestra da empatia e da intuição. Governa com o coração, oferecendo compaixão e cuidado incondicional.", rev: "Invertida, indica dependência emocional, manipulação sentimental ou intuição sendo ignorada." },
          Rei: { kw: ["sabedoria emocional", "diplomacia", "conselho", "equilíbrio"], up: "O Rei de Copas domina as emoções com sabedoria. É o conselheiro compassivo que equilibra razão e sentimento.", rev: "Invertido, indica repressão emocional, manipulação ou instabilidade disfarçada de controle." },
        },
        Espadas: {
          Valete: { kw: ["vigilância", "curiosidade mental", "espionagem", "verdade"], up: "O Valete de Espadas traz mensagens que exigem discernimento. Representa a mente curiosa e afiada que busca a verdade.", rev: "Invertido, indica fofoca, espionagem mal-intencionada ou uso destrutivo da inteligência." },
          Cavaleiro: { kw: ["velocidade", "ambição", "coragem intelectual", "pressa"], up: "O Cavaleiro de Espadas avança com velocidade e determinação mental. Corta ilusões com a espada da verdade.", rev: "Invertido, indica imprudência verbal, agressividade intelectual ou pressa que causa danos." },
          Rainha: { kw: ["percepção", "independência", "clareza", "verdade direta"], up: "A Rainha de Espadas possui uma percepção penetrante. Fala a verdade sem rodeios e mantém limites claros.", rev: "Invertida, indica frieza emocional, amargura ou uso cruel da inteligência." },
          Rei: { kw: ["autoridade intelectual", "justiça", "lógica", "imparcialidade"], up: "O Rei de Espadas é o juiz justo e o líder intelectual. Governa com lógica imparcial e pensamento estratégico.", rev: "Invertido, indica tirania intelectual, frieza calculista ou abuso de poder através da palavra." },
        },
        Paus: {
          Valete: { kw: ["entusiasmo", "exploração", "novidade", "inspiração"], up: "O Valete de Paus traz notícias excitantes e o entusiasmo de um novo começo criativo. É a faísca da inspiração.", rev: "Invertido, indica ideias sem execução, entusiasmo passageiro ou notícias decepcionantes." },
          Cavaleiro: { kw: ["paixão", "aventura", "impulso", "carisma"], up: "O Cavaleiro de Paus é pura energia e paixão em movimento. Aventureiro carismático que inspira todos ao redor.", rev: "Invertido, indica impulsividade destrutiva, frustração por atrasos ou energia dispersa." },
          Rainha: { kw: ["confiança", "determinação", "carisma", "independência"], up: "A Rainha de Paus brilha com confiança magnética. Lidera pela inspiração, combinando calor humano com determinação.", rev: "Invertida, indica dominação, ciúmes ou energia criativa bloqueada." },
          Rei: { kw: ["visão", "empreendedorismo", "liderança", "coragem"], up: "O Rei de Paus é o líder visionário e empreendedor nato. Transforma ideias em realidade com coragem e carisma.", rev: "Invertido, indica autoritarismo impaciente, expectativas irrealistas ou tirania criativa." },
        },
        Ouros: {
          Valete: { kw: ["estudo", "oportunidade", "dedicação", "aprendizado"], up: "O Valete de Ouros traz oportunidades concretas de crescimento — um curso, proposta ou chance de aprender algo valioso.", rev: "Invertido, indica preguiça, oportunidades desperdiçadas ou foco excessivo no material." },
          Cavaleiro: { kw: ["persistência", "rotina", "confiabilidade", "progresso"], up: "O Cavaleiro de Ouros avança com paciência e determinação inabalável. Progresso lento, mas absolutamente seguro.", rev: "Invertido, indica estagnação, teimosia ou rotina que sufoca o crescimento." },
          Rainha: { kw: ["prosperidade", "praticidade", "nutrição", "generosidade"], up: "A Rainha de Ouros cria abundância ao seu redor. Práctica e generosa, ela nutre e prospera com sabedoria terrena.", rev: "Invertida, indica possessividade, insegurança material ou negligência com o bem-estar." },
          Rei: { kw: ["riqueza", "sucesso", "poder material", "mentor"], up: "O Rei de Ouros é o mestre da prosperidade. Conquistou sucesso material com disciplina e agora guia outros no mesmo caminho.", rev: "Invertido, indica ganância, corrupção ou obsessão pelo status e poder material." },
        },
      };

      const flavor = suitFlavors[suit.suit]?.[courtName];

      cards.push({
        id: id++,
        number: template.rank,
        name: `${courtName} de ${suit.suit}`,
        nameOriginal: `${template.rankOriginal} de ${suit.suitOriginal}`,
        keywords: flavor?.kw || template.keywords,
        uprightMeaning: flavor?.up || template.upright,
        reversedMeaning: flavor?.rev || template.reversed,
        symbol: suit.symbol,
        element: suit.element,
        archetype: template.archetype,
      });
    }
  }

  return cards;
}

export const MINOR_ARCANA = generateMinorArcana();
