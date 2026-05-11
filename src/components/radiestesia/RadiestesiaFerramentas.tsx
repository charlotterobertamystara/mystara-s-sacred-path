import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, CircleDot } from "lucide-react";

const RadiestesiaFerramentas = () => {
  const [activeTool, setActiveTool] = useState<"bussola" | "pendulo" | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <Card
          className={`cursor-pointer border-border bg-card transition-all hover:border-primary/30 ${activeTool === "bussola" ? "border-primary shadow-mystical" : ""}`}
          onClick={() => setActiveTool(activeTool === "bussola" ? null : "bussola")}
        >
          <CardContent className="flex flex-col items-center gap-2 p-5">
            <Compass className="h-8 w-8 text-primary" />
            <span className="font-display text-xs tracking-wider text-foreground">Bússola</span>
            <span className="font-body text-[10px] text-muted-foreground text-center">
              Oriente ao Norte
            </span>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer border-border bg-card transition-all hover:border-primary/30 ${activeTool === "pendulo" ? "border-primary shadow-mystical" : ""}`}
          onClick={() => setActiveTool(activeTool === "pendulo" ? null : "pendulo")}
        >
          <CardContent className="flex flex-col items-center gap-2 p-5">
            <CircleDot className="h-8 w-8 text-primary" />
            <span className="font-display text-xs tracking-wider text-foreground">Pêndulo</span>
            <span className="font-body text-[10px] text-muted-foreground text-center">
              Pêndulo virtual
            </span>
          </CardContent>
        </Card>
      </div>

      {activeTool === "bussola" && <CompassTool />}
      {activeTool === "pendulo" && <PendulumTool />}
    </motion.div>
  );
};

const CompassTool = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setHeading(Math.round(e.alpha));
      }
    };

    if ("DeviceOrientationEvent" in window) {
      const requestPermission = (DeviceOrientationEvent as any).requestPermission;
      if (typeof requestPermission === "function") {
        requestPermission().then((state: string) => {
          if (state === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          } else {
            setError("Permissão de orientação negada.");
          }
        }).catch(() => setError("Não foi possível acessar o sensor."));
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    } else {
      setError("Sensor de orientação não disponível neste dispositivo.");
    }

    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  const rotation = heading !== null ? 360 - heading : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-primary/20 bg-card">
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <h3 className="font-display text-sm tracking-wider text-primary">Bússola</h3>
          {error ? (
            <p className="font-body text-sm text-muted-foreground text-center">{error}</p>
          ) : (
            <>
              <div className="relative h-48 w-48">
                <div
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <div className="relative h-full w-full">
                    <div className="absolute inset-0 rounded-full border-2 border-border" />
                    <div className="absolute left-1/2 top-2 -translate-x-1/2 font-display text-lg text-primary font-bold">N</div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 font-display text-xs text-muted-foreground">L</div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-display text-xs text-muted-foreground">S</div>
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 font-display text-xs text-muted-foreground">O</div>
                    <div className="absolute left-1/2 top-1/2 h-20 w-0.5 -translate-x-1/2 -translate-y-full bg-destructive origin-bottom" />
                    <div className="absolute left-1/2 top-1/2 h-20 w-0.5 -translate-x-1/2 bg-muted-foreground origin-top" />
                    <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
              <p className="font-body text-sm text-muted-foreground">
                {heading !== null ? `${heading}°` : "Calibrando..."}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const PendulumTool = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [swinging, setSwinging] = useState(false);
  const angleRef = useRef(0);
  const velocityRef = useRef(0);

  const startSwing = () => {
    angleRef.current = Math.PI / 4;
    velocityRef.current = 0;
    setSwinging(true);
  };

  useEffect(() => {
    if (!swinging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const length = h * 0.6;
    const pivotX = w / 2;
    const pivotY = 20;
    const gravity = 0.0005;
    const damping = 0.998;

    const draw = () => {
      const accel = -gravity * Math.sin(angleRef.current);
      velocityRef.current += accel;
      velocityRef.current *= damping;
      angleRef.current += velocityRef.current;

      ctx.clearRect(0, 0, w, h);

      const bobX = pivotX + length * Math.sin(angleRef.current);
      const bobY = pivotY + length * Math.cos(angleRef.current);

      // String
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.strokeStyle = "hsl(45, 60%, 55%)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pivot
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "hsl(45, 60%, 55%)";
      ctx.fill();

      // Bob
      ctx.beginPath();
      ctx.arc(bobX, bobY, 14, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(bobX - 3, bobY - 3, 2, bobX, bobY, 14);
      gradient.addColorStop(0, "hsl(270, 50%, 60%)");
      gradient.addColorStop(1, "hsl(270, 50%, 30%)");
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = "hsl(45, 60%, 55%)";
      ctx.lineWidth = 1;
      ctx.stroke();

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [swinging]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-primary/20 bg-card">
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <h3 className="font-display text-sm tracking-wider text-primary">Pêndulo Virtual</h3>
          <canvas
            ref={canvasRef}
            width={280}
            height={320}
            className="rounded-lg"
          />
          <Button
            onClick={startSwing}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-xs tracking-wider"
          >
            {swinging ? "Reiniciar" : "Iniciar Pêndulo"}
          </Button>
          <p className="font-body text-[10px] text-muted-foreground text-center">
            Concentre-se na sua pergunta e observe o movimento do pêndulo.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RadiestesiaFerramentas;
