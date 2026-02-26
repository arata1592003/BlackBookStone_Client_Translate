import { getLatestUpdatedBooks, countAllPublishedBooks } from "@/modules/book/book.service";
import LatestBooksClient from "@/components/features/book/LatestBooksClient";
import { TagListSidebar } from "@/components/features/tag/TagListSidebar";
import type { Metadata } from "next";

interface LatestBooksPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "BlackStoneBook";

export const metadata: Metadata = {
  title: `${APP_NAME} - Truyện mới cập nhật`,
  description: `Danh sách truyện mới cập nhật nhanh nhất trên ${APP_NAME}.`,
};

export default async function LatestBooksPage({ searchParams }: LatestBooksPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const booksPerPage = 30; // 30 books per page for list view
  const offset = (currentPage - 1) * booksPerPage;

  const [books, totalBooks] = await Promise.all([
    getLatestUpdatedBooks(offset, booksPerPage),
    countAllPublishedBooks(),
  ]);

  return (
    <main className="max-w-screen-2xl mx-auto py-6 px-4 md:px-8 xl:px-32 bg-surface-section min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* MAIN CONTENT */}
        <section className="flex-1 min-w-0">
          <LatestBooksClient
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
