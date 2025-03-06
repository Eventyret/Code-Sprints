import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { STREAK_MILESTONES, StreakMilestone } from "../constants/streakMilestones";

export interface StreakData {
  currentStreak: number;
  lastActiveDate: string;
  longestStreak: number;
  totalDays: number;
  lastMilestoneAwarded?: number;
}

export class StreakService {
  private static readonly STREAK_KEY = 'user_streak';
  private static readonly ONE_DAY = 24 * 60 * 60 * 1000; // 1 day in milliseconds

  /**
   * Check if the streak is still valid and update it
   * @param lastActiveDate The last date the user was active
   * @returns boolean indicating if the streak is still valid
   */
  static isStreakValid(lastActiveDate: string): boolean {
    const lastActive = new Date(lastActiveDate).getTime();
    const now = new Date().getTime();
    const timeDiff = now - lastActive;
    
    // Streak is valid if less than 48 hours have passed since last activity
    return timeDiff < (this.ONE_DAY * 2);
  }

  /**
   * Calculate the number of days between two dates
   */
  static getDaysBetween(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(diffTime / this.ONE_DAY);
  }

  /**
   * Check if two dates are the same calendar day
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Get the next milestone for a given streak
   */
  static getNextMilestone(currentStreak: number, lastMilestoneAwarded: number = 0): StreakMilestone | null {
    return STREAK_MILESTONES.find(milestone => 
      milestone.days > lastMilestoneAwarded && milestone.days <= currentStreak
    ) || null;
  }

  /**
   * Update the user's streak
   * @param userId The user's ID
   * @param currentStreak Current streak data
   * @returns Updated streak data
   */
  static async updateStreak(userId: string, currentStreak: StreakData): Promise<StreakData> {
    const now = new Date();
    const lastActive = new Date(currentStreak.lastActiveDate);

    // If it's the same day, no need to update
    if (this.isSameDay(now, lastActive)) {
      return currentStreak;
    }

    // If the streak is broken (more than 1 day gap)
    if (!this.isStreakValid(currentStreak.lastActiveDate)) {
      return {
        currentStreak: 1,
        lastActiveDate: now.toISOString(),
        longestStreak: currentStreak.longestStreak || 1,
        totalDays: (currentStreak.totalDays || 0) + 1,
        lastMilestoneAwarded: 0 // Reset milestone tracking on broken streak
      };
    }

    // Increment streak if it's a new day
    const newCurrentStreak = currentStreak.currentStreak + 1;
    const newLongestStreak = Math.max(newCurrentStreak, currentStreak.longestStreak || 0);

    return {
      currentStreak: newCurrentStreak,
      lastActiveDate: now.toISOString(),
      longestStreak: newLongestStreak,
      totalDays: (currentStreak.totalDays || 0) + 1,
      lastMilestoneAwarded: currentStreak.lastMilestoneAwarded
    };
  }

  /**
   * Initialize streak data for a new user
   */
  static initializeStreak(): StreakData {
    return {
      currentStreak: 1,
      lastActiveDate: new Date().toISOString(),
      longestStreak: 1,
      totalDays: 1,
      lastMilestoneAwarded: 0
    };
  }
}

/**
 * Hook to manage user streaks
 */
export function useStreaks(userId: string) {
  const streak = useQuery(api.streaks.getCurrentStreak, { userId });
  const streakStatus = useQuery(api.streaks.getStreakStatus, { userId });
  const updateStreakMutation = useMutation(api.streaks.updateStreak);
  const recoverStreakMutation = useMutation(api.streaks.recoverStreak);
  const updateUserXP = useMutation(api.users.updateXP);
  const addAchievement = useMutation(api.achievements.awardAchievement);

  const checkAndUpdateStreak = async () => {
    if (!streak || !userId) return;

    const updatedStreak = await StreakService.updateStreak(userId, streak);
    
    // Check for new milestones
    if (updatedStreak.currentStreak > (streak.lastMilestoneAwarded || 0)) {
      const nextMilestone = StreakService.getNextMilestone(
        updatedStreak.currentStreak,
        streak.lastMilestoneAwarded
      );

      if (nextMilestone) {
        // Award XP
        await updateUserXP({
          userId,
          xp: nextMilestone.xpReward,
          reason: `Streak milestone: ${nextMilestone.title}`
        });

        // Award achievement
        await addAchievement({
          userId,
          achievementKey: nextMilestone.achievementKey
        });

        // Update the last milestone awarded
        updatedStreak.lastMilestoneAwarded = nextMilestone.days;
      }
    }

    if (updatedStreak.currentStreak !== streak.currentStreak) {
      await updateStreakMutation({ userId, streak: updatedStreak });
    }
  };

  const recoverStreak = async (method: "freeze" | "challenge" | "practice") => {
    if (!userId) return;

    try {
      await recoverStreakMutation({
        userId,
        method,
      });
      
      // Refresh streak data
      await checkAndUpdateStreak();
      
      return {
        success: true,
        message: "Streak recovered successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to recover streak",
      };
    }
  };

  return {
    streak,
    streakStatus,
    checkAndUpdateStreak,
    recoverStreak,
    isAtRisk: streakStatus?.isAtRisk || false,
    hoursRemaining: streakStatus?.hoursRemaining || 0,
  };
} 