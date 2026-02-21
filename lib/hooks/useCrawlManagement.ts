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

    const chaptersToProcess = recrawlAll
      ? chaptersToCrawl
      : chaptersToCrawl.filter(
          (chapter) => chapter.chapter_number > lastCrawledChapterNumber,
        );

    setTotalChaptersToCrawlThisSession(chaptersToProcess.length); // Set total for this session

    setCrawlLog((prev) => [
      ...prev,
      `Bắt đầu cào ${chaptersToProcess.length} chương. (Tổng số chương gốc: ${chaptersToCrawl.length})`,
    ]);

    for (const chapter of chaptersToProcess) {
      console.log(`Checking stop signal for chapter ${chapter.chapter_number}. stopCrawlRef.current: ${stopCrawlRef.current}`);
      if (stopCrawlRef.current) {
        setCrawlLog((prev) => [...prev, "Quá trình cào đã bị dừng."]);
        console.log(`Crawl stopped for chapter ${chapter.chapter_number}. Breaking loop.`);
        break;
      }


      setCurrentCrawlingChapter({
        number: chapter.chapter_number,
        url: chapter.chapter_url,
      }); // Set current crawling chapter
      setCrawlContentError(null); // Clear previous content error

      setCrawlLog((prev) => [
        ...prev,
        `Đang cào chương ${chapter.chapter_number} (${chapter.chapter_url})...`,
      ]);
      try {
        const result = await crawlChapterContentAction(
          bookId,
          chapter.chapter_number,
          chapter.chapter_url,
        );

        if (result.success && result.chapter_id) {
          successCount++;
          const newResult: CrawledChapterResult = {
            chapter_id: result.chapter_id,
            chapter_number: result.chapter_number!,
            chapter_title_raw: result.chapter_title_raw!,
          };
          setCrawledChapterResults((prev) => [...prev, newResult]); // Add to crawled results
          setCrawlLog((prev) => [
            ...prev,
            `✅ Cào thành công chương ${result.chapter_number}: ${result.chapter_title_raw} (ID: ${result.chapter_id})`,
          ]);
        } else {
          errorCount++;
          const errorMessage = result.error || "Không xác định.";
          setCrawlContentError(
            `Lỗi chương ${chapter.chapter_number}: ${errorMessage}`,
          ); // Set content error
          setCrawlLog((prev) => [
            ...prev,
            `❌ Lỗi cào chương ${chapter.chapter_number}: ${errorMessage}`,
          ]);
        }
      } catch (error: any) {
        errorCount++;
        const errorMessage = error.message || "Không xác định.";
        setCrawlContentError(
          `Lỗi không xác định chương ${chapter.chapter_number}: ${errorMessage}`,
        ); // Set content error
        setCrawlLog((prev) => [
            ...prev,
            `❌ Lỗi không xác định khi cào chương ${chapter.chapter_number}: ${errorMessage}`,
          ]);
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