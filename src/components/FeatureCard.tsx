import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  path: string;
  delay?: number;
}

const FeatureCard = ({ title, description, icon, path, delay = 0 }: FeatureCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(path)}
      className="gradient-card border-glow flex w-full items-center gap-4 rounded-xl border border-border p-4 text-left transition-all hover:shadow-mystical"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-2xl">
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-sm tracking-wider text-foreground">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground font-body">{description}</p>
      </div>
    </motion.button>
  );
};

export default FeatureCard;
