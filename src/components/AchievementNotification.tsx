import { type Toast } from "react-hot-toast";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { type Achievement } from "@/lib/achievements";
import { getIconComponent, type IconName } from "@/types/icons";

interface AchievementToastProps {
  t: Toast;
  achievement: Achievement;
}

export function AchievementNotification({ t, achievement }: AchievementToastProps) {
  const IconComponent = getIconComponent(achievement.icon as IconName) || Trophy;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.6 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.6 }}
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-[#1e1e2e]/95 backdrop-blur-xl shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <IconComponent className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-100">
                Achievement Unlocked!
              </p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
                className="flex-shrink-0 bg-blue-500/10 rounded-full px-2 py-0.5"
              >
                <p className="text-xs font-medium text-blue-400">+{achievement.xpReward} XP</p>
              </motion.div>
            </div>
            <p className="mt-1 text-sm text-gray-300">{achievement.name}</p>
            <p className="mt-1 text-xs text-gray-400">{achievement.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 