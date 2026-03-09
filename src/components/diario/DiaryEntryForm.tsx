import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X, Book, Moon, Sparkles, Target, Lightbulb, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { getMoonPhase, getMoonSign } from "@/lib/lunar-utils";
import { DiaryEntry, DiaryEntryInput, EntryType, useDiaryEntries } from "@/hooks/useDiaryEntries";
import { toast } from "@/hooks/use-toast";

interface DiaryEntryFormProps {
  date: Date;
  existingEntry?: DiaryEntry;
  onClose: () => void;
  onSaved: () => void;
}

const ENTRY_TYPES: { type: EntryType; label: string; icon: React.ReactNode; emoji: string }[] = [
  { type: 'diario', label: 'Diário pessoal', icon: <Book className="h-4 w-4" />, emoji: '📖' },
  { type: 'sonhos', label: 'Sonhos', icon: <Moon className="h-4 w-4" />, emoji: '💭' },
  { type: 'sincronicidades', label: 'Sincronicidades', icon: <Sparkles className="h-4 w-4" />, emoji: '✨' },
  { type: 'manifestacoes', label: 'Manifestações', icon: <Target className="h-4 w-4" />, emoji: '🎯' },
  { type: 'insights', label: 'Insights', icon: <Lightbulb className="h-4 w-4" />, emoji: '🔮' },
  { type: 'gratidao', label: 'Gratidão', icon: <Heart className="h-4 w-4" />, emoji: '🙏' },
];

const EMOTIONS = ['Feliz', 'Calmo', 'Ansioso', 'Triste', 'Confuso', 'Inspirado', 'Medo', 'Paz', 'Amor', 'Raiva'];

