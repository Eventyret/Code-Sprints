import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Achievement } from "./types";

export const awardAchievement = mutation({
  args: {
    userId: v.string(),
    achievementId: v.id("achievements"),
  },
  handler: async (ctx, { userId, achievementId }) => {
    // Check if user already has this achievement
    const existingAchievement = await ctx.db
      .query("userAchievements")
      .withIndex("by_user_id_and_achievement", (q) =>
        q.eq("userId", userId).eq("achievementId", achievementId)
      )
      .first();

    if (existingAchievement) {
      return existingAchievement;
    }

    // Award the achievement
    return await ctx.db.insert("userAchievements", {
      userId,
      achievementId,
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
  handler: async (ctx, { userId, achievementId, progress, required }) => {
    // Check if user already has this achievement
    const existingProgress = await ctx.db
      .query("achievementProgress")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("achievementId"), achievementId))
      .first();

    if (existingProgress) {
      // Update progress
      await ctx.db.patch(existingProgress._id, {
        progress,
      });

      // If progress meets requirement, award achievement
      if (progress >= required) {
        await ctx.db.insert("userAchievements", {
          userId,
          achievementId,
          earnedAt: Date.now(),
        });
      }

      return existingProgress;
    }

    // Create new progress entry
    return await ctx.db.insert("achievementProgress", {
      userId,
      achievementId,
      progress,
      required,
    });
  },
});

export const getUserAchievements = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const achievements = await ctx.db
      .query("userAchievements")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const progress = await ctx.db
      .query("achievementProgress")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    // Get the actual achievement details
    const achievementDetails = await Promise.all(
      achievements.map(async (ua) => {
        const achievement = await ctx.db.get(ua.achievementId);
        return achievement;
      })
    );

    return {
      achievements: achievementDetails.filter((a): a is Achievement => a !== null),
      earnedAt: Object.fromEntries(
        achievements.map((ua) => [ua.achievementId, ua.earnedAt])
      ),
      progress: Object.fromEntries(
        progress.map((p) => [p.achievementId, p.progress])
      ),
    };
  },
}); 