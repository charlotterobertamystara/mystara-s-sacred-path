import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { SIGN_ELEMENT, Element } from "@/lib/astro-compatibility-utils";

interface Props {
  userSun: string;
  partnerSun: string;
  userName: string;
  partnerName: string;
  relationshipType?: string;
}

const COMMUNICATION_TIPS: Record<Element, string[]> = {
  'Fogo': [
    'Seja direto e entusiasmado nas conversas',
    'Dê espaço para eles liderarem algumas discussões',
    'Evite criticar suas ideias publicamente',
    'Mostre admiração genuína pelas conquistas',
  ],
  'Terra': [
    'Seja prático e objetivo ao comunicar',
    'Dê tempo para processarem informações',
    'Demonstre estabilidade e consistência',
    'Evite mudanças abruptas de planos',
  ],
  'Ar': [
    'Engaje em conversas intelectuais estimulantes',
    'Respeite a necessidade de espaço mental',
    'Seja flexível e aberto a novas ideias',
    'Evite cobranças emocionais excessivas',
  ],
  'Água': [
    'Comunique com sensibilidade e empatia',
    'Valide os sentimentos antes de dar soluções',
    'Crie um ambiente seguro para vulnerabilidade',
    'Evite críticas duras ou frieza',
  ],
};

const APPRECIATION_TIPS: Record<Element, string[]> = {
  'Fogo': ['Coragem e iniciativa', 'Paixão e entusiasmo', 'Generosidade e proteção', 'Energia vital contagiante'],
  'Terra': ['Confiabilidade e lealdade', 'Senso prático e realismo', 'Paciência e dedicação', 'Capacidade de construir'],
  'Ar': ['Inteligência e versatilidade', 'Senso de humor e leveza', 'Mente aberta e curiosa', 'Habilidade social'],
  'Água': ['Profundidade emocional', 'Intuição e empatia', 'Capacidade de cuidar', 'Conexão espiritual'],
};

const CONFLICT_TIPS: Record<string, string[]> = {
  'Fogo-Fogo': [
    'Deem tempo para esfriar antes de resolver',
    'Evitem competição — vocês são um time',
    'Canalizem a energia para atividades físicas juntos',
  ],
  'Terra-Terra': [
    'Evitem teimosia — flexibilidade é chave',
    'Busquem soluções práticas e concretas',
    'Não deixem conflitos se acumularem',
  ],
  'Ar-Ar': [
    'Não racionalizem demais os sentimentos',
    'Comprometam-se com decisões concretas',
    'Voltem ao corpo — atividades físicas ajudam',
  ],
  'Água-Água': [
    'Cuidado com projeções emocionais',
    'Deem espaço para processar sentimentos individualmente',
    'Evitem afundar juntos — busquem leveza',
  ],
  'Fogo-Terra': [
    'Fogo: pratique paciência e planejamento',
    'Terra: permita-se mais espontaneidade',
    'Encontrem ritmo que respeite ambos',
  ],
  'Fogo-Ar': [
    'Transformem discussões em brainstorming',
    'Ar: dê combustível para o entusiasmo de Fogo',
    'Fogo: ouça as ideias de Ar com curiosidade',
  ],
  'Fogo-Água': [
    'Fogo: suavize a intensidade da abordagem',
    'Água: não leve tudo para o lado pessoal',
    'Busquem atividades que integrem ação e emoção',
  ],
  'Terra-Ar': [
    'Terra: abra-se para novas perspectivas',
    'Ar: valorize a estabilidade que Terra oferece',
    'Encontrem projetos que unam ideias e prática',
  ],
  'Terra-Água': [
    'Ambos são receptivos — alguém precisa iniciar',
    'Terra: valide emoções antes de soluções',
    'Água: aprecie o cuidado prático de Terra',
  ],
  'Ar-Água': [
    'Ar: desenvolva mais sensibilidade emocional',
    'Água: aceite que nem tudo precisa ser profundo',
    'Encontrem um meio-termo entre lógica e sentimento',
  ],
};

