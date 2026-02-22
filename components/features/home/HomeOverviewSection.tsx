import Link from "next/link";
import { BookCard } from "@/components/features/book/BookCard";
import { BookVerticalList } from "@/components/features/book/BookVerticalList";
import { TagListSidebar } from "@/components/features/tag/TagListSidebar";
import { CompletedBookCard } from "@/components/features/book/CompletedBookCard"; // Import CompletedBookCard
import {
  BookCardWithAuthor,
  BookNewChapterCard,
  BookCompletedCard, // Import BookCompletedCard
} from "@/modules/book/book.types";

type Props = {
  hotBooks: BookCardWithAuthor[];
  newChapterBooks: BookNewChapterCard[]; // New prop for new chapters
  completedBooks: BookCompletedCard[]; // New prop for completed books
};

export const HomeOverviewSection = ({ hotBooks, newChapterBooks, completedBooks }: Props) => {
  const recommendedBooks = hotBooks.slice(0, 14); // Use hotBooks for recommended
  return (
    <section className="px-3 sm:px-4 lg:px-6 xl:px-32 py-6 bg-surface-section space-y-8">
      {/* ĐỀ CỬ */}
      <section className="p-3 rounded-lg bg-surface-card">
        <h2 className="text-text-muted text-xl font-semibold mb-4">Đề cử</h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {recommendedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Main content and Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Content (Chương mới) */}
        <div className="md:col-span-8">
          <section className="p-1 rounded-lg bg-surface-card">
            <div className="flex justify-between items-center mb-4 px-3 border-b border-text-muted/20 pb-2">
              <h2 className="text-text-muted text-xl font-semibold">Truyện mới cập nhật</h2>
              <Link href="/truyen-moi-cap-nhat" className="text-primary hover:underline text-sm font-medium">
                Xem thêm
              </Link>
            </div>
            <BookVerticalList books={newChapterBooks} />{" "}
            {/* Use newChapterBooks here */}
          </section>
        </div>

        {/* Sidebar (Tag List) */}
        <div className="md:col-span-4">
          <section className="p-3 rounded-lg bg-surface-card">
            <h2 className="text-text-muted text-xl font-semibold mb-4">
              Thể loại
            </h2>
            <TagListSidebar />
          </section>
        </div>
      </div>

      {/* Completed Books Section */}
      <section className="p-3 rounded-lg bg-surface-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-text-muted text-xl font-semibold">Truyện đã hoàn thành</h2>
          <Link href="/truyen-hoan-thanh" className="text-primary hover:underline text-sm font-medium">
            Xem thêm
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 gap-4"> {/* 2 rows, 10 columns implies 20 books */}
          {completedBooks.slice(0, 20).map((book) => (
            <CompletedBookCard key={book.id} book={book} /> // Replace BookCard with CompletedBookCard
          ))}
        </div>
      </section>
    </section>
  );
};