import { BookCardWithAuthor } from "@/modules/book/book.types";
import Image from "next/image";
import Link from "next/link";

export const BookCard = ({ book }: { book: BookCardWithAuthor }) => {
  return (
    <Link
      href={`/truyen/${book.slug}`}
      className="
        block
        flex-none shrink-0
        w-[100px] sm:w-[120px] md:w-[140px]
        no-underline
        text-inherit
        group
      "
    >
      <div
        className="
        relative w-full aspect-[2/3]
        overflow-hidden rounded-lg
        bg-surface-raised
      "
      >
        <Image
          src={book.cover_image_url}
          alt={book.book_name_translated}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <p
        className="
        mt-2
        text-xs sm:text-sm
        text-text-secondary
        line-clamp-1
        text-center
        group-hover:text-red-400
      "
      >
        {book.book_name_translated}
      </p>
    </Link>
  );
};
