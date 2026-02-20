"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookText, Loader2 } from "lucide-react";
import { ManagedBookDetails, ManagedChapter } from "@/modules/book/book.types";
import { Button } from "@/components/ui/Button";
import { RawContentModal } from "@/components/features/book/RawContentModal";
import CrawlProcessModal from "@/components/features/book/CrawlProcessModal";
import { useCrawlManagement } from "@/lib/hooks/useCrawlManagement";

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
  } = useCrawlManagement({ bookId, currentManagedChapters });

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
        <Button
          onClick={handleStartCrawlProcess}
          disabled={isCrawlInProgress}
          className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors flex items-center justify-center gap-2 text-lg"
        >
          {isCrawlInProgress ? (
            <>
              <Loader2 className="animate-spin" /> Đang cào...
            </>
          ) : (
            "Bắt đầu Cào"
          )}
        </Button>

        {/* Crawl Log */}
        {crawlLog.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Nhật ký Cào:</h3>
            <div className="max-h-60 overflow-y-auto border border-surface-border rounded-md p-3 bg-surface-raised font-mono text-sm">
              {crawlLog.map((logEntry, index) => (
                <p key={index} className="text-text-secondary">
                  {logEntry}
                </p>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Existing Chapters List */}
      <section className="bg-bg-box p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Danh sách Chương đã cào ({totalManagedChapters})
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
          isCrawlInProgress={isCrawlInProgress}
          crawlLog={crawlLog}
          isCrawlStoppedByParent={isCrawlStoppedByParent}
          onStopCrawlByParent={onStopCrawlByParent}
          totalManagedChapters={totalManagedChapters}
          lastCrawledChapterNumber={lastCrawledChapterNumber}
          crawledChapterResults={crawledChapterResults}
          currentCrawlingChapter={currentCrawlingChapter}
          crawlContentError={crawlContentError}
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
    </div>
  );
}
