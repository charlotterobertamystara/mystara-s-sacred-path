import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PendulumTool = () => {
  const [isSwinging, setIsSwinging] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "swinging" | "slowing" | "stopped">("idle");
  const rulerRef = useRef<HTMLDivElement>(null);
  const animControls = useAnimation();
  const pendulumAngle = useMotionValue(0);

  const maxDays = 30;
  const rulerMarks = Array.from({ length: maxDays + 1 }, (_, i) => i);

  const startPendulum = useCallback(() => {
    setPhase("swinging");
    setIsSwinging(true);
    setSelectedDays(null);

    // Simulate pendulum swing that gradually slows
    let amplitude = 40;
    let speed = 0.08;
    let frame = 0;
    const decay = 0.995;

    const animate = () => {
      frame++;
      amplitude *= decay;
      const angle = amplitude * Math.sin(frame * speed);
      pendulumAngle.set(angle);

      if (amplitude > 0.5) {
        requestAnimationFrame(animate);
      } else {
        // Pendulum stopped - pick a random day
        const days = Math.floor(Math.random() * 21) + 3; // 3-23 days
        setSelectedDays(days);
        setPhase("stopped");
        setIsSwinging(false);
        pendulumAngle.set(0);
      }
    };

    requestAnimationFrame(animate);
  }, [pendulumAngle]);

  const pendulumRotate = useTransform(pendulumAngle, (v) => `${v}deg`);

  return (
    <div className="space-y-6">
      {/* Interactive Pendulum */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-sm tracking-widest text-foreground uppercase">
            Pêndulo — Consulta de Dias
          </CardTitle>
          <p className="font-body text-xs text-muted-foreground">
            Use o pêndulo virtual para descobrir quantos dias manter o gráfico montado
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {/* Pendulum Visual */}
          <div className="relative h-48 w-full flex items-start justify-center overflow-hidden">
            {/* Pivot point */}
            <div className="absolute top-0 w-3 h-3 rounded-full bg-primary z-10" />
            {/* String + bob */}
            <motion.div
              className="absolute top-0 flex flex-col items-center origin-top"
              style={{ rotate: pendulumRotate }}
            >
              <div className="w-px h-32 bg-gradient-to-b from-primary to-primary/50" />
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent shadow-gold -mt-1" />
            </motion.div>
          </div>

          {/* Ruler */}
          <div ref={rulerRef} className="w-full">
            <div className="relative h-16 border border-border rounded-md bg-muted/30 overflow-hidden">
              <div className="flex items-end h-full px-2">
                {rulerMarks.map((day) => {
                  const isSelected = selectedDays === day;
                  const isMajor = day % 5 === 0;
                  return (
                    <div
                      key={day}
                      className="flex-1 flex flex-col items-center justify-end"
                    >
                      <div
                        className={`w-px transition-all duration-300 ${
                          isSelected
                            ? "h-10 bg-primary shadow-gold"
                            : isMajor
                            ? "h-6 bg-foreground/50"
                            : "h-3 bg-muted-foreground/30"
                        }`}
                      />
                      {isMajor && (
                        <span
                          className={`text-[9px] mt-1 font-display ${
                            isSelected
                              ? "text-primary font-bold"
                              : "text-muted-foreground"
                          }`}
                        >
                          {day}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {selectedDays !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-3 rounded-lg border border-primary/30 bg-primary/5"
            >
              <span className="font-display text-2xl text-primary text-glow">
                {selectedDays} dias
              </span>
              <p className="font-body text-xs text-muted-foreground mt-1">
                Mantenha o gráfico montado por este período
              </p>
            </motion.div>
          )}

          <Button
            onClick={startPendulum}
            disabled={isSwinging}
            className="w-full font-display tracking-widest"
          >
            {isSwinging ? "Consultando..." : "Consultar Pêndulo"}
          </Button>
        </CardContent>
      </Card>

      {/* Physical Guide */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-sm tracking-widest text-foreground uppercase">
            Guia — Pêndulo Físico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 font-body text-sm text-foreground/80">
            <div className="flex gap-3">
              <span className="text-primary font-display text-xs mt-0.5">01</span>
              <p>Imprima ou desenhe uma régua numerada de 1 a 30 em uma folha branca.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-display text-xs mt-0.5">02</span>
              <p>Segure seu pêndulo sobre a régua, com a mão firme e relaxada, cotovelo apoiado.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-display text-xs mt-0.5">03</span>
              <p>Mentalize a pergunta: <em>"Por quantos dias devo manter este gráfico montado?"</em></p>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-display text-xs mt-0.5">04</span>
              <p>Passe o pêndulo lentamente sobre os números. Observe onde ele gira ou oscila com mais intensidade.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-display text-xs mt-0.5">05</span>
              <p>O número onde o pêndulo reagir mais fortemente indica os dias recomendados.</p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg border border-accent/30 bg-accent/5">
            <p className="font-body text-xs text-muted-foreground">
              <strong className="text-accent-foreground">Dica:</strong> Se não possui um pêndulo, use um cordão fino (30-40cm) com um pequeno peso na ponta — uma argola, cristal pequeno ou até uma porca de parafuso.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendulumTool;