const DiaryEntryForm = ({ date, existingEntry, onClose, onSaved }: DiaryEntryFormProps) => {
  const { createEntry, updateEntry } = useDiaryEntries();
  const [saving, setSaving] = useState(false);
  
  const moonPhase = getMoonPhase(date);
  const moonSign = getMoonSign(date);

  // Form state
  const [selectedTypes, setSelectedTypes] = useState<EntryType[]>(
    existingEntry?.entry_types || []
  );
  const [personalText, setPersonalText] = useState(existingEntry?.personal_text || '');
  const [emotionalScale, setEmotionalScale] = useState(existingEntry?.emotional_scale || 5);
  const [energyLevel, setEnergyLevel] = useState<'baixa' | 'media' | 'alta'>(
    existingEntry?.energy_level || 'media'
  );
  const [spiritualPractice, setSpiritualPractice] = useState(existingEntry?.spiritual_practice || '');
  
  // Dream fields
  const [dreamTitle, setDreamTitle] = useState(existingEntry?.dream_title || '');
  const [dreamDescription, setDreamDescription] = useState(existingEntry?.dream_description || '');
  const [dreamSymbols, setDreamSymbols] = useState(existingEntry?.dream_symbols?.join(', ') || '');
  const [dreamEmotions, setDreamEmotions] = useState<string[]>(existingEntry?.dream_emotions || []);

  // Sync fields
  const [syncDescription, setSyncDescription] = useState(existingEntry?.sync_description || '');
  const [syncSymbols, setSyncSymbols] = useState(existingEntry?.sync_symbols || '');
  const [syncConnections, setSyncConnections] = useState(existingEntry?.sync_connections || '');
  const [syncFeeling, setSyncFeeling] = useState(existingEntry?.sync_feeling || '');

  // Manifestation fields
  const [manifestationWhat, setManifestationWhat] = useState(existingEntry?.manifestation_what || '');
  const [manifestationIntention, setManifestationIntention] = useState(existingEntry?.manifestation_intention || '');
  const [manifestationActions, setManifestationActions] = useState(existingEntry?.manifestation_actions || '');
  const [manifestationSigns, setManifestationSigns] = useState(existingEntry?.manifestation_signs || '');
  const [manifestationStatus, setManifestationStatus] = useState<'em_progresso' | 'manifestado'>(
    existingEntry?.manifestation_status || 'em_progresso'
  );

  // Gratitude fields
  const [gratitude1, setGratitude1] = useState(existingEntry?.gratitude_1 || '');
  const [gratitude2, setGratitude2] = useState(existingEntry?.gratitude_2 || '');
  const [gratitude3, setGratitude3] = useState(existingEntry?.gratitude_3 || '');

  // Insight fields
  const [insightText, setInsightText] = useState(existingEntry?.insight_text || '');

  // Tags
  const [tags, setTags] = useState(existingEntry?.tags?.join(', ') || '');

  const toggleType = (type: EntryType) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleEmotion = (emotion: string) => {
    setDreamEmotions(prev =>
      prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]
    );
  };

  const handleSubmit = async () => {
    if (selectedTypes.length === 0) {
      toast({
        title: "Selecione um tipo",
        description: "Escolha pelo menos um tipo de entrada.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const input: DiaryEntryInput = {
        entry_date: format(date, 'yyyy-MM-dd'),
        entry_types: selectedTypes,
        personal_text: personalText || undefined,
        emotional_scale: emotionalScale,
        energy_level: energyLevel,
        spiritual_practice: spiritualPractice || undefined,
        dream_title: dreamTitle || undefined,
        dream_description: dreamDescription || undefined,
        dream_symbols: dreamSymbols ? dreamSymbols.split(',').map(s => s.trim()) : undefined,
        dream_emotions: dreamEmotions.length > 0 ? dreamEmotions : undefined,
        sync_description: syncDescription || undefined,
        sync_symbols: syncSymbols || undefined,
        sync_connections: syncConnections || undefined,
        sync_feeling: syncFeeling || undefined,
        manifestation_what: manifestationWhat || undefined,
        manifestation_intention: manifestationIntention || undefined,
        manifestation_actions: manifestationActions || undefined,
        manifestation_signs: manifestationSigns || undefined,
        manifestation_status: manifestationStatus,
        gratitude_1: gratitude1 || undefined,
        gratitude_2: gratitude2 || undefined,
        gratitude_3: gratitude3 || undefined,
        insight_text: insightText || undefined,
        tags: tags ? tags.split(',').map(t => t.trim()) : undefined,
      };

      if (existingEntry) {
        await updateEntry(existingEntry.id, input);
        toast({ title: "Entrada atualizada!", description: "Suas reflexões foram salvas." });
      } else {
        await createEntry(input);
        toast({ title: "✨ Entrada criada!", description: "Sua jornada lunar continua." });
      }

      onSaved();
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar entrada",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-border bg-card p-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg tracking-wider capitalize">
              {format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {moonPhase.emoji} {moonPhase.phaseName} • Lua em {moonSign.name}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Entry Types */}
        <div className="mb-4">
          <Label className="font-display text-xs tracking-wider mb-2 block">Tipo de Entrada</Label>
          <div className="flex flex-wrap gap-2">
            {ENTRY_TYPES.map(({ type, label, emoji }) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-all ${
                  selectedTypes.includes(type)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <span>{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Conditional Fields */}
        <div className="space-y-4">
          {/* Personal Diary */}
          <AnimatePresence>
            {selectedTypes.includes('diario') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 rounded-lg border border-border bg-background/50 p-3"
              >
                <p className="font-display text-xs tracking-wider text-primary">📖 Diário Pessoal</p>
                <Textarea
                  placeholder="Como foi seu dia? O que está em sua mente?"
                  value={personalText}
                  onChange={(e) => setPersonalText(e.target.value)}
                  rows={4}
                />
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label className="text-[10px] text-muted-foreground">Escala Emocional: {emotionalScale}</Label>
                    <Slider
                      value={[emotionalScale]}
                      onValueChange={([v]) => setEmotionalScale(v)}
                      min={1}
                      max={10}
                      step={1}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Energia</Label>
                    <Select value={energyLevel} onValueChange={(v) => setEnergyLevel(v as 'baixa' | 'media' | 'alta')}>
                      <SelectTrigger className="w-24 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Input
                  placeholder="Prática espiritual realizada"
                  value={spiritualPractice}
                  onChange={(e) => setSpiritualPractice(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dreams */}
          <AnimatePresence>
            {selectedTypes.includes('sonhos') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 rounded-lg border border-border bg-background/50 p-3"
              >
                <p className="font-display text-xs tracking-wider text-primary">💭 Registro de Sonhos</p>
                <Input
                  placeholder="Título do sonho"
                  value={dreamTitle}
                  onChange={(e) => setDreamTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Descreva seu sonho em detalhes..."
                  value={dreamDescription}
                  onChange={(e) => setDreamDescription(e.target.value)}
                  rows={3}
                />
                <Input
                  placeholder="Símbolos marcantes (separados por vírgula)"
                  value={dreamSymbols}
                  onChange={(e) => setDreamSymbols(e.target.value)}
                />
                <div>
                  <Label className="text-[10px] text-muted-foreground mb-1 block">Emoções presentes</Label>
                  <div className="flex flex-wrap gap-1">
                    {EMOTIONS.map(emotion => (
                      <button
                        key={emotion}
                        onClick={() => toggleEmotion(emotion)}
                        className={`rounded-full px-2 py-0.5 text-[10px] transition-all ${
                          dreamEmotions.includes(emotion)
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {emotion}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Synchronicities */}
          <AnimatePresence>
            {selectedTypes.includes('sincronicidades') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 rounded-lg border border-border bg-background/50 p-3"
              >
                <p className="font-display text-xs tracking-wider text-primary">✨ Sincronicidades</p>
                <Textarea
                  placeholder="Descreva o evento sincronístico"
                  value={syncDescription}
                  onChange={(e) => setSyncDescription(e.target.value)}
                  rows={2}
                />
                <Input
                  placeholder="Números ou símbolos que apareceram"
                  value={syncSymbols}
                  onChange={(e) => setSyncSymbols(e.target.value)}
                />
                <Input
                  placeholder="Conexões percebidas"
                  value={syncConnections}
                  onChange={(e) => setSyncConnections(e.target.value)}
                />
                <Input
                  placeholder="Como me senti"
                  value={syncFeeling}
                  onChange={(e) => setSyncFeeling(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Manifestations */}
          <AnimatePresence>
            {selectedTypes.includes('manifestacoes') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 rounded-lg border border-border bg-background/50 p-3"
              >
                <p className="font-display text-xs tracking-wider text-primary">🎯 Manifestações</p>
                <Input
                  placeholder="O que estou manifestando"
                  value={manifestationWhat}
                  onChange={(e) => setManifestationWhat(e.target.value)}
                />
                <Textarea
                  placeholder="Minha intenção clara"
                  value={manifestationIntention}
                  onChange={(e) => setManifestationIntention(e.target.value)}
                  rows={2}
                />
                <Input
                  placeholder="Ações que tomei"
                  value={manifestationActions}
                  onChange={(e) => setManifestationActions(e.target.value)}
                />
                <Input
                  placeholder="Sinais recebidos"
                  value={manifestationSigns}
                  onChange={(e) => setManifestationSigns(e.target.value)}
                />
                <Select value={manifestationStatus} onValueChange={(v) => setManifestationStatus(v as 'em_progresso' | 'manifestado')}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="em_progresso">🔄 Em progresso</SelectItem>
                    <SelectItem value="manifestado">✅ Manifestado</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gratitude */}
          <AnimatePresence>
            {selectedTypes.includes('gratidao') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 rounded-lg border border-border bg-background/50 p-3"
              >
                <p className="font-display text-xs tracking-wider text-primary">🙏 Gratidão</p>
                <Input
                  placeholder="1. Sou grato(a) por..."
                  value={gratitude1}
                  onChange={(e) => setGratitude1(e.target.value)}
                />
                <Input
                  placeholder="2. Sou grato(a) por..."
                  value={gratitude2}
                  onChange={(e) => setGratitude2(e.target.value)}
                />
                <Input
                  placeholder="3. Sou grato(a) por..."
                  value={gratitude3}
                  onChange={(e) => setGratitude3(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Insights */}
          <AnimatePresence>
            {selectedTypes.includes('insights') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 rounded-lg border border-border bg-background/50 p-3"
              >
                <p className="font-display text-xs tracking-wider text-primary">🔮 Insights & Revelações</p>
                <Textarea
                  placeholder="Que insights ou revelações surgiram?"
                  value={insightText}
                  onChange={(e) => setInsightText(e.target.value)}
                  rows={3}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tags */}
          {selectedTypes.length > 0 && (
            <div>
              <Label className="text-[10px] text-muted-foreground">Tags (separadas por vírgula)</Label>
              <Input
                placeholder="lua cheia, ritual, meditação..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={saving || selectedTypes.length === 0}
          className="w-full mt-4 font-display tracking-wider"
        >
          {saving ? (
            <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
              🌙
            </motion.span>
          ) : existingEntry ? (
            'Atualizar Entrada'
          ) : (
            '✨ Salvar no Diário'
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default DiaryEntryForm;
