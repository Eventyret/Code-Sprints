"use client";

import { useUser } from "@clerk/nextjs";
import Editor from "@monaco-editor/react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import ThemeSelector from "@/app/(root)/_components/ThemeSelector";
import LanguageSelector from "@/app/(root)/_components/LanguageSelector";
import RunButton from "@/app/(root)/_components/RunButton";

export default function EditorPage() {
  const store = useCodeEditorStore();

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
        <RunButton />
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