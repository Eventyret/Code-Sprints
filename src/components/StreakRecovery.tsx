import { useUser } from "@clerk/nextjs";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStreaks } from "@/lib/services/streaks";

export default function StreakRecovery() {
  const { user } = useUser();
  const { streak } = useStreaks(user?.id || "");

  if (!streak || streak.currentStreak > 0) return null;

  const recoveryOptions = [
    {
      title: "Use Streak Freeze",
      description: "Use a streak freeze to maintain your streak (Pro feature)",
      action: "Use Freeze",
      isPro: true,
    },
    {
      title: "Complete Challenge",
      description: "Complete today's challenge to recover your streak",
      action: "Start Challenge",
      href: "/learn/challenges/daily",
    },
    {
      title: "Code Practice",
      description: "Write and run some code to recover your streak",
      action: "Start Coding",
      href: "/editor",
    },
  ];

  return (
    <Card className="bg-red-950/10 border-red-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          Streak at Risk!
        </CardTitle>
        <CardDescription>
          Your coding streak is about to end. Take action now to maintain it!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recoveryOptions.map((option) => (
            <div
              key={option.title}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-800/50"
            >
              <div>
                <h3 className="font-medium text-white">{option.title}</h3>
                <p className="text-sm text-gray-400">{option.description}</p>
              </div>
              <Button
                variant={option.isPro ? "outline" : "secondary"}
                size="sm"
                asChild={!option.isPro}
                className={option.isPro ? "border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20" : ""}
              >
                {option.href ? (
                  <a href={option.href}>{option.action}</a>
                ) : (
                  option.action
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-400">
        Complete any of these actions before midnight to maintain your streak.
      </CardFooter>
    </Card>
  );
} 