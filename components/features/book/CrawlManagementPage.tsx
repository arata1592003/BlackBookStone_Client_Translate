"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookText, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CrawlProcessModal from "./CrawlProcessModal";
import { RawContentModal } from "./RawContentModal";
import CrawlLogViewerModal from "./CrawlLogViewerModal";
import { useCrawlManagement } from "@/lib/hooks/useCrawlManagement";
import { ManagedBookDetails, ManagedChapter } from "@/modules/book/book.types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <div className="flex items-center gap-4 bg-surface-card p-4 rounded-lg shadow-md mb-8">
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
      <section className="bg-surface-card p-6 rounded-lg shadow-md mb-8">
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
                className="w-full px-8 py-4 bg-destructive hover:bg-destructive/90 text-foreground font-bold rounded-md transition-colors flex items-center justify-center gap-2 text-lg"
              >
                {isCrawlStoppedByParent ? "Đã dừng" : "Dừng Cào"}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleStartCrawlProcess}
              className="flex-1 px-8 py-4 bg-primary hover:bg-primary/90 text-foreground font-bold rounded-md transition-colors flex items-center justify-center gap-2 text-lg"
            >
              Bắt đầu Cào
            </Button>
          )}
          <Button
            onClick={() => setShowCrawlLogViewerModal(true)}
            className="flex-1 px-8 py-4 bg-muted hover:bg-muted/90 text-foreground font-bold rounded-md transition-colors flex items-center justify-center gap-2 text-lg"
          >
            Xem Nhật ký Cào
          </Button>
        </div>
      </section>

      {/* Existing Chapters List */}
      <section className="bg-surface-card p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-4 flex justify-between items-center">
          <span>Danh sách Chương đã cào ({totalManagedChapters})</span>
          <Button
            onClick={triggerManualRefresh}
            className="px-4 py-2 bg-accent hover:bg-accent/90 text-foreground rounded-md text-sm"
          >
            Làm mới danh sách Chương
          </Button>
        </h2>
        {totalManagedChapters === 0 ? (
          <p className="text-text-muted">Chưa có chương nào được cào.</p>
        ) : (
          <div className="w-full">
            <Table>
              <TableHeader className="bg-surface-raised">
                <TableRow className="border-border-default">
                  <TableHead className="w-20 text-text-secondary uppercase">Chương</TableHead>
                  <TableHead className="text-text-secondary uppercase">Tiêu đề</TableHead>
                  <TableHead className="w-32 text-text-secondary uppercase">Số từ</TableHead>
                  <TableHead className="text-text-secondary uppercase">URL gốc</TableHead>
                  <TableHead className="w-20 text-right text-text-secondary uppercase">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentManagedChapters.map((chapter) => (
                  <TableRow key={chapter.id} className="border-border-default/50 hover:bg-surface-raised/50">
                    <TableCell className="font-medium text-text-primary">
                      {chapter.chapterNumber}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {chapter.title}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {chapter.totalWordsRaw || "N/A"}
                    </TableCell>
                    <TableCell className="text-text-secondary max-w-xs truncate">
                      <a
                        href={chapter.urlRaw || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {chapter.urlRaw || "N/A"}
                      </a>
                    </TableCell>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleViewRawContent(chapter.title, chapter.id)
                        }
                        className="text-primary hover:text-primary/80 p-1 rounded-md hover:bg-surface-raised transition-colors"
                        title="Xem nội dung Raw"
                      >
                        <BookText size={18} />
                      </Button>
                    </td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
