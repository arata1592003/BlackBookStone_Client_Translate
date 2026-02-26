"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SearchBookResult } from "@/modules/book/book.types";
import { PagePagination } from "@/components/ui/page-pagination";
import { GridBookCard } from "./GridBookCard";
import { cn } from "@/lib/utils";
import { LayoutGrid, Loader2, RefreshCw, CheckCircle2 } from "lucide-react";

interface StatusBooksClientProps {
  initialResults: SearchBookResult[];
  initialTotalResults: number;
  currentStatus: string;
  booksPerPage: number;
  currentPage: number;
}

export default function StatusBooksClient({
  initialResults,
  initialTotalResults,
  currentStatus,
  booksPerPage,
  currentPage,
}: StatusBooksClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(initialTotalResults / booksPerPage);

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER & STATUS SELECTOR */}
      <div className="flex flex-col gap-6 border-b border-border-default pb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <LayoutGrid size={32} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary uppercase tracking-tight leading-none mb-1">
              Trạng Thái Phát Hành
            </h2>
            <p className="text-sm text-text-muted font-medium">Lọc truyện theo tình trạng hoàn thiện</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleStatusChange("ongoing")}
            className={cn(
              "flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 text-left group",
              currentStatus === "ongoing"
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                : "border-border-default bg-surface-card hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl transition-colors",
                currentStatus === "ongoing" ? "bg-primary text-white" : "bg-surface-raised text-text-muted group-hover:text-primary"
              )}>
                <RefreshCw size={24} className={cn(currentStatus === "ongoing" && "animate-spin-slow")} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-text-primary">Đang ra</h3>
                <p className="text-xs text-text-muted">Chương mới cập nhật mỗi ngày</p>
              </div>
            </div>
            {currentStatus === "ongoing" && <div className="w-2 h-2 rounded-full bg-primary" />}
          </button>

          <button
            onClick={() => handleStatusChange("full")}
            className={cn(
              "flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 text-left group",
              currentStatus === "full"
                ? "border-success bg-success/5 shadow-lg shadow-success/10"
                : "border-border-default bg-surface-card hover:border-success/50"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl transition-colors",
                currentStatus === "full" ? "bg-success text-white" : "bg-surface-raised text-text-muted group-hover:text-success"
              )}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-text-primary">Hoàn thành</h3>
                <p className="text-xs text-text-muted">Đã kết thúc, có thể đọc trọn bộ</p>
              </div>
            </div>
            {currentStatus === "full" && <div className="w-2 h-2 rounded-full bg-success" />}
          </button>
        </div>
      </div>

      {/* RESULTS SECTION */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-1">
          <div className="text-sm font-medium text-text-secondary uppercase tracking-widest">
            Danh sách truyện <span className="text-text-primary font-bold">({initialTotalResults})</span>
          </div>
        </div>

        {initialResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-surface-card rounded-2xl border border-dashed border-border-default">
            <p className="text-text-secondary text-lg mb-2 italic">
              &quot;Chưa có bộ truyện nào ở trạng thái này...&quot;
            </p>
            <p className="text-text-muted text-sm">Quay lại sau nhé bro!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-y-10 gap-x-4 md:gap-x-6 justify-items-center">
              {initialResults.map((book) => (
                <GridBookCard key={book.id} book={book} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="py-8 mt-10 border-t border-border-default/30">
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
    </div>
  );
}
