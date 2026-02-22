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
        w-[115px] xs:w-[125px] sm:w-[130px] md:w-[140px]
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
        shadow-sm group-hover:shadow-md transition-shadow
      "
      >
        <Image
          src={book.cover_image_url}
          alt={book.book_name_translated}
          fill
          sizes="(max-width: 640px) 115px, (max-width: 768px) 130px, 140px"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <p
        className="
        mt-2.5
        text-[13px] sm:text-sm
        text-text-secondary
        font-medium
        line-clamp-2
        text-center
        group-hover:text-primary-accent
        transition-colors
        px-1
      "
      >
        {book.book_name_translated}
      </p>
    </Link>
  );
};
