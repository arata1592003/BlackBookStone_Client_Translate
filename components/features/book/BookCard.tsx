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
        w-[100px] xs:w-[110px] sm:w-[120px] md:w-[130px] lg:w-[140px]
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
          sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 140px"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <p
        className="
        mt-2.5
        text-xs
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
