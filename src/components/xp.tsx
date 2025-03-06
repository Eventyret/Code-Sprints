import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import toast, { Toast } from "react-hot-toast";

interface XPGainProps {
  amount: number;
  reason: string;
  levelUp?: boolean;
  newLevel?: number;
}

export function XPToast({ t, amount, reason, levelUp, newLevel }: XPGainProps & { t: Toast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.6 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.6 }}
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-[#1e1e2e]/95 backdrop-blur-xl shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="flex-shrink-0 bg-yellow-500/10 rounded-full px-2 py-0.5"
              >
                <p className="text-sm font-medium text-yellow-400">+{amount} XP</p>
              </motion.div>
            </div>
            <p className="mt-1 text-sm text-gray-300">{reason}</p>
            {levelUp && (
              <motion.p 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-1 text-sm text-purple-400"
              >
                🎉 Level Up! You&apos;re now level {newLevel}!
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function showXPGain({ amount, reason, levelUp, newLevel }: XPGainProps) {
  toast.custom(
    (t) => (
      <XPToast
        t={t}
        amount={amount}
        reason={reason}
        levelUp={levelUp}
        newLevel={newLevel}
      />
    ),
    {
      duration: 4000,
      position: "top-right",
    }
  );
} 