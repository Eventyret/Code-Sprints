import toast from "react-hot-toast";
import { type Achievement } from "./achievements";
import { AchievementNotification } from "@/components/AchievementNotification";

export function showAchievementToast(achievement: Achievement): void {
  toast.custom(
    (t) => <AchievementNotification t={t} achievement={achievement} />,
    {
      duration: 4000,
      position: "top-right",
    }
  );
} 