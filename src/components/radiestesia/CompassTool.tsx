import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompass } from "@/hooks/useCompass";

const CompassTool = () => {
  const { heading, isSupported, isPermissionGranted, error, requestPermission } = useCompass();
  const [showFallback, setShowFallback] = useState(false);

  const getCardinalDirection = (deg: number): string => {
    const dirs = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"];
    const idx = Math.round(deg / 45) % 8;
    return dirs[idx];
  };

  const needsPermission =
    isSupported &&
    !isPermissionGranted &&
    typeof (DeviceOrientationEvent as any).requestPermission === "function";

  return (
    <div className="space-y-4">
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-sm tracking-widest text-foreground uppercase">
            Bússola — Orientação Norte
          </CardTitle>
          <p className="font-body text-xs text-muted-foreground">
            Alinhe uma das pontas do gráfico na direção Norte
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {isSupported && !showFallback ? (
            <>
              {needsPermission ? (
                <Button
                  onClick={requestPermission}
                  className="font-display tracking-widest"
                >
                  Ativar Bússola
                </Button>
              ) : heading !== null ? (
                <>
                  {/* Compass Rose */}
                  <div className="relative w-48 h-48">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-border" />

                    {/* Cardinal marks — fixed */}
                    {["N", "L", "S", "O"].map((dir, i) => {
                      const angle = i * 90;
                      const rad = (angle - 90) * (Math.PI / 180);
                      const r = 86;
                      return (
                        <span
                          key={dir}
                          className={`absolute font-display text-xs tracking-wider ${
                            dir === "N" ? "text-primary font-bold" : "text-muted-foreground"
                          }`}
                          style={{
                            left: `${50 + (r / 96) * 50 * Math.cos(rad)}%`,
                            top: `${50 + (r / 96) * 50 * Math.sin(rad)}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          {dir}
                        </span>
                      );
                    })}

                    {/* Rotating needle */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{ rotate: -heading }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                      {/* North half (red) */}
                      <div
                        className="absolute w-2 bg-primary"
                        style={{
                          height: "40%",
                          top: "10%",
                          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                        }}
                      />
                      {/* South half */}
                      <div
                        className="absolute w-2 bg-muted-foreground/50"
                        style={{
                          height: "40%",
                          bottom: "10%",
                          clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
                        }}
                      />
                      <div className="absolute w-3 h-3 rounded-full bg-primary border-2 border-card" />
                    </motion.div>
                  </div>

                  <div className="text-center">
                    <span className="font-display text-2xl text-primary text-glow">
                      {Math.round(heading)}°
                    </span>
                    <span className="ml-2 font-display text-sm text-muted-foreground">
                      {getCardinalDirection(heading)}
                    </span>
                  </div>
                </>
              ) : (
                <p className="font-body text-sm text-muted-foreground text-center">
                  Aguardando dados do sensor... Mova o dispositivo lentamente.
                </p>
              )}

              {error && (
                <p className="font-body text-xs text-destructive text-center">{error}</p>
              )}

              <button
                onClick={() => setShowFallback(true)}
                className="font-body text-xs text-muted-foreground underline"
              >
                Prefiro usar bússola física
              </button>
            </>
          ) : (
            <>
              {/* Fallback instructions */}
              <div className="space-y-3 font-body text-sm text-foreground/80 w-full">
                <div className="flex gap-3">
                  <span className="text-primary font-display text-xs mt-0.5">01</span>
                  <p>Use uma bússola física ou o app de bússola do seu celular.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary font-display text-xs mt-0.5">02</span>
                  <p>Identifique a direção Norte no ambiente onde montará o gráfico.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary font-display text-xs mt-0.5">03</span>
                  <p>Posicione o gráfico sobre uma superfície plana com uma das pontas apontando para o Norte.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary font-display text-xs mt-0.5">04</span>
                  <p>
                    <strong>Exceção:</strong> Gráficos totalmente circulares (como 9 Círculos) não precisam de orientação ao Norte.
                  </p>
                </div>
              </div>

              {isSupported && (
                <button
                  onClick={() => setShowFallback(false)}
                  className="font-body text-xs text-primary underline"
                >
                  Usar bússola digital
                </button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompassTool;
