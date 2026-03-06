import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { radiestesiaGraphs, categoryLabels, type RadiestesiaGraph } from "@/data/radiestesia-graphs";
import GraphCard from "@/components/radiestesia/GraphCard";
import CompassTool from "@/components/radiestesia/CompassTool";
import PendulumTool from "@/components/radiestesia/PendulumTool";
import MontageGuide from "@/components/radiestesia/MontageGuide";
import { Download, ImageOff } from "lucide-react";

const RadiestesiaPage = () => {
  const [problem, setProblem] = useState("");
  const [selectedGraph, setSelectedGraph] = useState<RadiestesiaGraph | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async (graph: RadiestesiaGraph) => {
    if (!graph.imageUrl) return;
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "cm", format: [14, 14] });

      doc.setFontSize(12);
      doc.text(graph.name, 7, 1.2, { align: "center" });

      // Load image and add to PDF
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = graph.imageUrl!;
      });

      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 1200, 1200);
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 50, 50, 1100, 1100);
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 0.5, 1.8, 13, 13);
      }

      doc.setFontSize(8);
      doc.text(`Cristal: ${graph.crystal}`, 7, 13.2, { align: "center" });
      if (graph.needsNorth) {
        doc.text("↑ Orientar ao Norte", 7, 13.6, { align: "center" });
      }

      doc.save(`${graph.id}-14x14.pdf`);
    } catch (e) {
      console.error("PDF error:", e);
    } finally {
      setDownloading(false);
    }
  };

  const categories = ["todos", ...Array.from(new Set(radiestesiaGraphs.map(g => g.category)))];
  const filteredGraphs = activeCategory === "todos"
    ? radiestesiaGraphs
    : radiestesiaGraphs.filter(g => g.category === activeCategory);

  return (
    <div className="mx-auto max-w-lg px-4 pt-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
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

        <Tabs defaultValue="consulta" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-muted/50">
            <TabsTrigger value="consulta" className="font-display text-[10px] tracking-wider">
              Consulta
            </TabsTrigger>
            <TabsTrigger value="graficos" className="font-display text-[10px] tracking-wider">
              Gráficos
            </TabsTrigger>
            <TabsTrigger value="ferramentas" className="font-display text-[10px] tracking-wider">
              Ferramentas
            </TabsTrigger>
            <TabsTrigger value="montar" className="font-display text-[10px] tracking-wider">
              Como Montar
            </TabsTrigger>
          </TabsList>

          {/* Consulta Tab */}
          <TabsContent value="consulta" className="mt-4">
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
                Receber Orientação
              </Button>

              <p className="font-body text-xs text-muted-foreground text-center italic">
                A IA indicará até 3 gráficos radiônicos ideais para sua situação, com cristais recomendados.
              </p>
            </div>
          </TabsContent>

          {/* Gráficos Tab */}
          <TabsContent value="graficos" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="font-body text-xs text-muted-foreground italic">
                  Toque em um gráfico para ver detalhes
                </p>
                <span className="font-display text-[10px] tracking-wider text-primary/70">
                  {filteredGraphs.length} gráficos
                </span>
              </div>

              {/* Category filter */}
              <div className="flex gap-1.5 flex-wrap pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-full font-display text-[10px] tracking-wider transition-colors border ${
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    {cat === "todos" ? "Todos" : categoryLabels[cat as keyof typeof categoryLabels]}
                  </button>
                ))}
              </div>

              {filteredGraphs.map((graph) => (
                <GraphCard
                  key={graph.id}
                  graph={graph}
                  onSelect={setSelectedGraph}
                />
              ))}
            </div>
          </TabsContent>

          {/* Ferramentas Tab */}
          <TabsContent value="ferramentas" className="mt-4">
            <Tabs defaultValue="bussola" className="w-full">
              <TabsList className="w-full grid grid-cols-2 bg-muted/30">
                <TabsTrigger value="bussola" className="font-display text-[10px] tracking-wider">
                  🧭 Bússola
                </TabsTrigger>
                <TabsTrigger value="pendulo" className="font-display text-[10px] tracking-wider">
                  🔮 Pêndulo
                </TabsTrigger>
              </TabsList>
              <TabsContent value="bussola" className="mt-4">
                <CompassTool />
              </TabsContent>
              <TabsContent value="pendulo" className="mt-4">
                <PendulumTool />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Como Montar Tab */}
          <TabsContent value="montar" className="mt-4">
            <MontageGuide />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Graph Detail Dialog */}
      <Dialog open={!!selectedGraph} onOpenChange={(open) => !open && setSelectedGraph(null)}>
        <DialogContent className="max-w-sm border-border bg-card">
          {selectedGraph && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 flex-wrap">
                  <DialogTitle className="font-display tracking-widest text-foreground">
                    {selectedGraph.name}
                  </DialogTitle>
                  <span className="text-[10px] font-display tracking-wider px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary">
                    {categoryLabels[selectedGraph.category]}
                  </span>
                </div>
                <DialogDescription className="font-body text-sm text-muted-foreground">
                  {selectedGraph.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Image Preview */}
                <div className="w-full max-w-[200px] mx-auto flex items-center justify-center rounded-lg overflow-hidden border border-border bg-muted/20 aspect-square">
                  {selectedGraph.imageUrl ? (
                    <img
                      src={selectedGraph.imageUrl}
                      alt={selectedGraph.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground/40">
                      <ImageOff className="w-10 h-10" />
                      <span className="text-[10px] font-display tracking-wider uppercase">Sem imagem</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-display text-xs tracking-wider text-muted-foreground uppercase">
                      Utilização
                    </h4>
                    <p className="font-body text-sm text-foreground/80 mt-1">
                      {selectedGraph.usage}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                    <h4 className="font-display text-xs tracking-wider text-primary uppercase">
                      ◆ Cristal Recomendado
                    </h4>
                    <p className="font-display text-sm text-foreground mt-1">
                      {selectedGraph.crystal}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      {selectedGraph.crystalReason}
                    </p>
                  </div>

                  {selectedGraph.needsNorth && (
                    <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                      <span className="text-primary">↑</span>
                      Este gráfico precisa ser orientado ao Norte
                    </div>
                   )}

                  <Button
                    variant="outline"
                    className="w-full font-display tracking-wider text-xs gap-2"
                    disabled={downloading}
                    onClick={() => handleDownloadPdf(selectedGraph)}
                  >
                    <Download className="w-4 h-4" />
                    {downloading ? "Gerando PDF..." : "Baixar PDF (14×14 cm)"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RadiestesiaPage;
