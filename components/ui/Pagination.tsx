import Link from "next/link";

interface Props {
  slug: string;
  prevChapter?: number | null;
  nextChapter?: number | null;
}

export const Pagination = ({
  slug,
  prevChapter,
  nextChapter,
}: Props) => {
  const commonButtonClasses = `inline-flex items-center justify-center gap-2 px-3 py-1.5 md:gap-2.5 md:px-2.5 md:py-[5px] relative bg-[#3600c0] rounded-[20px] overflow-hidden cursor-pointer border-0 font-roboto font-medium text-white text-base tracking-[0] leading-[normal] whitespace-nowrap`;
  const hoverEffectClasses = `hover:bg-[#4a00ff] transition-colors`;
  const disabledClasses = `opacity-50 cursor-not-allowed`;

  return (
    <nav className="flex items-center justify-center gap-2 md:gap-[10px] relative w-full py-2 md:py-2.5">
      {/* Prev */}
      {prevChapter ? (
        <Link
          href={`/truyen/${slug}/chuong/${prevChapter}`}
          className={`${commonButtonClasses} ${hoverEffectClasses}`}
        >
          Chương trước
        </Link>
      ) : (
        <span className={`${commonButtonClasses} ${disabledClasses}`}>
          Chương trước
        </span>
      )}

      {/* Center button */}
      <button
        className={`${commonButtonClasses}`}
        disabled
      >
        ...
      </button>

      {/* Next */}
      {nextChapter ? (
        <Link
          href={`/truyen/${slug}/chuong/${nextChapter}`}
          className={`${commonButtonClasses} ${hoverEffectClasses}`}
        >
          Chương tiếp
        </Link>
      ) : (
        <span className={`${commonButtonClasses} ${disabledClasses}`}>
          Chương tiếp
        </span>
      )}
    </nav>
  );
};