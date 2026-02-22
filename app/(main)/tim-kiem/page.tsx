import { getSearchBooksWithDetails, countSearchResults } from "@/modules/book/book.service";
import type { Metadata } from "next";
import SearchResultsClient from "@/components/features/search/SearchResultsClient";

interface SearchPageProps {
  searchParams: {
    q?: string;
    page?: string;
  };
}

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "App";

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q;

  if (!query) {
    return {
      title: `${APP_NAME} - Tìm kiếm`,
      description: `Tìm kiếm truyện trên ${APP_NAME}.`,
    };
  }

  return {
    title: `${APP_NAME} - Kết quả tìm kiếm cho "${query}"`,
    description: `Xem kết quả tìm kiếm truyện cho "${query}" trên ${APP_NAME}.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const booksPerPage = 10;
  const offset = (currentPage - 1) * booksPerPage;

  if (!query) {
    return (
      <main className="max-w-7xl mx-auto flex flex-col py-8 px-6 lg:px-8 bg-surface-section text-text-primary min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-6">Tìm kiếm</h1>
        <p className="text-text-secondary text-lg">
          Vui lòng nhập từ khóa để tìm kiếm truyện.
        </p>
      </main>
    );
  }

  const [searchResults, totalResults] = await Promise.all([
    getSearchBooksWithDetails(query, offset, booksPerPage),
    countSearchResults(query),
  ]);

  return (
    <main className="max-w-7xl mx-auto flex flex-col py-8 px-6 lg:px-8 bg-surface-section text-text-primary min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6">
        Kết quả tìm kiếm cho:{" "}
        <span className="text-primary">&quot;{query}&quot;</span>{" "}
      </h1>
      <SearchResultsClient
        initialSearchResults={searchResults}
        initialTotalResults={totalResults}
        query={query}
        booksPerPage={booksPerPage}
        currentPage={currentPage}
      />
    </main>
  );
}
