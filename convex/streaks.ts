import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCurrentStreak = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const streak = await ctx.db
      .query("streaks")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!streak) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date().toISOString().split('T')[0],
      };
    }

    return streak;
  },
});

export const updateStreak = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split('T')[0];
    const streak = await ctx.db
      .query("streaks")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!streak) {
      // Create new streak
      return await ctx.db.insert("streaks", {
        userId: args.userId,
        streakType: "daily",
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
      });
    }

    const lastDate = new Date(streak.lastActivityDate);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let newCurrentStreak = streak.currentStreak;
    
    if (diffDays === 1) {
      // Consecutive day
      newCurrentStreak += 1;
    } else if (diffDays > 1) {
      // Streak broken
      newCurrentStreak = 1;
    }
    // If diffDays === 0, same day, keep current streak

    const newLongestStreak = Math.max(newCurrentStreak, streak.longestStreak);

    return await ctx.db.patch(streak._id, {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastActivityDate: today,
    });
  },
}); 