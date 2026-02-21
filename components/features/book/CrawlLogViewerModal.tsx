"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CrawlProgressSection } from "./CrawlProgressSection";
import { CrawledChapterResult } from "@/modules/crawl/crawl.types";

interface CrawlLogViewerModalProps {
  bookTitle: string;
  onClose: () => void;
  crawlLog: string[];
  crawledChapterResults: CrawledChapterResult[];
  currentCrawlingChapter: { number: number; url: string } | null;
  rawChaptersTotal: number;
  isCrawlStoppedByParent: boolean;
  resetCrawlLog: () => void;
  isCrawlInProgress: boolean;
  crawlContentError: string | null;
  onStopCrawl: () => void;
}

const CrawlLogViewerModal: React.FC<CrawlLogViewerModalProps> = ({
  bookTitle,
  onClose,
  crawlLog,
  crawledChapterResults,
  currentCrawlingChapter,
  rawChaptersTotal,
  isCrawlStoppedByParent,
  resetCrawlLog,
  isCrawlInProgress,
  crawlContentError,
  onStopCrawl,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative bg-bg-box text-text-primary rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-surface-border">
          <h2 className="text-xl font-bold">Nhật ký Cào cho: {bookTitle}</h2>
          <Button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-hover transition-colors"
            title="Đóng"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Modal Content */}
        <CrawlProgressSection
          isCrawlInProgress={isCrawlInProgress} // Will likely be false for viewer, but passed for consistency
          crawlContentError={crawlContentError}
          crawledChapterResults={crawledChapterResults}
          currentCrawlingChapter={currentCrawlingChapter}
          rawChaptersTotal={rawChaptersTotal}
          isCrawlStoppedByParent={isCrawlStoppedByParent}
          onStopCrawl={onStopCrawl}
          crawlLog={crawlLog}
          resetCrawlLog={resetCrawlLog}
        />

        {/* Modal Footer */}
        <div className="flex justify-end p-4 border-t border-surface-border">
          <Button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CrawlLogViewerModal;
