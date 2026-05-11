import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { getMoonPhase, getMoonSign } from "@/lib/lunar-utils";
import { DiaryEntry, EntryType, useDiaryEntries } from "@/hooks/useDiaryEntries";
import { toast } from "@/hooks/use-toast";

interface DayInfoSheetProps {
  date: Date;
  entry?: DiaryEntry;
  open: boolean;
  onClose: () => void;
  onAddEntry: () => void;
  onEditEntry: () => void;
}

const ENTRY_TYPE_LABELS: Record<EntryType, { emoji: string; label: string }> = {
  diario: { emoji: '📖', label: 'Diário' },
  sonhos: { emoji: '💭', label: 'Sonhos' },
  sincronicidades: { emoji: '✨', label: 'Sincronicidades' },
  manifestacoes: { emoji: '🎯', label: 'Manifestações' },
  insights: { emoji: '🔮', label: 'Insights' },
  gratidao: { emoji: '🙏', label: 'Gratidão' },
};

const DayInfoSheet = ({ date, entry, open, onClose, onAddEntry, onEditEntry }: DayInfoSheetProps) => {
  const { deleteEntry } = useDiaryEntries();
  const moonPhase = getMoonPhase(date);
  const moonSign = getMoonSign(date);

  const handleDelete = async () => {
    if (!entry) return;
    
    if (confirm('Tem certeza que deseja excluir esta entrada?')) {
      try {
        await deleteEntry(entry.id);
        toast({ title: "Entrada excluída" });
        onClose();
      } catch (error) {
        toast({
          title: "Erro",
          description: error instanceof Error ? error.message : "Erro ao excluir",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="font-display tracking-wider capitalize">
            {format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </SheetTitle>
          <SheetDescription className="flex items-center gap-2">
            <span className="text-lg">{moonPhase.emoji}</span>
            {moonPhase.phaseName} • Lua em {moonSign.name} {moonSign.symbol}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 overflow-y-auto max-h-[calc(80vh-150px)]">
          {/* Moon Info */}
          <div className="rounded-xl border border-border bg-card/50 p-4">
            <h3 className="font-display text-xs tracking-wider text-muted-foreground uppercase mb-3">
              Informações Lunares
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Iluminação</p>
                <p className="text-sm text-foreground">{moonPhase.illumination}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Energia</p>
                <p className="text-sm text-foreground capitalize">{moonPhase.energy}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Melhor para</p>
                <div className="flex flex-wrap gap-1">
                  {moonPhase.bestFor.map((item, i) => (
                    <span key={i} className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Entry Preview */}
          {entry ? (
            <div className="rounded-xl border border-primary/30 bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-xs tracking-wider text-primary uppercase">
                  Entrada do Diário
                </h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={onEditEntry} className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleDelete} className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {entry.entry_types.map(type => (
                  <span key={type} className="rounded-full bg-muted px-2 py-1 text-xs flex items-center gap-1">
                    {ENTRY_TYPE_LABELS[type].emoji} {ENTRY_TYPE_LABELS[type].label}
                  </span>
                ))}
              </div>

              {/* Entry Content */}
              <div className="space-y-3 text-sm">
                {entry.dream_title && (
                  <div>
                    <p className="text-xs text-muted-foreground">Sonho</p>
                    <p className="font-medium">{entry.dream_title}</p>
                    {entry.dream_description && (
                      <p className="text-muted-foreground text-xs mt-1">{entry.dream_description}</p>
                    )}
                  </div>
                )}

                {entry.personal_text && (
                  <div>
                    <p className="text-xs text-muted-foreground">Diário</p>
                    <p className="text-foreground">{entry.personal_text}</p>
                  </div>
                )}

                {entry.manifestation_what && (
                  <div>
                    <p className="text-xs text-muted-foreground">Manifestação</p>
                    <p className="text-foreground flex items-center gap-2">
                      {entry.manifestation_what}
                      <span className={`text-xs ${entry.manifestation_status === 'manifestado' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {entry.manifestation_status === 'manifestado' ? '✅ Manifestado' : '🔄 Em progresso'}
                      </span>
                    </p>
                  </div>
                )}

                {entry.sync_description && (
                  <div>
                    <p className="text-xs text-muted-foreground">Sincronicidade</p>
                    <p className="text-foreground">{entry.sync_description}</p>
                  </div>
                )}

                {entry.insight_text && (
                  <div>
                    <p className="text-xs text-muted-foreground">Insight</p>
                    <p className="text-foreground">{entry.insight_text}</p>
                  </div>
                )}

                {(entry.gratitude_1 || entry.gratitude_2 || entry.gratitude_3) && (
                  <div>
                    <p className="text-xs text-muted-foreground">Gratidão</p>
                    <ul className="text-foreground text-xs space-y-0.5">
                      {entry.gratitude_1 && <li>• {entry.gratitude_1}</li>}
                      {entry.gratitude_2 && <li>• {entry.gratitude_2}</li>}
                      {entry.gratitude_3 && <li>• {entry.gratitude_3}</li>}
                    </ul>
                  </div>
                )}

                {entry.emotional_scale && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Emocional:</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${entry.emotional_scale * 10}%` }} 
                      />
                    </div>
                    <span className="text-xs">{entry.emotional_scale}/10</span>
                  </div>
                )}

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {entry.tags.map((tag, i) => (
                      <span key={i} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddEntry}
              className="w-full rounded-xl border-2 border-dashed border-border bg-card/30 p-8 text-center hover:border-primary/50 transition-colors"
            >
              <Plus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="font-display text-sm tracking-wider">Adicionar Entrada</p>
              <p className="text-xs text-muted-foreground mt-1">
                Registre seus sonhos, sincronicidades, manifestações...
              </p>
            </motion.button>
          )}

          {/* Writing Prompt */}
          <div className="rounded-xl border border-border bg-secondary/20 p-4">
            <h3 className="font-display text-xs tracking-wider text-muted-foreground uppercase mb-2">
              💫 Pergunta do Dia
            </h3>
            <p className="text-sm text-foreground italic">
              {moonPhase.phaseName === 'Lua Nova' && "Que sementes você deseja plantar neste novo ciclo?"}
              {moonPhase.phaseName === 'Lua Cheia' && "O que você está pronto(a) para liberar e agradecer?"}
              {moonPhase.phaseName.includes('Crescente') && "Que ações podem aproximá-lo(a) dos seus objetivos?"}
              {moonPhase.phaseName.includes('Minguante') && "O que você precisa soltar para seguir em frente?"}
              {moonPhase.phaseName === 'Quarto Crescente' && "Que obstáculos você está superando?"}
              {moonPhase.phaseName === 'Quarto Minguante' && "O que você aprendeu neste ciclo?"}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DayInfoSheet;
