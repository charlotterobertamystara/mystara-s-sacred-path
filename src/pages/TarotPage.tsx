import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const TarotPage = () => {
  const [question, setQuestion] = useState("");
  const [numCards, setNumCards] = useState(3);

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <span className="text-4xl">🂡</span>
          <h1 className="mt-2 font-display text-xl tracking-widest text-foreground">
            Tarot de Marselha
          </h1>
          <p className="mt-1 font-body text-sm text-muted-foreground italic">
            Leitura simbólica e arquetípica tradicional
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-display text-xs tracking-wider text-muted-foreground uppercase">
              Sua pergunta
            </label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Concentre-se e escreva sua pergunta..."
              className="mt-2 min-h-[100px] resize-none border-border bg-card font-body text-foreground placeholder:text-muted-foreground"
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
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {n} {n === 1 ? "carta" : "cartas"}
                </button>
              ))}
            </div>
          </div>

          <Button
            className="w-full font-display tracking-widest"
            size="lg"
            disabled={!question.trim()}
          >
            Iniciar Leitura
          </Button>

          <p className="text-center text-[10px] text-muted-foreground">
            Consome 1 crédito por leitura
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TarotPage;
