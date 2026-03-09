import { motion } from "framer-motion";
import { LunarProfile } from "@/hooks/useLunarProfile";
import { calculateLunarSign } from "@/lib/lunar-utils";

interface LunarProfileCardProps {
  profile: LunarProfile;
  onEdit?: () => void;
}

const ZODIAC_SYMBOLS: Record<string, string> = {
  'Áries': '♈',
  'Touro': '♉',
  'Gêmeos': '♊',
  'Câncer': '♋',
  'Leão': '♌',
  'Virgem': '♍',
  'Libra': '♎',
  'Escorpião': '♏',
  'Sagitário': '♐',
  'Capricórnio': '♑',
  'Aquário': '♒',
  'Peixes': '♓',
};

const LunarProfileCard = ({ profile, onEdit }: LunarProfileCardProps) => {
  const zodiacSymbol = profile.lunar_sign ? ZODIAC_SYMBOLS[profile.lunar_sign] || '' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-gradient-to-br from-card to-secondary/20 p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-2xl">
            {zodiacSymbol || '🌙'}
          </div>
          <div>
            <h3 className="font-display text-sm tracking-wider text-foreground">
              {profile.full_name}
            </h3>
            <p className="text-xs text-muted-foreground">
              Lua em {profile.lunar_sign}
            </p>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Editar
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-background/50 p-3 text-center">
          <p className="text-xl">
            {profile.birth_moon_phase === 'Lua Nova' && '🌑'}
            {profile.birth_moon_phase === 'Lua Crescente' && '🌒'}
            {profile.birth_moon_phase === 'Quarto Crescente' && '🌓'}
            {profile.birth_moon_phase === 'Lua Gibosa Crescente' && '🌔'}
            {profile.birth_moon_phase === 'Lua Cheia' && '🌕'}
            {profile.birth_moon_phase === 'Lua Gibosa Minguante' && '🌖'}
            {profile.birth_moon_phase === 'Quarto Minguante' && '🌗'}
            {profile.birth_moon_phase === 'Lua Minguante' && '🌘'}
          </p>
          <p className="mt-1 font-display text-[10px] tracking-wider text-muted-foreground uppercase">
            Fase Natal
          </p>
          <p className="text-xs text-foreground">{profile.birth_moon_phase}</p>
        </div>

        <div className="rounded-lg bg-background/50 p-3 text-center">
          <p className="text-xl">{zodiacSymbol}</p>
          <p className="mt-1 font-display text-[10px] tracking-wider text-muted-foreground uppercase">
            Signo Lunar
          </p>
          <p className="text-xs text-foreground">{profile.lunar_sign}</p>
        </div>

        <div className="rounded-lg bg-background/50 p-3 text-center">
          <p className="text-xl">🏠</p>
          <p className="mt-1 font-display text-[10px] tracking-wider text-muted-foreground uppercase">
            Casa Lunar
          </p>
          <p className="text-xs text-foreground">{profile.lunar_house || 'N/A'}</p>
        </div>

        <div className="rounded-lg bg-background/50 p-3 text-center">
          <p className="text-xl">☊</p>
          <p className="mt-1 font-display text-[10px] tracking-wider text-muted-foreground uppercase">
            Nodo
          </p>
          <p className="text-xs text-foreground">{profile.lunar_node || 'N/A'}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LunarProfileCard;
