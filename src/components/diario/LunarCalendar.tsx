import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { getMoonPhase, getMoonSign, getNextFullMoon, getNextNewMoon, MOON_PHASE_COLORS } from "@/lib/lunar-utils";
import { DiaryEntry } from "@/hooks/useDiaryEntries";

interface LunarCalendarProps {
  entries: DiaryEntry[];
  onDayClick: (date: Date, entry?: DiaryEntry) => void;
  selectedDate?: Date;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const LunarCalendar = ({ entries, onDayClick, selectedDate }: LunarCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfMonth = monthStart.getDay();
  const emptyDays = Array(firstDayOfMonth).fill(null);

  const nextFullMoon = useMemo(() => getNextFullMoon(new Date()), []);
  const nextNewMoon = useMemo(() => getNextNewMoon(new Date()), []);

  const todayPhase = useMemo(() => getMoonPhase(new Date()), []);
  const todaySign = useMemo(() => getMoonSign(new Date()), []);

  const getEntryForDate = (date: Date): DiaryEntry | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return entries.find(e => e.entry_date === dateStr);
  };

  return (
    <div className="space-y-4">
      {/* Current Moon Info */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-secondary/30 to-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.span 
              className="text-4xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              {todayPhase.emoji}
            </motion.span>
            <div>
              <p className="font-display text-sm tracking-wider">{todayPhase.phaseName}</p>
              <p className="text-xs text-muted-foreground">
                {todayPhase.illumination}% iluminação • Lua em {todaySign.name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">
              Energia {todayPhase.energy}
            </p>
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {todayPhase.bestFor.map((item, i) => (
            <span key={i} className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Upcoming Moons */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <p className="text-lg">🌕</p>
          <p className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">Próxima Lua Cheia</p>
          <p className="text-xs text-foreground">{format(nextFullMoon, "d 'de' MMM", { locale: ptBR })}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <p className="text-lg">🌑</p>
          <p className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">Próxima Lua Nova</p>
          <p className="text-xs text-foreground">{format(nextNewMoon, "d 'de' MMM", { locale: ptBR })}</p>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-display text-sm tracking-widest capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-[10px] font-display tracking-wider text-muted-foreground uppercase py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {daysInMonth.map((day) => {
          const moonPhase = getMoonPhase(day);
          const entry = getEntryForDate(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const today = isToday(day);
          const isSpecialDay = moonPhase.phaseName === 'Lua Nova' || moonPhase.phaseName === 'Lua Cheia';

          return (
            <motion.button
              key={day.toISOString()}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDayClick(day, entry)}
              className={`
                relative aspect-square rounded-lg p-0.5 text-center transition-all
                ${isSelected ? 'ring-2 ring-primary bg-primary/20' : 'hover:bg-muted'}
                ${today ? 'ring-1 ring-primary/50' : ''}
                ${isSpecialDay ? 'bg-secondary/30' : ''}
              `}
            >
              <span className="block text-xs">{moonPhase.emoji}</span>
              <span className={`block text-[10px] ${today ? 'text-primary font-bold' : 'text-foreground'}`}>
                {format(day, 'd')}
              </span>
              
              {entry && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default LunarCalendar;
