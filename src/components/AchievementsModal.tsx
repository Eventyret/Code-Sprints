import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Award, Trophy } from "lucide-react";
import { getIconComponent, type IconName } from "@/types/icons";
import { type Achievement } from "../../convex/types";

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

const categories = [
  { id: "coding", label: "Coding Milestones" },
  { id: "languages", label: "Language Mastery" },
  { id: "problem-solving", label: "Problem Solving" },
  { id: "social", label: "Social & Sharing" },
  { id: "learning", label: "Learning & Growth" },
];

export function AchievementsModal({ isOpen, onClose, achievements }: AchievementsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#1e1e2e]/95 backdrop-blur-xl border-[#313244]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className="h-5 w-5 text-blue-400" />
            Achievements
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Award className="h-4 w-4" />
                {category.label}
              </h3>

              <div className="space-y-2">
                {achievements
                  .filter((achievement) => achievement.category === category.id)
                  .map((achievement) => {
                    const IconComponent = getIconComponent(achievement.icon as IconName) || Trophy;
                    return (
                      <motion.div
                        key={achievement._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`relative p-4 rounded-lg border ${
                          achievement.earnedAt
                            ? "bg-blue-500/10 border-blue-500/20"
                            : "bg-gray-800/50 border-gray-700/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                achievement.earnedAt
                                  ? "bg-blue-500/20"
                                  : "bg-gray-700/50"
                              }`}
                            >
                              <IconComponent
                                className={`h-5 w-5 ${
                                  achievement.earnedAt
                                    ? "text-blue-400"
                                    : "text-gray-500"
                                }`}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4
                                className={`text-sm font-medium ${
                                  achievement.earnedAt
                                    ? "text-blue-400"
                                    : "text-gray-400"
                                }`}
                              >
                                {achievement.name}
                              </h4>
                              <span className="text-xs text-yellow-400">
                                +{achievement.xpReward} XP
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              {achievement.description}
                            </p>

                            {achievement.progress !== undefined && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                  <span>Progress</span>
                                  <span>
                                    {achievement.progress}/{achievement.required}
                                  </span>
                                </div>
                                <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-blue-500/50"
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${(achievement.progress! / achievement.required!) * 100}%`,
                                    }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                  />
                                </div>
                              </div>
                            )}

                            {achievement.earnedAt && (
                              <p className="mt-2 text-xs text-gray-500">
                                Earned{" "}
                                {new Date(achievement.earnedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 