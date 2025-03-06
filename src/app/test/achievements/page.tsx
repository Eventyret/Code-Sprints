"use client";

import { Button } from "@/components/ui/button";
import { showAchievementToast } from "@/lib/notifications";
import { ACHIEVEMENT_CATEGORIES } from "@/lib/achievements";
import { useState } from "react";
import { AchievementsModal } from "@/components/AchievementsModal";
import { type Id } from "../../../../convex/_generated/dataModel";
import { type Achievement as ConvexAchievement } from "../../../../convex/types";
import { FaCode, FaGlobe, FaPuzzlePiece, FaUsers, FaFire, FaBook, FaTrophy } from "react-icons/fa";

// Define the UI Achievement type expected by the modal
interface UIAchievement {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  required?: number;
  progress?: number;
  earnedAt?: number;
  xpReward: number;
}

// Helper function to transform Convex achievement to UI achievement for modal
function transformToModalAchievement(achievement: ConvexAchievement): UIAchievement {
  return {
    id: `${achievement.category}.${achievement._id}`,
    name: achievement.name,
    description: achievement.description,
    category: achievement.category,
    icon: achievement.icon,
    required: achievement.required,
    progress: achievement.progress,
    earnedAt: achievement.earnedAt,
    xpReward: achievement.xpReward,
  };
}

export default function TestAchievementsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to get category-specific icons
  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      coding: "FaCode",
      languages: "FaGlobe",
      "problem-solving": "FaPuzzlePiece",
      community: "FaUsers",
      streak: "FaFire",
      learning: "FaBook",
      default: "FaTrophy"
    };
    return icons[category] || icons.default;
  };

  // Helper function to create a mock achievement
  const createMockAchievement = (
    id: string,
    name: string,
    description: string,
    category: string,
    options?: {
      progress?: number;
      required?: number;
      earnedAt?: number;
      icon?: string;
      xpReward?: number;
    }
  ): ConvexAchievement => ({
    _id: id as unknown as Id<"achievements">,
    _creationTime: Date.now(),
    name,
    description,
    category,
    icon: options?.icon || getCategoryIcon(category),
    xpReward: options?.xpReward || 100,
    ...options,
  });

  // Sample achievements for testing
  const sampleAchievements = [
    createMockAchievement(
      "test1",
      "First Code Run",
      "Run your first piece of code",
      "coding",
      { earnedAt: Date.now(), xpReward: 50 }
    ),
    createMockAchievement(
      "test2",
      "Polyglot Programmer",
      "Write code in 5 different languages",
      "languages",
      { progress: 3, required: 5, xpReward: 200 }
    ),
    createMockAchievement(
      "test3",
      "Problem Solver",
      "Solve 10 coding challenges",
      "problem-solving",
      {
        progress: 10,
        required: 10,
        earnedAt: Date.now() - 86400000,
        xpReward: 500
      }
    ),
    createMockAchievement(
      "test4",
      "Level 10 Reached",
      "Reach level 10",
      "learning",
      { xpReward: 1000 }
    ),
  ];

  return (
    <div className="min-h-screen bg-[#1e1e2e] text-gray-200 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Achievement System Test Page</h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Achievement Notifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ACHIEVEMENT_CATEGORIES.map((category) => {
              const achievement = createMockAchievement(
                category.id,
                `${category.label} Achievement`,
                `This is a test achievement for ${category.label}`,
                category.id,
                { earnedAt: Date.now() }
              );
              
              return (
                <Button
                  key={category.id}
                  onClick={() => showAchievementToast(achievement)}
                  variant="outline"
                  className="w-full"
                >
                  Show {category.label} Achievement
                </Button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Achievement Progress Notifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => {
                const achievement = createMockAchievement(
                  "progress1",
                  "Progress Achievement",
                  "This achievement shows progress",
                  "coding",
                  { progress: 50, required: 100 }
                );
                showAchievementToast(achievement);
              }}
              variant="outline"
              className="w-full"
            >
              Show Progress Achievement (50%)
            </Button>
            <Button
              onClick={() => {
                const achievement = createMockAchievement(
                  "progress2",
                  "Completed Achievement",
                  "This achievement is completed",
                  "coding",
                  {
                    progress: 100,
                    required: 100,
                    earnedAt: Date.now(),
                  }
                );
                showAchievementToast(achievement);
              }}
              variant="outline"
              className="w-full"
            >
              Show Completed Achievement
            </Button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Achievements Modal</h2>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            className="w-full"
          >
            Open Achievements Modal
          </Button>
        </section>

        <AchievementsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          achievements={sampleAchievements.map(transformToModalAchievement)}
        />
      </div>
    </div>
  );
} 