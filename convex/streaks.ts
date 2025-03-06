import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCurrentStreak = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const streak = await ctx.db
      .query("streaks")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    // Get today's code execution
    const today = new Date().toISOString().split('T')[0];
    const hasCodedToday = await ctx.db
      .query("codeExecutions")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.gte(q.field("_creationTime"), new Date(today).getTime())
        )
      )
      .first();

    return {
      ...streak,
      hasCodedToday: !!hasCodedToday,
    };
  },
});

export const checkAndUpdateStreak = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const streak = await ctx.db
      .query("streaks")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Check if user has coded today
    const todaysExecution = await ctx.db
      .query("codeExecutions")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.gte(q.field("_creationTime"), new Date(today).getTime())
        )
      )
      .first();

    if (!todaysExecution) {
      return { hasCodedToday: false };
    }

    if (!streak) {
      // Create new streak
      const newStreak = {
        userId: args.userId,
        currentStreak: 1,
        lastActiveDate: today,
        longestStreak: 1,
        totalDays: 1,
        lastMilestoneAwarded: 0
      };
      const newStreakId = await ctx.db.insert("streaks", newStreak);
      return { hasCodedToday: true, currentStreak: 1 };
    }

    const lastActive = new Date(streak.lastActiveDate);
    const daysSinceLastActive = Math.floor(
      (now.getTime() - lastActive.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (daysSinceLastActive === 0) {
      // Already updated today
      return { 
        hasCodedToday: true, 
        currentStreak: streak.currentStreak 
      };
    }

    if (daysSinceLastActive === 1) {
      // Consecutive day, increment streak
      const newStreak = streak.currentStreak + 1;
      await ctx.db.patch(streak._id, {
        currentStreak: newStreak,
        lastActiveDate: today,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        totalDays: streak.totalDays + 1,
      });
      return { 
        hasCodedToday: true, 
        currentStreak: newStreak 
      };
    }

    // Streak broken, reset to 1
    await ctx.db.patch(streak._id, {
      currentStreak: 1,
      lastActiveDate: today,
      longestStreak: streak.longestStreak,
      totalDays: streak.totalDays + 1,
    });
    return { 
      hasCodedToday: true, 
      currentStreak: 1 
    };
  },
});

export const updateStreak = mutation({
  args: {
    userId: v.string(),
    streak: v.object({
      currentStreak: v.number(),
      lastActiveDate: v.string(),
      longestStreak: v.number(),
      totalDays: v.number(),
      lastMilestoneAwarded: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const existingStreak = await ctx.db
      .query("streaks")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existingStreak) {
      await ctx.db.patch(existingStreak._id, args.streak);
      return existingStreak._id;
    }

    const newStreakId = await ctx.db.insert("streaks", {
      userId: args.userId,
      ...args.streak,
    });

    return newStreakId;
  },
});

export const recoverStreak = mutation({
  args: {
    userId: v.string(),
    method: v.string(), // "freeze" | "challenge" | "practice"
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) return null;

    const streak = await ctx.db
      .query("streaks")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!streak) return null;

    // If using streak freeze, verify user is Pro
    if (args.method === "freeze" && !user.isPro) {
      throw new Error("Streak freeze is a Pro feature");
    }

    // Update streak data
    const now = new Date();
    await ctx.db.patch(streak._id, {
      lastActiveDate: now.toISOString(),
      currentStreak: Math.max(1, streak.currentStreak), // Ensure streak is at least 1
    });

    // Log recovery attempt
    await ctx.db.insert("userActivity", {
      userId: args.userId,
      date: now.toISOString(),
      activityType: `streak_recovery_${args.method}`,
    });

    return {
      success: true,
      message: "Streak recovered successfully",
    };
  },
});

export const getStreakStatus = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const streak = await ctx.db
      .query("streaks")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!streak) return null;

    const now = new Date();
    const lastActive = new Date(streak.lastActiveDate);
    const timeDiff = now.getTime() - lastActive.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    return {
      streak,
      isAtRisk: hoursDiff > 20, // Warn if no activity in last 20 hours
      hoursRemaining: Math.max(0, 48 - hoursDiff), // Grace period remaining
    };
  },
}); 