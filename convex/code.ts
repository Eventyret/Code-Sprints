import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";

interface CodeExecutionResult {
  executionId: Id<"codeExecutions">;
  xpResult: {
    xp: number;
    level: number;
    totalXp: number;
    xpGained: number;
    reason: string;
    leveledUp: boolean;
    previousLevel: number;
  };
}

export const executeCode = mutation({
  args: {
    userId: v.string(),
    code: v.string(),
    language: v.string(),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
    fixedError: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<CodeExecutionResult> => {
    // Record the code execution
    const executionId = await ctx.db.insert("codeExecutions", {
      userId: args.userId,
      code: args.code,
      language: args.language,
      output: args.output,
      error: args.error,
      timestamp: Date.now(),
    });

    // Check if this is the first execution of the day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const todaysExecutions = await ctx.db
      .query("codeExecutions")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .filter((q) => q.gte(q.field("timestamp"), startOfDay.getTime()))
      .collect();

    // Get previous execution to check for error fixes
    const previousExecution = await ctx.db
      .query("codeExecutions")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();

    // Award XP based on various conditions
    const isFirstOfDay = todaysExecutions.length === 1; // Since we just inserted one
    const hasFixedError = args.fixedError || (previousExecution?.error && !args.error);
    const isLongCode = args.code.length > 100; // Reward more complex code
    const usesAdvancedFeatures = args.code.includes("async") || 
                                args.code.includes("class") || 
                                args.code.includes("try") ||
                                args.code.includes("import");
    
    const usesFunctionalProgramming = args.code.includes("map(") || 
                                    args.code.includes("filter(") || 
                                    args.code.includes("reduce(");
    
    const usesRegex = args.code.includes("RegExp") || 
                     args.code.includes("/[") || 
                     args.code.includes(".test(") || 
                     args.code.includes(".match(");
    
    const usesComments = args.code.includes("//") || 
                        args.code.includes("/*") || 
                        args.code.includes("*/");
    
    // Base XP for running code
    const result = await ctx.runMutation(api.users.awardXP, {
      userId: args.userId,
      amount: 10,
      reason: "Running code",
    });

    // Bonus XP for first execution of the day
    if (isFirstOfDay) {
      await ctx.runMutation(api.users.awardXP, {
        userId: args.userId,
        amount: 50,
        reason: "First code execution of the day",
      });

      // Update streak
      await ctx.runMutation(api.streaks.checkAndUpdateStreak, {
        userId: args.userId,
      });
    }

    // Bonus XP for fixing errors
    if (hasFixedError) {
      await ctx.runMutation(api.users.awardXP, {
        userId: args.userId,
        amount: 15,
        reason: "Fixed a code error",
      });
    }

    // Bonus XP for writing complex code
    if (isLongCode) {
      await ctx.runMutation(api.users.awardXP, {
        userId: args.userId,
        amount: 5,
        reason: "Writing complex code",
      });
    }

    // Bonus XP for using advanced features
    if (usesAdvancedFeatures) {
      await ctx.runMutation(api.users.awardXP, {
        userId: args.userId,
        amount: 10,
        reason: "Using advanced programming features",
      });
    }

    // Bonus XP for using functional programming
    if (usesFunctionalProgramming) {
      await ctx.runMutation(api.users.awardXP, {
        userId: args.userId,
        amount: 15,
        reason: "Using functional programming concepts",
      });
    }

    // Bonus XP for using regex
    if (usesRegex) {
      await ctx.runMutation(api.users.awardXP, {
        userId: args.userId,
        amount: 10,
        reason: "Using regular expressions",
      });
    }

    // Small bonus for using comments (encouraging good practices)
    if (usesComments) {
      await ctx.runMutation(api.users.awardXP, {
        userId: args.userId,
        amount: 5,
        reason: "Writing code documentation",
      });
    }

    return {
      executionId,
      xpResult: result,
    };
  },
}); 