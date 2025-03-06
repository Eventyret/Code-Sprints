import { toast } from "sonner";
import { Achievement } from "../../convex/types";

export function showAchievementToast(achievement: Achievement) {
  toast(
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 p-2 bg-blue-500/10 rounded-lg">
        <div className="text-2xl">{achievement.icon}</div>
      </div>
      <div>
        <h3 className="font-semibold text-blue-400">Achievement Unlocked!</h3>
        <p className="text-sm text-gray-300">{achievement.name}</p>
        <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
        {achievement.xpReward && (
          <p className="text-xs text-yellow-400 mt-1">+{achievement.xpReward} XP</p>
        )}
      </div>
    </div>,
    {
      duration: 5000,
    }
  );
}

export function showLevelUpToast(newLevel: number, previousLevel: number) {
  toast(
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 p-2 bg-purple-500/10 rounded-lg">
        <div className="text-2xl">⭐</div>
      </div>
      <div>
        <h3 className="font-semibold text-purple-400">Level Up!</h3>
        <p className="text-sm text-gray-300">
          You've reached Level {newLevel}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Keep coding to unlock more achievements!
        </p>
      </div>
    </div>,
    {
      duration: 6000,
      className: "bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20",
    }
  );
}

export function showXPToast(xp: number, reason?: string) {
  toast(
    <div className="flex items-center gap-3">
      <div className="text-yellow-400">+{xp} XP</div>
      {reason && <div className="text-sm text-gray-400">{reason}</div>}
    </div>,
    {
      duration: 3000,
      className: "bg-yellow-500/5 border-yellow-500/20",
    }
  );
} 