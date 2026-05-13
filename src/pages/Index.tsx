import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/mystara-hero.jpg";

const features = [
  { title: "Tarot de Marselha", description: "Leitura simbólica e arquetípica profunda dos 78 arcanos", icon: "🂡", path: "/tarot", free: true },
  { title: "Runas", description: "Sabedoria ancestral nórdica do Elder Futhark", icon: "ᚱ", path: "/runas" },
  { title: "Numerologia", description: "Números sagrados cabalísticos e seu significado", icon: "✡", path: "/numerologia" },
  { title: "Cristais", description: "Poder energético das pedras sagradas", icon: "◆", path: "/cristais" },
  { title: "Limpeza Espiritual", description: "Banhos, ervas, defumações e rituais de purificação", icon: "🌿", path: "/limpeza" },
  { title: "Mapa Astral", description: "Seu mapa celeste pessoal e completo", icon: "☉", path: "/mapa-astral" },
  { title: "Radiestesia", description: "Gráficos radiônicos e orientação energética", icon: "◎", path: "/radiestesia" },
  { title: "Diário Lunar", description: "Registre sua jornada espiritual com os ciclos da lua", icon: "📔", path: "/diario" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <div className="relative h-64 lg:h-96 overflow-hidden">
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
          className="absolute inset-x-0 bottom-8 text-center"
        >
          <h1 className="font-display text-4xl lg:text-6xl tracking-widest text-foreground text-glow">
            MYSTARA
          </h1>
          <p className="mt-2 font-body text-sm lg:text-base text-muted-foreground italic">
            Orientação espiritual e simbólica
          </p>
          <p className="mt-3 text-xs text-primary/80 tracking-widest uppercase font-display">
            ✦ Tarot · Runas · Astrologia · Radiestesia ✦
          </p>
        </motion.div>
      </div>

      {/* Features */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 pb-12">
        <p className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase mb-6">
          Escolha sua consulta
        </p>

        {/* Mobile: lista / Desktop: grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
          {features.map((f, i) => (
            <motion.button
              key={f.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              onClick={() => navigate(f.path)}
              className="group relative flex items-center gap-4 rounded-xl border border-border bg-card/60 p-4 lg:p-5 text-left backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-12 w-12 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl lg:text-3xl transition-transform group-hover:scale-110">
                {f.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm lg:text-base tracking-wide text-foreground">
                    {f.title}
                  </h3>
                  {f.free && (
                    <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-display tracking-wider">
                      GRÁTIS
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs lg:text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>
              <span className="text-muted-foreground/40 group-hover:text-primary/60 transition-colors shrink-0">
                →
              </span>
            </motion.button>
          ))}
        </div>

        {/* CTA Premium */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-6 text-center"
        >
          <p className="font-display text-sm tracking-widest text-primary uppercase mb-2">
            ✦ Mystara Premium
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Acesso ilimitado a todas as funcionalidades por apenas
          </p>
          <p className="font-display text-3xl text-foreground mb-4">
            R$ 9,90<span className="text-sm text-muted-foreground font-body">/mês</span>
          </p>
          <button
            onClick={() => navigate("/loja")}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-display text-sm tracking-wider hover:bg-primary/90 transition-colors"
          >
            Assinar agora
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default Index;
