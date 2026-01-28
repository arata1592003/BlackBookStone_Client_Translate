import { BookDetailSection } from "@/components/features/book/BookDetailSection";
import { HomeHeader } from "@/components/layout/HomeHeader";
import { getBookInfo } from "@/modules/book/book.service";
import { getNewestChapterListByBookSlug } from "@/modules/chapter/chapter.service";

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
      <HomeHeader />
      <div className="flex items-start gap-4 md:gap-[30px] px-4 py-4 md:px-8 lg:px-[50px] md:py-5 relative w-full bg-[#292929]">
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