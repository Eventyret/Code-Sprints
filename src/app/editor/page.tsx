"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import ThemeSelector from "@/app/(root)/_components/ThemeSelector";
import LanguageSelector from "@/app/(root)/_components/LanguageSelector";
import { showXPGain } from "@/lib/xp";
import Editor from "@monaco-editor/react";

export default function EditorPage() {
  const { user } = useUser();
  const userId = user?.id;
  const runCode = useMutation(api.code.executeCode);
  const [editorContent, setEditorContent] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  const handleRunCode = async () => {
    if (!userId) return;

    try {
      const result = await runCode({
        userId,
        code: editorContent,
        language: selectedLanguage,
        output: null,
        error: null,
      });

      // Show XP notifications
      if (result.xpResult) {
        showXPGain({
          amount: result.xpResult.xpGained,
          reason: result.xpResult.reason,
          levelUp: result.xpResult.leveledUp,
          newLevel: result.xpResult.level,
        });
      }
    } catch (error) {
      console.error("Failed to run code:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <LanguageSelector
            value={selectedLanguage}
            onChange={setSelectedLanguage}
          />
          <ThemeSelector />
        </div>
        <button
          onClick={handleRunCode}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Run Code
        </button>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          language={selectedLanguage}
          theme="vs-dark"
          onChange={(value) => setEditorContent(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
} 