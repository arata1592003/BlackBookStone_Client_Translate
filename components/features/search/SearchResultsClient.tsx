"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SearchBookResult } from "@/modules/book/book.types";
import { PagePagination } from "@/components/ui/page-pagination";
import { SearchBookCard } from "../book/SearchBookCard";
import { cn } from "@/lib/utils";
import { Filter, SortAsc, LayoutGrid } from "lucide-react";

interface SearchResultsClientProps {
  initialSearchResults: SearchBookResult[];
  initialTotalResults: number;
  query: string;
  booksPerPage: number;
  currentPage: number;
}

const STATUS_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "ongoing", label: "Đang ra" },
  { id: "completed", label: "Hoàn thành" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Mới cập nhật" },
  { id: "views", label: "Lượt đọc" },
  { id: "chapters", label: "Số chương" },
];

export default function SearchResultsClient({
  initialSearchResults,
  initialTotalResults,
  query,
  booksPerPage,
  currentPage,
}: SearchResultsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "all";
  const currentSort = searchParams.get("sort") || "newest";

  const totalPages = Math.ceil(initialTotalResults / booksPerPage);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.set("page", "1"); // Reset to page 1 when filter changes
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* FILTER HUB */}
      <section className="flex flex-col gap-6 p-4 md:p-6 rounded-2xl bg-surface-card border border-border-default shadow-sm">
        {/* Status Filter */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2 min-w-[120px] text-text-muted">
            <Filter size={16} />
            <span className="text-sm font-bold uppercase tracking-wider">Trạng thái</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status.id}
                onClick={() => updateFilters("status", status.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  currentStatus === status.id
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-surface-raised text-text-secondary hover:bg-surface-hover"
                )}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Filter */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 border-t border-border-default/50 pt-4 md:pt-0 md:border-t-0">
          <div className="flex items-center gap-2 min-w-[120px] text-text-muted">
            <SortAsc size={16} />
            <span className="text-sm font-bold uppercase tracking-wider">Sắp xếp</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((sort) => (
              <button
                key={sort.id}
                onClick={() => updateFilters("sort", sort.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  currentSort === sort.id
                    ? "bg-primary-accent text-white shadow-md shadow-primary-accent/20"
                    : "bg-surface-raised text-text-secondary hover:bg-surface-hover"
                )}
              >
                {sort.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH HEADER */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <LayoutGrid size={20} className="text-primary-accent" />
          <h2 className="text-lg md:text-xl font-bold text-text-primary">
            Kết quả: <span className="text-primary-accent">{initialTotalResults}</span> truyện
          </h2>
        </div>
      </div>

      {/* RESULTS GRID */}
      {initialSearchResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-surface-card rounded-2xl border border-dashed border-border-default">
          <p className="text-text-secondary text-lg mb-2 italic">
            &quot;Chúng tôi đã lục tung thư viện nhưng không thấy gì...&quot;
          </p>
          <p className="text-text-muted text-sm">
            Thử tìm kiếm với từ khóa khác hoặc xóa bớt bộ lọc bro nhé!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {initialSearchResults.map((book) => (
              <div key={book.id} className="col-span-1">
                <SearchBookCard book={book} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="py-8 border-t border-border-default/30">
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
  );
}
