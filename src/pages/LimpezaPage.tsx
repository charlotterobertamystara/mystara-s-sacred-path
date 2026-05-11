import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { topicosBanhos, topicoDefumacoes, type Banho, type Defumacao } from "@/data/limpeza-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

const LimpezaPage = () => {
  const [selectedBanho, setSelectedBanho] = useState<Banho | null>(null);
  const [selectedDefumacao, setSelectedDefumacao] = useState<Defumacao | null>(null);

  return (
    <div className="mx-auto max-w-lg px-4 pt-6 pb-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        {/* Header */}
        <div className="text-center">
          <span className="text-4xl">🌿</span>
          <h1 className="mt-2 font-display text-xl tracking-widest text-foreground">Limpeza Espiritual</h1>
          <p className="mt-1 font-body text-sm text-muted-foreground italic">
            Banhos, ervas e defumações para purificação
          </p>
        </div>

        {/* Tabs: Banhos vs Defumações */}
        <Tabs defaultValue="banhos" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="banhos" className="font-display text-xs tracking-wider">
              🛁 Banhos
            </TabsTrigger>
            <TabsTrigger value="defumacoes" className="font-display text-xs tracking-wider">
              💨 Defumações
            </TabsTrigger>
          </TabsList>

          {/* === BANHOS === */}
          <TabsContent value="banhos" className="mt-4">
            <Accordion type="single" collapsible className="space-y-2">
              {topicosBanhos.map((topico, ti) => (
                <motion.div
                  key={topico.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ti * 0.06 }}
                >
                  <AccordionItem value={topico.id} className="gradient-card rounded-xl border border-border px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{topico.icon}</span>
                        <div className="text-left">
                          <h3 className="font-display text-sm tracking-wider text-foreground">{topico.titulo}</h3>
                          <p className="text-[11px] text-muted-foreground">{topico.descricao}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pb-2">
                        {topico.banhos.map((banho, bi) => (
                          <motion.button
                            key={banho.nome}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: bi * 0.03 }}
                            onClick={() => setSelectedBanho(banho)}
                            className="flex w-full items-center gap-3 rounded-lg border border-border/50 bg-background/50 p-3 text-left transition-all hover:border-primary/30 hover:shadow-sm"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {bi + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-display text-xs tracking-wider text-foreground">{banho.nome}</p>
                              <p className="truncate text-[10px] text-muted-foreground">
                                {banho.ingredientes.slice(0, 3).join(" · ")}
                              </p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </TabsContent>

          {/* === DEFUMAÇÕES === */}
          <TabsContent value="defumacoes" className="mt-4 space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="gradient-card rounded-xl border border-border p-4"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">{topicoDefumacoes.icon}</span>
                <div>
                  <h3 className="font-display text-sm tracking-wider text-foreground">{topicoDefumacoes.titulo}</h3>
                  <p className="text-[11px] text-muted-foreground">{topicoDefumacoes.descricao}</p>
                </div>
              </div>

              <div className="space-y-2">
                {topicoDefumacoes.defumacoes.map((def, di) => (
                  <motion.button
                    key={def.nome}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: di * 0.06 }}
                    onClick={() => setSelectedDefumacao(def)}
                    className="flex w-full items-center gap-3 rounded-lg border border-border/50 bg-background/50 p-3 text-left transition-all hover:border-primary/30 hover:shadow-sm"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/50 text-xs">
                      🔥
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-display text-xs tracking-wider text-foreground">{def.nome}</p>
                      <p className="truncate text-[10px] text-muted-foreground italic">{def.tema}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* === Dialog: Detalhe do Banho === */}
      <Dialog open={!!selectedBanho} onOpenChange={(o) => !o && setSelectedBanho(null)}>
        <DialogContent className="max-h-[85vh] max-w-[90vw] rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-base tracking-wider">{selectedBanho?.nome}</DialogTitle>
            <DialogDescription className="sr-only">Detalhes do banho</DialogDescription>
          </DialogHeader>
          {selectedBanho && (
            <ScrollArea className="max-h-[60vh] pr-3">
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="mb-1.5 font-display text-xs tracking-widest text-primary uppercase">Ingredientes</h4>
                  <ul className="space-y-1">
                    {selectedBanho.ingredientes.map((ing) => (
                      <li key={ing} className="flex items-start gap-2 text-muted-foreground">
                        <span className="mt-1 text-primary">•</span>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-1.5 font-display text-xs tracking-widest text-primary uppercase">Preparo</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedBanho.preparo}</p>
                </div>
                <div>
                  <h4 className="mb-1.5 font-display text-xs tracking-widest text-primary uppercase">Como Usar</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedBanho.uso}</p>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* === Dialog: Detalhe da Defumação === */}
      <Dialog open={!!selectedDefumacao} onOpenChange={(o) => !o && setSelectedDefumacao(null)}>
        <DialogContent className="max-h-[85vh] max-w-[90vw] rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-base tracking-wider">{selectedDefumacao?.nome}</DialogTitle>
            <DialogDescription className="sr-only">Detalhes da defumação</DialogDescription>
          </DialogHeader>
          {selectedDefumacao && (
            <ScrollArea className="max-h-[60vh] pr-3">
              <div className="space-y-4 text-sm">
                <div>
                  <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 font-display text-[10px] tracking-wider text-primary">
                    {selectedDefumacao.tema}
                  </span>
                </div>
                <div>
                  <h4 className="mb-1.5 font-display text-xs tracking-widest text-primary uppercase">Ingredientes</h4>
                  <ul className="space-y-1">
                    {selectedDefumacao.ingredientes.map((ing) => (
                      <li key={ing} className="flex items-start gap-2 text-muted-foreground">
                        <span className="mt-1 text-primary">•</span>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-1.5 font-display text-xs tracking-widest text-primary uppercase">Como Fazer</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedDefumacao.modo}</p>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LimpezaPage;
