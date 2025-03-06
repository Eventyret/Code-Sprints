"use client";

import HeaderProfileBtn from "@/app/(root)/_components/HeaderProfileBtn";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Blocks, BookMarked, Code2, Menu, Sparkles, Star, Trophy } from "lucide-react";
import Link from "next/link";
import { api } from "../../convex/_generated/api";
import StreakDisplay from "./StreakDisplay";
import StreakIndicator from "./StreakIndicator";
import XPIndicator from "./XPIndicator";
import AchievementIndicator from "./AchievementIndicator";
import useMounted from "@/hooks/useMounted";

interface MainHeaderProps {
  minimal?: boolean; // For pages that need a simpler header
}

function MainHeader({ minimal = false }: MainHeaderProps) {
  const { user } = useUser();
  const userId = user?.id;
  const mounted = useMounted();

  const convexUser = useQuery(api.users.getUser, { userId: userId || "" });
  const userProgress = useQuery(api.users.getUserProgress, { userId: userId || "" });
  const streak = useQuery(api.streaks.getCurrentStreak, { userId: userId || "" });

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative h-14 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
                group-hover:opacity-100 transition-all duration-500 blur-xl" />
              <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                <Blocks className="w-5 h-5 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
              </div>
              <div className="relative">
                <span className="block text-base font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                  CodeCraft
                </span>
                <span className="block text-[11px] text-blue-400/60 font-medium">
                  Interactive Code Editor
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
                group-hover:opacity-100 transition-all duration-500 blur-xl" />
              <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                <Blocks className="w-5 h-5 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
              </div>
              <div className="relative">
                <span className="block text-base font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                  CodeCraft
                </span>
                <span className="block text-[11px] text-blue-400/60 font-medium">
                  Interactive Code Editor
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList className="gap-2">
                  <NavigationMenuItem>
                    <Link href="/editor" legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-9 items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors">
                        <Code2 className="w-4 h-4 group-hover:rotate-3 transition-transform" />
                        Editor
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/snippets" legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-9 items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors">
                        <BookMarked className="w-4 h-4" />
                        Snippets
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/achievements" legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-9 items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors">
                        <Trophy className="w-4 h-4" />
                        Achievements
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <SignedIn>
              <AchievementIndicator />
              <XPIndicator />
              <StreakIndicator />
            </SignedIn>
            <SignedOut>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 
                    to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 mr-2" />
                  <span className="text-amber-400/90">Pro</span>
                </Button>
              </Link>
            </SignedOut>

            <HeaderProfileBtn />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-gray-950/95 border-gray-800">
                <SheetHeader>
                  <SheetTitle className="text-left text-white">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-4">
                  {/* Mobile Navigation */}
                  <div className="flex flex-col gap-2">
                    <Link 
                      href="/editor"
                      className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                    >
                      <Code2 className="w-4 h-4" />
                      Editor
                    </Link>
                    <Link 
                      href="/snippets"
                      className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                    >
                      <BookMarked className="w-4 h-4" />
                      Snippets
                    </Link>
                    <Link 
                      href="/achievements"
                      className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                    >
                      <Trophy className="w-4 h-4" />
                      Achievements
                    </Link>
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex flex-col gap-2">
                    <SignedOut>
                      <Link href="/pricing">
                        <Button
                          variant="outline"
                          className="w-full border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 
                            to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20"
                        >
                          <Sparkles className="w-4 h-4 text-amber-400 mr-2" />
                          <span className="text-amber-400/90">Pro</span>
                        </Button>
                      </Link>
                    </SignedOut>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainHeader; 