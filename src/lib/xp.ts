import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface XPGainProps {
  amount: number;
  reason: string;
  levelUp?: boolean;
  newLevel?: number;
}

export function showXPGain({ amount, reason, levelUp, newLevel }: XPGainProps) {
  const description = levelUp 
    ? `+${amount}XP - ${reason}\n🎉 Level Up! You're now level ${newLevel}!`
    : `+${amount}XP - ${reason}`;

  toast(description, {
    icon: <Sparkles className="w-4 h-4 text-yellow-400" />,
    className: "bg-gray-900/95 border border-yellow-500/20 text-yellow-300",
    position: "bottom-right",
    duration: 4000,
  });
} 