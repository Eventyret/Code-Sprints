"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { LANGUAGE_CONFIG } from "../_constants";
import { motion } from "framer-motion";
import { ChevronDown, Lock, Sparkles } from "lucide-react";
import useMounted from "@/hooks/useMounted";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiOpenjdk,
  SiGo,
  SiRust,
  SiCplusplus,
  SiSharp,
  SiRuby,
  SiSwift,
} from "react-icons/si";

const LANGUAGE_ICONS = {
  javascript: SiJavascript,
  typescript: SiTypescript,
  python: SiPython,
  java: SiOpenjdk,
  go: SiGo,
  rust: SiRust,
  cpp: SiCplusplus,
  csharp: SiSharp,
  ruby: SiRuby,
  swift: SiSwift,
};

function LanguageSelector({ hasAccess }: { hasAccess: boolean }) {
  const mounted = useMounted();
  const { language, setLanguage } = useCodeEditorStore();
  const currentLanguageObj = LANGUAGE_CONFIG[language];

  const handleLanguageSelect = (langId: string) => {
    if (!hasAccess && langId !== "javascript") return;
    setLanguage(langId);
  };

  if (!mounted) return null;

  const LanguageIcon = LANGUAGE_ICONS[language as keyof typeof LANGUAGE_ICONS];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`group relative flex items-center gap-3 px-4 py-2.5 bg-[#1e1e2e]/80 
            rounded-lg transition-all duration-200 border border-gray-800/50 hover:border-gray-700
            ${!hasAccess && language !== "javascript" ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {/* Decoration */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/5 
            rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-hidden="true"
          />

          <div className="size-6 rounded-md bg-gray-800/50 p-0.5 group-hover:scale-110 transition-transform">
            <LanguageIcon className="w-full h-full text-gray-300" />
          </div>

          <span className="text-gray-200 min-w-[80px] text-left group-hover:text-white transition-colors">
            {currentLanguageObj.label}
          </span>

          <ChevronDown
            className="size-4 text-gray-400 transition-all duration-300 group-hover:text-gray-300"
          />
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-64 bg-[#1e1e2e]/95 backdrop-blur-xl border-[#313244] py-2"
      >
        <div className="px-3 pb-2 mb-2 border-b border-gray-800/50">
          <p className="text-xs font-medium text-gray-400">Select Language</p>
        </div>

        <div className="max-h-[280px] overflow-y-auto overflow-x-hidden">
          {Object.values(LANGUAGE_CONFIG).map((lang) => {
            const isLocked = !hasAccess && lang.id !== "javascript";
            const Icon = LANGUAGE_ICONS[lang.id as keyof typeof LANGUAGE_ICONS];

            return (
              <DropdownMenuItem
                key={lang.id}
                disabled={isLocked}
                onSelect={() => handleLanguageSelect(lang.id)}
                className={`
                  relative group px-2 py-2 focus:bg-transparent
                  ${language === lang.id ? "bg-blue-500/10 text-blue-400" : "text-gray-300"}
                  ${isLocked ? "opacity-50" : "hover:bg-[#262637]"}
                `}
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className={`
                      relative size-8 rounded-lg p-1.5 group-hover:scale-110 transition-transform
                      ${language === lang.id ? "bg-blue-500/10" : "bg-gray-800/50"}
                    `}
                  >
                    <Icon className="w-full h-full" />
                  </div>

                  <span className="flex-1 text-left">{lang.label}</span>

                  {isLocked ? (
                    <Lock className="size-4 text-gray-500" />
                  ) : (
                    language === lang.id && (
                      <Sparkles className="size-4 text-blue-400 animate-pulse" />
                    )
                  )}
                </div>

                {language === lang.id && (
                  <motion.div
                    className="absolute inset-0 border-2 border-blue-500/30 rounded-lg pointer-events-none"
                    layoutId="selectedLanguage"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSelector;