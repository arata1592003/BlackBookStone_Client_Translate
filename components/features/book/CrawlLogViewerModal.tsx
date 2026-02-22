"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col p-0 gap-0 bg-surface-card border-border-default overflow-hidden">
        <DialogHeader className="p-6 border-b border-border-default">
          <DialogTitle className="text-xl font-bold text-text-primary">
            Nhật ký Cào cho: {bookTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <CrawlProgressSection
            isCrawlInProgress={isCrawlInProgress}
            crawlContentError={crawlContentError}
            crawledChapterResults={crawledChapterResults}
            currentCrawlingChapter={currentCrawlingChapter}
            rawChaptersTotal={rawChaptersTotal}
            isCrawlStoppedByParent={isCrawlStoppedByParent}
            onStopCrawl={onStopCrawl}
            crawlLog={crawlLog}
            resetCrawlLog={resetCrawlLog}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CrawlLogViewerModal;
