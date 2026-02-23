import Link from "next/link";
import { BookCard } from "@/components/features/book/BookCard";
import { BookVerticalList } from "@/components/features/book/BookVerticalList";
import { TagListSidebar } from "@/components/features/tag/TagListSidebar";
import { CompletedBookCard } from "@/components/features/book/CompletedBookCard";
import {
  BookCardWithAuthor,
  BookNewChapterCard,
  BookCompletedCard,
} from "@/modules/book/book.types";

type Props = {
  hotBooks: BookCardWithAuthor[];
  newChapterBooks: BookNewChapterCard[];
  completedBooks: BookCompletedCard[];
};

export const HomeOverviewSection = ({ hotBooks, newChapterBooks, completedBooks }: Props) => {
  const recommendedBooks = hotBooks.slice(0, 14);
  return (
    <section className="px-3 sm:px-4 lg:px-6 xl:px-32 py-6 bg-surface-section space-y-8 overflow-x-hidden">
      {/* ĐỀ CỬ */}
      <section className="p-3 rounded-lg bg-surface-card">
        <h2 className="text-text-muted text-lg md:text-xl font-semibold mb-4">Đề cử</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-y-6 gap-x-3 md:gap-4 justify-items-center">
          {recommendedBooks.map((book, index) => (
            <div 
              key={book.id} 
              className={index >= 12 ? "hidden md:block" : "block"}
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </section>

      {/* Main content and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Main Content (Chương mới) */}
        <div className="lg:col-span-8">
          <section className="p-1 rounded-lg bg-surface-card">
            <div className="flex justify-between items-center mb-4 px-3 border-b border-text-muted/20 pb-2">
              <h2 className="text-text-muted text-lg md:text-xl font-semibold">Truyện mới cập nhật</h2>
              <Link href="/truyen-moi-cap-nhat" className="text-primary hover:underline text-sm font-medium">
                Xem thêm
              </Link>
            </div>
            <BookVerticalList books={newChapterBooks} />
          </section>
        </div>

        {/* Sidebar (Tag List) */}
        <div className="lg:col-span-4">
          <section className="p-3 rounded-lg bg-surface-card h-full">
            <h2 className="text-text-muted text-lg md:text-xl font-semibold mb-4">
              Thể loại
            </h2>
            <TagListSidebar />
          </section>
        </div>
      </div>

      {/* Completed Books Section */}
      <section className="p-3 rounded-lg bg-surface-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-text-muted text-lg md:text-xl font-semibold">Truyện đã hoàn thành</h2>
          <Link href="/truyen-hoan-thanh" className="text-primary hover:underline text-sm font-medium">
            Xem thêm
          </Link>
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-y-6 gap-x-3 md:gap-4 justify-items-center">
          {completedBooks.slice(0, 20).map((book) => (
            <CompletedBookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </section>
  );
};