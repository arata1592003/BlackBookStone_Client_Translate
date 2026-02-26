"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BookNewChapterCard } from "@/modules/book/book.types";
import { PagePagination } from "@/components/ui/page-pagination";
import { BookRowItem } from "./BookRowItem";
import { Zap } from "lucide-react";

interface LatestBooksClientProps {
  initialBooks: BookNewChapterCard[];
  initialTotalBooks: number;
  booksPerPage: number;
  currentPage: number;
}

export default function LatestBooksClient({
  initialBooks,
  initialTotalBooks,
  booksPerPage,
  currentPage,
}: LatestBooksClientProps) {
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
    <div className="flex flex-col gap-6">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-border-default pb-4">
        <div className="flex items-center gap-2">
          <Zap size={24} className="text-primary-accent" />
          <h2 className="text-xl md:text-2xl font-bold text-text-primary uppercase tracking-tight">
            Mới cập nhật
          </h2>
        </div>
        <div className="text-sm text-text-secondary font-medium">
          Tổng số: <span className="text-primary-accent font-bold">{initialTotalBooks}</span> truyện
        </div>
      </div>

      {/* LIST SECTION */}
      <div className="bg-surface-card rounded-2xl border border-border-default shadow-sm p-4">
        <div className="flex flex-col">
          {initialBooks.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-text-secondary italic">Hiện chưa có truyện mới nào được cập nhật.</p>
            </div>
          ) : (
            <div className="divide-y divide-border-default/50">
              {initialBooks.map((book) => (
                <div key={book.id} className="py-2 first:pt-0 last:pb-0">
                  <BookRowItem book={book} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
