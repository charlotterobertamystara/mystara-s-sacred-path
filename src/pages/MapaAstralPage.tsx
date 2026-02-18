import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MapaAstralPage = () => {
  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <span className="text-4xl">☉</span>
          <h1 className="mt-2 font-display text-xl tracking-widest text-foreground">
            Mapa Astral
          </h1>
          <p className="mt-1 font-body text-sm text-muted-foreground italic">
            Seu mapa celeste pessoal
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-display text-xs tracking-wider text-muted-foreground uppercase">
              Data de nascimento
            </label>
            <Input type="date" className="mt-2 border-border bg-card text-foreground" />
          </div>
          <div>
            <label className="font-display text-xs tracking-wider text-muted-foreground uppercase">
              Hora de nascimento
            </label>
            <Input type="time" className="mt-2 border-border bg-card text-foreground" />
          </div>
          <div>
            <label className="font-display text-xs tracking-wider text-muted-foreground uppercase">
              Cidade de nascimento
            </label>
            <Input
              placeholder="Ex: São Paulo, SP"
              className="mt-2 border-border bg-card font-body text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Button className="w-full font-display tracking-widest" size="lg">
            Gerar Mapa Astral
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default MapaAstralPage;
