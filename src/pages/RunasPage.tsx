import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const RunasPage = () => {
  const [question, setQuestion] = useState("");

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <span className="text-4xl font-display">ᚱ</span>
          <h1 className="mt-2 font-display text-xl tracking-widest text-foreground">
            Runas
          </h1>
          <p className="mt-1 font-body text-sm text-muted-foreground italic">
            Sabedoria ancestral dos povos nórdicos
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
              placeholder="O que deseja saber das runas..."
              className="mt-2 min-h-[100px] resize-none border-border bg-card font-body text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="font-display text-xs tracking-wider text-muted-foreground uppercase">
              Tipo de tiragem
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {["1 Runa", "3 Runas", "Cruz Rúnica", "Tiragem Completa"].map((t) => (
                <button
                  key={t}
                  className="rounded-lg border border-border bg-card py-3 font-display text-xs tracking-wider text-muted-foreground transition-all hover:border-primary hover:text-primary"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Button
            className="w-full font-display tracking-widest"
            size="lg"
            disabled={!question.trim()}
          >
            Consultar Runas
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default RunasPage;
