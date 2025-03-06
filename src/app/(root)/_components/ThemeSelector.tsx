"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { motion } from "framer-motion";
import { CircleOff, Cloud, Laptop, Moon, Palette, Sun } from "lucide-react";
import React from "react";
import { SiGithub } from "react-icons/si";
import { THEMES } from "../_constants";
import dynamic from "next/dynamic";

const THEME_ICONS: Record<string, React.ReactNode> = {
  "vs-dark": <Moon className="size-4" />,
  "vs-light": <Sun className="size-4" />,
  "github-dark": <SiGithub className="size-4" />,
  monokai: <Laptop className="size-4" />,
  "solarized-dark": <Cloud className="size-4" />,
};

function ThemeSelectorComponent() {
  const { theme, setTheme } = useCodeEditorStore();
  const currentTheme = THEMES.find((t) => t.id === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-48 group relative flex items-center gap-2 px-4 py-2.5 bg-[#1e1e2e]/80 hover:bg-[#262637] 
          rounded-lg transition-all duration-200 border border-gray-800/50 hover:border-gray-700"
        >
          {/* hover state bg decorator */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />

          <Palette className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors" />

          <span className="text-gray-300 min-w-[80px] text-left group-hover:text-white transition-colors">
            {currentTheme?.label}
          </span>

          {/* color indicator */}
          <div
            className="relative w-4 h-4 rounded-full border border-gray-600 group-hover:border-gray-500 transition-colors"
            style={{ background: currentTheme?.color }}
          />
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-full min-w-[240px] bg-[#1e1e2e]/95 backdrop-blur-xl border-[#313244] py-2"
      >
        <div className="px-2 pb-2 mb-2 border-b border-gray-800/50">
          <p className="text-xs font-medium text-gray-400 px-2">Select Theme</p>
        </div>

        {THEMES.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onSelect={() => setTheme(t.id)}
            className={`
              relative group px-2 py-2 focus:bg-transparent
              ${theme === t.id ? "bg-blue-500/10 text-blue-400" : "text-gray-300"}
              hover:bg-[#262637]
            `}
          >
            <div className="flex items-center gap-3 w-full">
              {/* icon */}
              <div
                className={`
                  flex items-center justify-center size-8 rounded-lg
                  ${theme === t.id ? "bg-blue-500/10 text-blue-400" : "bg-gray-800/50 text-gray-400"}
                  group-hover:scale-110 transition-all duration-200
                `}
              >
                {THEME_ICONS[t.id] || <CircleOff className="w-4 h-4" />}
              </div>

              {/* label */}
              <span className="flex-1 text-left group-hover:text-white transition-colors">
                {t.label}
              </span>

              {/* color indicator */}
              <div
                className="relative size-4 rounded-full border border-gray-600 
                group-hover:border-gray-500 transition-colors"
                style={{ background: t.color }}
              />
            </div>

            {/* active theme border */}
            {theme === t.id && (
              <motion.div
                className="absolute inset-0 border-2 border-blue-500/30 rounded-lg pointer-events-none"
                layoutId="selectedTheme"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const ThemeSelector = dynamic(() => Promise.resolve(ThemeSelectorComponent), {
  ssr: false,
});

export default ThemeSelector;