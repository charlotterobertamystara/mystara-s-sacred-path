import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const RadiestesiaPage = () => {
  const [problem, setProblem] = useState("");

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <span className="text-4xl">◎</span>
          <h1 className="mt-2 font-display text-xl tracking-widest text-foreground">
            Radiestesia
          </h1>
          <p className="mt-1 font-body text-sm text-muted-foreground italic">
            Orientação energética e equilíbrio
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-display text-xs tracking-wider text-muted-foreground uppercase">
              Descreva sua situação
            </label>
            <Textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Descreva a situação que deseja harmonizar..."
              className="mt-2 min-h-[120px] resize-none border-border bg-card font-body text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Button
            className="w-full font-display tracking-widest"
            size="lg"
            disabled={!problem.trim()}
          >
            Iniciar Orientação
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default RadiestesiaPage;
