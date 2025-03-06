import { Button } from "@/components/ui/button";
import { Code2, Trophy, Target, BookMarked } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid gap-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/editor">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-auto p-6 flex flex-col items-center gap-3 bg-gray-900/50 border-gray-800/50 hover:border-blue-500/50 hover:bg-blue-500/10"
            >
              <Code2 className="w-8 h-8" />
              <div className="text-center">
                <h3 className="font-semibold">Code Editor</h3>
                <p className="text-sm text-gray-400">Write and run code</p>
              </div>
            </Button>
          </Link>

          <Link href="/achievements">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-auto p-6 flex flex-col items-center gap-3 bg-gray-900/50 border-gray-800/50 hover:border-yellow-500/50 hover:bg-yellow-500/10"
            >
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div className="text-center">
                <h3 className="font-semibold">Achievements</h3>
                <p className="text-sm text-gray-400">View your progress</p>
              </div>
            </Button>
          </Link>

          <Link href="/challenges">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-auto p-6 flex flex-col items-center gap-3 bg-gray-900/50 border-gray-800/50 hover:border-green-500/50 hover:bg-green-500/10"
            >
              <Target className="w-8 h-8 text-green-500" />
              <div className="text-center">
                <h3 className="font-semibold">Challenges</h3>
                <p className="text-sm text-gray-400">Daily coding tasks</p>
              </div>
            </Button>
          </Link>

          <Link href="/snippets">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-auto p-6 flex flex-col items-center gap-3 bg-gray-900/50 border-gray-800/50 hover:border-purple-500/50 hover:bg-purple-500/10"
            >
              <BookMarked className="w-8 h-8 text-purple-500" />
              <div className="text-center">
                <h3 className="font-semibold">Snippets</h3>
                <p className="text-sm text-gray-400">Browse community code</p>
              </div>
            </Button>
          </Link>
        </div>

        {/* Recent Activity or Featured Content can go here */}
      </div>
    </div>
  );
}