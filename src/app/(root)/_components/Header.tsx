"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Blocks, Code2, Sparkles, Flame, Star } from "lucide-react";
import { SignedIn, useUser } from "@clerk/nextjs";
import HeaderProfileBtn from "./HeaderProfileBtn";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";
import RunButton from "./RunButton";
import UserAchievements from "./UserAchievements";
import { Progress } from "@/components/ui/progress";

function Header() {
  const { user } = useUser();
  const userId = user?.id || "";

  const convexUser = useQuery(api.users.getUser, { userId });
  const userProgress = useQuery(api.users.getUserProgress, { userId });
  const streak = useQuery(api.streaks.getCurrentStreak, { userId });

  return (
    <div className="relative z-10">
      <div
        className="flex items-center lg:justify-between justify-center 
        bg-[#0a0a0f]/80 backdrop-blur-xl p-6 mb-4 rounded-lg"
      >
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group relative">
            {/* Logo hover effect */}

            <div
              className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
                group-hover:opacity-100 transition-all duration-500 blur-xl"
            />

            {/* Logo */}
            <div
              className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1
              ring-white/10 group-hover:ring-white/20 transition-all"
            >
              <Blocks className="size-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
            </div>

            <div className="flex flex-col">
              <span className="block text-lg font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                {process.env.NEXT_PUBLIC_NAME}
              </span>
              <span className="block text-xs text-blue-400/60 font-medium">
                Interactive Code Editor
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            <Link
              href="/snippets"
              className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50 
                hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 
                to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
              <span
                className="text-sm font-medium relative z-10 group-hover:text-white
                 transition-colors"
              >
                Snippets
              </span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* XP and Level Display */}
          {convexUser && userProgress && (
            <div className="flex items-center gap-4 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-800">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400">Level</span>
                <span className="text-lg font-bold text-blue-400">{userProgress.level}</span>
              </div>
              <div className="flex flex-col min-w-[200px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">{userProgress.xp} XP</span>
                  </div>
                  <span className="text-xs text-gray-500">{userProgress.nextLevelXp} XP</span>
                </div>
                {/* XP Progress Bar */}
                <Progress 
                  value={userProgress.progress} 
                  className="h-1.5 mt-1"
                  indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
                />
                <span className="text-xs text-gray-500 mt-1">
                  {Math.round(userProgress.progress)}% to Level {userProgress.level + 1}
                </span>
              </div>
            </div>
          )}

          {/* Streak Display */}
          {streak && streak.currentStreak > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <Flame className="w-4 h-4 text-orange-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-orange-400">
                  {streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''}
                </span>
                <span className="text-xs text-orange-400/60">
                  Best: {streak.longestStreak} days
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <ThemeSelector />
            <LanguageSelector hasAccess={Boolean(convexUser?.isPro)} />
          </div>

          {!convexUser?.isPro && (
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 
                to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 
                transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 text-amber-400 hover:text-amber-300" />
              <span className="text-sm font-medium text-amber-400/90 hover:text-amber-300">
                Pro
              </span>
            </Link>
          )}

          <SignedIn>
            <RunButton />
          </SignedIn>

          <div className="pl-3 border-l border-gray-800 flex items-center gap-3">
            <HeaderProfileBtn />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;