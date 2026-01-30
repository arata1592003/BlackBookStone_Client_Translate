"use client";

import {
  getChapterCountByBookSlug,
  getChapterListByBookSlug,
} from "@/modules/chapter/chapter.service";
import type { ChapterRow } from "@/modules/chapter/chapter.type";
import { timeAgo } from "@/utils/date";
import { ArrowDownWideNarrow, ChevronLeft, ChevronRight } from 'lucide-react'; // Import Lucide icons
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
  chaptersPerPage?: number;
}

function getVisiblePages(
  current: number,
  total: number,
  delta = 2
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
        getChapterListByBookSlug(
          slug,
          offset,
          chaptersPerPage,
          newestFirst
        ),
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
        <label className="inline-flex items-center gap-2.5 cursor-pointer"> {/* Added inline-flex for icon alignment */}
          <input
            type="checkbox"
            className="relative w-5 h-5 bg-white rounded-[5px] aspect-[1] appearance-none checked:bg-white"
            aria-label="Mới nhất"
            checked={newestFirst}
            onChange={(e) => {
              setNewestFirst(e.target.checked);
              setCurrentPage(1);
            }}
          />
          <ArrowDownWideNarrow size={20} className="text-gray-300" /> {/* Added icon */}
          <span className="relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-gray-300 text-base tracking-[0] leading-[normal] whitespace-nowrap">
            Mới nhất
          </span>
        </label>
      </div>

      <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-white">
          <div className="inline-flex items-center justify-center gap-2.5 p-2.5 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-gray-300 text-base tracking-[0] leading-[normal] whitespace-nowrap">
              STT
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 relative flex-1 grow">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-gray-300 text-base tracking-[0] leading-[normal] whitespace-nowrap">
              Tiêu đề chương
            </div>
          </div>
          <div className="inline-flex items-center justify-center gap-2.5 p-2.5 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-gray-300 text-base tracking-[0] leading-[normal] whitespace-nowrap">
              Thời gian
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-gray-300 text-center py-6 w-full">Đang tải...</div>
        ) : chapters.length === 0 ? (
          <div className="text-gray-300 text-center py-6 w-full opacity-70">
            Không có chương nào
          </div>
        ) : (
          chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/truyen/${slug}/chuong/${chapter.chapter_number}`}
              className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-white no-underline text-gray-300 hover:bg-white/10"
            >
              <div className="flex w-[52px] items-center justify-center gap-2.5 p-2.5 relative">
                <div className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-gray-300 text-base text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  {chapter.chapter_number}
                </div>
              </div>
              <div className="flex w-[757px] items-center gap-2.5 p-2.5 relative">
                <p className="relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-gray-300 text-base tracking-[0] leading-[normal] whitespace-nowrap">
                  {chapter.chapter_title_translated}
                </p>
              </div>
              <div className="flex w-[91px] items-center justify-end gap-2.5 p-2.5 relative">
                <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-gray-300 text-base tracking-[0] leading-[normal] whitespace-nowrap">
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
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center gap-2.5 p-[5px] relative flex-[0_0_auto] bg-[#3600c0] rounded-[5px] disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft size={20} className="text-gray-300" />
        </button>

        {pageNumbers.map((pageNum, index) =>
          pageNum === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-300 opacity-60">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() =>
                typeof pageNum === "number" && setCurrentPage(pageNum)
              }
              disabled={typeof pageNum === "string"}
              className={`inline-flex flex-col items-center justify-center gap-2.5 p-[5px] relative flex-[0_0_auto] rounded-[5px] overflow-hidden ${
                pageNum === currentPage ? "bg-[#3600c0]" : "bg-white"
              }`}
              aria-label={
                typeof pageNum === "number" ? `Page ${pageNum}` : "More pages"
              }
              aria-current={pageNum === currentPage ? "page" : undefined}
            >
              <div
                className={`relative flex items-center justify-center w-[19px] h-[19px] mt-[-1.00px] aspect-[1] [font-family:'Inter-Medium',Helvetica] font-medium text-base text-center tracking-[0] leading-[normal] whitespace-nowrap ${
                  pageNum === currentPage ? "text-gray-300" : "text-black"
                }`}
              >
                {pageNum}
              </div>
            </button>
          )
        )}

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="inline-flex items-center justify-center gap-2.5 p-[5px] relative flex-[0_0_auto] bg-[#3600c0] rounded-[5px] disabled:opacity-50"
          aria-label="Next page"
        >
          <ChevronRight size={20} className="text-gray-300" />
        </button>
      </nav>
    </div>
  );
};
