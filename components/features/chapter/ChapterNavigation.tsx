"use client";

import Link from "next/link";

interface Props {
  bookSlug: string;
  prevChapterNumber?: number | null;
  nextChapterNumber?: number | null;
}

export const ChapterNavigation = ({
  bookSlug,
  prevChapterNumber,
  nextChapterNumber,
}: Props) => {
  return (
    <nav
      className="flex items-center justify-center gap-5 px-2.5 py-0 relative self-stretch w-full flex-[0_0_auto]"
      aria-label="Chapter navigation"
    >
      {prevChapterNumber ? (
        <Link
          href={`/truyen/${bookSlug}/chuong/${prevChapterNumber}`}
          className="inline-flex flex-col items-start gap-2.5 p-2.5 relative flex-[0_0_auto] bg-[#3600c0] rounded-[5px] overflow-hidden border-0 cursor-pointer transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#3600c0] no-underline"
          aria-label="Chương trước"
        >
          <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-white text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
            Chương trước
          </span>
        </Link>
      ) : (
        <span className="inline-flex flex-col items-start gap-2.5 p-2.5 relative flex-[0_0_auto] bg-[#3600c0] rounded-[5px] overflow-hidden opacity-50">
          <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-white text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
            Chương trước
          </span>
        </span>
      )}

      <button
        type="button"
        className="flex flex-col items-start gap-2.5 relative self-stretch bg-[#3600c0] rounded-[5px] overflow-hidden aspect-[1] border-0 cursor-pointer transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#3600c0]"
        aria-label="Menu"
      >
        <div className="relative flex-1 grow aspect-[1] bg-[url(/frame-120.png)] bg-cover bg-[50%_50%]" />
      </button>

      {nextChapterNumber ? (
        <Link
          href={`/truyen/${bookSlug}/chuong/${nextChapterNumber}`}
          className="inline-flex flex-col items-start gap-2.5 p-2.5 relative flex-[0_0_auto] bg-[#3600c0] rounded-[5px] overflow-hidden border-0 cursor-pointer transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#3600c0] no-underline"
          aria-label="Chương tiếp"
        >
          <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-white text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
            Chương tiếp
          </span>
        </Link>
      ) : (
        <span className="inline-flex flex-col items-start gap-2.5 p-2.5 relative flex-[0_0_auto] bg-[#3600c0] rounded-[5px] overflow-hidden opacity-50">
          <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-white text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
            Chương tiếp
          </span>
        </span>
      )}
    </nav>
  );
};
