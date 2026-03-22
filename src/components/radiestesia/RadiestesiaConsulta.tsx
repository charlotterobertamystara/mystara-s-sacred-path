import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RadiestesiaConsulta = () => {
  const [situacao, setSituacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConsulta = async () => {
    if (!situacao.trim()) {
      toast({ title: "Descreva sua situação", description: "Por favor, escreva sobre a situação que deseja harmonizar.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResultado(null);

    try {
      const { data, error } = await supabase.functions.invoke("radiestesia-consulta", {
        body: { situacao: situacao.trim() },
      });

      if (error) throw error;
      setResultado(data.orientacao);
    } catch (err) {
      toast({ title: "Erro na consulta", description: "Não foi possível obter a orientação. Tente novamente.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 space-y-4"
    >
      <Card className="border-border bg-card">
        <CardContent className="p-5 space-y-4">
          <label className="font-display text-sm tracking-wider text-primary">
            Descreva sua situação
          </label>
          <Textarea
            placeholder="Descreva a situação que deseja harmonizar..."
            value={situacao}
            onChange={(e) => setSituacao(e.target.value)}
            className="min-h-[120px] border-border bg-muted/30 font-body text-foreground placeholder:text-muted-foreground"
          />
          <Button
            onClick={handleConsulta}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display tracking-wider"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Consultando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Receber Orientação
              </>
            )}
          </Button>
          <p className="text-center font-body text-xs text-muted-foreground">
            A IA indicará até 3 gráficos radiônicos ideais para sua situação, com cristais recomendados.
          </p>
        </CardContent>
      </Card>

      {resultado && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary/20 bg-card shadow-mystical">
            <CardContent className="p-5">
              <h3 className="mb-3 font-display text-sm tracking-wider text-primary">
                ✦ Orientação Radiônica
              </h3>
              <div className="font-body text-sm leading-relaxed text-foreground whitespace-pre-line">
                {resultado}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RadiestesiaConsulta;
