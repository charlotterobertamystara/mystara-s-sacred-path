import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MAJOR_ARCANA, TarotCard } from "@/data/tarot-cards";
import { MINOR_ARCANA } from "@/data/tarot-minor-arcana";
import { interpretTarot } from "@/lib/tarotEngine";
import { useToast } from "@/hooks/use-toast";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { ChevronLeft, RotateCcw, Sparkles, BookOpen, X, FlipVertical, Search } from "lucide-react";

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

const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA];

// ── Slot de busca de carta por posição ───────────────────────────────────────

interface CardSlotProps {
  index: number;
  position: string;
  selected: SelectedCard | undefined;
  onSelect: (card: TarotCard) => void;
  onRemove: () => void;
  onToggleReversed: () => void;
  onViewDetail: (card: TarotCard) => void;
  usedIds: Set<number>;
}

function CardSlot({ index, position, selected, onSelect, onRemove, onToggleReversed, onViewDetail, usedIds }: CardSlotProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = query.trim().length >= 2
    ? ALL_CARDS.filter(c =>
        !usedIds.has(c.id) &&
        (c.name.toLowerCase().includes(query.toLowerCase()) ||
         c.nameOriginal.toLowerCase().includes(query.toLowerCase()) ||
         c.keywords.some(k => k.toLowerCase().includes(query.toLowerCase())))
      ).slice(0, 7)
    : [];

  function handleSelect(card: TarotCard) {
    onSelect(card);
    setQuery("");
    setOpen(false);
  }

  useEffect(() => {
    if (!selected) {
      setQuery("");
      setOpen(false);
    }
  }, [selected]);

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      {/* Position label */}
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-display text-primary">
          {index + 1}
        </span>
        <p className="font-display text-xs tracking-wider text-muted-foreground uppercase">
          {position}
        </p>
      </div>

      {selected ? (
        /* Card confirmed */
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selected.card.symbol}</span>
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm text-primary leading-tight">{selected.card.number}</p>
              <p className="font-body text-sm text-foreground leading-tight">{selected.card.name}</p>
              <p className="font-body text-[10px] text-muted-foreground">{selected.card.nameOriginal}</p>
            </div>
            <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onToggleReversed}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-display text-[10px] tracking-wider transition-all ${
                selected.reversed
                  ? "border-primary bg-secondary text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              <FlipVertical className="h-3 w-3" />
              {selected.reversed ? "Invertida ✓" : "Inverter?"}
            </button>
            <button
              onClick={() => onViewDetail(selected.card)}
              className="rounded-lg border border-border px-3 py-1.5 font-body text-[10px] text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
            >
              Ver significado
            </button>
          </div>
        </div>
      ) : (
        /* Search input */
        <div className="relative">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 focus-within:ring-1 focus-within:ring-primary/50">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder="Digite o nome da carta que saiu..."
              className="w-full bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {query && (
              <button onClick={() => { setQuery(""); setOpen(false); }} className="text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Dropdown */}
          <AnimatePresence>
            {open && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-lg overflow-hidden"
              >
                {suggestions.map((card) => (
                  <button
                    key={card.id}
                    onMouseDown={() => handleSelect(card)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-secondary/40 transition-colors border-b border-border/50 last:border-0"
                  >
                    <span className="text-lg shrink-0">{card.symbol}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-xs text-primary truncate">{card.number}</p>
                      <p className="font-body text-sm text-foreground truncate">{card.name}</p>
                      <p className="font-body text-[10px] text-muted-foreground truncate">{card.nameOriginal}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
            {open && query.trim().length >= 2 && suggestions.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-card px-4 py-3"
              >
                <p className="font-body text-xs text-muted-foreground">Nenhuma carta encontrada. Tente outro nome.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ── Página principal ─────────────────────────────────────────────────────────

const TarotPage = () => {
  const [step, setStep] = useState<Step>("question");
  const [question, setQuestion] = useState("");
  const [numCards, setNumCards] = useState(3);
  const [selectedCards, setSelectedCards] = useState<(SelectedCard | undefined)[]>([]);
  const [readingCards, setReadingCards] = useState<SelectedCard[]>([]);
  const [detailCard, setDetailCard] = useState<TarotCard | null>(null);
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { saveSession } = useSessionHistory();

  // Reset slots when numCards changes
  useEffect(() => {
    setSelectedCards(Array(numCards).fill(undefined));
  }, [numCards]);

  const confirmedCards = selectedCards.filter((s): s is SelectedCard => !!s);
  const allFilled = confirmedCards.length === numCards;

  const usedIds = new Set(confirmedCards.map(s => s.card.id));

  function handleSelectCard(slotIndex: number, card: TarotCard) {
    const position = POSITION_NAMES[slotIndex + 1] || `Carta ${slotIndex + 1}`;
    setSelectedCards(prev => {
      const next = [...prev];
      next[slotIndex] = { card, reversed: false, position };
      return next;
    });
  }

  function handleRemoveCard(slotIndex: number) {
    setSelectedCards(prev => {
      const next = [...prev];
      next[slotIndex] = undefined;
      return next;
    });
  }

  function handleToggleReversed(slotIndex: number) {
    setSelectedCards(prev => {
      const next = [...prev];
      const slot = next[slotIndex];
      if (slot) next[slotIndex] = { ...slot, reversed: !slot.reversed };
      return next;
    });
  }

  const startReading = async () => {
    const captured = [...confirmedCards]; // captura as cartas antes de qualquer mudança de estado
    setReadingCards(captured);
    setIsLoading(true);
    setInterpretation("");
    setStep("reading");

    try {
      await new Promise((r) => setTimeout(r, 400));

      const engineCards = captured.map((s) => ({
        name: s.card.name,
        position: s.position,
        reversed: s.reversed,
        number: s.card.number,
        suit: (s.card as any).suit,
      }));

      const result = interpretTarot(question, engineCards);
      setInterpretation(result);

      try {
        saveSession({
          session_type: "tarot",
          question,
          session_data: {
            cards: captured.map((s) => ({
              name: s.card.name,
              position: s.position,
              reversed: s.reversed,
            })),
            numCards,
          },
          interpretation: result,
          reading_items: captured.map((s, i) => ({
            item_type: "tarot_card",
            item_name: s.card.name,
            item_position: s.position,
            is_reversed: s.reversed,
            sort_order: i,
            item_data: { number: s.card.number, symbol: s.card.symbol },
          })),
        });
      } catch {
        // Silently ignore — salvar sessão é opcional
      }
    } catch (e) {
      console.error("Tarot reading error:", e);
      setStep("select");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setStep("question");
    setQuestion("");
    setSelectedCards(Array(numCards).fill(undefined));
    setInterpretation("");
    setReadingCards([]);
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

      <AnimatePresence mode="wait">
        {/* Step: Pergunta */}
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
              Informar as Cartas
            </Button>
          </motion.div>
        )}

        {/* Step: Informar as Cartas */}
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

            <div className="rounded-xl border border-primary/20 bg-secondary/10 p-3">
              <p className="font-body text-xs text-muted-foreground italic leading-relaxed">
                Faça a tiragem fisicamente e <strong className="text-foreground">digite o nome de cada carta</strong> que saiu. O app encontra automaticamente.
              </p>
            </div>

            <div className="space-y-3">
              {Array.from({ length: numCards }, (_, i) => (
                <CardSlot
                  key={i}
                  index={i}
                  position={POSITION_NAMES[i + 1] || `Carta ${i + 1}`}
                  selected={selectedCards[i]}
                  onSelect={(card) => handleSelectCard(i, card)}
                  onRemove={() => handleRemoveCard(i)}
                  onToggleReversed={() => handleToggleReversed(i)}
                  onViewDetail={setDetailCard}
                  usedIds={usedIds}
                />
              ))}
            </div>

            <p className="font-body text-xs text-muted-foreground text-center">
              {confirmedCards.length}/{numCards} carta{numCards !== 1 ? "s" : ""} informada{numCards !== 1 ? "s" : ""}
            </p>

            <Button
              className="w-full font-display tracking-widest"
              size="lg"
              disabled={!allFilled}
              onClick={startReading}
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
                {readingCards.map((s, i) => (
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

            {/* Interpretação */}
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
                {readingCards.map((s) => (
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
                    <div>
                      <p className="font-display text-[10px] tracking-wider text-primary uppercase mb-1">
                        {s.reversed ? "Invertida" : "Direita"}
                      </p>
                      <p className="font-body text-xs text-muted-foreground leading-relaxed">
                        {s.reversed ? s.card.reversedMeaning : s.card.uprightMeaning}
                      </p>
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
