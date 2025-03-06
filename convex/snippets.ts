import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { api } from "./_generated/api";

export const saveSnippet = mutation({
  args: {
    userId: v.string(),
    code: v.string(),
    language: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Save the snippet
    const snippetId = await ctx.db.insert("snippets", {
      userId: args.userId,
      code: args.code,
      language: args.language,
      title: args.title,
      description: args.description,
      createdAt: Date.now(),
    });

    // Award XP for saving a snippet
    await ctx.runMutation(api.users.awardXP, {
      userId: args.userId,
      amount: 25,
      reason: "Saved a code snippet",
    });

    return snippetId;
  },
}); 