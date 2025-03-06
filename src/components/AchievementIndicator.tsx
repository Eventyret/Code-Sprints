import { useUser } from "@clerk/nextjs";
import { Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function AchievementIndicator() {
  const { user } = useUser();
  const achievements = useQuery(api.achievements.getUserAchievements, { userId: user?.id || "" });
  const progress = useQuery(api.achievements.getAchievementProgress, { userId: user?.id || "" });

  if (!achievements || !progress) return null;

  const recentAchievements = achievements.slice(0, 3);
  const nextAchievement = progress.find(p => p.progress < p.required);
  const totalAchievements = achievements.length;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-help transition-all duration-200
            bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/30">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">
              {totalAchievements}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          className="w-64 bg-gray-900/95 border border-gray-800 shadow-xl backdrop-blur-xl"
          sideOffset={4}
        >
          <div className="space-y-2">
            {/* Status Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-yellow-500/20">
              <p className="font-medium text-gray-100">
                <Medal className="w-4 h-4 text-yellow-400 inline-block mr-2" />
                {totalAchievements} Achievements Earned
              </p>
            </div>

            {/* Recent Achievements */}
            <div className="space-y-1.5">
              <p className="text-sm text-gray-300 font-medium">Recent Achievements:</p>
              <div className="space-y-1">
                {recentAchievements.map(achievement => (
                  <div key={achievement._id} className="flex items-start gap-2 text-xs">
                    <Trophy className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-200 font-medium">{achievement.name}</p>
                      <p className="text-gray-400">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Achievement */}
            {nextAchievement && (
              <div className="pt-2 mt-2 border-t border-gray-800 space-y-1">
                <p className="text-sm text-gray-300 font-medium">Next Achievement:</p>
                <div className="flex items-start gap-2 text-xs">
                  <Trophy className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-300 font-medium">{nextAchievement.name}</p>
                    <p className="text-gray-400">{nextAchievement.description}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400/50 rounded-full transition-all duration-300"
                          style={{ width: `${(nextAchievement.progress / nextAchievement.required) * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-400">
                        {nextAchievement.progress}/{nextAchievement.required}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 