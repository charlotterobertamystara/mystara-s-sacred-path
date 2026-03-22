import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RadiestesiaConsulta from "@/components/radiestesia/RadiestesiaConsulta";
import RadiestesiaGraficos from "@/components/radiestesia/RadiestesiaGraficos";
import RadiestesiaFerramentas from "@/components/radiestesia/RadiestesiaFerramentas";
import RadiestesiaComoMontar from "@/components/radiestesia/RadiestesiaComoMontar";

const RadiestesiaPage = () => {
  const [activeTab, setActiveTab] = useState("consulta");

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl"
      >
        <div className="mb-6 text-center">
          <span className="text-4xl text-primary text-glow">◎</span>
          <h1 className="mt-2 font-display text-2xl tracking-wider text-primary">
            Radiestesia
          </h1>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            Harmonize energias com gráficos radiônicos sagrados
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 border border-border">
            <TabsTrigger value="consulta" className="font-display text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Consulta
            </TabsTrigger>
            <TabsTrigger value="graficos" className="font-display text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Gráficos
            </TabsTrigger>
            <TabsTrigger value="ferramentas" className="font-display text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Ferramentas
            </TabsTrigger>
            <TabsTrigger value="como-montar" className="font-display text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Como Montar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="consulta">
            <RadiestesiaConsulta />
          </TabsContent>
          <TabsContent value="graficos">
            <RadiestesiaGraficos />
          </TabsContent>
          <TabsContent value="ferramentas">
            <RadiestesiaFerramentas />
          </TabsContent>
          <TabsContent value="como-montar">
            <RadiestesiaComoMontar />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default RadiestesiaPage;
