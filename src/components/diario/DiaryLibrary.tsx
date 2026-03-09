import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Filter, Grid, List, Calendar, Tag, Moon, Target, Book } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiaryEntry, EntryType } from "@/hooks/useDiaryEntries";

interface DiaryLibraryProps {
  entries: DiaryEntry[];
  onEntryClick: (entry: DiaryEntry) => void;
}

const ENTRY_TYPE_LABELS: Record<EntryType, { emoji: string; label: string }> = {
  diario: { emoji: '📖', label: 'Diário' },
  sonhos: { emoji: '💭', label: 'Sonhos' },
  sincronicidades: { emoji: '✨', label: 'Sincronicidades' },
  manifestacoes: { emoji: '🎯', label: 'Manifestações' },
  insights: { emoji: '🔮', label: 'Insights' },
  gratidao: { emoji: '🙏', label: 'Gratidão' },
};

const DiaryLibrary = ({ entries, onEntryClick }: DiaryLibraryProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<EntryType | 'all'>('all');
  const [filterPhase, setFilterPhase] = useState<string | 'all'>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const searchableText = [
          entry.personal_text,
          entry.dream_title,
          entry.dream_description,
          entry.sync_description,
          entry.manifestation_what,
          entry.insight_text,
          entry.gratitude_1,
          entry.gratitude_2,
          entry.gratitude_3,
          ...(entry.tags || []),
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableText.includes(searchLower)) return false;
      }

      // Type filter
      if (filterType !== 'all' && !entry.entry_types.includes(filterType)) {
        return false;
      }

      // Phase filter
      if (filterPhase !== 'all' && entry.moon_phase !== filterPhase) {
        return false;
      }

      return true;
    });
  }, [entries, searchQuery, filterType, filterPhase]);

  const groupedByPhase = useMemo(() => {
    const groups: Record<string, DiaryEntry[]> = {};
    filteredEntries.forEach(entry => {
      const phase = entry.moon_phase || 'Desconhecido';
      if (!groups[phase]) groups[phase] = [];
      groups[phase].push(entry);
    });
    return groups;
  }, [filteredEntries]);

  const allTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    entries.forEach(entry => {
      (entry.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
  }, [entries]);

  const stats = useMemo(() => {
    const totalEntries = entries.length;
    const byPhase: Record<string, number> = {};
    const byType: Record<string, number> = {};
    let manifestationsCompleted = 0;
    let manifestationsInProgress = 0;

    entries.forEach(entry => {
      if (entry.moon_phase) {
        byPhase[entry.moon_phase] = (byPhase[entry.moon_phase] || 0) + 1;
      }
      entry.entry_types.forEach(type => {
        byType[type] = (byType[type] || 0) + 1;
      });
      if (entry.manifestation_status === 'manifestado') manifestationsCompleted++;
      if (entry.manifestation_status === 'em_progresso') manifestationsInProgress++;
    });

    const mostActivePhase = Object.entries(byPhase).sort((a, b) => b[1] - a[1])[0]?.[0];

    return { totalEntries, byPhase, byType, manifestationsCompleted, manifestationsInProgress, mostActivePhase };
  }, [entries]);

  const renderEntryCard = (entry: DiaryEntry) => (
    <motion.div
      key={entry.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onEntryClick(entry)}
      className="cursor-pointer rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground capitalize">
            {format(new Date(entry.entry_date), "EEEE, d 'de' MMM", { locale: ptBR })}
          </p>
          <div className="mt-1 flex items-center gap-1">
            {entry.entry_types.map(type => (
              <span key={type} className="text-sm" title={ENTRY_TYPE_LABELS[type].label}>
                {ENTRY_TYPE_LABELS[type].emoji}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg">{entry.moon_phase === 'Lua Nova' ? '🌑' : entry.moon_phase === 'Lua Cheia' ? '🌕' : entry.moon_phase === 'Quarto Crescente' ? '🌓' : entry.moon_phase === 'Quarto Minguante' ? '🌗' : entry.moon_phase?.includes('Crescente') ? '🌔' : '🌖'}</p>
          <p className="text-[10px] text-muted-foreground">{entry.moon_phase}</p>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-3 space-y-1">
        {entry.dream_title && (
          <p className="text-sm text-foreground font-medium truncate">
            💭 {entry.dream_title}
          </p>
        )}
        {entry.personal_text && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {entry.personal_text}
          </p>
        )}
        {entry.manifestation_what && (
          <p className="text-xs text-foreground flex items-center gap-1">
            🎯 {entry.manifestation_what}
            <span className={`text-[10px] ${entry.manifestation_status === 'manifestado' ? 'text-green-400' : 'text-yellow-400'}`}>
              {entry.manifestation_status === 'manifestado' ? '✅' : '🔄'}
            </span>
          </p>
        )}
      </div>

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {entry.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              #{tag}
            </span>
          ))}
          {entry.tags.length > 3 && (
            <span className="text-[10px] text-muted-foreground">+{entry.tags.length - 3}</span>
          )}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar entradas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={viewMode === 'timeline' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setViewMode('timeline')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setViewMode('grid')}
        >
          <Grid className="h-4 w-4" />
        </Button>
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setFilterType('all')}
          className={`rounded-full px-3 py-1 text-xs transition-all ${
            filterType === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}
        >
          Todos
        </button>
        {Object.entries(ENTRY_TYPE_LABELS).map(([type, { emoji, label }]) => (
          <button
            key={type}
            onClick={() => setFilterType(type as EntryType)}
            className={`rounded-full px-3 py-1 text-xs transition-all ${
              filterType === type ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-9">
          <TabsTrigger value="timeline" className="text-xs">Timeline</TabsTrigger>
          <TabsTrigger value="phase" className="text-xs">Por Fase</TabsTrigger>
          <TabsTrigger value="tags" className="text-xs">Tags</TabsTrigger>
          <TabsTrigger value="stats" className="text-xs">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-4xl mb-2">📔</p>
              <p className="text-sm">Nenhuma entrada encontrada</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
              {filteredEntries.map(renderEntryCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="phase" className="mt-4 space-y-4">
          {Object.entries(groupedByPhase).map(([phase, phaseEntries]) => (
            <div key={phase}>
              <h3 className="font-display text-xs tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                <Moon className="h-3 w-3" />
                {phase} ({phaseEntries.length})
              </h3>
              <div className="space-y-2">
                {phaseEntries.slice(0, 3).map(renderEntryCard)}
                {phaseEntries.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{phaseEntries.length - 3} mais entradas
                  </p>
                )}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="tags" className="mt-4">
          <div className="flex flex-wrap gap-2">
            {allTags.map(([tag, count]) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                #{tag} <span className="text-[10px] opacity-60">({count})</span>
              </button>
            ))}
            {allTags.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma tag ainda</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-2xl font-display text-primary">{stats.totalEntries}</p>
              <p className="text-xs text-muted-foreground">Total de Entradas</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-2xl">{stats.mostActivePhase === 'Lua Cheia' ? '🌕' : stats.mostActivePhase === 'Lua Nova' ? '🌑' : '🌙'}</p>
              <p className="text-xs text-muted-foreground">Fase Mais Ativa</p>
              <p className="text-[10px] text-foreground">{stats.mostActivePhase || 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-2xl font-display text-green-400">{stats.manifestationsCompleted}</p>
              <p className="text-xs text-muted-foreground">Manifestações Realizadas</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-2xl font-display text-yellow-400">{stats.manifestationsInProgress}</p>
              <p className="text-xs text-muted-foreground">Em Progresso</p>
            </div>
          </div>

          {/* Activity by Type */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h4 className="font-display text-xs tracking-wider text-muted-foreground mb-3">Atividade por Tipo</h4>
            <div className="space-y-2">
              {Object.entries(ENTRY_TYPE_LABELS).map(([type, { emoji, label }]) => {
                const count = stats.byType[type] || 0;
                const percentage = stats.totalEntries > 0 ? (count / stats.totalEntries) * 100 : 0;
                return (
                  <div key={type} className="flex items-center gap-2">
                    <span className="text-sm">{emoji}</span>
                    <span className="text-xs text-muted-foreground w-24">{label}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiaryLibrary;
