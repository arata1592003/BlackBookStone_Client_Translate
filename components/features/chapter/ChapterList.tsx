"use client";

import {
  getChapterCountByBookSlug,
  getChapterListByBookSlug,
} from "@/modules/chapter/chapter.service";
import type { ChapterRow } from "@/modules/chapter/chapter.type";
import { timeAgo } from "@/utils/date";
import { Button } from "@/components/ui/Button";
import { ArrowDownWideNarrow, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
  chaptersPerPage?: number;
}

function getVisiblePages(
  current: number,
  total: number,
  delta = 2,
): (number | "...")[] {
  const pages: (number | "...")[] = [];
  const start = Math.max(1, current - delta);
  const end = Math.min(total, current + delta);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < total) {
    if (end < total - 1) pages.push("...");
    pages.push(total);
  }

  return pages.filter((item, index) => pages.indexOf(item) === index);
}

export const ChapterList = ({ slug, chaptersPerPage = 10 }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [chapters, setChapters] = useState<ChapterRow[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [newestFirst, setNewestFirst] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);

      const offset = (currentPage - 1) * chaptersPerPage;

      const [list, total] = await Promise.all([
        getChapterListByBookSlug(slug, offset, chaptersPerPage, newestFirst),
        getChapterCountByBookSlug(slug),
      ]);

      if (!ignore) {
        setChapters(list);
        setTotalPages(Math.max(1, Math.ceil(total / chaptersPerPage)));
        setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [slug, currentPage, chaptersPerPage, newestFirst]);

  const pageNumbers = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
      <div className="flex items-start gap-2.5 px-5 py-2.5 relative self-stretch w-full flex-[0_0_auto]">
        <label className="inline-flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            className="relative w-5 h-5 bg-white rounded-sm aspect-[1] appearance-none checked:bg-white"
            aria-label="Mới nhất"
            checked={newestFirst}
            onChange={(e) => {
              setNewestFirst(e.target.checked);
              setCurrentPage(1);
            }}
          />
          <ArrowDownWideNarrow size={20} className="text-text-secondary" />
          <span className="relative w-fit mt-[-1.00px] font-inter font-medium text-text-secondary text-base tracking-[0] leading-[normal] whitespace-nowrap">
            Mới nhất
          </span>
        </label>
      </div>

      <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-white">
          <div className="inline-flex items-center justify-center gap-2.5 p-2.5 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] font-inter font-medium text-text-secondary text-base tracking-[0] leading-[normal] whitespace-nowrap">
              STT
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 relative flex-1 grow">
            <div className="relative w-fit mt-[-1.00px] font-inter font-medium text-text-secondary text-base tracking-[0] leading-[normal] whitespace-nowrap">
              Tiêu đề chương
            </div>
          </div>
          <div className="inline-flex items-center justify-center gap-2.5 p-2.5 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] font-inter font-medium text-text-secondary text-base tracking-[0] leading-[normal] whitespace-nowrap">
              Thời gian
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-text-secondary text-center py-6 w-full">
            Đang tải...
          </div>
        ) : chapters.length === 0 ? (
          <div className="text-text-secondary text-center py-6 w-full opacity-70">
            Không có chương nào
          </div>
        ) : (
          chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/truyen/${slug}/chuong/${chapter.chapter_number}`}
              className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-white no-underline text-text-secondary hover:bg-white/10"
            >
              <div className="flex w-[52px] items-center justify-center gap-2.5 p-2.5 relative">
                <div className="relative flex items-center justify-center w-fit mt-[-1.00px] font-inter font-medium text-text-secondary text-base text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  {chapter.chapter_number}
                </div>
              </div>
              <div className="flex w-[757px] items-center gap-2.5 p-2.5 relative">
                <p className="relative w-fit mt-[-1.00px] font-inter font-medium text-text-secondary text-base tracking-[0] leading-[normal] whitespace-nowrap">
                  {chapter.chapter_title_translated}
                </p>
              </div>
              <div className="flex w-[91px] items-center justify-end gap-2.5 p-2.5 relative">
                <div className="relative w-fit mt-[-1.00px] font-inter font-medium text-text-secondary text-base tracking-[0] leading-[normal] whitespace-nowrap">
                  {timeAgo(chapter.created_at)}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <nav
        className="flex items-center justify-center gap-2.5 p-2.5 relative self-stretch w-full flex-[0_0_auto]"
        aria-label="Pagination"
      >
        <Button
          size="icon-sm"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-[5px] bg-primary rounded-sm"
          aria-label="Previous page"
        >
          <ChevronLeft size={20} className="text-text-secondary" />
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
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                typeof pageNum === "number" && setCurrentPage(pageNum)
              }
              disabled={typeof pageNum === "string"}
              className={`p-[5px] rounded-sm overflow-hidden ${
                pageNum === currentPage ? "bg-primary" : "bg-white"
              }`}
              aria-label={
                typeof pageNum === "number" ? `Page ${pageNum}` : "More pages"
              }
              aria-current={pageNum === currentPage ? "page" : undefined}
            >
              <div
                className={`flex items-center justify-center w-[19px] h-[19px] font-inter font-medium text-base text-center tracking-[0] leading-[normal] whitespace-nowrap ${
                  pageNum === currentPage ? "text-text-secondary" : "text-black"
                }`}
              >
                {pageNum}
              </div>
            </Button>
          ),
        )}

        <Button
          size="icon-sm"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-[5px] bg-primary rounded-sm"
          aria-label="Next page"
        >
          <ChevronRight size={20} className="text-text-secondary" />
        </Button>
      </nav>
    </div>
  );
};
