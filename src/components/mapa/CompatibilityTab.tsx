import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCompatibility, CompatibilityProfile } from "@/hooks/useCompatibility";
import AddPersonModal from "./AddPersonModal";
import CompatibilityResult from "./CompatibilityResult";
import QuickComparisonModal from "./QuickComparisonModal";
import IdealMatchSection from "./IdealMatchSection";
import AstroGuide from "./AstroGuide";
import {
  SIGNS, SIGN_SYMBOLS, getCompatibleSigns, getScoreLabel,
  estimateSunSign, calculateCompatibility, PersonSigns,
} from "@/lib/astro-compatibility-utils";

interface UserSigns {
  sun: string;
  moon: string;
  ascendant: string;
  name: string;
  birthDate: string;
}

export default function CompatibilityTab({ userSigns }: { userSigns?: UserSigns }) {
  const { user } = useAuth();
  const { profiles, loading, addProfile, deleteProfile, saveAnalysis } = useCompatibility();
  const [showModal, setShowModal] = useState(false);
  const [showQuick, setShowQuick] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<CompatibilityProfile | null>(null);
  const [activeSection, setActiveSection] = useState<"main" | "matches" | "guide">("main");

  const uSigns: PersonSigns = {
    sun: userSigns?.sun || 'Áries',
    moon: userSigns?.moon || '',
    ascendant: userSigns?.ascendant || '',
  };

  const handleAddPerson = async (data: any) => {
    setAddLoading(true);
    const profile = await addProfile({
      name: data.name,
      relationship_type: data.relationship_type,
      birth_date: data.birth_date,
      birth_time: data.birth_time,
      birth_place: data.birth_place,
      sun_sign: data.sun_sign,
      moon_sign: data.moon_sign,
      ascendant_sign: data.ascendant_sign,
      photo_url: null,
    });
    if (profile) {
      const pSigns: PersonSigns = {
        sun: profile.sun_sign || estimateSunSign(profile.birth_date),
        moon: profile.moon_sign || '',
        ascendant: profile.ascendant_sign || '',
      };
      const scores = calculateCompatibility(uSigns, pSigns);
      await saveAnalysis({
        profile_id: profile.id,
        overall_score: scores.overall,
        sun_score: scores.sunSun,
        moon_score: scores.moonMoon,
        asc_score: scores.ascAsc,
        cross_score: scores.crossSunMoon,
        analysis_data: { scores, userSigns: uSigns, partnerSigns: pSigns },
      });
      setSelectedProfile(profile as CompatibilityProfile);
      setShowModal(false);
    }
    setAddLoading(false);
  };

  // If viewing a specific result
  if (selectedProfile) {
    const pSigns: PersonSigns = {
      sun: selectedProfile.sun_sign || estimateSunSign(selectedProfile.birth_date),
      moon: selectedProfile.moon_sign || '',
      ascendant: selectedProfile.ascendant_sign || '',
    };
    const scores = calculateCompatibility(uSigns, pSigns);
    return (
      <CompatibilityResult
        userName={userSigns?.name || "Você"}
        partnerName={selectedProfile.name}
        userSigns={uSigns}
        partnerSigns={pSigns}
        scores={scores}
        relationshipType={selectedProfile.relationship_type}
        onBack={() => setSelectedProfile(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Section Toggle */}
      <div className="flex gap-1 bg-muted/30 rounded-lg p-1">
        {[
          { key: 'main', label: '💫 Compatibilidade' },
          { key: 'matches', label: '🔮 Match Ideal' },
          { key: 'guide', label: '📖 Fundamentos' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key as any)}
            className={`flex-1 text-[9px] font-display tracking-wider py-1.5 rounded-md transition-all ${
              activeSection === key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeSection === "matches" ? (
        <IdealMatchSection userSigns={uSigns} />
      ) : (
        <>
          {/* User Profile Card */}
          {userSigns && (
            <Card className="border-border bg-card p-4 border-glow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl">
                  {SIGN_SYMBOLS[userSigns.sun] || '☉'}
                </div>
                <div className="flex-1">
                  <p className="font-display text-sm tracking-wider text-foreground">{userSigns.name || 'Você'}</p>
                  <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground">
                    {userSigns.sun && <span>☉ {userSigns.sun}</span>}
                    {userSigns.moon && <span>☽ {userSigns.moon}</span>}
                    {userSigns.ascendant && <span>↑ {userSigns.ascendant}</span>}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button className="font-display tracking-wider text-xs" onClick={() => setShowModal(true)}>
              + Adicionar Pessoa
            </Button>
            <Button variant="outline" className="font-display tracking-wider text-xs" onClick={() => setShowQuick(true)}>
              ⚡ Comparação Rápida
            </Button>
          </div>

          {/* Saved Profiles */}
          {profiles.length > 0 && (
            <div className="space-y-2">
              <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">Perfis Salvos</p>
              {profiles.map(p => {
                const pSigns: PersonSigns = {
                  sun: p.sun_sign || estimateSunSign(p.birth_date),
                  moon: p.moon_sign || '',
                  ascendant: p.ascendant_sign || '',
                };
                const scores = calculateCompatibility(uSigns, pSigns);
                const { emoji, colorClass } = getScoreLabel(scores.overall);
                return (
                  <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Card className="border-border bg-card p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => setSelectedProfile(p)}>
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm">
                          {SIGN_SYMBOLS[pSigns.sun] || '☉'}
                        </div>
                        <div>
                          <p className="font-display text-xs tracking-wider text-foreground">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground">{p.relationship_type} · ☉ {pSigns.sun}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className={`font-display text-sm ${colorClass}`}>{scores.overall}% {emoji}</span>
                        <button onClick={() => deleteProfile(p.id)} className="text-muted-foreground hover:text-destructive text-xs ml-2">✕</button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Compatible Signs Section */}
          {userSigns?.sun && (
            <CompatibleSignsSection sign={userSigns.sun} label="Sol" icon="☉" />
          )}
          {userSigns?.moon && (
            <CompatibleSignsSection sign={userSigns.moon} label="Lua" icon="☽" />
          )}
        </>
      )}

      <AddPersonModal open={showModal} onClose={() => setShowModal(false)} onSubmit={handleAddPerson} loading={addLoading} />
      <QuickComparisonModal
        open={showQuick}
        onClose={() => setShowQuick(false)}
        userSigns={uSigns}
        userName={userSigns?.name || "Você"}
      />
    </div>
  );
}

function CompatibleSignsSection({ sign, label, icon }: { sign: string; label: string; icon: string }) {
  const compat = getCompatibleSigns(sign);
  return (
    <Card className="border-border bg-card p-4 space-y-2">
      <p className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">
        {icon} {label} em {sign} — Compatibilidade
      </p>
      <div className="space-y-1">
        <div className="flex flex-wrap gap-1">
          {compat.high.map(s => (
            <span key={s} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] bg-green-500/20 text-green-400 border border-green-500/30">
              {SIGN_SYMBOLS[s]} {s}
            </span>
          ))}
          {compat.good.map(s => (
            <span key={s} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              {SIGN_SYMBOLS[s]} {s}
            </span>
          ))}
        </div>
        <div className="flex gap-3 text-[9px] text-muted-foreground mt-1">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500/50" /> Alta</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500/50" /> Boa</span>
        </div>
      </div>
    </Card>
  );
}
