"use client";

import { BookDetailTabs } from "@/components/features/book/BookDetailTabs";
import { BookInfoCard } from "@/components/features/book/BookInfoCard";
import { ChapterNewestList } from "@/components/features/chapter/ChapterNewestList";
import type { BookInfo } from "@/modules/book/book.types";
import type { ChapterRow } from "@/modules/chapter/chapter.type";
import { useRef } from "react";

type Props = {
  slug: string;
  bookInfo: BookInfo;
  newestChapterList: ChapterRow[];
};

export function BookDetailSection({
  slug,
  bookInfo,
  newestChapterList,
}: Props) {
  const chapterTabRef = useRef<HTMLDivElement>(null);

  const goToChapterList = () => {
    chapterTabRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-start gap-6 md:gap-[30px] px-0 md:px-[50px] py-5 relative self-stretch w-full flex-[0_0_auto]">
      <div className="flex flex-col items-start gap-6 md:gap-[30px] relative w-full">
        <BookInfoCard bookInfo={bookInfo} onGoChapterList={goToChapterList} />
        <ChapterNewestList slug={slug} newestChapterList={newestChapterList} />
        <div ref={chapterTabRef} className="w-full">
          <BookDetailTabs 
            bookId={bookInfo.id}
            slug={slug} 
            description={bookInfo.description || undefined} 
          />
        </div>
      </div>
    </div>
  );
}
