import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    isPro: v.boolean(),
    proSince: v.optional(v.number()),
    customerId: v.optional(v.string()),
    orderId: v.optional(v.string()),
    streakFreezes: v.number(),
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
    userName: v.string(),
  }).index("by_user_id", ["userId"]),

  snippetComments: defineTable({
    snippetId: v.id("snippets"),
    userId: v.string(),
    userName: v.string(),
    content: v.string(),
  }).index("by_snippet_id", ["snippetId"]),

  stars: defineTable({
    userId: v.string(),
    snippetId: v.id("snippets"),
  }).index("by_user_id", ["userId"])
    .index("by_snippet_id", ["snippetId"])
    .index("by_user_id_and_snippet_id", ["userId", "snippetId"]),

  achievementTypes: defineTable({
    key: v.string(),
    name: v.string(),
    description: v.string(),
  }).index("by_key", ["key"]),

  achievements: defineTable({
    key: v.string(),
    name: v.string(),
    description: v.string(),
    icon: v.optional(v.string()),
    typeId: v.id("achievementTypes"),
  }).index("by_key", ["key"])
    .index("by_type_id", ["typeId"]),

  userAchievements: defineTable({
    userId: v.string(),
    achievementId: v.id("achievements"),
    earnedAt: v.number(),
  }).index("by_user_id", ["userId"])
    .index("by_achievement_id", ["achievementId"])
    .index("by_user_id_and_achievement", ["userId", "achievementId"]),

  achievementProgress: defineTable({
    userId: v.string(),
    achievementId: v.id("achievements"),
    progress: v.number(),
    required: v.number(),
  }).index("by_user_id", ["userId"])
    .index("by_achievement_id", ["achievementId"]),

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
