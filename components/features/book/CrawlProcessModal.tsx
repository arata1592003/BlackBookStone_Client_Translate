"use client";

import React, { useState } from "react";
import { Loader2, X } from "lucide-react";
import { fetchRawChaptersAction } from "@/app/actions/crawl";
import { ManagedBookDetails, ManagedChapter } from "@/modules/book/book.types";
import { Button } from "@/components/ui/Button";
import { ChapterRaw, CrawledChapterResult } from "@/modules/crawl/crawl.types";
import { CrawlConfirmationSection } from "./CrawlConfirmationSection";
import { CrawlProgressSection } from "./CrawlProgressSection";

interface CrawlProcessModalProps {
  bookId: string;
  bookDetails: ManagedBookDetails;
  currentManagedChapters: ManagedChapter[];
  onClose: () => void;
  onConfirmCrawl: (chaptersToCrawl: ChapterRaw[], recrawlAll: boolean) => void;
  onCrawlStart: () => void;
  isCrawlInProgress: boolean;
  crawlLog: string[];
  isCrawlStoppedByParent: boolean;
  onStopCrawlByParent: () => void;
  totalManagedChapters: number;
  lastCrawledChapterNumber: number;
  crawledChapterResults: CrawledChapterResult[];
  currentCrawlingChapter: { number: number; url: string } | null;
  crawlContentError: string | null;
}

const CrawlProcessModal: React.FC<CrawlProcessModalProps> = ({
  bookId,
  bookDetails,
  onClose,
  onConfirmCrawl,
  onCrawlStart,
  isCrawlInProgress,
  isCrawlStoppedByParent,
  onStopCrawlByParent,
  lastCrawledChapterNumber,
  crawledChapterResults,
  currentCrawlingChapter,
  crawlContentError,
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

  const handleStopCrawlProcess = () => {
    onStopCrawlByParent();
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative bg-bg-box text-text-primary rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-surface-border">
          <h2 className="text-xl font-bold">
            Xác nhận quá trình Cào dữ liệu cho: {bookDetails.title}
          </h2>
          <Button
            onClick={handleCloseModal}
            className="p-2 rounded-full hover:bg-surface-hover transition-colors"
            title="Đóng"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Modal Content */}
        {isCrawlInProgress ? (
          <CrawlProgressSection
            isCrawlInProgress={isCrawlInProgress}
            crawlContentError={crawlContentError}
            crawledChapterResults={crawledChapterResults}
            currentCrawlingChapter={currentCrawlingChapter}
            isCrawlStoppedByParent={isCrawlStoppedByParent}
            onStopCrawl={handleStopCrawlProcess}
            rawChaptersTotal={rawChaptersFound.length}
          />
        ) : (
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
        )}

        {/* Modal Footer */}
        <div className="flex justify-end p-4 border-t border-surface-border">
          <Button
            onClick={handleCloseModal}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
          >
            Hủy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CrawlProcessModal;
