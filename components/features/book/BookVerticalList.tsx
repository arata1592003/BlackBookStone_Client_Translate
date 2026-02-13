import { BookNewChapterCard } from "@/modules/book/book.types"; // Import BookNewChapterCard
import { BookRowItem } from "./BookRowItem";

type Props = {
  books: BookNewChapterCard[]; // Updated prop type
};

export const BookVerticalList = ({ books }: Props) => {
  return (
    <div className="flex flex-col gap-1">
      {books.map((book) => (
        <BookRowItem key={book.id} book={book} />
      ))}
    </div>
  );
};
