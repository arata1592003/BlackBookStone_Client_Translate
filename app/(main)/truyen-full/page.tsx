import { getCompletedBookList, countAllCompletedBooks } from "@/modules/book/book.service";
import CompletedBooksClient from "@/components/features/book/CompletedBooksClient";
import { TagListSidebar } from "@/components/features/tag/TagListSidebar";
import type { Metadata } from "next";

interface CompletedBooksPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "BlackStoneBook";

export const metadata: Metadata = {
  title: `${APP_NAME} - Truyện đã hoàn thành (Full)`,
  description: `Đọc truyện online bản Full, đã hoàn thành chương tại ${APP_NAME}.`,
};

export default async function CompletedBooksPage({ searchParams }: CompletedBooksPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const booksPerPage = 30; // 6 per row on xl * 5 rows
  const offset = (currentPage - 1) * booksPerPage;

  const [books, totalBooks] = await Promise.all([
    getCompletedBookList(booksPerPage, offset),
    countAllCompletedBooks(),
  ]);

  return (
    <main className="max-w-screen-2xl mx-auto py-6 px-4 md:px-8 xl:px-32 bg-surface-section min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* MAIN CONTENT */}
        <section className="flex-1 min-w-0">
          <CompletedBooksClient
            initialBooks={books}
            initialTotalBooks={totalBooks}
            booksPerPage={booksPerPage}
            currentPage={currentPage}
          />
        </section>

        {/* SIDEBAR - Desktop */}
        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-24 bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm">
            <TagListSidebar />
          </div>
        </aside>
      </div>
    </main>
  );
}
