import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ELDER_FUTHARK, Rune } from "@/data/runes";
import { useToast } from "@/hooks/use-toast";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { ChevronLeft, RotateCcw, Sparkles, BookOpen, X, FlipVertical } from "lucide-react";

type Step = "question" | "select" | "reading";

interface SelectedRune {
  rune: Rune;
  reversed: boolean;
  position: string;
}

const SPREAD_OPTIONS = [
  { count: 1, label: "1 Runa", desc: "Runa única — foco direto na questão" },
  { count: 3, label: "3 Runas", desc: "3 runas — situação · desafio · conselho" },
  { count: 5, label: "5 Runas", desc: "5 runas — leitura completa da Cruz Rúnica" },
];

const POSITION_NAMES: Record<number, string> = {
  1: "Situação Atual",
  2: "Desafio / Obstáculo",
  3: "Conselho / Ação",
  4: "Passado / Raiz",
  5: "Resultado Provável",
};

const RunasPage = () => {
  const [step, setStep] = useState<Step>("question");
  const [question, setQuestion] = useState("");
  const [numRunes, setNumRunes] = useState(3);
  const [selectedRunes, setSelectedRunes] = useState<SelectedRune[]>([]);
  const [detailRune, setDetailRune] = useState<Rune | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

  const filteredRunes = ELDER_FUTHARK.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isRuneSelected = (rune: Rune) =>
    selectedRunes.some((s) => s.rune.id === rune.id);

  const toggleRune = (rune: Rune) => {
    if (isRuneSelected(rune)) {
      setSelectedRunes((prev) => prev.filter((s) => s.rune.id !== rune.id));
    } else if (selectedRunes.length < numRunes) {
      const posIndex = selectedRunes.length + 1;
      setSelectedRunes((prev) => [
        ...prev,
        {
          rune,
          reversed: false,
          position: POSITION_NAMES[posIndex] || `Runa ${posIndex}`,
        },
      ]);
    }
  };

  const toggleReversed = (runeId: number) => {
    setSelectedRunes((prev) =>
      prev.map((s) =>
        s.rune.id === runeId && s.rune.canReverse
          ? { ...s, reversed: !s.reversed }
          : s
      )
    );
  };

  const streamInterpretation = async () => {
    setIsLoading(true);
    setInterpretation("");
    setStep("reading");

    const payload = {
      question,
      runes: selectedRunes.map((s) => ({
        name: s.rune.name,
        position: s.position,
        reversed: s.reversed,
        canReverse: s.rune.canReverse,
      })),
    };

    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/runes-reading`, {
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
    } catch {
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
    setSelectedRunes([]);
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
        <span className="text-4xl font-display">ᚱ</span>
        <h1 className="mt-2 font-display text-xl tracking-widest text-foreground">
          Runas — Elder Futhark
        </h1>
        <p className="mt-1 font-body text-sm text-muted-foreground italic">
          Sabedoria ancestral dos povos nórdicos
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
                Tipo de tiragem
              </label>
              <div className="mt-2 flex gap-2">
                {SPREAD_OPTIONS.map((opt) => (
                  <button
                    key={opt.count}
                    onClick={() => setNumRunes(opt.count)}
                    className={`flex-1 rounded-lg border py-3 font-display text-sm tracking-wider transition-all ${
                      numRunes === opt.count
                        ? "border-primary bg-secondary text-primary shadow-gold"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 font-body text-xs text-muted-foreground italic">
                {SPREAD_OPTIONS.find((o) => o.count === numRunes)?.desc}
              </p>
            </div>

            <Button
              className="w-full font-display tracking-widest"
              size="lg"
              disabled={!question.trim()}
              onClick={() => setStep("select")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Escolher Runas
            </Button>
          </motion.div>
        )}

        {/* Step: Seleção de Runas */}
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

            {/* Runas selecionadas */}
            {selectedRunes.length > 0 && (
              <div className="rounded-xl border border-primary/20 bg-secondary/20 p-3">
                <p className="mb-2 font-display text-xs tracking-wider text-primary uppercase">
                  Runas selecionadas ({selectedRunes.length}/{numRunes})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedRunes.map((s, i) => (
                    <div
                      key={s.rune.id}
                      className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-card px-2 py-1"
                    >
                      <span className="font-body text-xs text-primary">{i + 1}.</span>
                      <span className="font-display text-sm">{s.rune.unicode}</span>
                      <span className="font-body text-xs text-foreground">
                        {s.rune.name}
                        {s.reversed && (
                          <span className="ml-1 text-muted-foreground">(inv.)</span>
                        )}
                      </span>
                      {s.rune.canReverse && (
                        <button
                          onClick={() => toggleReversed(s.rune.id)}
                          title="Inverter runa"
                          className="ml-0.5 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <FlipVertical className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => toggleRune(s.rune)}
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
              placeholder="Buscar runa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />

            <p className="font-body text-xs text-muted-foreground">
              {selectedRunes.length < numRunes
                ? `Selecione ${numRunes - selectedRunes.length} runa(s) que você tirou fisicamente`
                : "Todas as runas selecionadas. Você pode inverter ou remover."}
            </p>

            {/* Grid das runas */}
            <ScrollArea className="h-[340px]">
              <div className="grid grid-cols-2 gap-2 pr-2">
                {filteredRunes.map((rune) => {
                  const selected = isRuneSelected(rune);
                  const full = selectedRunes.length >= numRunes && !selected;
                  return (
                    <motion.button
                      key={rune.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => !full && toggleRune(rune)}
                      className={`relative rounded-xl border p-3 text-left transition-all ${
                        selected
                          ? "border-primary bg-secondary shadow-gold"
                          : full
                          ? "cursor-not-allowed border-border bg-card/40 opacity-40"
                          : "border-border bg-card hover:border-primary/50 hover:bg-secondary/30"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-2xl font-display">{rune.unicode}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-xs text-primary leading-tight">
                            {rune.phonetic}
                          </p>
                          <p className="font-body text-xs font-medium text-foreground leading-tight truncate">
                            {rune.name}
                          </p>
                          {!rune.canReverse && (
                            <p className="font-body text-[9px] text-muted-foreground">
                              sem inversão
                            </p>
                          )}
                        </div>
                        {selected && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                            {selectedRunes.findIndex((s) => s.rune.id === rune.id) + 1}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailRune(rune);
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
              disabled={selectedRunes.length < numRunes}
              onClick={streamInterpretation}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Consultar Runas
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
            {/* Runas da tiragem */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-3 font-display text-xs tracking-widest text-muted-foreground uppercase">
                Sua Tiragem
              </p>
              <div className="space-y-2">
                {selectedRunes.map((s) => (
                  <div key={s.rune.id} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-secondary/30 text-xl font-display">
                      {s.rune.unicode}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display text-xs text-primary">{s.rune.phonetic}</span>
                        <span className="font-body text-sm text-foreground">{s.rune.name}</span>
                        {s.reversed && s.rune.canReverse && (
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
                  <span className="font-body text-sm italic">As runas estão falando...</span>
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
                  Significados das Runas
                </p>
                {selectedRunes.map((s) => (
                  <div
                    key={s.rune.id}
                    className="rounded-xl border border-border bg-card p-4 space-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-display">{s.rune.unicode}</span>
                      <div>
                        <p className="font-display text-sm text-foreground">
                          {s.rune.name} ({s.rune.phonetic})
                        </p>
                        <p className="font-body text-[11px] text-muted-foreground italic">
                          {s.rune.element} · {s.rune.archetype}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {s.rune.keywords.map((k) => (
                        <Badge key={k} variant="outline" className="border-primary/20 text-primary text-[10px] font-body px-2 py-0">
                          {k}
                        </Badge>
                      ))}
                    </div>
                    <div>
                      <p className="font-display text-[10px] tracking-wider text-primary uppercase mb-1">
                        {s.reversed && s.rune.canReverse ? "Invertida" : "Direita"}
                      </p>
                      <p className="font-body text-xs text-muted-foreground leading-relaxed">
                        {s.reversed && s.rune.canReverse
                          ? s.rune.reversedMeaning
                          : s.rune.uprightMeaning}
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

      {/* Modal detalhe runa */}
      <Dialog open={!!detailRune} onOpenChange={() => setDetailRune(null)}>
        <DialogContent className="max-w-sm border-border bg-card">
          {detailRune && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-display">{detailRune.unicode}</span>
                  <div>
                    <DialogTitle className="font-display text-base text-primary">
                      {detailRune.name}
                    </DialogTitle>
                    <p className="font-body text-xs text-muted-foreground italic">
                      Fonema: {detailRune.phonetic}
                    </p>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {detailRune.keywords.map((k) => (
                    <Badge key={k} variant="outline" className="border-primary/20 text-primary text-[10px] px-2 py-0 font-body">
                      {k}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-secondary/20 border border-border px-2 py-1.5">
                    <p className="font-display text-[9px] tracking-wider text-muted-foreground uppercase">Elemento</p>
                    <p className="font-body text-xs text-foreground">{detailRune.element}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/20 border border-border px-2 py-1.5">
                    <p className="font-display text-[9px] tracking-wider text-muted-foreground uppercase">Arquétipo</p>
                    <p className="font-body text-xs text-foreground">{detailRune.archetype}</p>
                  </div>
                </div>
                <div>
                  <p className="font-display text-[10px] tracking-wider text-primary uppercase mb-1">Direita</p>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">{detailRune.uprightMeaning}</p>
                </div>
                {detailRune.canReverse && (
                  <div>
                    <p className="font-display text-[10px] tracking-wider text-muted-foreground uppercase mb-1">Invertida</p>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">{detailRune.reversedMeaning}</p>
                  </div>
                )}
                {!detailRune.canReverse && (
                  <p className="font-body text-[11px] text-muted-foreground italic">
                    Esta runa não possui posição invertida.
                  </p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RunasPage;
