import { motion } from "framer-motion";

const items = [
  { name: "Banho de Arruda", desc: "Proteção contra energias negativas", icon: "🌿" },
  { name: "Banho de Sal Grosso", desc: "Limpeza e purificação", icon: "🧂" },
  { name: "Banho de Rosas", desc: "Amor e autoestima", icon: "🌹" },
  { name: "Banho de Alecrim", desc: "Prosperidade e vitalidade", icon: "🌱" },
  { name: "Ervas para Defumação", desc: "Limpeza do ambiente", icon: "💨" },
  { name: "Chás Rituais", desc: "Conexão e meditação", icon: "🍵" },
];

const BanhosErvasPage = () => {
  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <span className="text-4xl">🌿</span>
          <h1 className="mt-2 font-display text-xl tracking-widest text-foreground">
            Banhos & Ervas
          </h1>
          <p className="mt-1 font-body text-sm text-muted-foreground italic">
            Rituais de purificação e equilíbrio
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.button
              key={item.name}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="gradient-card flex w-full items-center gap-4 rounded-xl border border-border p-4 text-left transition-all hover:shadow-mystical"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="font-display text-sm tracking-wider text-foreground">{item.name}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BanhosErvasPage;
