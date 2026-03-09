import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import CompatibilityTab from "@/components/mapa/CompatibilityTab";
import { estimateSunSign } from "@/lib/astro-compatibility-utils";

const SECTIONS = [
  { icon: "☉", label: "Panorama Geral" },
  { icon: "☀", label: "Sol — Essência" },
  { icon: "☽", label: "Lua — Emoções" },
  { icon: "⇡", label: "Ascendente" },
  { icon: "☿", label: "Mercúrio" },
  { icon: "♀", label: "Vênus — Amor" },
  { icon: "♂", label: "Marte — Ação" },
  { icon: "♃", label: "Júpiter — Expansão" },
  { icon: "♄", label: "Saturno — Lições" },
  { icon: "⛢", label: "Transpessoais" },
  { icon: "☊", label: "Nodos — Karma" },
  { icon: "⌂", label: "Casas Astrológicas" },
  { icon: "✦", label: "Aspectos Planetários" },
  { icon: "♡", label: "Vida Afetiva" },
  { icon: "★", label: "Carreira" },
  { icon: "✚", label: "Saúde" },
  { icon: "◆", label: "Finanças" },
  { icon: "◎", label: "Espiritualidade" },
  { icon: "⊕", label: "Síntese Final" },
];

const MapaAstralPage = () => {
  const [activeTab, setActiveTab] = useState("mapa");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const canSubmit = birthDate && birthTime && birthCity;

  const handleGenerate = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setReading("");
    setDone(false);

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mapa-astral`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ fullName, birthDate, birthTime, birthCity }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erro desconhecido" }));
        toast({ title: "Erro", description: err.error, variant: "destructive" });
        setLoading(false);
        return;
      }

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 300);

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              accumulated += content;
              setReading(accumulated);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      setDone(true);
    } catch (e) {
      console.error(e);
      toast({ title: "Erro", description: "Falha na conexão.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReading("");
    setDone(false);
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.+)$/gm, '<h3 class="font-display text-base tracking-wider text-primary mt-6 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="font-display text-lg tracking-wider text-primary mt-8 mb-3 border-b border-border pb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="font-display text-xl tracking-wider text-primary mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="text-muted-foreground">$1</em>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 text-muted-foreground list-disc">$1</li>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  };

  // (userSigns derived inline in JSX below)

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="text-center">
          <span className="text-5xl">☉</span>
          <h1 className="mt-2 font-display text-xl tracking-widest text-foreground">
            Mapa Astral
          </h1>
          <p className="mt-1 font-body text-sm text-muted-foreground italic">
            Uma leitura profunda do seu mapa celeste pessoal
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-muted/50">
            <TabsTrigger value="mapa" className="font-display text-[10px] tracking-wider">☉ Meu Mapa</TabsTrigger>
            <TabsTrigger value="compatibilidade" className="font-display text-[10px] tracking-wider">💫 Compat.</TabsTrigger>
            <TabsTrigger value="fundamentos" className="font-display text-[10px] tracking-wider">📖 Fundamentos</TabsTrigger>
          </TabsList>

          {/* Meu Mapa Tab */}
          <TabsContent value="mapa" className="space-y-6 mt-4">
            {/* Section Icons */}
            {!reading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-2"
              >
                {SECTIONS.map((s) => (
                  <span
                    key={s.label}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-1 text-[10px] font-display tracking-wider text-muted-foreground"
                  >
                    <span>{s.icon}</span> {s.label}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Form */}
            {!reading && (
              <Card className="space-y-4 border-border bg-card p-5">
                <div>
                  <label className="font-display text-xs tracking-wider text-muted-foreground uppercase">
                    Nome completo (opcional)
                  </label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Maria da Silva"
                    className="mt-2 border-border bg-background font-body text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="font-display text-xs tracking-wider text-muted-foreground uppercase">
                    Data de nascimento *
                  </label>
                  <Input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="mt-2 border-border bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="font-display text-xs tracking-wider text-muted-foreground uppercase">
                    Hora de nascimento *
                  </label>
                  <Input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="mt-2 border-border bg-background text-foreground"
                  />
                  <p className="mt-1 text-[10px] text-muted-foreground italic">
                    A hora exata é essencial para calcular o Ascendente e as Casas Astrológicas
                  </p>
                </div>
                <div>
                  <label className="font-display text-xs tracking-wider text-muted-foreground uppercase">
                    Cidade de nascimento *
                  </label>
                  <Input
                    value={birthCity}
                    onChange={(e) => setBirthCity(e.target.value)}
                    placeholder="Ex: São Paulo, SP, Brasil"
                    className="mt-2 border-border bg-background font-body text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <Button
                  className="w-full font-display tracking-widest"
                  size="lg"
                  disabled={!canSubmit || loading}
                  onClick={handleGenerate}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Gerando Mapa Astral…
                    </span>
                  ) : (
                    "✦ Gerar Mapa Astral Completo"
                  )}
                </Button>
              </Card>
            )}

            {/* Result */}
            <AnimatePresence>
              {reading && (
                <motion.div
                  ref={resultRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <Card className="border-border bg-card p-5">
                    <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <h2 className="font-display text-sm tracking-widest text-primary uppercase">
                          ☉ Mapa Astral {fullName ? `de ${fullName}` : ""}
                        </h2>
                        <p className="text-[10px] text-muted-foreground">
                          {birthDate} · {birthTime} · {birthCity}
                        </p>
                      </div>
                      {loading && (
                        <span className="h-3 w-3 animate-pulse rounded-full bg-primary" />
                      )}
                    </div>

                    <div
                      className="font-body text-sm leading-relaxed text-muted-foreground prose-sm"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(reading) }}
                    />

                    {loading && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                        Analisando os astros…
                      </div>
                    )}
                  </Card>

                  {done && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center"
                    >
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        className="font-display tracking-widest"
                      >
                        ✦ Nova Consulta
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Compatibilidade Tab */}
          <TabsContent value="compatibilidade" className="mt-4">
            <CompatibilityTab
              userSigns={birthDate ? {
                sun: estimateSunSign(birthDate),
                moon: '',
                ascendant: '',
                name: fullName || 'Você',
                birthDate,
              } : undefined}
            />
          </TabsContent>

          {/* Fundamentos Tab */}
          <TabsContent value="fundamentos" className="mt-4 space-y-4">
            <FundamentosSection />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

function FundamentosSection() {
  const signs = [
    { sign: 'Áries', symbol: '♈', element: 'Fogo', modality: 'Cardeal', desc: 'Pioneiro, corajoso, impulsivo. Regido por Marte.' },
    { sign: 'Touro', symbol: '♉', element: 'Terra', modality: 'Fixo', desc: 'Estável, sensual, determinado. Regido por Vênus.' },
    { sign: 'Gêmeos', symbol: '♊', element: 'Ar', modality: 'Mutável', desc: 'Comunicativo, versátil, curioso. Regido por Mercúrio.' },
    { sign: 'Câncer', symbol: '♋', element: 'Água', modality: 'Cardeal', desc: 'Protetor, intuitivo, emocional. Regido pela Lua.' },
    { sign: 'Leão', symbol: '♌', element: 'Fogo', modality: 'Fixo', desc: 'Criativo, generoso, magnético. Regido pelo Sol.' },
    { sign: 'Virgem', symbol: '♍', element: 'Terra', modality: 'Mutável', desc: 'Analítico, prático, dedicado. Regido por Mercúrio.' },
    { sign: 'Libra', symbol: '♎', element: 'Ar', modality: 'Cardeal', desc: 'Diplomático, harmonioso, estético. Regido por Vênus.' },
    { sign: 'Escorpião', symbol: '♏', element: 'Água', modality: 'Fixo', desc: 'Intenso, transformador, magnético. Regido por Plutão.' },
    { sign: 'Sagitário', symbol: '♐', element: 'Fogo', modality: 'Mutável', desc: 'Aventureiro, filosófico, otimista. Regido por Júpiter.' },
    { sign: 'Capricórnio', symbol: '♑', element: 'Terra', modality: 'Cardeal', desc: 'Ambicioso, disciplinado, responsável. Regido por Saturno.' },
    { sign: 'Aquário', symbol: '♒', element: 'Ar', modality: 'Fixo', desc: 'Inovador, independente, humanitário. Regido por Urano.' },
    { sign: 'Peixes', symbol: '♓', element: 'Água', modality: 'Mutável', desc: 'Sensível, místico, compassivo. Regido por Netuno.' },
  ];

  return (
    <>
      <Card className="border-border bg-card p-4 space-y-3">
        <h3 className="font-display text-sm tracking-widest text-primary">Os 12 Signos</h3>
        <div className="space-y-2">
          {signs.map(s => (
            <div key={s.sign} className="flex items-start gap-2 text-xs">
              <span className="text-lg">{s.symbol}</span>
              <div>
                <p className="font-display text-foreground tracking-wider">{s.sign} <span className="text-muted-foreground">({s.element} · {s.modality})</span></p>
                <p className="text-muted-foreground font-body">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-border bg-card p-4 space-y-3">
        <h3 className="font-display text-sm tracking-widest text-primary">Elementos</h3>
        {[
          { el: '🔥 Fogo', signs: 'Áries, Leão, Sagitário', desc: 'Energia, paixão, ação, entusiasmo.' },
          { el: '🌍 Terra', signs: 'Touro, Virgem, Capricórnio', desc: 'Estabilidade, praticidade, materialidade.' },
          { el: '💨 Ar', signs: 'Gêmeos, Libra, Aquário', desc: 'Comunicação, ideias, socialização.' },
          { el: '🌊 Água', signs: 'Câncer, Escorpião, Peixes', desc: 'Emoção, intuição, profundidade.' },
        ].map(e => (
          <div key={e.el} className="text-xs">
            <p className="font-display text-foreground">{e.el}</p>
            <p className="text-muted-foreground">{e.signs}</p>
            <p className="text-muted-foreground font-body italic">{e.desc}</p>
          </div>
        ))}
      </Card>

      <Card className="border-border bg-card p-4 space-y-3">
        <h3 className="font-display text-sm tracking-widest text-primary">Aspectos Astrológicos</h3>
        {[
          { name: 'Conjunção (0°)', desc: 'União e intensidade. Energias se fundem e amplificam.', icon: '⊙' },
          { name: 'Sextil (60°)', desc: 'Harmonia e facilidade. Oportunidades fluem naturalmente.', icon: '✶' },
          { name: 'Quadratura (90°)', desc: 'Tensão criativa. Crescimento através de desafios.', icon: '□' },
          { name: 'Trígono (120°)', desc: 'Fluidez natural. Talentos e afinidades inatas.', icon: '△' },
          { name: 'Oposição (180°)', desc: 'Polaridade magnética. Atração e espelhamento.', icon: '☍' },
        ].map(a => (
          <div key={a.name} className="flex items-start gap-2 text-xs">
            <span className="text-base">{a.icon}</span>
            <div>
              <p className="font-display text-foreground tracking-wider">{a.name}</p>
              <p className="text-muted-foreground font-body">{a.desc}</p>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}

export default MapaAstralPage;
