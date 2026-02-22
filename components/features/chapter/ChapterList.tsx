"use client";

import {
  getChapterCountByBookSlug,
  getChapterListByBookSlug,
} from "@/modules/chapter/chapter.service";
import type { ChapterRow } from "@/modules/chapter/chapter.type";
import { timeAgo } from "@/utils/date";
import { Button } from "@/components/ui/button";
import { ArrowDownWideNarrow, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getVisiblePages } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
  chaptersPerPage?: number;
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
    <div className="flex flex-col w-full">
      {/* Controls */}
      <div className="flex items-center px-2 py-3 border-b border-border-default/50">
        <label className="inline-flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 bg-background border-border-default rounded checked:bg-primary accent-primary"
            checked={newestFirst}
            onChange={(e) => {
              setNewestFirst(e.target.checked);
              setCurrentPage(1);
            }}
          />
          <ArrowDownWideNarrow size={18} className="text-text-secondary group-hover:text-primary transition-colors" />
          <span className="text-sm md:text-base font-medium text-text-secondary group-hover:text-primary transition-colors">
            Mới nhất trước
          </span>
        </label>
      </div>

      {/* List */}
      <div className="flex flex-col w-full">
        {loading ? (
          <div className="text-text-muted text-center py-10 w-full italic">
            Đang tải danh sách chương...
          </div>
        ) : chapters.length === 0 ? (
          <div className="text-text-muted text-center py-10 w-full opacity-70">
            Hiện chưa có chương nào.
          </div>
        ) : (
          <div className="flex flex-col">
            {chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/truyen/${slug}/chuong/${chapter.chapter_number}`}
                className="flex items-center justify-between py-3 md:py-4 px-2 md:px-4 border-b border-border-default/30 last:border-none hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <span className="text-xs md:text-sm font-mono text-text-muted w-8 md:w-10 shrink-0">
                    {chapter.chapter_number.toString().padStart(2, '0')}
                  </span>
                  <p className="text-sm md:text-lg font-medium text-text-secondary group-hover:text-primary transition-colors truncate pr-4">
                    {chapter.chapter_title_translated}
                  </p>
                </div>
                <time className="text-[10px] md:text-sm text-text-muted shrink-0 italic md:not-italic">
                  {timeAgo(chapter.created_at)}
                </time>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <nav className="flex items-center justify-center gap-1.5 md:gap-2.5 py-6" aria-label="Pagination">
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="md:size-8"
        >
          <ChevronLeft size={16} />
        </Button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) => (
            <Button
              key={index}
              variant={pageNum === currentPage ? "default" : "ghost"}
              size="icon-xs"
              onClick={() => typeof pageNum === "number" && setCurrentPage(pageNum)}
              disabled={typeof pageNum === "string"}
              className={cn(
                "md:size-8 text-xs md:text-sm",
                pageNum === currentPage ? "bg-primary" : "text-text-secondary"
              )}
            >
              {pageNum}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="md:size-8"
        >
          <ChevronRight size={16} />
        </Button>
      </nav>
    </div>
  );
};
