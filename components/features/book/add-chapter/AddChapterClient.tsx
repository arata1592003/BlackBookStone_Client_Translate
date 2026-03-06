"use client";

import { useState } from "react";
import { 
  FileText, 
  Files, 
  Scissors, 
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddSingleChapter } from "./AddSingleChapter";
import { AddMultipleChapters } from "./AddMultipleChapters";
import { AddSplitFile } from "./AddSplitFile";

type AddMode = "single" | "multiple" | "split";

interface AddChapterClientProps {
  bookId: string;
  nextChapterNumber: number;
}

export const AddChapterClient = ({ bookId, nextChapterNumber }: AddChapterClientProps) => {
  const [mode, setMode] = useState<AddMode>("single");

  const modes = [
    {
      id: "single" as const,
      title: "Thêm 1 chương",
      description: "Nhập text thủ công cho từng chương một.",
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      id: "multiple" as const,
      title: "Nhiều file / ZIP",
      description: "Tải lên danh sách file txt/docx hoặc file .zip.",
      icon: Files,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      id: "split" as const,
      title: "Tách từ 1 file",
      description: "Hệ thống tự động chia nhỏ từ 1 file lớn.",
      icon: Scissors,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "flex flex-col items-start p-6 rounded-2xl border-2 transition-all text-left relative overflow-hidden group",
              mode === m.id 
                ? "bg-surface-card border-primary shadow-lg shadow-primary/5" 
                : "bg-surface-card border-border-default hover:border-primary/30"
            )}
          >
            <div className={cn("p-3 rounded-xl mb-4 transition-colors", m.bg, m.color)}>
              <m.icon size={24} />
            </div>
            <h3 className={cn("font-bold text-lg mb-1", mode === m.id ? "text-primary" : "text-text-primary")}>
              {m.title}
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              {m.description}
            </p>
            
            {mode === m.id && (
              <div className="absolute top-4 right-4 text-primary">
                <CheckCircle2 size={20} />
              </div>
            )}
            
            <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <m.icon size={80} />
            </div>
          </button>
        ))}
      </div>

      {/* Render Active Component */}
      <div className="bg-surface-card border border-border-default rounded-3xl shadow-xl overflow-hidden min-h-[500px]">
        {mode === "single" && (
          <AddSingleChapter 
            bookId={bookId} 
            nextChapterNumber={nextChapterNumber} 
          />
        )}
        {mode === "multiple" && (
          <AddMultipleChapters 
            bookId={bookId} 
            nextChapterNumber={nextChapterNumber} 
          />
        )}
        {mode === "split" && (
          <AddSplitFile 
            bookId={bookId} 
            nextChapterNumber={nextChapterNumber} 
          />
        )}
      </div>
    </div>
  );
};
