"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BookCard } from "@/components/features/book/BookCard";
import { getVisiblePages } from "@/lib/utils";
import { cn } from "@/lib/utils"; // Import cn utility
import { BookCardWithAuthor } from "@/modules/book/book.types";

interface SearchResultsClientProps {
  initialSearchResults: BookCardWithAuthor[];
  initialTotalResults: number;
  query: string;
  booksPerPage: number;
  currentPage: number;
}

export default function SearchResultsClient({
  initialSearchResults,
  initialTotalResults,
  query,
  booksPerPage,
  currentPage,
}: SearchResultsClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const totalPages = Math.ceil(initialTotalResults / booksPerPage);
  const pageNumbers = getVisiblePages(currentPage, totalPages);

  const handlePageChange = (page: number) => {
    // Construct new URL with updated page number
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set('page', page.toString());
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {initialSearchResults.length === 0 ? (
        <p className="text-text-secondary">
          Không tìm thấy truyện nào phù hợp với từ khóa &quot;{query}&quot;.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {initialSearchResults.map((book) => (
              <div key={book.id} className="col-span-1">
                <BookCard book={book} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="flex items-center justify-center gap-2.5 p-2.5 relative self-stretch w-full flex-[0_0_auto]"
              aria-label="Pagination"
            >
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
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
                    onClick={() =>
                      typeof pageNum === "number" && handlePageChange(pageNum)
                    }
                    disabled={typeof pageNum === "string"}
                    className={cn(
                      "px-3 py-1 rounded-md",
                      currentPage === pageNum
                        ? "bg-primary text-white"
                        : "bg-surface-raised hover:bg-surface-raised/70 text-text-primary"
                    )}
                  >
                    {pageNum}
                  </Button>
                ),
              )}

              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-surface-raised hover:bg-surface-raised/70 text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang kế tiếp
              </Button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
