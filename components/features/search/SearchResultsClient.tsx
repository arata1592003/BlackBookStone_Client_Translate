"use client";

import { useRouter, usePathname } from "next/navigation";
import { BookCardWithAuthor, SearchBookResult } from "@/modules/book/book.types"; // Updated import
import { PagePagination } from "@/components/ui/PagePagination";
import { SearchBookCard } from "../book/SearchBookCard"; // Import SearchBookCard

interface SearchResultsClientProps {
  initialSearchResults: SearchBookResult[]; // Updated type
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

  const handlePageChange = (page: number) => {
    // Construct new URL with updated page number
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set("page", page.toString());
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {initialSearchResults.length === 0 ? (
        <p className="text-text-secondary text-lg">
          Không tìm thấy truyện nào phù hợp với từ khóa &quot;{query}&quot;.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialSearchResults.map((book) => (
              <div key={book.id} className="col-span-1">
                <SearchBookCard book={book} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <PagePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
