import { getBooksWithFiltersAndSort, countBooksWithFiltersAndSort } from "@/modules/book/book.service";
import StatusBooksClient from "@/components/features/book/StatusBooksClient";
import type { Metadata } from "next";

interface StatusPageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "BlackStoneBook";

export const metadata: Metadata = {
  title: `${APP_NAME} - Trạng thái phát hành`,
  description: `Duyệt truyện theo tình trạng đang ra hoặc đã hoàn thành trên ${APP_NAME}.`,
};

export default async function StatusPage({ searchParams }: StatusPageProps) {
  const resolvedSearchParams = await searchParams;
  
  const status = resolvedSearchParams.status || "ongoing";
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const booksPerPage = 35; // 7 per row on xl * 5 rows
  const offset = (currentPage - 1) * booksPerPage;

  const [books, totalBooks] = await Promise.all([
    getBooksWithFiltersAndSort({
      status,
      sortBy: "newest",
      offset,
      limit: booksPerPage,
    }),
    countBooksWithFiltersAndSort({
      status,
    }),
  ]);

  return (
    <main className="max-w-screen-2xl mx-auto py-6 px-4 md:px-8 xl:px-32 bg-surface-section min-h-screen">
      <StatusBooksClient
        initialResults={books}
        initialTotalResults={totalBooks}
        currentStatus={status}
        booksPerPage={booksPerPage}
        currentPage={currentPage}
      />
    </main>
  );
}
