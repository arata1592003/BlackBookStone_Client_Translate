"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SearchBookResult } from "@/modules/book/book.types";
import { PagePagination } from "@/components/ui/page-pagination";
import { SearchBookCard } from "../book/SearchBookCard";
import { LayoutGrid } from "lucide-react";

interface CategoryBooksClientProps {
  tagName: string;
  initialBooks: SearchBookResult[];
  initialTotalBooks: number;
  booksPerPage: number;
  currentPage: number;
}

export default function CategoryBooksClient({
  tagName,
  initialBooks,
  initialTotalBooks,
  booksPerPage,
  currentPage,
}: CategoryBooksClientProps) {
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
          <LayoutGrid size={24} className="text-primary-accent" />
          <h2 className="text-xl md:text-2xl font-bold text-text-primary">
            Thể loại: <span className="text-primary-accent">{tagName}</span>
          </h2>
        </div>
        <div className="text-sm text-text-secondary font-medium">
          Tổng số: <span className="text-primary-accent">{initialTotalBooks}</span> truyện
        </div>
      </div>

      {/* RESULTS GRID */}
      {initialBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-surface-card rounded-2xl border border-dashed border-border-default">
          <p className="text-text-secondary text-lg mb-2 italic">
            &quot;Chưa có bộ truyện nào thuộc thể loại này bro ơi...&quot;
          </p>
          <p className="text-text-muted text-sm">
            Vui lòng quay lại sau nhé!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {initialBooks.map((book) => (
              <div key={book.id} className="col-span-1">
                <SearchBookCard book={book} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="py-8 mt-4 border-t border-border-default/30">
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
