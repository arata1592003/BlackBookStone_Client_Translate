import { BookCardWithAuthor } from "@/modules/book/book.types";
import { BookRowItem } from "./BookRowItem";

type Props = {
  books: BookCardWithAuthor[];
};

export const BookVerticalList = ({ books }: Props) => {
  return (
    <div className="flex flex-col gap-3">
      {books.map((book) => (
        <BookRowItem key={book.id} book={book} />
      ))}
    </div>
  );
};
