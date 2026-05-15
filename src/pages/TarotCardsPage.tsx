import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MAJOR_ARCANA, TarotCard } from "@/data/tarot-cards";
import { MINOR_ARCANA } from "@/data/tarot-minor-arcana";
import { ChevronLeft, Search } from "lucide-react";

const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA];

const SUIT_GROUPS = [
  { label: "Arcanos Maiores", filter: (c: TarotCard) => (c as any).suit === undefined },
  { label: "Copas", filter: (c: TarotCard) => (c as any).suit === "Copas" },
  { label: "Espadas", filter: (c: TarotCard) => (c as any).suit === "Espadas" },
  { label: "Paus", filter: (c: TarotCard) => (c as any).suit === "Paus" },
  { label: "Ouros", filter: (c: TarotCard) => (c as any).suit === "Ouros" },
];

const TarotCardsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TarotCard | null>(null);
  const [activeGroup, setActiveGroup] = useState("Arcanos Maiores");

  const filtered = ALL_CARDS.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.nameOriginal.toLowerCase().includes(q) ||
      c.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const displayCards = search.trim()
    ? filtered
    : ALL_CARDS.filter(SUIT_GROUPS.find((g) => g.label === activeGroup)!.filter);

  return (
    <div className="mx-auto max-w-2xl px-4 pt-4 pb-28">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={() => navigate("/tarot")}
          className="flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </button>
        <h1 className="font-display text-base tracking-widest text-foreground">
          Todas as Cartas
        </h1>
      </div>

      {/* Busca */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar carta pelo nome ou palavra-chave..."
          className="pl-9 border-border bg-card font-body text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Filtros por grupo */}
      {!search.trim() && (
        <div className="mb-4 flex flex-wrap gap-2">
          {SUIT_GROUPS.map((g) => (
            <button
              key={g.label}
              onClick={() => setActiveGroup(g.label)}
              className={`rounded-full border px-3 py-1 font-display text-xs tracking-wider transition-all ${
                activeGroup === g.label
                  ? "border-primary bg-secondary text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid de cartas */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {displayCards.map((card, i) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => setSelected(card)}
            className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3 text-center transition-all hover:border-primary/50 hover:bg-secondary/20"
          >
            <span className="text-2xl">{card.symbol}</span>
            <p className="font-display text-[10px] leading-tight tracking-wide text-foreground line-clamp-2">
              {card.name}
            </p>
            <p className="font-body text-[9px] text-muted-foreground italic line-clamp-1">
              {card.number}
            </p>
          </motion.button>
        ))}
      </div>

      {displayCards.length === 0 && (
        <p className="mt-8 text-center font-body text-sm text-muted-foreground italic">
          Nenhuma carta encontrada.
        </p>
      )}

      {/* Modal detalhes */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-sm border-border bg-card">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selected.symbol}</span>
                  <div>
                    <DialogTitle className="font-display text-base text-primary">
                      {selected.number} — {selected.name}
                    </DialogTitle>
                    <p className="font-body text-xs text-muted-foreground italic">
                      {selected.nameOriginal}
                    </p>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {selected.keywords.map((k) => (
                    <Badge
                      key={k}
                      variant="outline"
                      className="border-primary/20 text-primary text-[10px] px-2 py-0 font-body"
                    >
                      {k}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-secondary/20 border border-border px-2 py-1.5">
                    <p className="font-display text-[9px] tracking-wider text-muted-foreground uppercase">
                      Elemento
                    </p>
                    <p className="font-body text-xs text-foreground">{selected.element}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/20 border border-border px-2 py-1.5">
                    <p className="font-display text-[9px] tracking-wider text-muted-foreground uppercase">
                      Arquétipo
                    </p>
                    <p className="font-body text-xs text-foreground">{selected.archetype}</p>
                  </div>
                </div>
                <div>
                  <p className="font-display text-[10px] tracking-wider text-primary uppercase mb-1">
                    Direita
                  </p>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">
                    {selected.uprightMeaning}
                  </p>
                </div>
                <div>
                  <p className="font-display text-[10px] tracking-wider text-muted-foreground uppercase mb-1">
                    Invertida
                  </p>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">
                    {selected.reversedMeaning}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TarotCardsPage;
