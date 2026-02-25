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
  currentManagedChapters,
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

        const existingChapterNumbers = new Set(
          currentManagedChapters.map((ch) => ch.chapterNumber)
        );

        const filtered = result.chapters.filter((chapter) => {
          if (recrawlAll) return true;
          return !existingChapterNumbers.has(chapter.chapter_number);
        });

        setChaptersToCrawl(filtered);

        if (result.chapters.length > 0) {
          if (recrawlAll) {
            setChapterListMessage(`Sẵn sàng cào lại toàn bộ ${result.chapters.length} chương.`);
          } else {
            const newChapters = result.chapters.filter(ch => ch.chapter_number > lastCrawledChapterNumber).length;
            const missingChapters = filtered.length - newChapters;
            
            let message = `Tìm thấy ${result.chapters.length} chương gốc. Total: ${filtered.length} chương cần cào.`;
            if (missingChapters > 0) {
              message += ` (Bao gồm ${missingChapters} chương bị thiếu/lỗi trước đó và ${newChapters} chương mới).`;
            } else {
              message += ` (${newChapters} chương mới).`;
            }
            setChapterListMessage(message);
          }
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
