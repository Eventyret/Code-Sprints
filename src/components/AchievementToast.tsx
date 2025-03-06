import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import toast, { Toast } from "react-hot-toast";
import { getIconComponent, type IconName } from "@/types/icons";

interface AchievementToastProps {
  t: Toast;
  achievement: {
    name: string;
    description: string;
    icon: IconName;
    xpReward: number;
  };
}

export function AchievementToast({ t, achievement }: AchievementToastProps) {
  const IconComponent = getIconComponent(achievement.icon) || Trophy;

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
      <div className="flex border-l border-gray-700">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
} 