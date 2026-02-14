import { BookDetailSection } from "@/components/features/book/BookDetailSection";
import { getBookInfo } from "@/modules/book/book.service";
import { getNewestChapterListByBookSlug } from "@/modules/chapter/chapter.service";
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bookInfo = await getBookInfo(slug);

  if (!bookInfo) {
    return {
      title: "Không tìm thấy truyện",
      description: "Trang bạn đang tìm không tồn tại.",
    };
  }

  return {
    title: bookInfo.book_name_translated,
    description: bookInfo.description
      ? bookInfo.description.substring(0, 150) + "..."
      : `Đọc truyện ${bookInfo.book_name_translated} online miễn phí tại Hắc Thạch Thôn.`,
    openGraph: {
      title: bookInfo.book_name_translated,
      description: bookInfo.description
        ? bookInfo.description.substring(0, 150) + "..."
        : `Đọc truyện ${bookInfo.book_name_translated} online miễn phí tại Hắc Thạch Thôn.`,
      images: [
        {
          url: bookInfo.cover_image_url,
          alt: bookInfo.book_name_translated,
        },
      ],
    },
  };
}

// Tái xác thực trang này sau mỗi 300 giây (5 phút)
export const revalidate = 300;

type Props = {
  params: {
    slug: string;
  };
};

export default async function BookDetailPage({ params }: Props) {
  const { slug } = await params;

  const bookInfo = await getBookInfo(slug);
  const newestChapterList = await getNewestChapterListByBookSlug(slug, 10);

  return (
    <div className="max-w-screen-2xl mx-auto flex flex-col bg-white min-h-screen ">
      <div className="flex items-start gap-4 md:gap-[30px] px-4 py-4 md:px-8 lg:px-[50px] md:py-5 relative w-full bg-surface-section">
        <div className="flex flex-col items-start gap-4 md:gap-[30px] relative w-full">
          <BookDetailSection
            slug={slug}
            bookInfo={bookInfo}
            newestChapterList={newestChapterList}
          />
        </div>
      </div>
    </div>
  );
}
