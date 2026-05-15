import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MAJOR_ARCANA, TarotCard } from "@/data/tarot-cards";
import { MINOR_ARCANA } from "@/data/tarot-minor-arcana";
import { interpretTarot } from "@/lib/tarotEngine";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { RotateCcw, Sparkles, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Renderiza negrito (**texto**) e seções (✦) em JSX
function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        // Linha de seção (começa com ✦)
        if (line.startsWith("✦")) {
          return (
            <p key={i} className="font-display text-xs tracking-widest text-primary uppercase mt-4 first:mt-0">
              {line}
            </p>
          );
        }
        // Linha com **negrito**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="font-body text-sm leading-relaxed text-foreground">
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j} className="font-semibold text-foreground">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      })}
    </div>
  );
}

type Step = "input" | "reading";

interface SelectedCard {
  card: TarotCard;
  reversed: boolean;
  position: string;
}

const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA];

// ── Parseador de cartas a partir do texto livre ───────────────────────────────

function normalizeStr(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SUIT_ALIASES: Record<string, string> = {
  copas: "copas",
  tacas: "copas",
  copos: "copas",
  espadas: "espadas",
  gladios: "espadas",
  paus: "paus",
  bastos: "paus",
  bastoes: "paus",
  varinhas: "paus",
  ouros: "ouros",
  pentaculos: "ouros",
  moedas: "ouros",
  discos: "ouros",
  denarios: "ouros",
};

const DIGIT_TO_WORD: Record<string, string> = {
  "1": "as",
  "2": "dois",
  "3": "tres",
  "4": "quatro",
  "5": "cinco",
  "6": "seis",
  "7": "sete",
  "8": "oito",
  "9": "nove",
  "10": "dez",
  "11": "valete",
  "12": "cavaleiro",
  "13": "rainha",
  "14": "rei",
};

const WORD_ALIASES: Record<string, string> = {
  as: "as",
  ace: "as",
  sota: "valete",
  cavalo: "cavaleiro",
  dama: "rainha",
  duas: "dois",
  tres: "tres",
};

function prepareText(text: string): string {
  let t = normalizeStr(text);
  for (const [alias, canonical] of Object.entries(SUIT_ALIASES)) {
    t = t.replace(new RegExp(`\\b${alias}\\b`, "g"), canonical);
  }
  for (const [alias, canonical] of Object.entries(WORD_ALIASES)) {
    t = t.replace(new RegExp(`\\b${alias}\\b`, "g"), canonical);
  }
  for (const [digit, word] of Object.entries(DIGIT_TO_WORD)) {
    t = t.replace(new RegExp(`\\b${digit}\\b`, "g"), word);
  }
  return t;
}

function parseCardsFromText(text: string, numCards: number): SelectedCard[] {
  const normText = prepareText(text);
  const found: Array<{ card: TarotCard; index: number }> = [];
  const usedIds = new Set<number>();

  for (const card of ALL_CARDS) {
    if (usedIds.has(card.id)) continue;

    // Remove article only when NOT followed by "de/do/da" (ex: "O Louco" → "louco", mas "Ás de Paus" NÃO perde o "as")
    const cardNorm = prepareText(card.name).replace(/^(o |a |os |as )(?!d[eoa])/, "").trim();
    let matchIndex = normText.indexOf(cardNorm);

    if (matchIndex < 0) {
      const origNorm = prepareText(card.nameOriginal).replace(/^(le |la |les |l )(?!d[eoa])/, "").trim();
      matchIndex = normText.indexOf(origNorm);
    }

    if (matchIndex >= 0) {
      found.push({ card, index: matchIndex });
      usedIds.add(card.id);
    }
  }

  found.sort((a, b) => a.index - b.index);

  return found.slice(0, numCards).map((f, i) => ({
    card: f.card,
    reversed: false,
    position: `${i + 1}ª Carta`,
  }));
}

// ── Página principal ──────────────────────────────────────────────────────────

const TarotPage = () => {
  const [step, setStep] = useState<Step>("input");
  const [text, setText] = useState("");
  const [numCards, setNumCards] = useState(3);
  const [readingCards, setReadingCards] = useState<SelectedCard[]>([]);
  const [detailCard, setDetailCard] = useState<TarotCard | null>(null);
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { saveSession } = useSessionHistory();
  const navigate = useNavigate();

  const startReading = async () => {
    const cards = parseCardsFromText(text, numCards);
    setReadingCards(cards);
    setIsLoading(true);
    setInterpretation("");
    setStep("reading");

    try {
      await new Promise((r) => setTimeout(r, 500));

      const engineCards = cards.map((s) => ({
        name: s.card.name,
        position: s.position,
        reversed: s.reversed,
        number: s.card.number,
        suit: (s.card as any).suit,
      }));

      const result = interpretTarot(text, engineCards);
      setInterpretation(result);

      try {
        saveSession({
          session_type: "tarot",
          question: text,
          session_data: {
            cards: cards.map((s) => ({ name: s.card.name, reversed: s.reversed })),
          },
          interpretation: result,
          reading_items: cards.map((s, i) => ({
            item_type: "tarot_card",
            item_name: s.card.name,
            item_position: s.position,
            is_reversed: s.reversed,
            sort_order: i,
            item_data: { number: s.card.number, symbol: s.card.symbol },
          })),
        });
      } catch {
        // Salvar sessão é opcional
      }
    } catch (e) {
      console.error("Tarot reading error:", e);
      setStep("input");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setStep("input");
    setText("");
    setReadingCards([]);
    setInterpretation("");
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
          Tarô de Marselha
        </h1>
        <p className="mt-1 font-body text-sm text-muted-foreground italic">
          Leitura simbólica e arquetípica tradicional
        </p>
        <button
          onClick={() => navigate("/tarot/cartas")}
          className="mt-3 inline-flex items-center gap-1.5 font-body text-xs text-muted-foreground hover:text-primary transition-colors underline"
        >
          <BookOpen className="h-3 w-3" />
          Ver todas as 78 cartas e seus significados
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step: Entrada */}
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-5"
          >
            <div>
              <label className="font-display text-xs tracking-wider text-muted-foreground uppercase">
                Sua dúvida e as cartas que saíram
              </label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  "Exemplo: Estou preocupada com meu trabalho e preciso de orientação. As cartas que saíram foram: 10 de paus, o Julgamento e a Lua."
                }
                className="mt-2 min-h-[150px] resize-none border-border bg-card font-body text-foreground placeholder:text-muted-foreground"
              />
              <p className="mt-1.5 font-body text-[11px] text-muted-foreground italic">
                Descreva sua situação e mencione as cartas que saíram no baralho físico. O app as encontra automaticamente.
              </p>
            </div>

            <div>
              <label className="font-display text-xs tracking-wider text-muted-foreground uppercase">
                Tiragem
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
              disabled={!text.trim()}
              onClick={startReading}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Realizar Leitura
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
            {/* Cartas identificadas */}
            {readingCards.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-3 font-display text-xs tracking-widest text-muted-foreground uppercase">
                  Cartas Identificadas
                </p>
                <div className="space-y-2">
                  {readingCards.map((s) => (
                    <div key={s.card.id} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-secondary/30 text-xl">
                        {s.card.symbol}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm text-foreground">{s.card.name}</p>
                        <p className="font-body text-[10px] text-muted-foreground italic">{s.card.nameOriginal}</p>
                      </div>
                      <button
                        onClick={() => setDetailCard(s.card)}
                        className="font-body text-[10px] text-muted-foreground hover:text-primary transition-colors underline shrink-0"
                      >
                        ver
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {readingCards.length === 0 && !isLoading && (
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="font-body text-sm text-muted-foreground italic">
                  Nenhuma carta foi identificada no texto. A leitura será feita com base na sua pergunta.
                </p>
              </div>
            )}

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
              {interpretation && <RichText text={interpretation} />}
            </div>

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
                    <Badge
                      key={k}
                      variant="outline"
                      className="border-primary/20 text-primary text-[10px] px-2 py-0 font-body"
                    >
                      {k}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-secondary/20 border border-border px-2 py-1.5">
                    <p className="font-display text-[9px] tracking-wider text-muted-foreground uppercase">
                      Elemento
                    </p>
                    <p className="font-body text-xs text-foreground">{detailCard.element}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/20 border border-border px-2 py-1.5">
                    <p className="font-display text-[9px] tracking-wider text-muted-foreground uppercase">
                      Arquétipo
                    </p>
                    <p className="font-body text-xs text-foreground">{detailCard.archetype}</p>
                  </div>
                </div>
                <div>
                  <p className="font-display text-[10px] tracking-wider text-primary uppercase mb-1">
                    Direita
                  </p>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">
                    {detailCard.uprightMeaning}
                  </p>
                </div>
                <div>
                  <p className="font-display text-[10px] tracking-wider text-muted-foreground uppercase mb-1">
                    Invertida
                  </p>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">
                    {detailCard.reversedMeaning}
                  </p>
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
