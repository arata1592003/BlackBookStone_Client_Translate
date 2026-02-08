export type CreateBookInput = {
  book_name_raw?: string | null;
  book_name_translated: string;
  author_name_raw?: string | null;
  author_name_translated: string;
  url_raw?: string | null;
  cover_image_url?: string | null;
  description?: string | null;
  source_book_code?: string | null;
  genres?: string[]; // tag_id[]
};
