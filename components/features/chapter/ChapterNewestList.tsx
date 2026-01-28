"use client";

import { ChapterRow } from "@/modules/chapter/chapter.type";
import { timeAgo } from "@/utils/date";
import Link from "next/link";

type Props = {
  slug: string;
  newestChapterList: ChapterRow[];
};

export const ChapterNewestList = ({ slug, newestChapterList }: Props) => {
  return (
    <section className="flex flex-col w-[900px] items-start justify-center relative flex-[0_0_auto] rounded-[5px] overflow-hidden border border-solid border-white">
      <header className="flex w-[1340px] items-start gap-2.5 px-2.5 py-[15px] relative flex-[0_0_auto] mr-[-440.00px] border-b [border-bottom-style:solid] border-white">
        <h2 className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-white text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
          Danh sách chương mới
        </h2>
      </header>

      {newestChapterList.map((chapter) => (
        <Link
          key={chapter.id}
          href={`/truyen/${slug}/chuong/${chapter.chapter_number}`}
          className="flex items-start justify-between pl-2.5 pr-5 py-2.5 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-white no-underline text-white hover:bg-white/10"
        >
          <p className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-white text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
            Chương {chapter.chapter_number}: {chapter.chapter_title_translated}
          </p>

          <time className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-white text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
            {timeAgo(chapter.created_at)}
          </time>
        </Link>
      ))}
    </section>
  );
};
