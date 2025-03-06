import { useUser } from "@clerk/nextjs";
import { Flame, Clock } from "lucide-react";
import { useStreaks } from "@/lib/services/streaks";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function StreakIndicator() {
  const { user } = useUser();
  const { streak, streakStatus } = useStreaks(user?.id || "");

  if (!streak) return null;

  const currentStreak = streak.currentStreak || 0;
  const longestStreak = streak.longestStreak || 0;
  const hasCodedToday = streak.hasCodedToday || false;
  const isAtRisk = streakStatus?.isAtRisk || false;
  const hoursRemaining = Math.floor(streakStatus?.hoursRemaining || 0);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-help transition-all duration-200",
            hasCodedToday 
              ? "bg-orange-500/10 border-orange-500/20 hover:border-orange-500/30" 
              : isAtRisk
              ? "bg-red-500/10 border-red-500/20 hover:border-red-500/30"
              : "bg-gray-900/50 border-gray-800/50 hover:border-gray-700/50"
          )}>
            <Flame
              className={cn(
                "w-4 h-4 transition-all",
                hasCodedToday
                  ? "text-orange-400 fill-orange-400 animate-flame"
                  : isAtRisk
                  ? "text-red-400"
                  : "text-gray-400"
              )}
            />
            <span className={cn(
              "text-sm font-medium",
              hasCodedToday ? "text-orange-400" : 
              isAtRisk ? "text-red-400" : "text-gray-400"
            )}>
              {currentStreak}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          className="w-64 bg-gray-900/95 border border-gray-800 shadow-xl backdrop-blur-xl"
          sideOffset={4}
        >
          <div className="space-y-2">
            {/* Status Header */}
            <div className={cn(
              "flex items-center gap-2 pb-2 border-b",
              hasCodedToday ? "border-orange-500/20" : 
              isAtRisk ? "border-red-500/20" : "border-gray-800"
            )}>
              <p className="font-medium text-gray-100">
                {hasCodedToday
                  ? "🔥 Streak Active!"
                  : isAtRisk
                  ? "⚠️ Streak at Risk!"
                  : "💻 Keep Coding!"}
              </p>
            </div>

            {/* Streak Info */}
            <div className="space-y-1.5 text-sm">
              <p className="text-gray-200">
                {hasCodedToday
                  ? `You've coded today! Current streak: ${currentStreak} day${currentStreak !== 1 ? 's' : ''}`
                  : "Write some code today to maintain your streak"}
              </p>
              
              {!hasCodedToday && (
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span className={cn(
                    isAtRisk ? "text-red-400" : "text-gray-300"
                  )}>
                    {hoursRemaining > 0
                      ? `${hoursRemaining} hours remaining today`
                      : "Last chance to code today!"}
                  </span>
                </div>
              )}

              {/* Stats */}
              <div className="pt-2 mt-2 border-t border-gray-800 text-xs space-y-1">
                {longestStreak > 0 && (
                  <p className="text-gray-300">
                    Longest Streak: <span className="text-purple-400 font-medium">{longestStreak}</span> days
                  </p>
                )}
                {streak.totalDays && streak.totalDays > 0 && (
                  <p className="text-gray-300">
                    Total Active Days: <span className="text-blue-400 font-medium">{streak.totalDays}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 