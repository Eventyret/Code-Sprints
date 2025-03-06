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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const mounted = useMounted();
  const { language, setLanguage } = useCodeEditorStore();
  const currentLanguageObj = LANGUAGE_CONFIG[language];

  const handleLanguageSelect = (langId: string) => {
    setLanguage(langId);
  };

  if (!mounted) return null;

  const LanguageIcon = LANGUAGE_ICONS[language as keyof typeof LANGUAGE_ICONS];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-800/50">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="javascript">JavaScript</SelectItem>
        <SelectItem value="typescript">TypeScript</SelectItem>
        <SelectItem value="python">Python</SelectItem>
        <SelectItem value="java">Java</SelectItem>
        <SelectItem value="csharp">C#</SelectItem>
        <SelectItem value="cpp">C++</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default LanguageSelector;