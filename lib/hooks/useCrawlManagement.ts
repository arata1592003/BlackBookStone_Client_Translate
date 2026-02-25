import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChapterRaw, CrawledChapterResult } from "@/modules/crawl/crawl.types";
import { crawlChapterContentAction } from "@/app/actions/crawl";
import { getChapterContentAction } from "@/app/actions/book";
import { ManagedChapter } from "@/modules/book/book.types";

interface UseCrawlManagementProps {
  bookId: string;
  currentManagedChapters: ManagedChapter[];
}

export const useCrawlManagement = ({
  bookId,
  currentManagedChapters,
}: UseCrawlManagementProps) => {
  const router = useRouter();
  const [showCrawlModal, setShowCrawlModal] = useState(false);
  const [showRawContentModal, setShowRawContentModal] = useState(false);
  const [selectedRawContent, setSelectedRawContent] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const [crawlLog, setCrawlLog] = useState<string[]>([]);
  const [crawledChapterResults, setCrawledChapterResults] = useState<
    CrawledChapterResult[]
  >([]);
  const [currentCrawlingChapter, setCurrentCrawlingChapter] = useState<{
    number: number;
    url: string;
  } | null>(null);
  const [crawlContentError, setCrawlContentError] = useState<string | null>(
    null,
  );
  const [isCrawlInProgress, setIsCrawlInProgress] = useState(false);

  // NEW: Ref for immediate stop signal, and state for UI feedback
  const stopCrawlRef = useRef(false);
  const [hasCrawlBeenStoppedForUI, setHasCrawlBeenStoppedForUI] = useState(false);

  const [totalChaptersToCrawlThisSession, setTotalChaptersToCrawlThisSession] =
    useState(0);

  const totalManagedChapters = currentManagedChapters.length;
  const lastCrawledChapterNumber =
    totalManagedChapters > 0
      ? Math.max(...currentManagedChapters.map((c) => c.chapterNumber))
      : 0;

  const handleStartCrawlProcess = () => {
    setShowCrawlModal(true);
    stopCrawlRef.current = false; // Reset ref state when starting
    setHasCrawlBeenStoppedForUI(false); // Reset UI state
  };

  const handleCrawlComplete = () => {
    setShowCrawlModal(false);
  };

  const handleCrawlStart = () => {
    setIsCrawlInProgress(true);
    setCrawlLog([]);
    setCrawledChapterResults([]); // Reset
    setCurrentCrawlingChapter(null); // Reset
    setCrawlContentError(null); // Reset
    stopCrawlRef.current = false; // Ensure ref is false when crawl starts
    setHasCrawlBeenStoppedForUI(false); // Ensure UI state is false when crawl starts
    setTotalChaptersToCrawlThisSession(0); // Reset for new session
  };

  const onStopCrawlByParent = () => {
    console.log("onStopCrawlByParent called: Setting stopCrawlRef.current to true");
    stopCrawlRef.current = true; // Update ref for immediate check
    setHasCrawlBeenStoppedForUI(true); // Update state for UI feedback
  };

  const resetCrawlLog = () => {
    setCrawlLog([]);
    setCrawledChapterResults([]);
    setCurrentCrawlingChapter(null);
    setCrawlContentError(null);
    setTotalChaptersToCrawlThisSession(0);
    setHasCrawlBeenStoppedForUI(false);
  };

  const triggerManualRefresh = () => {
    router.refresh();
  };

  const handleConfirmCrawl = async (
    chaptersToCrawl: ChapterRaw[],
    recrawlAll: boolean,
  ) => {
    let successCount = 0;
    let errorCount = 0;

    const chaptersToProcess = chaptersToCrawl; // Use the list as-is from the modal

    setTotalChaptersToCrawlThisSession(chaptersToProcess.length);

    setCrawlLog((prev) => [
      ...prev,
      `Bắt đầu cào ${chaptersToProcess.length} chương. (Tổng số chương gốc: ${chaptersToCrawl.length})`,
    ]);

    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // 2 seconds

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const chapter of chaptersToProcess) {
      if (stopCrawlRef.current) {
        setCrawlLog((prev) => [...prev, "Quá trình cào đã bị dừng."]);
        break;
      }

      setCurrentCrawlingChapter({
        number: chapter.chapter_number,
        url: chapter.chapter_url,
      });
      setCrawlContentError(null);

      let attempt = 0;
      let isSuccess = false;

      while (attempt < MAX_RETRIES && !isSuccess && !stopCrawlRef.current) {
        attempt++;
        const attemptPrefix = attempt > 1 ? `[Thử lại lần ${attempt - 1}] ` : "";
        
        setCrawlLog((prev) => [
          ...prev,
          `${attemptPrefix}Đang cào chương ${chapter.chapter_number}...`,
        ]);

        try {
          const result = await crawlChapterContentAction(
            bookId,
            chapter.chapter_number,
            chapter.chapter_url,
          );

          if (result.success && result.chapter_id) {
            successCount++;
            isSuccess = true;
            const newResult: CrawledChapterResult = {
              chapter_id: result.chapter_id,
              chapter_number: result.chapter_number!,
              chapter_title_raw: result.chapter_title_raw!,
            };
            setCrawledChapterResults((prev) => [...prev, newResult]);
            setCrawlLog((prev) => [
              ...prev,
              `✅ Thành công chương ${result.chapter_number}: ${result.chapter_title_raw}`,
            ]);
          } else {
            const errorMessage = result.error || "Không xác định.";
            if (attempt < MAX_RETRIES && !stopCrawlRef.current) {
              setCrawlLog((prev) => [...prev, `⚠️ Lỗi: ${errorMessage}. Thử lại sau ${RETRY_DELAY/1000}s...`]);
              await sleep(RETRY_DELAY);
            } else {
              errorCount++;
              setCrawlContentError(`Lỗi chương ${chapter.chapter_number}: ${errorMessage}`);
              setCrawlLog((prev) => [...prev, `❌ Thất bại sau ${attempt} lần thử: ${errorMessage}`]);
            }
          }
        } catch (error: any) {
          const errorMessage = error.message || "Không xác định.";
          if (attempt < MAX_RETRIES && !stopCrawlRef.current) {
            setCrawlLog((prev) => [...prev, `⚠️ Lỗi kết nối: ${errorMessage}. Thử lại sau ${RETRY_DELAY/1000}s...`]);
            await sleep(RETRY_DELAY);
          } else {
            errorCount++;
            setCrawlContentError(`Lỗi không xác định chương ${chapter.chapter_number}: ${errorMessage}`);
            setCrawlLog((prev) => [...prev, `❌ Lỗi hệ thống sau ${attempt} lần thử: ${errorMessage}`]);
          }
        }
      }
    }
    setCurrentCrawlingChapter(null); // Clear current crawling chapter after loop
    setCrawlLog((prev) => [
      ...prev,
      `--- Quá trình cào hoàn tất. Thành công: ${successCount}, Lỗi: ${errorCount} ---`,
    ]);
    setIsCrawlInProgress(false);
    handleCrawlComplete(); // Call handleCrawlComplete when the crawl finishes
  };

  const handleViewRawContent = async (
    chapterTitle: string,
    chapterId: string,
  ) => {
    const { success, data, error } = await getChapterContentAction(chapterId);

    if (success && data && data.contentRaw) {
      setSelectedRawContent({ title: chapterTitle, content: data.contentRaw });
      setShowRawContentModal(true);
    } else {
      console.error("Failed to fetch raw content:", error);
      setSelectedRawContent({
        title: chapterTitle,
        content: error || "Không thể tải nội dung raw.",
      });
      setShowRawContentModal(true);
    }
  };

  return {
    showCrawlModal,
    showRawContentModal,
    selectedRawContent,
    crawlLog,
    isCrawlInProgress,
    isCrawlStoppedByParent: hasCrawlBeenStoppedForUI, // Expose hasCrawlBeenStoppedForUI as isCrawlStoppedByParent for external components
    totalManagedChapters,
    lastCrawledChapterNumber,
    handleStartCrawlProcess,
    handleCrawlComplete,
    handleCrawlStart,
    handleConfirmCrawl,
    handleViewRawContent,
    setShowRawContentModal,
    onStopCrawlByParent,
    crawledChapterResults,
    currentCrawlingChapter,
    crawlContentError,
    totalChaptersToCrawlThisSession,
    resetCrawlLog, // NEW
    triggerManualRefresh, // NEW
  };
};