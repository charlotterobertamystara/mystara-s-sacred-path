import { motion } from "framer-motion";

const crystals = [
  { name: "Ametista", desc: "Proteção e intuição", color: "bg-mystara-purple" },
  { name: "Quartzo Rosa", desc: "Amor e harmonia", color: "bg-pink-900/50" },
  { name: "Citrino", desc: "Prosperidade e energia", color: "bg-mystara-gold/20" },
  { name: "Turmalina Negra", desc: "Proteção e aterramento", color: "bg-muted" },
  { name: "Selenita", desc: "Purificação e clareza", color: "bg-secondary" },
  { name: "Obsidiana", desc: "Transformação e verdade", color: "bg-muted" },
];

const CristaisPage = () => {
  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <span className="text-4xl">◆</span>
          <h1 className="mt-2 font-display text-xl tracking-widest text-foreground">
            Cristais
          </h1>
          <p className="mt-1 font-body text-sm text-muted-foreground italic">
            Poder e sabedoria das pedras sagradas
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {crystals.map((c, i) => (
            <motion.button
              key={c.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="gradient-card flex flex-col items-center gap-2 rounded-xl border border-border p-4 transition-all hover:shadow-mystical hover:border-primary/30"
            >
              <div className={`h-10 w-10 rounded-full ${c.color} border border-border`} />
              <span className="font-display text-xs tracking-wider text-foreground">{c.name}</span>
              <span className="text-[10px] text-muted-foreground">{c.desc}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CristaisPage;
