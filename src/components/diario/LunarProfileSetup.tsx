import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLunarProfile, LunarProfile } from "@/hooks/useLunarProfile";
import { toast } from "@/hooks/use-toast";

const profileSchema = z.object({
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  birth_date: z.string().min(1, "Data de nascimento é obrigatória"),
  birth_time: z.string().optional(),
  birth_city: z.string().min(2, "Cidade é obrigatória"),
  birth_state: z.string().optional(),
});

interface ProfileFormData {
  full_name: string;
  birth_date: string;
  birth_time?: string;
  birth_city: string;
  birth_state?: string;
}

interface LunarProfileSetupProps {
  open: boolean;
  onComplete: (profile: LunarProfile) => void;
}

const LunarProfileSetup = ({ open, onComplete }: LunarProfileSetupProps) => {
  const { createOrUpdateProfile } = useLunarProfile();
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      birth_date: "",
      birth_time: "",
      birth_city: "",
      birth_state: "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsCalculating(true);
    try {
      const profile = await createOrUpdateProfile(data);
      toast({
        title: "✨ Perfil Lunar Criado!",
        description: "Seu mapa lunar foi calculado com sucesso.",
      });
      onComplete(profile as LunarProfile);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar perfil",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-xl tracking-wider text-center flex items-center justify-center gap-2">
            <span className="text-2xl">🌙</span>
            Configuração Lunar
          </DialogTitle>
          <DialogDescription className="text-center font-body text-muted-foreground">
            Para criar seu diário lunar personalizado, preciso de algumas informações sobre seu nascimento.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-display text-xs tracking-wider">Nome Completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Seu nome"
                      className="bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-display text-xs tracking-wider">Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birth_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-display text-xs tracking-wider">
                    Hora de Nascimento <span className="text-muted-foreground">(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      className="bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="birth_city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-display text-xs tracking-wider">Cidade</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Sua cidade"
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birth_state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-display text-xs tracking-wider">Estado</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="UF"
                        maxLength={2}
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full font-display tracking-wider"
              disabled={isCalculating}
            >
              {isCalculating ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="inline-block"
                >
                  🌙
                </motion.span>
              ) : (
                <>✨ Calcular Meu Mapa Lunar</>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LunarProfileSetup;
