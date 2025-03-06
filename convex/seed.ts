import { mutation } from "./_generated/server";
import { Achievement } from "./types";

// Type for seeding that excludes system fields
type SeedAchievement = Pick<Achievement, "name" | "description" | "category" | "icon" | "required" | "xpReward">;

const ACHIEVEMENTS: SeedAchievement[] = [
  {
    name: "Hello, World!",
    description: "Write your first program",
    category: "coding",
    icon: "FaCode",
    xpReward: 50,
  },
  {
    name: "Code Warrior",
    description: "Written 100 lines of code",
    category: "coding",
    required: 100,
    icon: "FaCode",
    xpReward: 100,
  },
  {
    name: "Script Artisan",
    description: "Written 1000 lines of code",
    category: "coding",
    required: 1000,
    icon: "FaCode",
    xpReward: 500,
  },

  // Language Mastery
  {
    name: "Polyglot",
    description: "Used 3 different programming languages",
    category: "languages",
    required: 3,
    icon: "FaGlobe",
    xpReward: 200,
  },
  {
    name: "TypeScript Titan",
    description: "Convert a JavaScript program to TypeScript",
    category: "languages",
    icon: "FaGlobe",
    xpReward: 150,
  },
  {
    name: "Rust Rookie",
    description: "Complete your first Rust program",
    category: "languages",
    icon: "FaGlobe",
    xpReward: 100,
  },

  // Problem Solving
  {
    name: "Bug Squasher",
    description: "Fix 5 errors in your code",
    category: "problem-solving",
    required: 5,
    icon: "FaPuzzlePiece",
    xpReward: 250,
  },
  {
    name: "Debug Master",
    description: "Use console.log or print statements in 10 different programs",
    category: "problem-solving",
    required: 10,
    icon: "FaPuzzlePiece",
    xpReward: 300,
  },

  // Social & Sharing
  {
    name: "Code Contributor",
    description: "Share your first code snippet",
    category: "social",
    icon: "FaUsers",
    xpReward: 100,
  },
  {
    name: "Community Champion",
    description: "Have your code snippet liked by 5 other users",
    category: "social",
    required: 5,
    icon: "FaUsers",
    xpReward: 300,
  },

  // Learning & Growth
  {
    name: "Theme Enthusiast",
    description: "Try all available themes",
    category: "learning",
    icon: "FaBook",
    xpReward: 50,
  },
  {
    name: "Night Owl",
    description: "Code for 2 hours between 10 PM and 5 AM",
    category: "learning",
    icon: "FaBook",
    xpReward: 150,
  },
  {
    name: "Consistent Coder",
    description: "Code for 7 consecutive days",
    category: "learning",
    required: 7,
    icon: "FaBook",
    xpReward: 500,
  },
];

export const seedAchievements = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing achievements
    const existingAchievements = await ctx.db.query("achievements").collect();
    for (const achievement of existingAchievements) {
      await ctx.db.delete(achievement._id);
    }

    // Insert new achievements
    for (const achievement of ACHIEVEMENTS) {
      await ctx.db.insert("achievements", achievement);
    }

    return { success: true, count: ACHIEVEMENTS.length };
  },
}); 