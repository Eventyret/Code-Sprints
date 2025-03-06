import { useUser } from "@clerk/nextjs";
import { Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function XPIndicator() {
  const { user } = useUser();
  const userProgress = useQuery(api.users.getUserProgress, { userId: user?.id || "" });

  if (!userProgress) return null;

  const { level, xp, totalXp } = userProgress;
  const nextLevelXp = Math.pow((level + 1) * 100, 1.2);
  const currentLevelXp = Math.pow(level * 100, 1.2);
  const xpForNextLevel = nextLevelXp - currentLevelXp;
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-help transition-all duration-200
            bg-purple-500/10 border-purple-500/20 hover:border-purple-500/30">
            <Star className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">
              {level}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          className="w-64 bg-gray-900/95 border border-gray-800 shadow-xl backdrop-blur-xl"
          sideOffset={4}
        >
          <div className="space-y-2">
            {/* Status Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-purple-500/20">
              <p className="font-medium text-gray-100">
                <Sparkles className="w-4 h-4 text-purple-400 inline-block mr-2" />
                Level {level}
              </p>
            </div>

            {/* XP Info */}
            <div className="space-y-1.5 text-sm">
              <p className="text-gray-200">
                Total XP: {Math.floor(totalXp).toLocaleString()}
              </p>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Progress to Level {level + 1}</span>
                  <span>{Math.floor(xp - currentLevelXp).toLocaleString()} / {Math.floor(xpForNextLevel).toLocaleString()} XP</span>
                </div>
                <Progress value={progress} className="h-1" />
              </div>

              {/* XP Rewards */}
              <div className="pt-2 mt-2 border-t border-gray-800 text-xs space-y-1">
                <p className="text-gray-300 font-medium">XP Rewards:</p>
                <ul className="space-y-0.5 text-gray-400">
                  <li>• Daily Coding: 50 XP</li>
                  <li>• Streak Milestones: 100-20,000 XP</li>
                  <li>• Completing Challenges: 100-500 XP</li>
                  <li>• Creating Snippets: 25 XP</li>
                </ul>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 