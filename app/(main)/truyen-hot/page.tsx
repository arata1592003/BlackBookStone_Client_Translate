import { getHotBookList, countAllPublishedBooks } from "@/modules/book/book.service";
import HotBooksClient from "@/components/features/book/HotBooksClient";
import { TagListSidebar } from "@/components/features/tag/TagListSidebar";
import type { Metadata } from "next";

interface HotBooksPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "BlackStoneBook";

export const metadata: Metadata = {
  title: `${APP_NAME} - Bảng xếp hạng truyện Hot`,
  description: `Xem những bộ truyện được đọc nhiều nhất, hấp dẫn nhất hiện nay trên ${APP_NAME}.`,
};

export default async function HotBooksPage({ searchParams }: HotBooksPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const booksPerPage = 30; // 6 per row on xl * 5 rows
  const offset = (currentPage - 1) * booksPerPage;

  const [books, totalBooks] = await Promise.all([
    getHotBookList(booksPerPage, offset),
    countAllPublishedBooks(),
  ]);

  return (
    <main className="max-w-screen-2xl mx-auto py-6 px-4 md:px-8 xl:px-32 bg-surface-section min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* MAIN CONTENT */}
        <section className="flex-1 min-w-0">
          <HotBooksClient
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
