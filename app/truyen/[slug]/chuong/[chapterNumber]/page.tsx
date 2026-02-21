import { ChapterContent } from "@/components/features/chapter/ChapterContent";
import { Breadcrumb } from "@/components/ui/BreadCumb";
import { Pagination } from "@/components/ui/Pagination";
import { getChapterDetailBySlugAndNumber } from "@/modules/chapter/chapter.service";
import type { Metadata } from "next";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "App";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, chapterNumber } = await params;
  const chapterNumberic = Number(chapterNumber);

  if (!Number.isInteger(chapterNumberic)) {
    return {
      title: "Chương không hợp lệ",
      description: "Chương bạn đang tìm không hợp lệ.",
    };
  }

  const chapter = await getChapterDetailBySlugAndNumber(slug, chapterNumberic);

  if (!chapter) {
    return {
      title: "Không tìm thấy chương",
      description: "Chương bạn đang tìm không tồn tại.",
    };
  }

  const title = `${chapter.book_name} - Chương ${chapter.chapter_number}: ${chapter.title} | ${APP_NAME}`;
  const description = `Đọc chương ${chapter.chapter_number} của truyện ${chapter.book_name} online miễn phí tại ${APP_NAME}.`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      // You can add images here if available for chapters
    },
  };
}

interface PageProps {
  params: {
    slug: string;
    chapterNumber: string;
  };
}

export default async function ChapterReadPage({ params }: PageProps) {
  const { slug, chapterNumber } = await params;

  const chapterNumberic = Number(chapterNumber);

  if (!Number.isInteger(chapterNumberic)) {
    throw new Error("Invalid chapter number");
  }

  const chapter = await getChapterDetailBySlugAndNumber(slug, chapterNumberic);

  if (!chapter) {
    return <div>Chapter not found</div>;
  }

  return (
    <div className="mx-auto flex flex-col relative bg-white min-h-screen">
      <div className="flex flex-col items-start gap-[30px] px-[50px] py-5 relative self-stretch w-full flex-[0_0_auto] bg-surface-section">
        <Breadcrumb
          slug={slug}
          bookTitle={chapter.book_name}
          chapterTitle={chapter.title}
          chapterNumber={chapter.chapter_number}
        />

        <Pagination
          slug={slug}
          prevChapter={chapter.prev_chapter}
          nextChapter={chapter.next_chapter}
        />

        <ChapterContent
          chapterNumber={chapter.chapter_number}
          title={chapter.title}
          wordCount={chapter.total_words}
          createdAt={chapter.created_at}
          content={chapter.content}
        />

        <Pagination
          slug={slug}
          prevChapter={chapter.prev_chapter}
          nextChapter={chapter.next_chapter}
        />
      </div>
    </div>
  );
}
