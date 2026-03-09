import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SIGNS, estimateSunSign, SIGN_SYMBOLS } from "@/lib/astro-compatibility-utils";

interface AddPersonModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    relationship_type: string;
    birth_date: string;
    birth_time: string | null;
    birth_place: string | null;
    sun_sign: string | null;
    moon_sign: string | null;
    ascendant_sign: string | null;
  }) => void;
  loading?: boolean;
}

const RELATIONSHIPS = [
  { value: 'parceiro', label: 'Parceiro(a)' },
  { value: 'crush', label: 'Crush' },
  { value: 'amigo', label: 'Amigo(a)' },
  { value: 'familiar', label: 'Familiar' },
  { value: 'colega', label: 'Colega' },
  { value: 'outro', label: 'Outro' },
];

export default function AddPersonModal({ open, onClose, onSubmit, loading }: AddPersonModalProps) {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("outro");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [moonSign, setMoonSign] = useState("");
  const [ascSign, setAscSign] = useState("");

  const sunSign = birthDate ? estimateSunSign(birthDate) : "";
  const canSubmit = name.trim() && birthDate;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      name: name.trim(),
      relationship_type: relationship,
      birth_date: birthDate,
      birth_time: birthTime || null,
      birth_place: birthPlace || null,
      sun_sign: sunSign || null,
      moon_sign: moonSign || null,
      ascendant_sign: ascSign || null,
    });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-5 space-y-4"
        >
          <div className="text-center">
            <span className="text-3xl">💫</span>
            <h3 className="font-display text-base tracking-widest text-foreground mt-1">Adicionar Pessoa</h3>
            <p className="text-xs text-muted-foreground">Preencha os dados para calcular a compatibilidade</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">Nome ou apelido *</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Maria" className="mt-1 border-border bg-background text-foreground" />
            </div>

            <div>
              <label className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">Relação</label>
              <Select value={relationship} onValueChange={setRelationship}>
                <SelectTrigger className="mt-1 border-border bg-background text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIPS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">Data de nascimento *</label>
              <Input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="mt-1 border-border bg-background text-foreground" />
              {sunSign && (
                <p className="mt-1 text-xs text-primary">
                  {SIGN_SYMBOLS[sunSign]} Sol em {sunSign}
                </p>
              )}
            </div>

            <div>
              <label className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">Hora de nascimento (opcional)</label>
              <Input type="time" value={birthTime} onChange={e => setBirthTime(e.target.value)} className="mt-1 border-border bg-background text-foreground" />
            </div>

            <div>
              <label className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">Local de nascimento (opcional)</label>
              <Input value={birthPlace} onChange={e => setBirthPlace(e.target.value)} placeholder="Ex: São Paulo, SP" className="mt-1 border-border bg-background text-foreground" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">Lua (se souber)</label>
                <Select value={moonSign} onValueChange={setMoonSign}>
                  <SelectTrigger className="mt-1 border-border bg-background text-foreground text-xs">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {SIGNS.map(s => <SelectItem key={s} value={s}>{SIGN_SYMBOLS[s]} {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-display text-[10px] tracking-wider text-muted-foreground uppercase">Ascendente (se souber)</label>
                <Select value={ascSign} onValueChange={setAscSign}>
                  <SelectTrigger className="mt-1 border-border bg-background text-foreground text-xs">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {SIGNS.map(s => <SelectItem key={s} value={s}>{SIGN_SYMBOLS[s]} {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 font-display tracking-wider text-xs" onClick={onClose}>Cancelar</Button>
            <Button className="flex-1 font-display tracking-wider text-xs" disabled={!canSubmit || loading} onClick={handleSubmit}>
              {loading ? "Calculando…" : "✦ Calcular"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
