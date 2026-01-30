import { BookVerticalList } from "@/components/features/book/BookVerticalList";
import { HorizontalBookScroller } from "@/components/features/book/HorizontalBookScroller";
import { BookCardWithAuthor } from "@/modules/book/book.types";

type Props = {
  books: BookCardWithAuthor[];
};

export const HomeOverviewSection = ({ books }: Props) => {
  return (
    <section className="px-3 sm:px-4 lg:px-6 xl:px-32 py-6 bg-[#292929] space-y-8">
      {/* ĐỀ CỬ */}
      <section className="p-4 rounded-lg bg-[#1f1f1f]">
        <h2 className="text-gray-400 text-xl font-semibold mb-4">Đề cử</h2>
        <HorizontalBookScroller books={books} />
      </section>

      {/* 2 CỘT → MOBILE THÀNH 1 CỘT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="p-4 rounded-lg bg-[#1f1f1f]">
          <h2 className="text-gray-400 text-xl font-semibold mb-4">
            Truyện mới
          </h2>
          <BookVerticalList books={books} />
        </section>

        <section className="p-4 rounded-lg bg-[#1f1f1f]">
          <h2 className="text-gray-400 text-xl font-semibold mb-4">
            Chương mới
          </h2>
          <BookVerticalList books={books} />
        </section>
      </div>
    </section>
  );
};
