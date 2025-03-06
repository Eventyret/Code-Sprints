import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Achievement } from "./types";

export const getUserAchievements = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userAchievements = await ctx.db
      .query("userAchievements")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    // Get the full achievement details for each earned achievement
    const achievements = await Promise.all(
      userAchievements.map(async (ua) => {
        const achievement = await ctx.db.get(ua.achievementId);
        return {
          ...achievement,
          earnedAt: ua.earnedAt,
          _id: ua.achievementId,
        };
      })
    );

    return achievements;
  },
});

export const getAchievementProgress = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("achievementProgress")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    // Get the full achievement details for each progress entry
    const progressWithDetails = await Promise.all(
      progress.map(async (p) => {
        const achievement = await ctx.db.get(p.achievementId);
        return {
          ...achievement,
          progress: p.progress,
          required: p.required,
          _id: p.achievementId,
        };
      })
    );

    return progressWithDetails;
  },
});

export const awardAchievement = mutation({
  args: {
    userId: v.string(),
    achievementId: v.id("achievements"),
  },
  handler: async (ctx, args) => {
    // Check if user already has this achievement
    const existing = await ctx.db
      .query("userAchievements")
      .withIndex("by_user_id_and_achievement", (q) =>
        q
          .eq("userId", args.userId)
          .eq("achievementId", args.achievementId)
      )
      .first();

    if (existing) return existing._id;

    // Award the achievement
    return await ctx.db.insert("userAchievements", {
      userId: args.userId,
      achievementId: args.achievementId,
      earnedAt: Date.now(),
    });
  },
});

export const updateAchievementProgress = mutation({
  args: {
    userId: v.string(),
    achievementId: v.id("achievements"),
    progress: v.number(),
    required: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if user already has this achievement progress
    const existing = await ctx.db
      .query("achievementProgress")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("achievementId"), args.achievementId))
      .first();

    if (existing) {
      // Update progress
      await ctx.db.patch(existing._id, {
        progress: args.progress,
      });

      // If progress meets requirement, award achievement
      if (args.progress >= args.required) {
        await ctx.db.insert("userAchievements", {
          userId: args.userId,
          achievementId: args.achievementId,
          earnedAt: Date.now(),
        });
      }

      return existing._id;
    }

    // Create new progress entry
    return await ctx.db.insert("achievementProgress", {
      userId: args.userId,
      achievementId: args.achievementId,
      progress: args.progress,
      required: args.required,
    });
  },
}); 