import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer } from "lucide-react";
import { RADIESTESIA_GRAPHS, GRAPH_CATEGORIES } from "@/data/radiestesia-graphs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const RadiestesiaGraficos = () => {
  const [categoria, setCategoria] = useState("Todos");

  const filtered = categoria === "Todos"
    ? RADIESTESIA_GRAPHS
    : RADIESTESIA_GRAPHS.filter((g) => g.categoria === categoria);

  const handlePrint = (imagem: string, nome: string) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx!.drawImage(img, 0, 0);
      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
      ctx!.putImageData(imageData, 0, 0);
      const invertedUrl = canvas.toDataURL("image/png");
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${nome} — Mystara</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
              img { max-width: 100%; max-height: 100vh; object-fit: contain; }
              @media print { body { margin: 0; } img { max-width: 100%; } }
            </style>
          </head>
          <body>
            <img src="${invertedUrl}" alt="${nome}" onload="window.print()" />
          </body>
          </html>
        `);
        printWindow.document.close();
      }
    };
    img.src = imagem;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 space-y-4"
    >
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {GRAPH_CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={categoria === cat ? "default" : "outline"}
              className={`cursor-pointer shrink-0 font-display text-[10px] tracking-wider transition-all ${
                categoria === cat
                  ? "bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
              }`}
              onClick={() => setCategoria(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <p className="font-body text-xs text-muted-foreground text-center">
        {filtered.length} gráfico{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((graph, i) => (
          <motion.div
            key={graph.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card className="overflow-hidden border-border bg-card hover:border-primary/30 transition-colors">
              <div className="aspect-square bg-muted/20 flex items-center justify-center p-2">
                <img
                  src={graph.imagem}
                  alt={graph.nome}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-3 space-y-2">
                <h3 className="font-display text-xs tracking-wider text-foreground leading-tight line-clamp-2">
                  {graph.nome}
                </h3>
                <Badge variant="outline" className="font-body text-[9px] border-border text-muted-foreground">
                  {graph.categoria}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/30 text-primary hover:bg-primary/10 font-display text-[10px] tracking-wider"
                  onClick={() => handlePrint(graph.imagem, graph.nome)}
                >
                  <Printer className="mr-1 h-3 w-3" />
                  Imprimir
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RadiestesiaGraficos;
