"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CrawledChapterResult } from "../../../modules/crawl/crawl.types";

interface CrawlProgressSectionProps {
  isCrawlInProgress: boolean;
  crawlContentError: string | null;
  crawledChapterResults: CrawledChapterResult[];
  currentCrawlingChapter: { number: number; url: string } | null;
  rawChaptersTotal: number;
  isCrawlStoppedByParent: boolean;
  onStopCrawl: () => void;
}

export const CrawlProgressSection: React.FC<CrawlProgressSectionProps> = ({
  isCrawlInProgress,
  crawlContentError,
  crawledChapterResults,
  currentCrawlingChapter,
  rawChaptersTotal,
  isCrawlStoppedByParent,
  onStopCrawl,
}) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {crawlContentError && (
        <div className="bg-red-500/20 text-red-500 p-3 rounded-md text-sm mb-4">
          {crawlContentError}
        </div>
      )}

      {isCrawlInProgress && (
        <div className="flex items-center gap-2 text-text-secondary mb-4">
          <Loader2 className="animate-spin" />
          {currentCrawlingChapter &&
            `Đang cào chương ${currentCrawlingChapter.number} (${crawledChapterResults.length}/${rawChaptersTotal})...`}
        </div>
      )}

      {/* Crawled Results */}
      {crawledChapterResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">
            Kết quả cào ({crawledChapterResults.length}/{rawChaptersTotal}):
          </h3>
          <div className="max-h-60 overflow-y-auto border border-surface-border rounded-md p-3 bg-surface-raised font-mono text-sm">
            {crawledChapterResults.map((result) => (
              <p key={result.chapter_id} className="text-text-secondary">
                [#{result.chapter_number}] {result.chapter_title_raw} (ID:{" "}
                {result.chapter_id})
              </p>
            ))}
          </div>
        </div>
      )}

      {isCrawlInProgress && (
        <div className="mt-4">
          <Button
            onClick={onStopCrawl}
            disabled={isCrawlStoppedByParent}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors"
          >
            {isCrawlStoppedByParent ? "Đã dừng" : "Dừng Cào"}
          </Button>
        </div>
      )}
    </div>
  );
};
