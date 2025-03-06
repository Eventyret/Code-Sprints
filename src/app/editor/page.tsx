"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ThemeSelector from "@/app/(root)/_components/ThemeSelector";
import LanguageSelector from "@/app/(root)/_components/LanguageSelector";
import Editor from "@monaco-editor/react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";

export default function EditorPage() {
  const { user } = useUser();
  const userId = user?.id;
  const saveExecution = useMutation(api.codeExecutions.saveExecution);
  const store = useCodeEditorStore();

  const handleRunCode = async () => {
    if (!userId) return;

    // Run code using the store's implementation
    await store.runCode();

    // If we have a result, save it to Convex
    const result = store.executionResult;
    if (result) {
      try {
        await saveExecution({
          language: store.language,
          code: result.code,
          executionResult: {
            code: result.code,
            output: result.output || "",
            error: result.error,
          }
        });
      } catch (error) {
        console.error("Failed to save execution:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <LanguageSelector
            value={store.language}
            onChange={store.setLanguage}
          />
          <ThemeSelector />
        </div>
        <button
          onClick={handleRunCode}
          disabled={store.isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {store.isRunning ? "Running..." : "Run Code"}
        </button>
      </div>
      <div className="flex-1 flex">
        {/* Editor Panel */}
        <div className="flex-1 border-r border-gray-800">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            language={store.language}
            theme={store.theme}
            onMount={store.setValue}
            options={{
              minimap: { enabled: false },
              fontSize: store.fontSize,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
        
        {/* Output Panel */}
        <div className="flex-1 bg-gray-900">
          <div className="p-4 h-full">
            <h2 className="text-sm font-medium text-gray-400 mb-2">Output</h2>
            <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap h-[calc(100%-2rem)] overflow-auto">
              {store.output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 