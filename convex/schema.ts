import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        userId: v.string(), // clerkId
        email: v.string(),
        name: v.string(),
        isPro: v.boolean(),
        proSince: v.optional(v.number()),
        customerId: v.optional(v.string()),
        orderId: v.optional(v.string()),
        xp: v.number(),
        level: v.number(),
        totalXp: v.number(),
      }).index("by_user_id", ["userId"]),
    
      codeExecutions: defineTable({
        userId: v.string(),
        language: v.string(),
        code: v.string(),
        output: v.optional(v.string()),
        error: v.optional(v.string()),
      }).index("by_user_id", ["userId"]),
    
      snippets: defineTable({
        userId: v.string(),
        title: v.string(),
        language: v.string(),
        code: v.string(),
        userName: v.string(), // store user's name for easy access
      }).index("by_user_id", ["userId"]),
    
      snippetComments: defineTable({
        snippetId: v.id("snippets"),
        userId: v.string(),
        userName: v.string(),
        content: v.string(), // This will store HTML content
      }).index("by_snippet_id", ["snippetId"]),
    
      stars: defineTable({
        userId: v.string(),
        snippetId: v.id("snippets"),
      })
        .index("by_user_id", ["userId"])
        .index("by_snippet_id", ["snippetId"])
        .index("by_user_id_and_snippet_id", ["userId", "snippetId"]),

  achievementTypes: defineTable({
    key: v.string(),
    name: v.string(),
    description: v.string(),
  }).index("by_key", ["key"]),

  levelRequirements: defineTable({
    level: v.number(),
    xpRequired: v.number(),
    rewards: v.array(v.object({
      type: v.string(),
      value: v.any(),
    })),
  }).index("by_level", ["level"]),

  achievements: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.string(),
    icon: v.string(), // Store the React Icons identifier
    required: v.optional(v.number()),
    xpReward: v.number(), // XP reward for earning this achievement
    progress: v.optional(v.number()),
    earnedAt: v.optional(v.number()),
  }).index("by_category", ["category"]),

  userAchievements: defineTable({
    userId: v.string(),
    achievementId: v.id("achievements"),
    earnedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_id_and_achievement", ["userId", "achievementId"]),

  achievementProgress: defineTable({
    userId: v.string(),
    achievementId: v.id("achievements"),
    progress: v.number(),
    required: v.number(),
  }).index("by_user_id", ["userId"]),

  userActivity: defineTable({
    userId: v.string(),
    date: v.string(),
    activityType: v.string(),
  }).index("by_user_id_and_date", ["userId", "date"]),

  streaks: defineTable({
    userId: v.string(),
    streakType: v.string(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastActivityDate: v.string(),
  }).index("by_user_id", ["userId"]),
});
