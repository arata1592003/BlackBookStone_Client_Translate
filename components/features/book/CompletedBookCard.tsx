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
        flex-none shrink-0
        w-[100px] xs:w-[110px] sm:w-[120px] md:w-[130px] lg:w-[140px]
      "
    >
      <div
        className="
          flex flex-col
          items-center
          text-center
          w-full
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
            shadow-sm
            group-hover:shadow-md
            transition-all
            duration-200
          "
        >
          {book.cover_image_url ? (
            <Image
              src={book.cover_image_url}
              alt={book.book_name_translated ?? ""}
              fill
              sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 140px"
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}
        </div>

        <div className="mt-2 w-full">
          <p
            className="
              text-xs
              font-medium
              text-text-primary
              line-clamp-2
              group-hover:text-primary-accent
              transition-colors
              px-1
            "
          >
            {book.book_name_translated}
          </p>
          <p
            className="
              text-[10px]
              text-text-muted
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
