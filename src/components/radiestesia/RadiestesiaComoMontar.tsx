import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    numero: 1,
    titulo: "Imprima o Gráfico",
    descricao: "Imprima o gráfico em papel branco, preferencialmente em tinta preta. Tamanho ideal A4 ou maior.",
    icone: "🖨️",
  },
  {
    numero: 2,
    titulo: "Oriente ao Norte",
    descricao: "Use a aba Bússola. Posicione uma ponta do gráfico na direção Norte. Gráficos circulares não precisam de orientação.",
    icone: "🧭",
  },
  {
    numero: 3,
    titulo: "Prepare o Testemunho",
    descricao: "Escreva em papel: nome completo, data de nascimento e pedido/intenção. Pode usar foto junto ao pedido.",
    icone: "✍️",
  },
  {
    numero: 4,
    titulo: "Posicione no Centro",
    descricao: "Coloque o testemunho exatamente no centro do gráfico impresso.",
    icone: "⊕",
  },
  {
    numero: 5,
    titulo: "Adicione o Cristal",
    descricao: "Adicione o cristal indicado sobre ou ao lado do testemunho, no centro do gráfico.",
    icone: "💎",
  },
];

const RadiestesiaComoMontar = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 space-y-3"
    >
      <p className="font-body text-sm text-muted-foreground text-center mb-2">
        Siga os passos abaixo para montar corretamente seu gráfico radiônico
      </p>

      {steps.map((step, i) => (
        <motion.div
          key={step.numero}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="border-border bg-card hover:border-primary/20 transition-colors">
            <CardContent className="flex items-start gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                <span className="text-lg">{step.icone}</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-sm tracking-wider text-primary">
                  {step.numero}. {step.titulo}
                </h3>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  {step.descricao}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default RadiestesiaComoMontar;
