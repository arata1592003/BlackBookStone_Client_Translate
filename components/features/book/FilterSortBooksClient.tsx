"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SearchBookResult } from "@/modules/book/book.types";
import { Tag } from "@/modules/tag/tag.type";
import { PagePagination } from "@/components/ui/page-pagination";
import { GridBookCard } from "./GridBookCard";
import { cn } from "@/lib/utils";
import { Filter, SortAsc, LayoutGrid, Tag as TagIcon, X } from "lucide-react";

interface FilterSortBooksClientProps {
  initialResults: SearchBookResult[];
  initialTotalResults: number;
  allTags: Tag[];
  booksPerPage: number;
  currentPage: number;
}

const STATUS_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "ongoing", label: "Đang ra" },
  { id: "full", label: "Hoàn thành" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Mới nhất" },
  { id: "oldest", label: "Cũ nhất" },
  { id: "views", label: "Lượt đọc" },
  { id: "chapters", label: "Số chương" },
];

export default function FilterSortBooksClient({
  initialResults,
  initialTotalResults,
  allTags,
  booksPerPage,
  currentPage,
}: FilterSortBooksClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "all";
  const currentSort = searchParams.get("sort") || "newest";
  const currentGenre = searchParams.get("genre") || "all";

  const totalPages = Math.ceil(initialTotalResults / booksPerPage);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const hasFilters = currentStatus !== "all" || currentSort !== "newest" || currentGenre !== "all";

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* SIDEBAR - FILTERS */}
      <aside className="w-full lg:w-80 shrink-0">
        <div className="sticky top-24 flex flex-col gap-6 bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm">
          <div className="flex items-center justify-between border-b border-border-default pb-4">
            <div className="flex items-center gap-2 font-bold text-lg uppercase tracking-tight">
              <Filter size={20} className="text-primary-accent" />
              Bộ lọc
            </div>
            {hasFilters && (
              <button 
                onClick={clearAllFilters}
                className="text-[10px] font-bold text-text-muted hover:text-destructive flex items-center gap-1 uppercase transition-colors"
              >
                <X size={12} /> Xóa hết
              </button>
            )}
          </div>

          {/* Status */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Trạng thái</span>
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status.id}
                  onClick={() => updateFilters("status", status.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                    currentStatus === status.id
                      ? "bg-primary border-primary text-white shadow-sm"
                      : "bg-surface-raised border-border-default text-text-secondary hover:border-primary/50"
                  )}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-3 pt-4 border-t border-border-default/50">
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
              <SortAsc size={14} /> Sắp xếp theo
            </span>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((sort) => (
                <button
                  key={sort.id}
                  onClick={() => updateFilters("sort", sort.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                    currentSort === sort.id
                      ? "bg-primary-accent border-primary-accent text-white shadow-sm"
                      : "bg-surface-raised border-border-default text-text-secondary hover:border-primary-accent/50"
                  )}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-col gap-3 pt-4 border-t border-border-default/50">
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
              <TagIcon size={14} /> Thể loại
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateFilters("genre", "all")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border text-left truncate",
                  currentGenre === "all"
                    ? "bg-secondary-accent border-secondary-accent text-white"
                    : "bg-surface-raised border-border-default text-text-secondary hover:border-secondary-accent/50"
                )}
              >
                Tất cả
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => updateFilters("genre", tag.name)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border text-left truncate",
                    currentGenre === tag.name
                      ? "bg-secondary-accent border-secondary-accent text-white"
                      : "bg-surface-raised border-border-default text-text-secondary hover:border-secondary-accent/50"
                  )}
                  title={tag.name}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT - RESULTS GRID */}
      <section className="flex-1 min-w-0">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-1 border-b border-border-default pb-4">
            <div className="flex items-center gap-2">
              <LayoutGrid size={20} className="text-primary-accent" />
              <h2 className="text-lg md:text-xl font-bold text-text-primary">
                Tìm thấy: <span className="text-primary-accent">{initialTotalResults}</span> truyện
              </h2>
            </div>
          </div>

          {initialResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-surface-card rounded-2xl border border-dashed border-border-default">
              <p className="text-text-secondary text-lg mb-2 italic">
                &quot;Không có truyện nào phù hợp với bộ lọc bro ơi...&quot;
              </p>
              <p className="text-text-muted text-sm">
                Thử thay đổi bộ lọc để khám phá thêm nhiều bộ truyện khác nhé!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 gap-x-4 md:gap-x-6 justify-items-center">
                {initialResults.map((book) => (
                  <GridBookCard key={book.id} book={book} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="py-8 mt-8 border-t border-border-default/30">
                  <PagePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
