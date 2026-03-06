"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Trash2,
  ListOrdered,
  BookMarked,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Languages,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { timeAgoFns } from "@/utils/date";
import { cn } from "@/lib/utils";

import { vi } from "date-fns/locale";
import { ManagedBookDetails, ChapterContent } from "@/modules/book/book.types";
import { getChapterContentAction } from "@/app/actions/book";
import { getVisiblePages } from "@/lib/utils";

interface ManagedBookContentProps {
  book: ManagedBookDetails;
}

export default function ManagedBookContent({ book }: ManagedBookContentProps) {
  const router = useRouter();
  const [showChapters, setShowChapters] = useState(true);

  const [showReadChapterModal, setShowReadChapterModal] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"translated" | "raw">(
    "translated",
  );
  const [chapterContent, setChapterContent] = useState<ChapterContent | null>(
    null,
  );
  const [isFetchingChapterContent, setIsFetchingChapterContent] =
    useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const chaptersPerPage = 10;

  const indexOfLastChapter = currentPage * chaptersPerPage;
  const indexOfFirstChapter = indexOfLastChapter - chaptersPerPage;
  const currentChapters = book.chapters.slice(
    indexOfFirstChapter,
    indexOfLastChapter,
  );

  const totalPages = Math.ceil(book.chapters.length / chaptersPerPage);
  const pageNumbers = getVisiblePages(currentPage, totalPages);

  const currentChapter = book.chapters[currentChapterIndex];

  // Functions for actions
  const handleTranslate = () => {
    router.push(`/tai-khoan/truyen/${book.id}/dich`);
  };

  const handleReadChapter = async (index: number) => {
    setCurrentChapterIndex(index);
    setChapterContent(null);
    setIsFetchingChapterContent(true);

    const chapterToRead = book.chapters[index];
    if (chapterToRead) {
      const { success, data, error } = await getChapterContentAction(
        chapterToRead.id,
      );
      if (success && data) {
        setChapterContent(data);
      } else {
        console.error("Failed to fetch chapter content:", error);
      }
    }
    setIsFetchingChapterContent(false);
    setShowReadChapterModal(true);
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < book.chapters.length - 1) {
      handleReadChapter(currentChapterIndex + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      handleReadChapter(currentChapterIndex - 1);
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const formattedCreatedAt = format(new Date(book.createdAt), "dd/MM/yyyy", {
    locale: vi,
  });

  return (
    <div className="flex flex-col flex-1 p-6 bg-surface-section text-text-primary">
      {/* Back Button */}
      <Link
        href="/tai-khoan/ban-lam-viec"
        className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-4"
      >
        <ArrowLeft size={20} />
        Quay lại Bàn làm việc
      </Link>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-surface-card p-6 rounded-lg shadow-md border border-border-default">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {book.title}
          </h1>
          <p className="text-text-secondary text-sm">
            Ngày tạo:{" "}
            <span className="font-semibold text-text-primary">
              {formattedCreatedAt}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() =>
              router.push(`/tai-khoan/truyen/${book.id}/them-chuong`)
            }
            variant="outline"
            className="py-2 border-primary text-primary hover:bg-primary/10 font-bold rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle size={20} />
            Thêm chương
          </Button>
          <Button
            onClick={handleTranslate}
            className="py-2 bg-primary-accent hover:bg-primary-accent/90 text-foreground font-bold rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <Languages size={20} />
            Dịch thuật AI
          </Button>
          <Button
            variant="outline"
            className="py-2 border-destructive text-destructive hover:bg-destructive/10 font-bold rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={20} />
            Xóa truyện
          </Button>
        </div>
      </div>

      {/* Chapters Management */}
      <div className="bg-surface-card p-6 rounded-lg shadow-md border border-border-default">
        <h3
          className="text-xl font-bold text-text-primary mb-4 cursor-pointer flex justify-between items-center"
          onClick={() => setShowChapters(!showChapters)}
        >
          <div className="flex items-center">
            <ListOrdered size={24} className="mr-2" /> Danh sách chương (
            {book.chapters.length})
          </div>
          {showChapters ? <ChevronUp /> : <ChevronDown />}
        </h3>
        {showChapters && (
          <div className="w-full animate-fade-in">
            <Table>
              <TableHeader className="bg-surface-raised">
                <TableRow className="border-border-default">
                  <TableHead className="w-20 text-text-secondary uppercase">
                    Chương
                  </TableHead>
                  <TableHead className="text-text-secondary uppercase">
                    Tiêu đề
                  </TableHead>
                  <TableHead className="w-40 text-text-secondary uppercase">
                    Tình trạng dịch
                  </TableHead>
                  <TableHead className="w-40 text-text-secondary uppercase">
                    Cập nhật
                  </TableHead>
                  <TableHead className="w-20 text-right text-text-secondary uppercase">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentChapters.map((chapter, index) => (
                  <TableRow
                    key={chapter.id}
                    className="border-border-default/50 hover:bg-surface-raised/50"
                  >
                    <TableCell className="font-medium text-text-primary">
                      {chapter.chapterNumber}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {chapter.originalTitle}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "rounded-full font-semibold",
                          chapter.status === true
                            ? "bg-success/20 text-success"
                            : "bg-destructive/20 text-destructive",
                        )}
                      >
                        {chapter.status === true ? "Đã dịch" : "Chưa dịch"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {timeAgoFns(chapter.lastUpdated)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <Button
                        onClick={() =>
                          handleReadChapter(indexOfFirstChapter + index)
                        }
                        variant="ghost"
                        className="text-primary hover:text-primary/80 p-1 rounded-md hover:bg-surface-raised transition-colors"
                        title="Đọc chương"
                      >
                        <BookMarked size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-2">
              <Button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-surface-raised hover:bg-surface-raised/70 text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang trước
              </Button>
              {pageNumbers.map((pageNum, index) =>
                pageNum === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-text-secondary opacity-60"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={index}
                    onClick={() =>
                      typeof pageNum === "number" && paginate(pageNum)
                    }
                    disabled={typeof pageNum === "string"}
                    className={cn(
                      "px-3 py-1 rounded-md",
                      pageNum === currentPage
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-raised hover:bg-surface-raised/70 text-text-primary",
                    )}
                  >
                    {pageNum}
                  </Button>
                ),
              )}
              <Button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-surface-raised hover:bg-surface-raised/70 text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang kế tiếp
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Chapter Read Modal */}
      {showReadChapterModal && currentChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 p-4">
          <div className="relative bg-surface-card text-foreground rounded-lg shadow-xl max-w-4xl w-full h-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-border-default">
              <h2 className="text-xl font-bold">
                {currentChapter.title} ({currentChapter.chapterNumber})
              </h2>
              <Button
                onClick={() => setShowReadChapterModal(false)}
                variant="ghost"
                className="p-2 rounded-full hover:bg-surface-hover transition-colors"
                title="Đóng"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Tabs for content */}
            <div className="flex border-b border-border-default">
              <button
                className={cn(
                  "flex-1 py-2 text-center text-lg font-medium transition-all",
                  activeTab === "translated"
                    ? "border-b-2 border-primary text-primary"
                    : "text-text-muted hover:text-foreground",
                )}
                onClick={() => setActiveTab("translated")}
              >
                Bản dịch
              </button>
              <button
                className={cn(
                  "flex-1 py-2 text-center text-lg font-medium transition-all",
                  activeTab === "raw"
                    ? "border-b-2 border-primary text-primary"
                    : "text-text-muted hover:text-foreground",
                )}
                onClick={() => setActiveTab("raw")}
              >
                Bản gốc
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-y-auto text-base leading-relaxed whitespace-pre-wrap">
              {isFetchingChapterContent ? (
                <p>Đang tải nội dung chương...</p>
              ) : chapterContent ? (
                activeTab === "translated" ? (
                  chapterContent.contentTranslated || "Nội dung dịch chưa có."
                ) : (
                  chapterContent.contentRaw || "Nội dung gốc chưa có."
                )
              ) : (
                <p>Không thể tải nội dung chương.</p>
              )}
            </div>

            {/* Modal Footer (Navigation) */}
            <div className="flex justify-between p-4 border-t border-border-default">
              <Button
                onClick={handlePrevChapter}
                disabled={currentChapterIndex === 0}
                variant="outline"
                className="px-4 py-2 rounded-md flex items-center gap-2"
              >
                <ChevronLeft size={20} />
                Chương trước
              </Button>
              <Button
                onClick={handleNextChapter}
                disabled={currentChapterIndex === book.chapters.length - 1}
                variant="outline"
                className="px-4 py-2 rounded-md flex items-center gap-2"
              >
                Chương kế tiếp
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
