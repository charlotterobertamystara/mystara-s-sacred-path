import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MontageGuide = () => {
  return (
    <div className="space-y-4">
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-sm tracking-widest text-foreground uppercase">
            Como Montar seu Gráfico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 font-body text-sm text-foreground/80">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full border border-primary/50 flex items-center justify-center">
                <span className="text-primary font-display text-xs">1</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Imprima o gráfico</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Imprima em papel branco, preferencialmente em tinta preta. O tamanho ideal é A4 ou maior.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full border border-primary/50 flex items-center justify-center">
                <span className="text-primary font-display text-xs">2</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Oriente ao Norte</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Use a aba "Bússola" para encontrar o Norte. Posicione uma ponta do gráfico na direção Norte.
                  Gráficos circulares (ex: 9 Círculos) não precisam de orientação.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full border border-primary/50 flex items-center justify-center">
                <span className="text-primary font-display text-xs">3</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Prepare o testemunho</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Escreva em um pequeno papel: <strong>nome completo</strong>, <strong>data de nascimento</strong> e o <strong>pedido/intenção</strong>.
                  Você também pode usar uma <strong>foto</strong> junto ao pedido.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full border border-primary/50 flex items-center justify-center">
                <span className="text-primary font-display text-xs">4</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Posicione no centro</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Coloque o testemunho (papel ou foto + pedido) exatamente no centro do gráfico impresso.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full border border-primary/50 flex items-center justify-center">
                <span className="text-primary font-display text-xs">5</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Adicione o cristal</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Coloque o cristal indicado sobre ou ao lado do testemunho, no centro do gráfico.
                  Ele potencializa os efeitos espirituais da radiação do gráfico.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full border border-primary/50 flex items-center justify-center">
                <span className="text-primary font-display text-xs">6</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Determine o tempo</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Use a aba "Pêndulo" para consultar por quantos dias manter o gráfico montado.
                  Mantenha em local tranquilo, protegido e limpo.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg border border-accent/30 bg-accent/5">
            <p className="font-body text-xs text-muted-foreground">
              <strong className="text-accent-foreground">Importante:</strong> Mantenha o gráfico em um local onde não seja perturbado. 
              Evite que outras pessoas toquem ou movam durante o período de uso. Ao finalizar, 
              agradeça mentalmente e descarte o papel do testemunho.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MontageGuide;
