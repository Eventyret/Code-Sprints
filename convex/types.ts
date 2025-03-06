import { Id } from "./_generated/dataModel";

export interface Achievement {
  _id: Id<"achievements">;
  _creationTime: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  required?: number;
  progress?: number;
  earnedAt?: number;
  xpReward: number;
}

export interface LevelRequirement {
  level: number;
  xpRequired: number;
  rewards: Array<{
    type: string;
    value: string | number | boolean | null;
  }>;
}

export interface UserStats {
  xp: number;
  level: number;
  totalXp: number;
}

export interface UserAchievement {
  _id: Id<"userAchievements">;
  userId: string;
  achievementId: Id<"achievements">;
  earnedAt: number;
}

export interface AchievementProgress {
  _id: Id<"achievementProgress">;
  userId: string;
  achievementId: Id<"achievements">;
  progress: number;
  required: number;
}

export type AchievementCategory = 
  | "coding"
  | "languages"
  | "problem-solving"
  | "social"
  | "learning";

export const ACHIEVEMENT_CATEGORIES = [
  { id: "coding" as const, label: "Coding Milestones" },
  { id: "languages" as const, label: "Language Mastery" },
  { id: "problem-solving" as const, label: "Problem Solving" },
  { id: "social" as const, label: "Social & Sharing" },
  { id: "learning" as const, label: "Learning & Growth" },
]; 