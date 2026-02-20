import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { RadiestesiaGraph } from "@/data/radiestesia-graphs";
import { categoryLabels } from "@/data/radiestesia-graphs";

interface GraphCardProps {
  graph: RadiestesiaGraph;
  onSelect?: (graph: RadiestesiaGraph) => void;
}

const categoryColors: Record<RadiestesiaGraph["category"], string> = {
  limpeza: "text-sky-400 border-sky-400/30 bg-sky-400/10",
  protecao: "text-violet-400 border-violet-400/30 bg-violet-400/10",
  cura: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  prosperidade: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  amor: "text-rose-400 border-rose-400/30 bg-rose-400/10",
  espiritualidade: "text-indigo-400 border-indigo-400/30 bg-indigo-400/10",
  saude: "text-teal-400 border-teal-400/30 bg-teal-400/10",
  harmonizacao: "text-fuchsia-400 border-fuchsia-400/30 bg-fuchsia-400/10",
};

const GraphCard = ({ graph, onSelect }: GraphCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="border-border bg-card cursor-pointer hover:border-primary/40 transition-colors"
        onClick={() => onSelect?.(graph)}
      >
        <CardContent className="p-4 flex gap-4">
          {/* Graph SVG preview */}
          <div
            className="w-16 h-16 flex-shrink-0 text-primary/70"
            dangerouslySetInnerHTML={{ __html: graph.svgPath }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-display text-sm tracking-wider text-foreground">
                {graph.name}
              </h3>
              <span className={`text-[9px] font-display tracking-wider px-1.5 py-0.5 rounded-full border ${categoryColors[graph.category]}`}>
                {categoryLabels[graph.category]}
              </span>
            </div>
            <p className="font-body text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {graph.description}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-display tracking-wider text-primary/70 uppercase">
                ◆ {graph.crystal}
              </span>
              {graph.needsNorth && (
                <span className="text-[10px] font-display tracking-wider text-muted-foreground uppercase">
                  ↑ Norte
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GraphCard;
