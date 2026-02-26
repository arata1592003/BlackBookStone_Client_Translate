"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BookCompletedCard as BookCompletedCardType } from "@/modules/book/book.types";
import { PagePagination } from "@/components/ui/page-pagination";
import { CompletedBookCard } from "./CompletedBookCard";
import { CheckCircle2, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompletedBooksClientProps {
  initialBooks: BookCompletedCardType[];
  initialTotalBooks: number;
  booksPerPage: number;
  currentPage: number;
}

export default function CompletedBooksClient({
  initialBooks,
  initialTotalBooks,
  booksPerPage,
  currentPage,
}: CompletedBooksClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(initialTotalBooks / booksPerPage);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-border-default pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-success/10 rounded-2xl text-success">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary uppercase tracking-tight leading-none mb-1">
              Truyện Đã Hoàn Thành
            </h2>
            <p className="text-sm text-text-muted font-medium">Những bộ truyện đã ra mắt đầy đủ nội dung</p>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-text-muted uppercase font-bold tracking-widest">Tổng cộng</span>
          <span className="text-sm font-semibold text-text-secondary">{initialTotalBooks} bộ</span>
        </div>
      </div>

      {/* LIST SECTION */}
      <section className="bg-surface-card rounded-2xl p-6 border border-border-default shadow-sm min-h-[400px]">
        {initialBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <p className="text-text-secondary text-lg italic mb-2">
              &quot;Hiện chưa có truyện nào được đánh dấu hoàn thành...&quot;
            </p>
            <p className="text-text-muted text-sm">Quay lại sau bro nhé!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-10 gap-x-2 md:gap-x-4 justify-items-center">
            {initialBooks.map((book) => (
              <div key={book.id} className="w-fit">
                <CompletedBookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="py-8 border-t border-border-default/30">
          <PagePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
