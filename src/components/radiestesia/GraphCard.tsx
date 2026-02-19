import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { RadiestesiaGraph } from "@/data/radiestesia-graphs";

interface GraphCardProps {
  graph: RadiestesiaGraph;
  onSelect?: (graph: RadiestesiaGraph) => void;
}

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
            <h3 className="font-display text-sm tracking-wider text-foreground">
              {graph.name}
            </h3>
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
