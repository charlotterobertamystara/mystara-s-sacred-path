import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { products, categorias, type Product } from "@/data/loja-products";

const ProductCard = ({ product, index }: { product: Product; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="gradient-card flex flex-col overflow-hidden rounded-xl border border-border transition-all hover:shadow-mystical hover:border-primary/30"
  >
    <div className="aspect-square w-full overflow-hidden bg-secondary/30">
      <img
        src={product.imagem}
        alt={product.nome}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
    <div className="flex flex-1 flex-col gap-2 p-3">
      <h4 className="font-display text-xs tracking-wider text-foreground leading-tight">
        {product.nome}
      </h4>
      <p className="text-[11px] text-muted-foreground font-body leading-snug">
        {product.descricao}
      </p>
      <span className="mt-auto font-display text-sm tracking-wide text-primary text-glow">
        {product.preco}
      </span>
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 font-display text-[10px] tracking-widest text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
      >
        Comprar
        <ExternalLink size={12} />
      </a>
    </div>
  </motion.div>
);

const LojaPage = () => {
  return (
    <div className="mx-auto max-w-lg px-4 pt-6 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center">
          <span className="text-4xl">🔮</span>
          <h1 className="mt-2 font-display text-xl tracking-widest text-foreground">
            Loja Mystara
          </h1>
          <p className="mt-1 font-body text-sm text-muted-foreground italic">
            Ferramentas sagradas para sua jornada
          </p>
        </div>

        {categorias.map((cat) => {
          const items = products.filter((p) => p.categoria === cat.key);
          if (items.length === 0) return null;
          return (
            <section key={cat.key} className="space-y-3">
              <h2 className="flex items-center gap-2 font-display text-sm tracking-widest text-foreground">
                <span className="text-lg">{cat.icon}</span>
                {cat.label}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {items.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </section>
          );
        })}
      </motion.div>
    </div>
  );
};

export default LojaPage;
