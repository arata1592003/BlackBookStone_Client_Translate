import { getBooksByTag, countBooksByTag } from "@/modules/book/book.service";
import CategoryBooksClient from "@/components/features/tag/CategoryBooksClient";
import { TagListSidebar } from "@/components/features/tag/TagListSidebar";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "BlackStoneBook";

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tagName = decodeURIComponent(resolvedParams.slug);

  return {
    title: `${APP_NAME} - Thể loại ${tagName}`,
    description: `Khám phá các bộ truyện thuộc thể loại ${tagName} trên ${APP_NAME}.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const tagName = decodeURIComponent(resolvedParams.slug);
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const booksPerPage = 12;
  const offset = (currentPage - 1) * booksPerPage;

  const [books, totalBooks] = await Promise.all([
    getBooksByTag(tagName, offset, booksPerPage),
    countBooksByTag(tagName),
  ]);

  return (
    <main className="max-w-screen-2xl mx-auto py-6 px-4 md:px-8 xl:px-32 bg-surface-section min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR - Desktop */}
        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-24 bg-surface-card p-6 rounded-2xl border border-border-default shadow-sm">
            <TagListSidebar />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 min-w-0">
          <CategoryBooksClient
            tagName={tagName}
            initialBooks={books}
            initialTotalBooks={totalBooks}
            booksPerPage={booksPerPage}
            currentPage={currentPage}
          />
        </section>
      </div>
    </main>
  );
}
