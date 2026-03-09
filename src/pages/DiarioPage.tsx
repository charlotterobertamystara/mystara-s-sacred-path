import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Calendar, BookOpen, User, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLunarProfile, LunarProfile } from "@/hooks/useLunarProfile";
import { useDiaryEntries, DiaryEntry } from "@/hooks/useDiaryEntries";
import { useCredits } from "@/hooks/useCredits";
import LunarProfileSetup from "@/components/diario/LunarProfileSetup";
import LunarProfileCard from "@/components/diario/LunarProfileCard";
import LunarCalendar from "@/components/diario/LunarCalendar";
import DiaryEntryForm from "@/components/diario/DiaryEntryForm";
import DiaryLibrary from "@/components/diario/DiaryLibrary";
import DayInfoSheet from "@/components/diario/DayInfoSheet";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const FREE_ENTRY_LIMIT = 5;

const DiarioPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, hasProfile } = useLunarProfile();
  const { entries, entriesCount, loading: entriesLoading, fetchEntries } = useDiaryEntries();
  const { isSubscribed, loading: subLoading, createSubscription } = useCredits();
  const navigate = useNavigate();

  const [showSetup, setShowSetup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | undefined>();
  const [showDaySheet, setShowDaySheet] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | undefined>();
  const [subscribing, setSubscribing] = useState(false);

  const loading = authLoading || profileLoading || entriesLoading || subLoading;
  const canAddEntry = isSubscribed || entriesCount < FREE_ENTRY_LIMIT;

  useEffect(() => {
    if (!authLoading && !profileLoading && user && !hasProfile) {
      setShowSetup(true);
    }
  }, [authLoading, profileLoading, user, hasProfile]);

  const handleProfileComplete = (newProfile: LunarProfile) => {
    setShowSetup(false);
  };

  const handleDayClick = (date: Date, entry?: DiaryEntry) => {
    setSelectedDate(date);
    setSelectedEntry(entry);
    setShowDaySheet(true);
  };

  const handleAddEntry = () => {
    if (!canAddEntry) {
      toast({
        title: "Limite atingido",
        description: "Você atingiu o limite de 5 entradas gratuitas este mês. Assine o plano premium para entradas ilimitadas.",
      });
      return;
    }
    setEditingEntry(undefined);
    setShowDaySheet(false);
    setShowEntryForm(true);
  };

  const handleEditEntry = () => {
    setEditingEntry(selectedEntry);
    setShowDaySheet(false);
    setShowEntryForm(true);
  };

  const handleEntryClick = (entry: DiaryEntry) => {
    setSelectedDate(new Date(entry.entry_date));
    setSelectedEntry(entry);
    setShowDaySheet(true);
  };

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const result = await createSubscription();
      window.open(result.init_point, "_blank");
    } catch (e) {
      toast({
        title: "Erro",
        description: e instanceof Error ? e.message : "Erro ao criar assinatura",
        variant: "destructive",
      });
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }} className="text-4xl">
          🌙
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <span className="text-5xl">🌙</span>
          <h2 className="font-display text-lg tracking-widest text-foreground">Diário Lunar</h2>
          <p className="font-body text-sm text-muted-foreground">
            Faça login para acessar seu diário lunar pessoal.
          </p>
          <Button className="w-full font-display tracking-wider" onClick={() => navigate("/auth")}>
            Entrar / Criar Conta
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 pt-6 pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-6">
          <motion.span 
            className="text-4xl inline-block"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            🌙
          </motion.span>
          <h1 className="font-display text-2xl tracking-widest mt-2">Diário Lunar</h1>
          <p className="text-xs text-muted-foreground">Acompanhe sua jornada com as fases da lua</p>
        </div>

        {/* Free Limit Banner */}
        {!isSubscribed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-center"
          >
            <p className="text-xs text-foreground">
              <strong>{entriesCount}/{FREE_ENTRY_LIMIT}</strong> entradas gratuitas este mês
            </p>
            {entriesCount >= FREE_ENTRY_LIMIT && (
              <Button
                size="sm"
                variant="link"
                onClick={handleSubscribe}
                disabled={subscribing}
                className="text-xs text-primary"
              >
                {subscribing ? "Processando..." : "✨ Assinar Premium para ilimitado"}
              </Button>
            )}
          </motion.div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="calendario" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-10 mb-4">
            <TabsTrigger value="calendario" className="text-xs gap-1">
              <Calendar className="h-3 w-3" />
              Calendário
            </TabsTrigger>
            <TabsTrigger value="biblioteca" className="text-xs gap-1">
              <BookOpen className="h-3 w-3" />
              Biblioteca
            </TabsTrigger>
            <TabsTrigger value="perfil" className="text-xs gap-1">
              <User className="h-3 w-3" />
              Perfil Lunar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendario">
            <LunarCalendar
              entries={entries}
              onDayClick={handleDayClick}
              selectedDate={selectedDate || undefined}
            />
          </TabsContent>

          <TabsContent value="biblioteca">
            <DiaryLibrary
              entries={entries}
              onEntryClick={handleEntryClick}
            />
          </TabsContent>

          <TabsContent value="perfil">
            {profile ? (
              <div className="space-y-4">
                <LunarProfileCard
                  profile={profile}
                  onEdit={() => setShowSetup(true)}
                />

                {/* Premium Features Preview */}
                {!isSubscribed && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <h3 className="font-display text-xs tracking-wider text-muted-foreground uppercase mb-3 flex items-center gap-2">
                      <Sparkles className="h-3 w-3 text-primary" />
                      Recursos Premium
                    </h3>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li>🔮 Análise de padrões com IA</li>
                      <li>📊 Estatísticas avançadas</li>
                      <li>📖 Entradas ilimitadas</li>
                      <li>💭 Análise de simbolismo de sonhos</li>
                      <li>📤 Exportação em PDF</li>
                    </ul>
                    <Button
                      className="w-full mt-4 font-display tracking-wider"
                      onClick={handleSubscribe}
                      disabled={subscribing}
                    >
                      {subscribing ? "Processando..." : "✨ Assinar por R$ 5,99/mês"}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm mb-4">
                  Configure seu perfil lunar para começar
                </p>
                <Button onClick={() => setShowSetup(true)} className="font-display tracking-wider">
                  🌙 Configurar Perfil Lunar
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Modals */}
      <LunarProfileSetup
        open={showSetup}
        onComplete={handleProfileComplete}
      />

      <AnimatePresence>
        {showDaySheet && selectedDate && (
          <DayInfoSheet
            date={selectedDate}
            entry={selectedEntry}
            open={showDaySheet}
            onClose={() => setShowDaySheet(false)}
            onAddEntry={handleAddEntry}
            onEditEntry={handleEditEntry}
          />
        )}

        {showEntryForm && selectedDate && (
          <DiaryEntryForm
            date={selectedDate}
            existingEntry={editingEntry}
            onClose={() => {
              setShowEntryForm(false);
              setEditingEntry(undefined);
            }}
            onSaved={() => {
              fetchEntries();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiarioPage;
