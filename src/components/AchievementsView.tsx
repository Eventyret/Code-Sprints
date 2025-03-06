"use client";

import { ACHIEVEMENT_CATEGORIES } from "@/lib/achievements";
import { useQuery } from "convex/react";
import { type Achievement } from "../../convex/types";
import { motion } from "framer-motion";
import { Award, Trophy } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { getIconComponent, type IconName } from "@/types/icons";

interface AchievementsViewProps {
  userId: string;
}

export function AchievementsView({ userId }: AchievementsViewProps) {
  const achievementsData = useQuery(api.achievements.getUserAchievements, {
    userId,
  });

  if (!achievementsData) {
    return (
      <div className="min-h-screen bg-[#1e1e2e] text-gray-200 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <Trophy className="h-8 w-8 text-blue-400" />
            Loading achievements...
          </h1>
        </div>
      </div>
    );
  }

  const { achievements, earnedAt, progress } = achievementsData;

  return (
    <div className="min-h-screen bg-[#1e1e2e] text-gray-200 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Trophy className="h-8 w-8 text-blue-400" />
          Your Achievements
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ACHIEVEMENT_CATEGORIES.map((category) => {
            // Filter and ensure non-null achievements
            const categoryAchievements = achievements.filter(
              (a): a is NonNullable<typeof a> & Achievement =>
                a !== null && a.category === category.id
            );

            if (categoryAchievements.length === 0) {
              return null;
            }

            return (
              <div key={category.id} className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-400" />
                  {category.label}
                </h2>

                <div className="space-y-4">
                  {categoryAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative p-4 rounded-lg border ${
                        earnedAt[achievement._id]
                          ? "bg-blue-500/10 border-blue-500/20"
                          : "bg-gray-800/50 border-gray-700/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              earnedAt[achievement._id]
                                ? "bg-blue-500/20"
                                : "bg-gray-700/50"
                            }`}
                          >
                            {achievement.icon ? (
                              <div className="h-6 w-6">
                                {(() => {
                                  const IconComponent = getIconComponent(achievement.icon as IconName);
                                  return IconComponent ? <IconComponent className="h-6 w-6" /> : <Trophy className="h-6 w-6" />;
                                })()}
                              </div>
                            ) : (
                              <Trophy
                                className={`h-5 w-5 ${
                                  earnedAt[achievement._id]
                                    ? "text-blue-400"
                                    : "text-gray-500"
                                }`}
                              />
                            )}
                          </div>
                        </div>

                        <div>
                          <h3
                            className={`text-sm font-medium ${
                              earnedAt[achievement._id]
                                ? "text-blue-400"
                                : "text-gray-400"
                            }`}
                          >
                            {achievement.name}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">
                            {achievement.description}
                          </p>

                          {achievement.required && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>
                                  {progress[achievement._id] || 0}/
                                  {achievement.required}
                                </span>
                              </div>
                              <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-blue-500/50"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${
                                      ((progress[achievement._id] || 0) /
                                        achievement.required) *
                                      100
                                    }%`,
                                  }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                />
                              </div>
                            </div>
                          )}

                          {earnedAt[achievement._id] && (
                            <p className="mt-2 text-xs text-gray-500">
                              Earned{" "}
                              {new Date(
                                earnedAt[achievement._id]
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 