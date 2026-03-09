import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionHistory, SessionType, UserSession } from "@/hooks/useSessionHistory";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const SESSION_TYPE_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  tarot: { label: "Tarot", icon: "🂡", color: "border-primary/30 bg-primary/10 text-primary" },
  runas: { label: "Runas", icon: "ᚱ", color: "border-accent/30 bg-accent/10 text-accent-foreground" },
  "mapa-astral": { label: "Mapa Astral", icon: "☉", color: "border-primary/30 bg-primary/10 text-primary" },
  numerologia: { label: "Numerologia", icon: "✡", color: "border-primary/30 bg-secondary/30 text-primary" },
  radiestesia: { label: "Radiestesia", icon: "◎", color: "border-muted bg-muted/30 text-muted-foreground" },
  cristais: { label: "Cristais", icon: "◆", color: "border-muted bg-muted/30 text-muted-foreground" },
  limpeza: { label: "Limpeza", icon: "🌿", color: "border-muted bg-muted/30 text-muted-foreground" },
};

const FILTER_OPTIONS: { value: SessionType | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "tarot", label: "Tarot" },
  { value: "runas", label: "Runas" },
  { value: "mapa-astral", label: "Mapa Astral" },
  { value: "numerologia", label: "Numerologia" },
];

const HistoricoPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<SessionType | "all">("all");
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);
  const { sessions, isLoading } = useSessionHistory(filter === "all" ? undefined : filter);

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-20 text-center">
        <p className="font-display text-sm text-muted-foreground">
          Faça login para ver seu histórico
        </p>
        <button
          onClick={() => navigate("/auth")}
          className="mt-4 font-display text-xs tracking-wider text-primary underline"
        >
          Entrar
        </button>
      </div>
    );
  }

  const getSessionSummary = (session: UserSession) => {
    const data = session.session_data as Record<string, unknown> | null;
    if (session.session_type === "tarot" && data?.cards) {
      const cards = data.cards as Array<{ name: string; reversed: boolean }>;
      return cards.map((c) => `${c.name}${c.reversed ? " (inv.)" : ""}`).join(", ");
    }
    if (session.session_type === "runas" && data?.runes) {
      const runes = data.runes as Array<{ name: string; reversed: boolean }>;
      return runes.map((r) => `${r.name}${r.reversed ? " (inv.)" : ""}`).join(", ");
    }
    if (session.session_type === "numerologia" && data) {
      return `Caminho ${data.lifePath} · Expressão ${data.expression} · Alma ${data.soulUrge}`;
    }
    if (session.session_type === "mapa-astral" && data) {
      return `${data.fullName || ""} — ${data.birthDate} ${data.birthTime} ${data.birthCity}`;
    }
    return session.question || "—";
  };

  return (
    <div className="mx-auto max-w-lg px-4 pt-6 pb-28">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
        <span className="text-4xl">📜</span>
        <h1 className="mt-2 font-display text-xl tracking-widest text-foreground">Histórico</h1>
        <p className="mt-1 font-body text-sm text-muted-foreground italic">
          Suas consultas e leituras passadas
        </p>
      </motion.div>

      {/* Filter */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-2.5 py-1 rounded-full font-display text-[10px] tracking-wider transition-colors border ${
              filter === opt.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="h-6 w-6 rounded-full border-2 border-primary/30 border-t-primary"
          />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-body text-sm text-muted-foreground">Nenhuma consulta encontrada</p>
          <p className="font-body text-xs text-muted-foreground/60 mt-1">
            Suas leituras aparecerão aqui automaticamente
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {sessions.map((session, i) => {
              const config = SESSION_TYPE_CONFIG[session.session_type] || {
                label: session.session_type,
                icon: "•",
                color: "border-border bg-card text-muted-foreground",
              };

              return (
                <motion.button
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedSession(session)}
                  className="w-full rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-secondary/30 text-lg">
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${config.color}`}>
                          {config.label}
                        </Badge>
                        <span className="font-body text-[10px] text-muted-foreground">
                          {format(new Date(session.created_at), "dd MMM yyyy · HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      {session.question && (
                        <p className="font-body text-xs text-foreground truncate">{session.question}</p>
                      )}
                      <p className="font-body text-[10px] text-muted-foreground truncate mt-0.5">
                        {getSessionSummary(session)}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-w-md max-h-[85vh] border-border bg-card">
          {selectedSession && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {SESSION_TYPE_CONFIG[selectedSession.session_type]?.icon || "•"}
                  </span>
                  <div>
                    <DialogTitle className="font-display text-sm tracking-wider text-primary">
                      {SESSION_TYPE_CONFIG[selectedSession.session_type]?.label || selectedSession.session_type}
                    </DialogTitle>
                    <p className="font-body text-[10px] text-muted-foreground">
                      {format(new Date(selectedSession.created_at), "dd 'de' MMMM yyyy · HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <DialogDescription className="sr-only">Detalhes da sessão</DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh] pr-3">
                <div className="space-y-4">
                  {selectedSession.question && (
                    <div>
                      <p className="font-display text-[10px] tracking-wider text-muted-foreground uppercase mb-1">
                        Pergunta / Contexto
                      </p>
                      <p className="font-body text-sm text-foreground">{selectedSession.question}</p>
                    </div>
                  )}

                  <div>
                    <p className="font-display text-[10px] tracking-wider text-muted-foreground uppercase mb-1">
                      Resumo
                    </p>
                    <p className="font-body text-xs text-foreground/80">{getSessionSummary(selectedSession)}</p>
                  </div>

                  {selectedSession.interpretation && (
                    <div>
                      <p className="font-display text-[10px] tracking-wider text-primary uppercase mb-1">
                        Interpretação
                      </p>
                      <div className="font-body text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {selectedSession.interpretation}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoricoPage;
