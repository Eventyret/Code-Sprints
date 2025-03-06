import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

type User = Doc<"users">;

interface UserProgress extends Pick<User, "level" | "xp" | "totalXp"> {
  nextLevelXp: number;
  progress: number;
}

interface UserWithLevelUp extends User {
  leveledUp: boolean;
  previousLevel: number;
}

export const syncUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db.query("users")
      .filter(q => q.eq(q.field("userId"), args.userId)).first();
    if(!existingUser) {
      await ctx.db.insert("users", {
        userId: args.userId,
        email: args.email,
        name: args.name,
        isPro: false,
        xp: 0,
        level: 1,
        totalXp: 0,
      });
    }
  },
});

export const getUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    if(!args.userId) return null;

    const user = await ctx.db.query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();
    
    return user;
  },
});

export const addXP = mutation({
  args: {
    userId: v.string(),
    xp: v.number(),
  },
  handler: async (ctx, args): Promise<UserWithLevelUp | null> => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) return null;

    const currentXP = user.xp + args.xp;
    const currentLevel = user.level;
    const xpForNextLevel = currentLevel * 1000;

    let newLevel = currentLevel;
    let remainingXP = currentXP;

    // Check if user leveled up
    if (currentXP >= xpForNextLevel) {
      newLevel = currentLevel + 1;
      remainingXP = currentXP - xpForNextLevel;
    }

    const patch = {
      xp: remainingXP,
      level: newLevel,
      totalXp: user.totalXp + args.xp,
    };

    await ctx.db.patch(user._id, patch);

    return {
      _id: user._id,
      _creationTime: user._creationTime,
      userId: user.userId,
      email: user.email,
      name: user.name,
      isPro: user.isPro,
      xp: remainingXP,
      level: newLevel,
      totalXp: user.totalXp + args.xp,
      leveledUp: newLevel > currentLevel,
      previousLevel: currentLevel,
    };
  },
});

export const getUserProgress = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args): Promise<UserProgress | null> => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) return null;

    const xpForNextLevel = user.level * 1000;
    const progress = (user.xp / xpForNextLevel) * 100;

    return {
      level: user.level,
      xp: user.xp,
      totalXp: user.totalXp,
      nextLevelXp: xpForNextLevel,
      progress,
    };
  },
});
