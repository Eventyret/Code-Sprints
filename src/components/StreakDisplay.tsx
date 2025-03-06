import { useUser } from "@clerk/nextjs";
import { Flame, Trophy, Calendar, Star } from "lucide-react";
import { useStreaks } from "@/lib/services/streaks";
import { useEffect } from "react";
import { STREAK_MILESTONES } from "@/lib/constants/streakMilestones";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function StreakDisplay() {
  const { user } = useUser();
  const { streak, checkAndUpdateStreak } = useStreaks(user?.id || "");

  // Check streak on component mount and when user changes
  useEffect(() => {
    if (user?.id) {
      checkAndUpdateStreak();
    }
  }, [user?.id]);

  if (!streak) return null;

  // Find next milestone
  const nextMilestone = STREAK_MILESTONES.find(m => m.days > (streak.lastMilestoneAwarded || 0));
  const progressToNextMilestone = nextMilestone 
    ? ((streak.currentStreak - (streak.lastMilestoneAwarded || 0)) / (nextMilestone.days - (streak.lastMilestoneAwarded || 0))) * 100
    : 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-6 px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800/50">
        {/* Current Streak */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-orange-500/10">
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Current Streak</p>
            <p className="text-lg font-semibold text-white">{streak.currentStreak} days</p>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-yellow-500/10">
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Longest Streak</p>
            <p className="text-lg font-semibold text-white">{streak.longestStreak} days</p>
          </div>
        </div>

        {/* Total Days */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-blue-500/10">
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Total Days</p>
            <p className="text-lg font-semibold text-white">{streak.totalDays} days</p>
          </div>
        </div>
      </div>

      {/* Next Milestone Progress */}
      {nextMilestone && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-2 px-4">
                <Star className="w-4 h-4 text-purple-400" />
                <div className="w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">Next Milestone: {nextMilestone.title}</span>
                    <span className="text-xs text-gray-400">
                      {streak.currentStreak - (streak.lastMilestoneAwarded || 0)}/{nextMilestone.days - (streak.lastMilestoneAwarded || 0)} days
                    </span>
                  </div>
                  <Progress value={progressToNextMilestone} className="h-1" />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p className="font-medium">{nextMilestone.title}</p>
                <p className="text-gray-400">{nextMilestone.description}</p>
                <p className="text-purple-400 mt-1">+{nextMilestone.xpReward} XP</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
} 