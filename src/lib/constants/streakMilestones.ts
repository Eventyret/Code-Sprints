export interface StreakMilestone {
  days: number;
  xpReward: number;
  achievementKey: string;
  title: string;
  description: string;
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    days: 3,
    xpReward: 100,
    achievementKey: "streak_3_days",
    title: "Getting Started",
    description: "Maintained a 3-day coding streak"
  },
  {
    days: 7,
    xpReward: 250,
    achievementKey: "streak_7_days",
    title: "Weekly Warrior",
    description: "Maintained a 7-day coding streak"
  },
  {
    days: 14,
    xpReward: 500,
    achievementKey: "streak_14_days",
    title: "Fortnight Fighter",
    description: "Maintained a 14-day coding streak"
  },
  {
    days: 30,
    xpReward: 1000,
    achievementKey: "streak_30_days",
    title: "Monthly Master",
    description: "Maintained a 30-day coding streak"
  },
  {
    days: 50,
    xpReward: 2000,
    achievementKey: "streak_50_days",
    title: "Coding Champion",
    description: "Maintained a 50-day coding streak"
  },
  {
    days: 100,
    xpReward: 5000,
    achievementKey: "streak_100_days",
    title: "Century Coder",
    description: "Maintained a 100-day coding streak"
  },
  {
    days: 365,
    xpReward: 20000,
    achievementKey: "streak_365_days",
    title: "Year of Code",
    description: "Maintained a 365-day coding streak"
  }
]; 