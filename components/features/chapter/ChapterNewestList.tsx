"use client";

import { ChapterRow } from "@/modules/chapter/chapter.type";
import { timeAgo } from "@/utils/date";
import Link from "next/link";
import { Zap } from "lucide-react";

type Props = {
  slug: string;
  newestChapterList: ChapterRow[];
};

export const ChapterNewestList = ({ slug, newestChapterList }: Props) => {
  return (
    <section className="flex flex-col w-full items-start justify-center relative flex-[0_0_auto] rounded-lg overflow-hidden border border-primary/20 bg-surface-card shadow-md">
      <header className="flex w-full items-center gap-2 px-4 py-3 bg-primary/10 border-b border-primary/20">
        <Zap size={18} className="text-primary-accent" />
        <h2 className="font-roboto font-bold text-primary-accent text-base md:text-lg tracking-tight uppercase">
          Chương mới cập nhật
        </h2>
      </header>

      <div className="flex flex-col w-full">
        {newestChapterList.map((chapter, index) => (
          <Link
            key={chapter.id}
            href={`/truyen/${slug}/chuong/${chapter.chapter_number}`}
            className={`flex items-start justify-between px-4 py-3 border-b border-border-default/50 last:border-none no-underline text-text-secondary hover:bg-primary/5 transition-colors`}
          >
            <p className="flex-1 font-roboto font-medium text-sm md:text-base line-clamp-1 pr-4">
              Chương {chapter.chapter_number}: {chapter.chapter_title_translated}
            </p>

            <time className="font-roboto font-normal text-text-muted text-[10px] md:text-sm whitespace-nowrap pt-0.5">
              {timeAgo(chapter.created_at)}
            </time>
          </Link>
        ))}
      </div>
    </section>
  );
};
