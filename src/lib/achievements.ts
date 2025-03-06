import { type Id } from "../../convex/_generated/dataModel";
import { type IconName } from "@/types/icons";

export interface Achievement {
  _id: Id<"achievements">;
  _creationTime: number;
  name: string;
  description: string;
  category: string;
  icon: IconName;
  required?: number;
  progress?: number;
  earnedAt?: number;
  xpReward: number;
}

export type AchievementCategory = typeof ACHIEVEMENT_CATEGORIES[number]["id"];

export const ACHIEVEMENT_CATEGORIES = [
  { id: "coding", label: "Coding Milestones" },
  { id: "languages", label: "Language Mastery" },
  { id: "problem-solving", label: "Problem Solving" },
  { id: "social", label: "Social & Sharing" },
  { id: "learning", label: "Learning & Growth" },
] as const;

// Example achievement definitions
export const ACHIEVEMENTS = {
  // Coding Milestones
  "coding.hello-world": {
    id: "coding.hello-world",
    name: "Hello, World!",
    description: "Write your first program",
  },
  "coding.code-warrior": {
    id: "coding.code-warrior",
    name: "Code Warrior",
    description: "Written 100 lines of code",
    required: 100,
  },
  "coding.script-artisan": {
    id: "coding.script-artisan",
    name: "Script Artisan",
    description: "Written 1000 lines of code",
    required: 1000,
  },

  // Language Mastery
  "languages.polyglot": {
    id: "languages.polyglot",
    name: "Polyglot",
    description: "Used 3 different programming languages",
    required: 3,
  },
  "languages.typescript-titan": {
    id: "languages.typescript-titan",
    name: "TypeScript Titan",
    description: "Convert a JavaScript program to TypeScript",
  },
  "languages.rust-rookie": {
    id: "languages.rust-rookie",
    name: "Rust Rookie",
    description: "Complete your first Rust program",
  },

  // Problem Solving
  "problem-solving.bug-squasher": {
    id: "problem-solving.bug-squasher",
    name: "Bug Squasher",
    description: "Fix 5 errors in your code",
    required: 5,
  },
  "problem-solving.debug-master": {
    id: "problem-solving.debug-master",
    name: "Debug Master",
    description: "Use console.log or print statements in 10 different programs",
    required: 10,
  },

  // Social & Sharing
  "social.code-contributor": {
    id: "social.code-contributor",
    name: "Code Contributor",
    description: "Share your first code snippet",
  },
  "social.community-champion": {
    id: "social.community-champion",
    name: "Community Champion",
    description: "Have your code snippet liked by 5 other users",
    required: 5,
  },

  // Learning & Growth
  "learning.theme-enthusiast": {
    id: "learning.theme-enthusiast",
    name: "Theme Enthusiast",
    description: "Try all available themes",
  },
  "learning.night-owl": {
    id: "learning.night-owl",
    name: "Night Owl",
    description: "Code for 2 hours between 10 PM and 5 AM",
  },
  "learning.consistent-coder": {
    id: "learning.consistent-coder",
    name: "Consistent Coder",
    description: "Code for 7 consecutive days",
    required: 7,
  },
} as const; 