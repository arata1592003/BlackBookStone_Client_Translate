"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileEdit,
  Globe,
  Trash2,
  ListOrdered,
  BookMarked,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  BookText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { format } from "date-fns";
import { timeAgoFns } from "@/utils/date";

import { vi } from "date-fns/locale";
import { ManagedBookDetails, ChapterContent } from "@/modules/book/book.types";
import { getChapterContentAction } from "@/app/actions/book";
import { getVisiblePages } from "@/lib/utils";

interface ManagedBookContentProps {
  book: ManagedBookDetails;
}

export default function ManagedBookContent({ book }: ManagedBookContentProps) {
  const router = useRouter();
  const [showDescription, setShowDescription] = useState(false);
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
  const handleCrawl = () => {
    router.push(`/tai-khoan/truyen/${book.id}/quan-ly-cao`);
  };

  const handleEditInfo = () => {
    alert(`Chỉnh sửa thông tin truyện: ${book.title}`);
    // In a real app, this would navigate to an edit form
  };

  const handleReadChapter = async (index: number) => {
    setCurrentChapterIndex(index);
    setChapterContent(null); // Reset content when opening new chapter
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
        // Optionally display an error message to the user
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

  // Function to change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const formattedCreatedAt = format(new Date(book.createdAt), "dd/MM/yyyy", {
    locale: vi,
  });
  const formattedUpdatedAt = format(new Date(book.updatedAt), "dd/MM/yyyy", {
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
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-text-primary">
        Quản Lý Truyện: {book.title}
      </h1>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Book Cover and Quick Actions */}
        <div className="md:w-1/4 flex flex-col items-center">
          <div className="relative w-full aspect-[2/3] max-w-[180px] rounded-lg overflow-hidden shadow-lg border border-surface-border">
            <Image
              src={book.coverImageUrl || "/placeholder.jpg"}
              alt={book.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="mt-4 w-full max-w-[250px] flex flex-col gap-2">
            <Button
              onClick={handleEditInfo}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <FileEdit size={20} />
              Chỉnh sửa thông tin
            </Button>
            <Button
              onClick={handleCrawl}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <Globe size={20} />
              Quản lý cào
            </Button>
            <Button className="w-full py-2 border border-red-600 text-red-500 hover:bg-red-900/20 font-bold rounded-md transition-colors flex items-center justify-center gap-2">
              <Trash2 size={20} />
              Xóa truyện
            </Button>
          </div>
        </div>

        {/* Book Details and Status */}
        <div className="md:w-3/4 bg-bg-box p-6 rounded-lg shadow-md border border-surface-border">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {book.title}
          </h2>
          {book.originalTitle && (
            <p className="text-text-secondary italic mb-1">
              ({book.originalTitle})
            </p>
          )}
          <h3 className="text-lg text-text-secondary mb-4">
            Tác giả: {book.author}
            {book.originalAuthor && (
              <span className="italic"> ({book.originalAuthor})</span>
            )}
          </h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {book.genres &&
              book.genres.map((genre, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 bg-surface-raised px-3 py-1 rounded-full text-sm text-text-primary"
                >
                  <BookText size={16} /> {genre}
                </span>
              ))}
          </div>

          <p className="text-text-secondary text-sm mb-2">
            Trạng thái truyện:{" "}
            <span className="font-semibold text-text-primary">
              {book.status}
            </span>
          </p>
          <p className="text-text-secondary text-sm mb-2">
            Nguồn:{" "}
            <a
              href={book.sourceUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {book.source || "N/A"}
            </a>
          </p>
          <p className="text-text-secondary text-sm mb-2">
            Cập nhật gần nhất:{" "}
            <span className="font-semibold text-text-primary">
              {formattedUpdatedAt}
            </span>
          </p>
          <p className="text-text-secondary text-sm mb-4">
            Ngày tạo:{" "}
            <span className="font-semibold text-text-primary">
              {formattedCreatedAt}
            </span>
          </p>

          <h3
            className="text-xl font-bold text-text-primary mt-6 mb-3 border-b border-gray-700 pb-2 cursor-pointer flex justify-between items-center"
            onClick={() => setShowDescription(!showDescription)}
          >
            Mô tả {showDescription ? <ChevronUp /> : <ChevronDown />}
          </h3>
          {showDescription && (
            <p className="text-text-secondary leading-relaxed animate-fade-in">
              {book.description}
            </p>
          )}
        </div>
      </div>

      {/* Chapters Management */}
      <div className="bg-bg-box p-6 rounded-lg shadow-md border border-surface-border mt-6">
        <h3
          className="text-xl font-bold text-text-primary mb-4 cursor-pointer flex justify-between items-center"
          onClick={() => setShowChapters(!showChapters)}
        >
          <ListOrdered size={24} className="mr-2" /> Danh sách chương (
          {book.chapters.length}){" "}
          {showChapters ? <ChevronUp /> : <ChevronDown />}
        </h3>
        {showChapters && (
          <div className="overflow-x-auto animate-fade-in">
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
                    Tình trạng dịch
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                  >
                    Cập nhật
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
                {currentChapters.map((chapter, index) => (
                  <tr key={chapter.id} className="hover:bg-surface-raised/50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-text-primary">
                      {chapter.chapterNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                      {chapter.title}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          chapter.status === true
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {chapter.status === true ? "Đã dịch" : "Chưa dịch"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                      {timeAgoFns(chapter.lastUpdated)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        onClick={() =>
                          handleReadChapter(indexOfFirstChapter + index)
                        }
                        className="text-blue-400 hover:text-blue-300 p-1 rounded-md hover:bg-surface-raised transition-colors"
                        title="Đọc chương"
                      >
                        <BookMarked size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                    // No variant "ghost" in this project's Button. Replace with direct classes.
                    // No size "icon-sm" either.
                    onClick={() =>
                      typeof pageNum === "number" && paginate(pageNum)
                    }
                    disabled={typeof pageNum === "string"}
                    className={`px-3 py-1 rounded-md ${
                      pageNum === currentPage
                        ? "bg-primary text-white"
                        : "bg-surface-raised hover:bg-surface-raised/70 text-text-primary"
                    }`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-xl max-w-4xl w-full h-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">
                {currentChapter.title} ({currentChapter.chapterNumber})
              </h2>
              <Button
                onClick={() => setShowReadChapterModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Đóng"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Tabs for content */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`flex-1 py-2 text-center text-lg font-medium ${
                  activeTab === "translated"
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
                onClick={() => setActiveTab("translated")}
              >
                Bản dịch
              </button>
              <button
                className={`flex-1 py-2 text-center text-lg font-medium ${
                  activeTab === "raw"
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
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
            <div className="flex justify-between p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handlePrevChapter}
                disabled={currentChapterIndex === 0}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md flex items-center gap-2"
              >
                <ChevronLeft size={20} />
                Chương trước
              </Button>
              <Button
                onClick={handleNextChapter}
                disabled={currentChapterIndex === book.chapters.length - 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md flex items-center gap-2"
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
