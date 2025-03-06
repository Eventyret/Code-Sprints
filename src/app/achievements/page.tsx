import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AchievementsView } from "@/components/AchievementsView";

export default async function AchievementsPage() {
  const session = await auth();

  if (!session.userId) {
    redirect("/sign-in");
  }

  return <AchievementsView userId={session.userId} />;
} 