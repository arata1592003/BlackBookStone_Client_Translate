// features/book/book.types.ts
export interface Book {
  id: string;
  book_name_translated: string | null;
  author_name_translated: string | null;
  cover_image_url: string | null;
  slug: string;
}
