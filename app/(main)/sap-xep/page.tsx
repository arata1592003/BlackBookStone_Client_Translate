import { getBooksWithFiltersAndSort, countBooksWithFiltersAndSort } from "@/modules/book/book.service";
import { getAllTags } from "@/modules/tag/tag.service";
import FilterSortBooksClient from "@/components/features/book/FilterSortBooksClient";
import type { Metadata } from "next";

interface SortPageProps {
  searchParams: Promise<{
    status?: string;
    sort?: string;
    genre?: string;
    q?: string;
    page?: string;
  }>;
}

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "BlackStoneBook";

export const metadata: Metadata = {
  title: `${APP_NAME} - Sắp xếp và Lọc truyện`,
  description: `Tìm kiếm và sắp xếp các bộ truyện theo sở thích của bạn trên ${APP_NAME}.`,
};

export default async function SortPage({ searchParams }: SortPageProps) {
  const resolvedSearchParams = await searchParams;
  
  const status = resolvedSearchParams.status || "all";
  const sortBy = resolvedSearchParams.sort || "newest";
  const genre = resolvedSearchParams.genre || "all";
  const query = resolvedSearchParams.q || "";
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const booksPerPage = 20; // Increase per page for grid view
  const offset = (currentPage - 1) * booksPerPage;

  const [books, totalBooks, allTags] = await Promise.all([
    getBooksWithFiltersAndSort({
      status,
      sortBy,
      genreName: genre,
      searchQuery: query,
      offset,
      limit: booksPerPage,
    }),
    countBooksWithFiltersAndSort({
      status,
      genreName: genre,
      searchQuery: query,
    }),
    getAllTags(50),
  ]);

  return (
    <main className="max-w-screen-2xl mx-auto py-6 px-4 md:px-8 xl:px-32 bg-surface-section min-h-screen">
      <FilterSortBooksClient
        initialResults={books}
        initialTotalResults={totalBooks}
        allTags={allTags}
        booksPerPage={booksPerPage}
        currentPage={currentPage}
      />
    </main>
  );
}
