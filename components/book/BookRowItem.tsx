import { Book } from "@/features/book/book.types";
import Image from "next/image";
import Link from "next/link";

export function BookRowItem({ book }: { book: Book }) {
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
          flex items-center gap-3
          min-h-[72px]
          rounded-md
          px-2 py-1
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
            w-[40px]
            sm:w-[44px]
            md:w-[52px]
            aspect-[2/3]
            shrink-0
            rounded
            overflow-hidden
            bg-neutral-800
          "
        >
          {book.cover_image_url ? (
            <Image
              src={book.cover_image_url}
              alt={book.book_name_translated ?? ""}
              fill
              sizes="
                (max-width: 640px) 40px,
                (max-width: 768px) 44px,
                52px
              "
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-700" />
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center min-w-0">
          <span
            className="
              text-sm
              sm:text-base
              text-white
              font-medium
              line-clamp-1
              group-hover:text-red-400
            "
          >
            {book.book_name_translated}
          </span>

          <span
            className="
              text-xs
              text-neutral-400
              line-clamp-1
            "
          >
            {book.author_name_translated ?? "Unknown"}
          </span>
        </div>
      </div>
    </Link>
  );
}
