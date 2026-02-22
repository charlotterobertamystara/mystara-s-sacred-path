import { motion } from "framer-motion";
import heroImage from "@/assets/mystara-hero.jpg";
import FeatureCard from "@/components/FeatureCard";

const features = [
  { title: "Tarot de Marselha", description: "Leitura simbólica e arquetípica", icon: "🂡", path: "/tarot" },
  { title: "Runas", description: "Sabedoria ancestral nórdica", icon: "ᚱ", path: "/runas" },
  { title: "Radiestesia", description: "Orientação energética", icon: "◎", path: "/radiestesia" },
  { title: "Cristais", description: "Poder das pedras sagradas", icon: "◆", path: "/cristais" },
  { title: "Limpeza Espiritual", description: "Banhos, ervas e defumações", icon: "🌿", path: "/limpeza" },
  { title: "Mapa Astral", description: "Seu mapa celeste pessoal", icon: "☉", path: "/mapa-astral" },
];

const Index = () => {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={heroImage}
          alt="Mystara - Orientação Espiritual"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-x-0 bottom-6 text-center"
        >
          <h1 className="font-display text-3xl tracking-widest text-foreground text-glow">
            MYSTARA
          </h1>
          <p className="mt-1 font-body text-sm text-muted-foreground italic">
            Orientação espiritual e simbólica
          </p>
        </motion.div>
      </div>

      {/* Features */}
      <div className="mx-auto w-full max-w-lg space-y-3 px-4 pt-6">
        <p className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Escolha sua consulta
        </p>
        {features.map((f, i) => (
          <FeatureCard key={f.path} {...f} delay={i * 0.08} />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mx-auto max-w-lg px-4 py-8">
        <p className="text-center text-[10px] text-muted-foreground leading-relaxed">
          Mystara é um aplicativo de orientação espiritual e simbólica. Não substitui
          aconselhamento médico, psicológico, jurídico ou profissional. Não garantimos resultados.
        </p>
      </div>
    </div>
  );
};

export default Index;
