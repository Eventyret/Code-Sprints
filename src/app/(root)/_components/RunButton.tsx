"use client";

import { getExecutionResult, useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, Play } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import useMounted from "@/hooks/useMounted";
import { useStreaks } from "@/lib/services/streaks";
import { showXPGain } from "@/components/xp";

function RunButton() {
  const { user } = useUser();
  const { runCode, language, isRunning } = useCodeEditorStore();
  const saveExecution = useMutation(api.codeExecutions.saveExecution);
  const awardXP = useMutation(api.users.awardXP);
  const { streak, checkAndUpdateStreak } = useStreaks(user?.id || "");
  const mounted = useMounted();

  // Add this to ensure XP data is always up to date
  useQuery(api.users.getUserProgress, { userId: user?.id || "" });

  const handleRun = async () => {
    await runCode();
    const result = getExecutionResult();

    if (user && result) {
      try {
        // Save execution to Convex
        await saveExecution({
          language,
          code: result.code,
          executionResult: {
            code: result.code,
            output: result.output || "",
            error: result.error,
          }
        });

        // Check if it's first execution of the day before awarding XP
        const wasCodedToday = streak?.hasCodedToday;
        await checkAndUpdateStreak();

        // Award XP for running code
        const xpResult = await awardXP({
          userId: user.id,
          amount: 10,
          reason: "Running code"
        });

        // Show XP notification
        showXPGain({
          amount: 10,
          reason: "Running code",
          levelUp: xpResult.leveledUp,
          newLevel: xpResult.level
        });
        
        // If this is the first execution of the day, award bonus XP
        if (!wasCodedToday) {
          const dailyXpResult = await awardXP({
            userId: user.id,
            amount: 50,
            reason: "Daily coding bonus"
          });

          showXPGain({
            amount: 50,
            reason: "Daily coding bonus",
            levelUp: dailyXpResult.leveledUp,
            newLevel: dailyXpResult.level
          });
        }
      } catch (error) {
        console.error("Error saving execution:", error);
      }
    }
  };

  const buttonContent = (
    <>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl opacity-100 transition-opacity group-hover:opacity-90" />
      <div className="relative flex items-center gap-2.5">
        {isRunning ? (
          <>
            <div className="relative">
              <Loader2 className="w-4 h-4 animate-spin text-white/70" />
              <div className="absolute inset-0 blur animate-pulse" />
            </div>
            <span className="text-sm font-medium text-white/90">Executing...</span>
          </>
        ) : (
          <>
            <div className="relative flex items-center justify-center w-4 h-4">
              <Play className="w-4 h-4 text-white/90 transition-transform group-hover:scale-110 group-hover:text-white" />
            </div>
            <span className="text-sm font-medium text-white/90 group-hover:text-white">
              Run Code
            </span>
          </>
        )}
      </div>
    </>
  );

  const buttonClassName = `
    group relative inline-flex items-center gap-2.5 px-5 py-2.5
    disabled:cursor-not-allowed
    focus:outline-none
  `;

  if (!mounted) {
    return (
      <button
        disabled
        className={buttonClassName}
      >
        {buttonContent}
      </button>
    );
  }

  return (
    <motion.button
      onClick={handleRun}
      disabled={isRunning}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={buttonClassName}
    >
      {buttonContent}
    </motion.button>
  );
}

export default RunButton;