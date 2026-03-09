import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, RotateCcw, Sparkles, BookOpen, Share2, Lock, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { useNavigate } from "react-router-dom";
import NumeroCompatibilidade from "@/components/numerologia/NumeroCompatibilidade";
import {
  calculateFullNumerology,
  isMasterNumber,
  NUMBER_MEANINGS,
  FUNDAMENTALS,
  NumerologyResult,
} from "@/lib/numerology-utils";

type Step = "input" | "calculating" | "result" | "fundamentals" | "compatibility";

const NumerologiaPage = () => {
  const [step, setStep] = useState<Step>("input");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [expandedNumber, setExpandedNumber] = useState<number | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isSubscribed } = useCredits();
  const navigate = useNavigate();

  const handleCalculate = async () => {
    if (!fullName.trim() || !birthDate) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    setStep("calculating");

    // Simulate mystical calculation delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const numerology = calculateFullNumerology(fullName, birthDate);
    setResult(numerology);
    setStep("result");
  };

  const resetAll = () => {
    setStep("input");
    setFullName("");
    setBirthDate("");
    setResult(null);
    setExpandedNumber(null);
  };

  const shareResult = () => {
    if (!result) return;
    const text = `🔢 Meu Mapa Numerológico — Mystara\n\n✦ Caminho de Vida: ${result.lifePath}\n✦ Expressão: ${result.expression}\n✦ Alma: ${result.soulUrge}\n✦ Personalidade: ${result.personality}\n✦ Destino: ${result.destiny}\n✦ Ano Pessoal: ${result.personalYear}`;
    if (navigator.share) {
      navigator.share({ title: "Mapa Numerológico — Mystara", text });
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: "Copiado!", description: "Resultado copiado para a área de transferência." });
    }
  };

  const renderNumberCard = (label: string, number: number, icon: string, isPremium = false) => {
    const meaning = NUMBER_MEANINGS[number];
    const isMaster = isMasterNumber(number);
    const isExpanded = expandedNumber === number;
    const locked = isPremium && !isSubscribed;

    return (
      <motion.div
        key={label}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-xl border p-4 transition-all cursor-pointer ${
          isMaster
            ? "border-primary/50 bg-gradient-to-br from-primary/15 to-secondary/30 shadow-gold"
            : "border-border bg-card hover:border-primary/30"
        } ${locked ? "opacity-60" : ""}`}
        onClick={() => !locked && setExpandedNumber(isExpanded ? null : number)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-display ${
              isMaster
                ? "bg-primary text-primary-foreground shadow-gold"
                : "bg-secondary text-primary"
            }`}>
              {number}
            </div>
            <div>
              <p className="font-display text-xs tracking-wider text-muted-foreground uppercase">
                {label}
              </p>
              <p className="font-body text-sm text-foreground">{meaning?.title || "—"}</p>
              {isMaster && (
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-display tracking-wider text-primary">
                  NÚMERO MESTRE
                </span>
              )}
            </div>
          </div>
          {locked ? (
            <Lock className="h-4 w-4 text-muted-foreground" />
          ) : (
            <span className="text-lg">{icon}</span>
          )}
        </div>

        <AnimatePresence>
          {isExpanded && meaning && !locked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-3 overflow-hidden"
            >
              <div className="flex flex-wrap gap-1">
                {meaning.keywords.map((kw, i) => (
                  <span key={i} className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
                    {kw}
                  </span>
                ))}
              </div>
              <div>
                <p className="font-display text-[10px] tracking-wider text-muted-foreground uppercase mb-1">
                  Significado
                </p>
                <p className="font-body text-xs text-foreground leading-relaxed">
                  {meaning.description}
                </p>
              </div>
              <div>
                <p className="font-display text-[10px] tracking-wider text-muted-foreground uppercase mb-1">
                  Desafios
                </p>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  {meaning.challenges}
                </p>
              </div>
              <div>
                <p className="font-display text-[10px] tracking-wider text-muted-foreground uppercase mb-1">
                  Missão
                </p>
                <p className="font-body text-xs text-foreground leading-relaxed italic">
                  {meaning.mission}
                </p>
              </div>
              <div>
                <p className="font-display text-[10px] tracking-wider text-muted-foreground uppercase mb-1">
                  Compatibilidade
                </p>
                <div className="flex gap-2">
                  {meaning.compatibility.map((n) => (
                    <span key={n} className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-display text-primary">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {locked && (
          <p className="mt-2 text-[10px] text-muted-foreground">
            🔒 Disponível no plano premium
          </p>
        )}
      </motion.div>
    );
  };

  return (
    <div className="mx-auto max-w-lg px-4 pt-6 pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <span className="text-4xl font-display">✡</span>
        <h1 className="mt-2 font-display text-xl tracking-widest text-foreground">
          Numerologia Cabalística
        </h1>
        <p className="mt-1 font-body text-sm text-muted-foreground italic">
          Os números sagrados revelam seu destino
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step: Input */}
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
                Nome completo
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo de nascimento"
                className="mt-2 border-border bg-card font-body text-foreground placeholder:text-muted-foreground"
              />
              <p className="mt-1 font-body text-[10px] text-muted-foreground">
                Use o nome conforme consta no registro de nascimento
              </p>
            </div>

            <div>
              <label className="font-display text-xs tracking-wider text-muted-foreground uppercase">
                Data de nascimento
              </label>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-2 border-border bg-card font-body text-foreground"
              />
            </div>

            <Button
              className="w-full font-display tracking-widest"
              size="lg"
              disabled={!fullName.trim() || !birthDate}
              onClick={handleCalculate}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Calcular Mapa Numerológico
            </Button>

            <button
              onClick={() => setStep("fundamentals")}
              className="flex items-center justify-center gap-2 w-full py-2 font-body text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Conhecer os Fundamentos
            </button>
          </motion.div>
        )}

        {/* Step: Calculating */}
        {step === "calculating" && (
          <motion.div
            key="calculating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-20 space-y-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="text-6xl"
            >
              ✡
            </motion.div>
            <div className="text-center">
              <p className="font-display text-sm tracking-widest text-primary">
                Calculando seu mapa...
              </p>
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mt-2 font-body text-xs text-muted-foreground italic"
              >
                Os números sagrados estão se revelando
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Step: Result */}
        {step === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <button
                onClick={resetAll}
                className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-3 w-3" /> Nova consulta
              </button>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={shareResult} className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={resetAll} className="h-8 w-8">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Name display */}
            <div className="rounded-xl border border-primary/20 bg-secondary/20 p-4 text-center">
              <p className="font-display text-xs tracking-widest text-muted-foreground uppercase">
                Mapa Numerológico de
              </p>
              <p className="mt-1 font-display text-lg tracking-wider text-primary">
                {fullName}
              </p>
            </div>

            {/* Number Cards */}
            <div className="space-y-3">
              {renderNumberCard("Caminho de Vida", result.lifePath, "🛤️")}
              {renderNumberCard("Expressão", result.expression, "🗣️", true)}
              {renderNumberCard("Alma", result.soulUrge, "💎", true)}
              {renderNumberCard("Personalidade", result.personality, "🎭", true)}
              {renderNumberCard("Destino", result.destiny, "⭐", true)}
            </div>

            {/* Personal Year */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-primary/30 bg-gradient-to-br from-secondary/20 to-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl font-display text-accent-foreground">
                  {result.personalYear}
                </div>
                <div>
                  <p className="font-display text-xs tracking-wider text-muted-foreground uppercase">
                    Ano Pessoal {new Date().getFullYear()}
                  </p>
                  <p className="font-body text-sm text-foreground">
                    {NUMBER_MEANINGS[result.personalYear]?.title || "—"}
                  </p>
                </div>
              </div>
              {NUMBER_MEANINGS[result.personalYear] && (
                <p className="mt-3 font-body text-xs text-muted-foreground leading-relaxed">
                  {NUMBER_MEANINGS[result.personalYear].description}
                </p>
              )}
            </motion.div>

            {/* Life Cycles */}
            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <p className="font-display text-xs tracking-widest text-muted-foreground uppercase mb-3">
                  Ciclos de Vida
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center rounded-lg bg-background/50 p-3">
                    <p className="text-xl font-display text-primary">{result.cycles.youth}</p>
                    <p className="text-[10px] font-display tracking-wider text-muted-foreground uppercase mt-1">
                      Juventude
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      até {result.cycles.youthEnd} anos
                    </p>
                  </div>
                  <div className="text-center rounded-lg bg-background/50 p-3">
                    <p className="text-xl font-display text-primary">{result.cycles.maturity}</p>
                    <p className="text-[10px] font-display tracking-wider text-muted-foreground uppercase mt-1">
                      Maturidade
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      até {result.cycles.maturityEnd} anos
                    </p>
                  </div>
                  <div className="text-center rounded-lg bg-background/50 p-3">
                    <p className="text-xl font-display text-primary">{result.cycles.wisdom}</p>
                    <p className="text-[10px] font-display tracking-wider text-muted-foreground uppercase mt-1">
                      Sabedoria
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      após {result.cycles.maturityEnd} anos
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <Lock className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                <p className="font-display text-xs tracking-wider text-muted-foreground uppercase">
                  Ciclos de Vida
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Disponível no plano premium
                </p>
              </div>
            )}

            {/* Premium CTA */}
            {!isSubscribed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-center space-y-3"
              >
                <p className="font-display text-xs tracking-wider">✨ Desbloqueie a Análise Completa</p>
                <p className="font-body text-xs text-muted-foreground">
                  Assine o plano premium para acessar todos os números, ciclos de vida e compatibilidades.
                </p>
                <Button
                  className="w-full font-display tracking-wider"
                  onClick={() => navigate("/perfil")}
                >
                  ✨ Assinar por R$ 5,99/mês
                </Button>
              </motion.div>
            )}

            <Button
              variant="outline"
              className="w-full font-display tracking-wider"
              onClick={() => setStep("fundamentals")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Ver Fundamentos
            </Button>
          </motion.div>
        )}

        {/* Step: Fundamentals */}
        {step === "fundamentals" && (
          <motion.div
            key="fundamentals"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-4"
          >
            <button
              onClick={() => setStep(result ? "result" : "input")}
              className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-3 w-3" /> Voltar
            </button>

            <h2 className="font-display text-lg tracking-widest text-foreground text-center">
              Fundamentos da Numerologia
            </h2>

            <ScrollArea className="h-[60vh]">
              <div className="space-y-4 pr-2">
                {FUNDAMENTALS.map((section, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <h3 className="font-display text-xs tracking-widest text-primary uppercase mb-2">
                      {section.title}
                    </h3>
                    <p className="font-body text-xs text-foreground leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NumerologiaPage;
