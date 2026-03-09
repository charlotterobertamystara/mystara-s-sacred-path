import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MAJOR_ARCANA, TarotCard } from "@/data/tarot-cards";
import { useToast } from "@/hooks/use-toast";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { ChevronLeft, RotateCcw, Sparkles, BookOpen, X, FlipVertical } from "lucide-react";

type Step = "question" | "select" | "reading";

interface SelectedCard {
  card: TarotCard;
  reversed: boolean;
  position: string;
}

const POSITION_NAMES: Record<number, string> = {
  1: "Situação Atual",
  2: "Influência / Desafio",
  3: "Conselho / Caminho",
  4: "Passado",
  5: "Futuro Próximo",
};

const TarotPage = () => {
  const [step, setStep] = useState<Step>("question");
  const [question, setQuestion] = useState("");
  const [numCards, setNumCards] = useState(3);
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [detailCard, setDetailCard] = useState<TarotCard | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { saveSession } = useSessionHistory();

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

  const filteredCards = MAJOR_ARCANA.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameOriginal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isCardSelected = (card: TarotCard) =>
    selectedCards.some((s) => s.card.id === card.id);

  const toggleCard = (card: TarotCard) => {
    if (isCardSelected(card)) {
      setSelectedCards((prev) => prev.filter((s) => s.card.id !== card.id));
    } else if (selectedCards.length < numCards) {
      const positionIndex = selectedCards.length + 1;
      setSelectedCards((prev) => [
        ...prev,
        {
          card,
          reversed: false,
          position: POSITION_NAMES[positionIndex] || `Carta ${positionIndex}`,
        },
      ]);
    }
  };

  const toggleReversed = (cardId: number) => {
    setSelectedCards((prev) =>
      prev.map((s) => (s.card.id === cardId ? { ...s, reversed: !s.reversed } : s))
    );
  };

  const streamInterpretation = async () => {
    setIsLoading(true);
    setInterpretation("");
    setStep("reading");

    const payload = {
      question,
      cards: selectedCards.map((s) => ({
        name: s.card.name,
        position: s.position,
        reversed: s.reversed,
      })),
    };

    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/tarot-reading`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Erro desconhecido" }));
        toast({
          title: "Erro na leitura",
          description: err.error || "Tente novamente.",
          variant: "destructive",
        });
        setStep("select");
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let accumulated = "";

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              accumulated += content;
              setInterpretation(accumulated);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Save to history
      if (accumulated) {
        saveSession({
          session_type: "tarot",
          question,
          session_data: {
            cards: selectedCards.map((s) => ({
              name: s.card.name,
              position: s.position,
              reversed: s.reversed,
            })),
            numCards,
          },
          interpretation: accumulated,
        });
      }
    } catch (e) {
      toast({
        title: "Erro de conexão",
        description: "Verifique sua conexão e tente novamente.",
        variant: "destructive",
      });
      setStep("select");
    } finally {
      setIsLoading(false);
    }
  };
  const resetAll = () => {
    setStep("question");
    setQuestion("");
    setSelectedCards([]);
    setInterpretation("");
    setSearchQuery("");
  };

  return (
    <div className="mx-auto max-w-lg px-4 pt-6 pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <span className="text-4xl">🂡</span>
        <h1 className="mt-2 font-display text-xl tracking-widest text-foreground">
          Tarot de Marselha
        </h1>
        <p className="mt-1 font-body text-sm text-muted-foreground italic">
          Leitura simbólica e arquetípica tradicional
        </p>
      </motion.div>

      {/* Step: Pergunta */}
      <AnimatePresence mode="wait">
        {step === "question" && (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-5"
          >
            <div>
              <label className="font-display text-xs tracking-wider text-muted-foreground uppercase">
                Sua intenção ou pergunta
              </label>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Concentre-se e escreva sua pergunta ou situação..."
                className="mt-2 min-h-[110px] resize-none border-border bg-card font-body text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="font-display text-xs tracking-wider text-muted-foreground uppercase">
                Número de cartas
              </label>
              <div className="mt-2 flex gap-2">
                {[1, 3, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNumCards(n)}
                    className={`flex-1 rounded-lg border py-3 font-display text-sm tracking-wider transition-all ${
                      numCards === n
                        ? "border-primary bg-secondary text-primary shadow-gold"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {n} {n === 1 ? "carta" : "cartas"}
                  </button>
                ))}
              </div>
              <p className="mt-2 font-body text-xs text-muted-foreground italic">
                {numCards === 1 && "Carta única — foco direto na questão"}
                {numCards === 3 && "3 cartas — passado · presente · conselho"}
                {numCards === 5 && "5 cartas — leitura completa da situação"}
              </p>
            </div>

            <Button
              className="w-full font-display tracking-widest"
              size="lg"
              disabled={!question.trim()}
              onClick={() => setStep("select")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Escolher Cartas
            </Button>
          </motion.div>
        )}

        {/* Step: Seleção de Cartas */}
        {step === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-4"
          >
            <button
              onClick={() => setStep("question")}
              className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-3 w-3" /> Voltar
            </button>

            {/* Cartas selecionadas */}
            {selectedCards.length > 0 && (
              <div className="rounded-xl border border-primary/20 bg-secondary/20 p-3">
                <p className="mb-2 font-display text-xs tracking-wider text-primary uppercase">
                  Cartas selecionadas ({selectedCards.length}/{numCards})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedCards.map((s, i) => (
                    <div
                      key={s.card.id}
                      className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-card px-2 py-1"
                    >
                      <span className="font-body text-xs text-primary">{i + 1}.</span>
                      <span className="font-body text-xs text-foreground">
                        {s.card.name}
                        {s.reversed && (
                          <span className="ml-1 text-muted-foreground">(inv.)</span>
                        )}
                      </span>
                      <button
                        onClick={() => toggleReversed(s.card.id)}
                        title="Inverter carta"
                        className="ml-0.5 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <FlipVertical className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => toggleCard(s.card)}
                        className="ml-0.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Busca */}
            <input
              type="text"
              placeholder="Buscar arcano..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />

            <p className="font-body text-xs text-muted-foreground">
              {selectedCards.length < numCards
                ? `Selecione ${numCards - selectedCards.length} carta(s) que você tirou fisicamente`
                : "Todas as cartas selecionadas. Você pode inverter ou remover."}
            </p>

            {/* Grid dos arcanos */}
            <ScrollArea className="h-[340px]">
              <div className="grid grid-cols-2 gap-2 pr-2">
                {filteredCards.map((card) => {
                  const selected = isCardSelected(card);
                  const full = selectedCards.length >= numCards && !selected;
                  return (
                    <motion.button
                      key={card.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => !full && toggleCard(card)}
                      className={`relative rounded-xl border p-3 text-left transition-all ${
                        selected
                          ? "border-primary bg-secondary shadow-gold"
                          : full
                          ? "cursor-not-allowed border-border bg-card/40 opacity-40"
                          : "border-border bg-card hover:border-primary/50 hover:bg-secondary/30"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{card.symbol}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-xs text-primary leading-tight">
                            {card.number}
                          </p>
                          <p className="font-body text-xs font-medium text-foreground leading-tight truncate">
                            {card.name}
                          </p>
                          <p className="font-body text-[10px] text-muted-foreground leading-tight">
                            {card.nameOriginal}
                          </p>
                        </div>
                        {selected && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                            {selectedCards.findIndex((s) => s.card.id === card.id) + 1}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailCard(card);
                        }}
                        className="mt-1.5 font-body text-[10px] text-muted-foreground underline hover:text-primary"
                      >
                        ver significado
                      </button>
                    </motion.button>
                  );
                })}
              </div>
            </ScrollArea>

            <Button
              className="w-full font-display tracking-widest"
              size="lg"
              disabled={selectedCards.length < numCards}
              onClick={streamInterpretation}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Iniciar Leitura
            </Button>
          </motion.div>
        )}

        {/* Step: Leitura */}
        {step === "reading" && (
          <motion.div
            key="reading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Cartas da tiragem */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-3 font-display text-xs tracking-widest text-muted-foreground uppercase">
                Sua Tiragem
              </p>
              <div className="space-y-2">
                {selectedCards.map((s, i) => (
                  <div key={s.card.id} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-secondary/30 text-xl">
                      {s.card.symbol}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display text-xs text-primary">{s.card.number}</span>
                        <span className="font-body text-sm text-foreground">{s.card.name}</span>
                        {s.reversed && (
                          <Badge variant="outline" className="text-[9px] border-muted-foreground text-muted-foreground px-1 py-0">
                            invertida
                          </Badge>
                        )}
                      </div>
                      <p className="font-body text-[10px] text-muted-foreground">{s.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interpretação IA */}
            <div className="rounded-xl border border-primary/20 bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <p className="font-display text-xs tracking-widest text-primary uppercase">
                  Interpretação
                </p>
              </div>
              {isLoading && !interpretation && (
                <div className="flex items-center gap-2 py-4 text-muted-foreground">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary"
                  />
                  <span className="font-body text-sm italic">As cartas estão falando...</span>
                </div>
              )}
              <div className="font-body text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {interpretation}
                {isLoading && interpretation && (
                  <span className="ml-0.5 inline-block h-4 w-0.5 bg-primary animate-pulse" />
                )}
              </div>
            </div>

            {/* Significados individuais */}
            {!isLoading && interpretation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <p className="font-display text-xs tracking-widest text-muted-foreground uppercase">
                  Significados das Cartas
                </p>
                {selectedCards.map((s) => (
                  <div
                    key={s.card.id}
                    className="rounded-xl border border-border bg-card p-4 space-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.card.symbol}</span>
                      <div>
                        <p className="font-display text-sm text-foreground">
                          {s.card.number} — {s.card.name}
                        </p>
                        <p className="font-body text-[11px] text-muted-foreground italic">
                          {s.card.element} · {s.card.archetype}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {s.card.keywords.map((k) => (
                        <Badge key={k} variant="outline" className="border-primary/20 text-primary text-[10px] font-body px-2 py-0">
                          {k}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="font-display text-[10px] tracking-wider text-primary uppercase mb-1">
                          {s.reversed ? "Invertida" : "Direita"}
                        </p>
                        <p className="font-body text-xs text-muted-foreground leading-relaxed">
                          {s.reversed ? s.card.reversedMeaning : s.card.uprightMeaning}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {!isLoading && (
              <Button
                variant="outline"
                className="w-full font-display tracking-widest border-border text-muted-foreground hover:text-foreground"
                onClick={resetAll}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Nova Leitura
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal detalhe carta */}
      <Dialog open={!!detailCard} onOpenChange={() => setDetailCard(null)}>
        <DialogContent className="max-w-sm border-border bg-card">
          {detailCard && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{detailCard.symbol}</span>
                  <div>
                    <DialogTitle className="font-display text-base text-primary">
                      {detailCard.number} — {detailCard.name}
                    </DialogTitle>
                    <p className="font-body text-xs text-muted-foreground italic">
                      {detailCard.nameOriginal}
                    </p>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {detailCard.keywords.map((k) => (
                    <Badge key={k} variant="outline" className="border-primary/20 text-primary text-[10px] px-2 py-0 font-body">
                      {k}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-secondary/20 border border-border px-2 py-1.5">
                    <p className="font-display text-[9px] tracking-wider text-muted-foreground uppercase">Elemento</p>
                    <p className="font-body text-xs text-foreground">{detailCard.element}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/20 border border-border px-2 py-1.5">
                    <p className="font-display text-[9px] tracking-wider text-muted-foreground uppercase">Arquétipo</p>
                    <p className="font-body text-xs text-foreground">{detailCard.archetype}</p>
                  </div>
                </div>
                <div>
                  <p className="font-display text-[10px] tracking-wider text-primary uppercase mb-1">Direita</p>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">{detailCard.uprightMeaning}</p>
                </div>
                <div>
                  <p className="font-display text-[10px] tracking-wider text-muted-foreground uppercase mb-1">Invertida</p>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">{detailCard.reversedMeaning}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TarotPage;
