import { BookCompletedCard } from "@/modules/book/book.types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  book: BookCompletedCard;
};

export const CompletedBookCard = ({ book }: Props) => {
  return (
    <Link
      href={`/truyen/${book.slug}`}
      className="
        block
        group
        no-underline
        text-inherit
      "
    >
      <div
        className="
          flex flex-col
          items-center
          text-center
        "
      >
        <div
          className="
            relative
            w-full
            aspect-[2/3]
            rounded-md
            overflow-hidden
            bg-surface-raised
            shadow-md
            group-hover:shadow-lg
            transition-all
            duration-200
          "
        >
          {book.cover_image_url ? (
            <Image
              src={book.cover_image_url}
              alt={book.book_name_translated ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes, adjust as needed
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-700" />
          )}
        </div>

        <div className="mt-2 w-full">
          <p
            className="
              text-sm
              font-medium
              text-text-primary
              line-clamp-2
              group-hover:text-red-400
              transition-colors
            "
          >
            {book.book_name_translated}
          </p>
          <p
            className="
              text-xs
              text-neutral-500
              line-clamp-1
            "
          >
            {book.totalChapters} Chương
          </p>
        </div>
      </div>
    </Link>
  );
};
