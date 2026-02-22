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
          grid-cols-[auto_1fr_auto]
          md:grid-cols-[auto_1fr_170px_100px_100px]
          items-center
          gap-2 md:gap-3
          py-2 md:py-0
          min-h-[60px]
          rounded-md
          px-1
          transition-colors
          group-hover:bg-foreground/5
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-primary/60
        "
      >
        {/* Cover */}
        <div
          className="
            relative
            w-[32px]
            sm:w-[36px]
            md:w-[40px]
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
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}
        </div>

        {/* Title & Info */}
        <div className="min-w-0 flex flex-col justify-center">
          <span
            className="
              text-sm
              md:text-base
              text-text-secondary
              font-medium
              line-clamp-1
              group-hover:text-primary-accent
            "
          >
            {book.book_name_translated}
          </span>
          
          {/* Mobile-only info (Chapter number) */}
          <div className="flex items-center gap-2 md:hidden">
             {book.author_name_translated && (
              <span className="text-[10px] text-text-muted line-clamp-1 max-w-[80px]">
                {book.author_name_translated}
              </span>
            )}
            <span className="text-[10px] text-primary-accent font-bold">
              {book.latestChapterNumber ? `Chương ${book.latestChapterNumber}` : ""}
            </span>
          </div>

          {/* Desktop-only info (Author) */}
          {book.author_name_translated && (
            <span
              className="
                hidden md:block
                text-xs
                text-text-muted
                line-clamp-1
              "
            >
              {book.author_name_translated}
            </span>
          )}
        </div>

        {/* Genres - Hidden on small screens */}
        <div className="hidden md:block text-sm text-text-muted text-left whitespace-nowrap overflow-hidden text-ellipsis pl-2">
          {genresText}
        </div>

        {/* Chapter Number - Hidden on small screens, shown separately on mobile */}
        <div className="hidden md:block text-sm text-text-muted text-left whitespace-nowrap overflow-hidden text-ellipsis">
          {book.latestChapterNumber && `Chương ${book.latestChapterNumber}`}
        </div>

        {/* Time Ago */}
        <div className="text-[10px] md:text-sm text-text-muted text-right md:text-left whitespace-nowrap overflow-hidden text-ellipsis pl-2">
          {timeAgo}
        </div>
      </div>
    </Link>
  );
}