const GOALS_TIPS: Record<string, string[]> = {
  'Fogo': ['Aventuras e viagens', 'Projetos empreendedores', 'Esportes e competições', 'Causas que inspiram'],
  'Terra': ['Construir patrimônio', 'Criar uma casa acolhedora', 'Estabilidade financeira', 'Projetos de longo prazo'],
  'Ar': ['Aprender coisas novas juntos', 'Networking e eventos sociais', 'Viagens culturais', 'Projetos criativos'],
  'Água': ['Crescimento espiritual conjunto', 'Aprofundar a conexão emocional', 'Criar memórias significativas', 'Ajudar outros'],
};

export default function PracticalTips({ userSun, partnerSun, userName, partnerName, relationshipType }: Props) {
  const userEl = SIGN_ELEMENT[userSun] || 'Fogo';
  const partnerEl = SIGN_ELEMENT[partnerSun] || 'Fogo';
  const comboKey = `${userEl}-${partnerEl}`;
  const reverseKey = `${partnerEl}-${userEl}`;
  const conflictTips = CONFLICT_TIPS[comboKey] || CONFLICT_TIPS[reverseKey] || CONFLICT_TIPS[`${userEl}-${userEl}`] || [];

  const tips = [
    {
      icon: '🗣️',
      title: 'Como Melhorar a Comunicação',
      subtitle: `Baseado em ${userEl} + ${partnerEl}`,
      items: [
        `Com ${partnerName} (${partnerEl}):`,
        ...COMMUNICATION_TIPS[partnerEl]?.slice(0, 2) || [],
        `Para você (${userEl}):`,
        ...COMMUNICATION_TIPS[userEl]?.slice(0, 2) || [],
      ],
    },
    {
      icon: '💝',
      title: 'O Que Valorizar Um no Outro',
      subtitle: 'Qualidades a celebrar',
      items: [
        `Em ${partnerName}:`,
        ...APPRECIATION_TIPS[partnerEl]?.slice(0, 2) || [],
        `Em você:`,
        ...APPRECIATION_TIPS[userEl]?.slice(0, 2) || [],
      ],
    },
    {
      icon: '⚔️',
      title: 'Como Lidar com Conflitos',
      subtitle: `Dinâmica ${userEl} × ${partnerEl}`,
      items: conflictTips,
    },
    {
      icon: '🎯',
      title: 'Objetivos em Comum',
      subtitle: 'Onde podem crescer juntos',
      items: [
        ...GOALS_TIPS[userEl]?.slice(0, 2) || [],
        ...GOALS_TIPS[partnerEl]?.slice(0, 2) || [],
      ].filter((v, i, a) => a.indexOf(v) === i),
    },
  ];

  return (
    <div className="space-y-2">
      {tips.map((tip, idx) => (
        <TipCard key={idx} {...tip} />
      ))}
    </div>
  );
}

function TipCard({ icon, title, subtitle, items }: { icon: string; title: string; subtitle: string; items: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-border bg-card overflow-hidden">
        <CollapsibleTrigger className="w-full p-3 flex items-center justify-between text-left">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <div>
              <p className="font-display text-xs tracking-wider text-foreground">{title}</p>
              <p className="text-[9px] text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <span className="text-muted-foreground text-xs">{open ? '−' : '+'}</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 pb-3 space-y-1 border-t border-border pt-2">
            {items.map((item, i) => (
              <p key={i} className={`text-[10px] ${item.includes(':') && !item.includes('Com') && !item.includes('Em') && !item.includes('Para') ? 'text-muted-foreground' : item.includes(':') ? 'text-primary font-display tracking-wider mt-2 first:mt-0' : 'text-muted-foreground'}`}>
                {!item.includes(':') ? `• ${item}` : item}
              </p>
            ))}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
