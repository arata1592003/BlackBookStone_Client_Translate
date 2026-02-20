"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChapterRaw } from "../../../modules/crawl/crawl.types";

interface CrawlConfirmationSectionProps {
  isFetchingChapterList: boolean;
  chapterListError: string | null;
  chapterListMessage: string | null;
  recrawlAll: boolean;
  setRecrawlAll: (value: boolean) => void;
  chaptersToCrawl: ChapterRaw[];
  rawChaptersFound: ChapterRaw[];
  onStartCrawl: () => void;
  onRecrawlAll: () => void;
}

export const CrawlConfirmationSection: React.FC<
  CrawlConfirmationSectionProps
> = ({
  isFetchingChapterList,
  chapterListError,
  chapterListMessage,
  recrawlAll,
  setRecrawlAll,
  chaptersToCrawl,
  rawChaptersFound,
  onStartCrawl,
  onRecrawlAll,
}) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Messages */}
      {chapterListError && (
        <div className="bg-red-500/20 text-red-500 p-3 rounded-md text-sm mb-4">
          {chapterListError}
        </div>
      )}
      {chapterListMessage && (
        <div className="bg-blue-500/20 text-blue-500 p-3 rounded-md text-sm mb-4">
          {chapterListMessage}
        </div>
      )}

      {isFetchingChapterList && (
        <div className="flex items-center gap-2 text-text-secondary mb-4">
          <Loader2 className="animate-spin" />
          Đang lấy danh sách chương gốc...
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 mt-6">
        <label className="flex items-center gap-2 cursor-pointer text-text-secondary mb-4">
          <input
            type="checkbox"
            checked={recrawlAll}
            onChange={(e) => setRecrawlAll(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600 rounded"
            disabled={isFetchingChapterList}
          />
          Cào lại toàn bộ (bao gồm cả các chương đã cào)
        </label>
        <Button
          onClick={onStartCrawl}
          disabled={isFetchingChapterList || chaptersToCrawl.length === 0}
          className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md transition-colors"
        >
          Tiếp tục Cào ({chaptersToCrawl.length} chương mới)
        </Button>
        <Button
          onClick={onRecrawlAll}
          disabled={isFetchingChapterList || rawChaptersFound.length === 0}
          className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-md transition-colors"
        >
          Cào lại toàn bộ ({rawChaptersFound.length} chương)
        </Button>
      </div>
    </div>
  );
};
