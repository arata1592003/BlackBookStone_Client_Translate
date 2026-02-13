import { BookNewChapterCard } from "@/modules/book/book.types";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { vi } from "date-fns/locale";

export function BookRowItem({ book }: { book: BookNewChapterCard }) {
  const genresText =
    book.genres.length > 0 ? `[${book.genres.join(", ")}]` : "";

  // Format time using date-fns
  const timeAgo = book.latestChapterUpdatedAt
    ? formatDistanceToNowStrict(new Date(book.latestChapterUpdatedAt), {
        addSuffix: true,
        locale: vi,
      })
    : "";

  return (
    <Link
      href={`/truyen/${book.slug}`}
      className="
        block
        no-underline
        text-inherit
        group
      "
    >
      <div
        className="
          grid
          grid-cols-[auto_1fr_170px_100px_100px]
          items-center
          gap-3
          min-h-[60px]
          rounded-md
          px-1
          transition-colors
          group-hover:bg-white/5
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-red-500/60
        "
      >
        {/* Cover */}
        <div
          className="
            relative
            w-[24px]
            sm:w-[30px]
            md:w-[36px]
            aspect-[2/3]
            shrink-0
            rounded
            overflow-hidden
            bg-surface-raised
          "
        >
          {book.cover_image_url ? (
            <Image
              src={book.cover_image_url}
              alt={book.book_name_translated ?? ""}
              fill
              sizes="
                (max-width: 640px) 24px,
                (max-width: 768px) 30px,
                36px
              "
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-700" />
          )}
        </div>

        {/* Title */}
        <div className="min-w-0 flex flex-col justify-center">
          <span
            className="
              text-sm
              sm:text-base
              text-text-secondary
              font-medium
              line-clamp-1
              group-hover:text-red-400
            "
          >
            {book.book_name_translated}
          </span>
          {book.author_name_translated && (
            <span
              className="
                text-xs
                text-neutral-400
                line-clamp-1
              "
            >
              {book.author_name_translated}
            </span>
          )}
        </div>

        {/* Genres */}
        <div className="text-sm text-neutral-400 text-left whitespace-nowrap overflow-hidden text-ellipsis pl-2 hidden sm:block">
          {" "}
          {/* Hidden on small screens */}
          {genresText}
        </div>

        {/* Chapter Number */}
        <div className="text-sm text-neutral-400 text-left whitespace-nowrap overflow-hidden text-ellipsis hidden sm:block">
          {" "}
          {/* Hidden on small screens */}
          {book.latestChapterNumber && `Chương ${book.latestChapterNumber}`}
        </div>

        {/* Time Ago */}
        <div className="text-sm text-neutral-400 text-left whitespace-nowrap overflow-hidden text-ellipsis pl-2">
          {timeAgo}
        </div>
      </div>
    </Link>
  );
}
