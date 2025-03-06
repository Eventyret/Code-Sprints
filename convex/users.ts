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
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db.query("users")
      .filter(q => q.eq(q.field("userId"), args.userId)).first();
    
    if(!existingUser) {
      // Generate default avatar if none provided
      const imageUrl = args.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${args.userId}`;
      
      await ctx.db.insert("users", {
        userId: args.userId,
        email: args.email,
        name: args.name,
        imageUrl,
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
      ...user,
      xp: remainingXP,
      level: newLevel,
      totalXp: user.totalXp + args.xp,
      leveledUp: newLevel > currentLevel,
      previousLevel: currentLevel,
    };
  },
});

export const updateXP = mutation({
  args: {
    userId: v.string(),
    xp: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    return await addXP(ctx, { userId: args.userId, xp: args.xp });
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

export const createUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existingUser) {
      return existingUser;
    }

    // Create new user
    await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      isPro: false,
      xp: 0,
      level: 1,
      totalXp: 0,
    });

    return {
      userId: args.userId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      isPro: false,
      xp: 0,
      level: 1,
      totalXp: 0,
      leveledUp: false,
      previousLevel: 1,
    };
  },
});

export const migrateUserAvatars = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    for (const user of users) {
      if (!user.imageUrl) {
        // Generate a default avatar URL using DiceBear
        const defaultImageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userId}`;
        
        await ctx.db.patch(user._id, {
          imageUrl: defaultImageUrl,
        });
      }
    }
    
    return { success: true, usersUpdated: users.length };
  },
});

export const awardXP = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Calculate new level based on XP
    const currentXP = user.xp || 0;
    const currentLevel = user.level;
    const newXP = currentXP + args.amount;
    const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
    const leveledUp = newLevel > currentLevel;

    // Update user's XP and level
    await ctx.db.patch(user._id, {
      xp: newXP,
      level: newLevel,
      totalXp: (user.totalXp || 0) + args.amount,
    });

    return {
      xp: newXP,
      level: newLevel,
      totalXp: (user.totalXp || 0) + args.amount,
      xpGained: args.amount,
      reason: args.reason,
      leveledUp,
      previousLevel: currentLevel,
    };
  },
});
