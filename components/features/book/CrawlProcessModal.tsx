"use client";

import React, { useState } from "react";
import { fetchRawChaptersAction } from "@/app/actions/crawl";
import { ManagedBookDetails, ManagedChapter } from "@/modules/book/book.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChapterRaw } from "@/modules/crawl/crawl.types";
import { CrawlConfirmationSection } from "./CrawlConfirmationSection";

interface CrawlProcessModalProps {
  bookId: string;
  bookDetails: ManagedBookDetails;
  currentManagedChapters: ManagedChapter[];
  onClose: () => void;
  onConfirmCrawl: (chaptersToCrawl: ChapterRaw[], recrawlAll: boolean) => void;
  onCrawlStart: () => void;
  lastCrawledChapterNumber: number;
}

const CrawlProcessModal: React.FC<CrawlProcessModalProps> = ({
  bookId,
  bookDetails,
  onClose,
  onConfirmCrawl,
  onCrawlStart,
  lastCrawledChapterNumber,
}) => {
  const [isFetchingChapterList, setIsFetchingChapterList] = useState(false);
  const [chapterListError, setChapterListError] = useState<string | null>(null);
  const [rawChaptersFound, setRawChaptersFound] = useState<ChapterRaw[]>([]);
  const [chaptersToCrawl, setChaptersToCrawl] = useState<ChapterRaw[]>([]);
  const [chapterListMessage, setChapterListMessage] = useState<string | null>(
    null,
  );
  const [recrawlAll, setRecrawlAll] = useState(false);

  const fetchRawChaptersAndPrepare = async () => {
    setIsFetchingChapterList(true);
    setChapterListError(null);
    setChapterListMessage(null);
    setRawChaptersFound([]);
    setChaptersToCrawl([]);
    try {
      const result = await fetchRawChaptersAction(bookId);
      if (result.success && result.chapters) {
        setRawChaptersFound(result.chapters);

        const effectiveLastCrawledChapterNumber = recrawlAll
          ? 0
          : lastCrawledChapterNumber;

        const filtered = result.chapters.filter(
          (chapter) =>
            chapter.chapter_number > effectiveLastCrawledChapterNumber,
        );
        setChaptersToCrawl(filtered);

        if (result.chapters.length > 0) {
          setChapterListMessage(
            `Tìm thấy ${result.chapters.length} chương gốc. Có ${filtered.length} chương mới cần cào (từ chương ${
              effectiveLastCrawledChapterNumber + 1
            }).`,
          );
        } else {
          setChapterListMessage("Không tìm thấy chương gốc nào.");
        }
      } else {
        setChapterListError(result.error || "Không thể lấy danh sách chương.");
      }
    } catch (error: any) {
      setChapterListError(error.message || "Lỗi không xác định.");
    } finally {
      setIsFetchingChapterList(false);
    }
  };

  React.useEffect(() => {
    fetchRawChaptersAndPrepare();
  }, [recrawlAll]);

  const handleConfirmStartCrawl = (
    confirmedChapters: ChapterRaw[],
    confirmedRecrawlAll: boolean,
  ) => {
    onConfirmCrawl(confirmedChapters, confirmedRecrawlAll);
    onCrawlStart();
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col p-0 gap-0 bg-surface-card border-border-default overflow-hidden">
        <DialogHeader className="p-6 border-b border-border-default">
          <DialogTitle className="text-xl font-bold text-text-primary">
            Xác nhận Cào dữ liệu cho: {bookDetails.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <CrawlConfirmationSection
            isFetchingChapterList={isFetchingChapterList}
            chapterListError={chapterListError}
            chapterListMessage={chapterListMessage}
            recrawlAll={recrawlAll}
            setRecrawlAll={setRecrawlAll}
            chaptersToCrawl={chaptersToCrawl}
            rawChaptersFound={rawChaptersFound}
            onStartCrawl={() => handleConfirmStartCrawl(chaptersToCrawl, false)}
            onRecrawlAll={() => handleConfirmStartCrawl(rawChaptersFound, true)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CrawlProcessModal;
