"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookText, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import CrawlProcessModal from "./CrawlProcessModal";
import { RawContentModal } from "./RawContentModal";
import CrawlLogViewerModal from "./CrawlLogViewerModal";
import { useCrawlManagement } from "@/lib/hooks/useCrawlManagement";
import { ManagedBookDetails, ManagedChapter } from "@/modules/book/book.types";

interface CrawlManagementPageProps {
  bookId: string;
  bookDetails: ManagedBookDetails;
  currentManagedChapters: ManagedChapter[];
}

export default function CrawlManagementPage({
  bookId,
  bookDetails,
  currentManagedChapters,
}: CrawlManagementPageProps) {
  const {
    showCrawlModal,
    showRawContentModal,
    selectedRawContent,
    crawlLog,
    isCrawlInProgress,
    isCrawlStoppedByParent,
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
    resetCrawlLog,
    triggerManualRefresh,
  } = useCrawlManagement({ bookId, currentManagedChapters });

  const [showCrawlLogViewerModal, setShowCrawlLogViewerModal] = useState(false); // NEW State

  return (
    <div className="flex flex-col flex-1 p-6 bg-surface-section text-text-primary">
      {/* Back Button */}
      <Link
        href={`/tai-khoan/truyen/${bookId}`}
        className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-4"
      >
        <ArrowLeft size={20} />
        Quay lại Quản lý Truyện
      </Link>

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-text-primary">
        Quản lý Crawl cho: {bookDetails.title}
      </h1>

      {/* Book Info Summary */}
      <div className="flex items-center gap-4 bg-bg-box p-4 rounded-lg shadow-md mb-8">
        <Image
          src={bookDetails.coverImageUrl || "/placeholder.jpg"}
          alt={bookDetails.title}
          width={80}
          height={120}
          className="object-cover rounded"
        />
        <div>
          <h2 className="text-xl font-semibold">{bookDetails.title}</h2>
          <p className="text-text-secondary">Tác giả: {bookDetails.author}</p>
          <p className="text-text-secondary">Nguồn: {bookDetails.source}</p>
          <p className="text-text-secondary">
            Tổng số chương đã quản lý: {totalManagedChapters}
          </p>
          <p className="text-text-secondary">
            Chương cuối đã cào: {lastCrawledChapterNumber}
          </p>
        </div>
      </div>

      {/* Crawl Control Section (includes Start Crawl Button and Log) */}
      <section className="bg-bg-box p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Điều khiển Cào dữ liệu
        </h2>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {isCrawlInProgress ? (
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-text-secondary">
                <Loader2 className="animate-spin" />
                Đang cào chương {currentCrawlingChapter?.number || "..."} (
                {crawledChapterResults.length}/{totalChaptersToCrawlThisSession}
                )...
              </div>
              <Button
                onClick={onStopCrawlByParent}
                disabled={isCrawlStoppedByParent}
                className="w-full px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors flex items-center justify-center gap-2 text-lg"
              >
                {isCrawlStoppedByParent ? "Đã dừng" : "Dừng Cào"}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleStartCrawlProcess}
              className="flex-1 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors flex items-center justify-center gap-2 text-lg"
            >
              Bắt đầu Cào
            </Button>
          )}
          <Button
            onClick={() => setShowCrawlLogViewerModal(true)}
            className="flex-1 px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-md transition-colors flex items-center justify-center gap-2 text-lg"
          >
            Xem Nhật ký Cào
          </Button>
        </div>
      </section>

      {/* Existing Chapters List */}
      <section className="bg-bg-box p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-4 flex justify-between items-center">
          <span>Danh sách Chương đã cào ({totalManagedChapters})</span>
          <Button
            onClick={triggerManualRefresh}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm"
          >
            Làm mới danh sách Chương
          </Button>
        </h2>
        {totalManagedChapters === 0 ? (
          <p className="text-text-muted">Chưa có chương nào được cào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-surface-raised">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                  >
                    Chương
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                  >
                    Tiêu đề
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                  >
                    Số từ
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                  >
                    URL gốc
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-right text-xs font-medium text-text-secondary uppercase tracking-wider"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {currentManagedChapters.map((chapter) => (
                  <tr key={chapter.id} className="hover:bg-surface-raised/50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-text-primary">
                      {chapter.chapterNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                      {chapter.title}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                      {chapter.totalWordsRaw || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary max-w-xs truncate">
                      <a
                        href={chapter.urlRaw || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {chapter.urlRaw || "N/A"}
                      </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleViewRawContent(chapter.title, chapter.id)
                        }
                        className="text-blue-400 hover:text-blue-300 p-1 rounded-md hover:bg-surface-raised transition-colors"
                        title="Xem nội dung Raw"
                      >
                        <BookText size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Crawl Process Modal */}
      {showCrawlModal && (
        <CrawlProcessModal
          bookId={bookId}
          bookDetails={bookDetails}
          currentManagedChapters={currentManagedChapters}
          onClose={handleCrawlComplete}
          onConfirmCrawl={handleConfirmCrawl}
          onCrawlStart={handleCrawlStart}
          lastCrawledChapterNumber={lastCrawledChapterNumber}
        />
      )}

      {/* Raw Content Viewer Modal */}
      {showRawContentModal && selectedRawContent && (
        <RawContentModal
          title={selectedRawContent.title}
          content={selectedRawContent.content}
          onClose={() => setShowRawContentModal(false)}
        />
      )}

      {/* Crawl Log Viewer Modal */}
      {showCrawlLogViewerModal && (
        <CrawlLogViewerModal
          bookTitle={bookDetails.title}
          onClose={() => setShowCrawlLogViewerModal(false)}
          crawlLog={crawlLog}
          crawledChapterResults={crawledChapterResults}
          currentCrawlingChapter={currentCrawlingChapter}
          rawChaptersTotal={totalChaptersToCrawlThisSession}
          isCrawlStoppedByParent={isCrawlStoppedByParent}
          resetCrawlLog={resetCrawlLog}
          isCrawlInProgress={isCrawlInProgress}
          crawlContentError={crawlContentError}
          onStopCrawl={onStopCrawlByParent}
        />
      )}
    </div>
  );
}
