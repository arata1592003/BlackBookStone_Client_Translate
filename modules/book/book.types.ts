export type BookEntity = {
  id: string;
  source_id: string;
  owner_user_id: string;

  slug: string;

  book_name_raw: string | null;
  book_name_translated: string | null;

  author_name_raw: string | null;
  author_name_translated: string | null;

  publication_status: string | null;

  cover_image_url: string | null;
  url_raw: string | null;

  is_published: boolean | null;
  draft_expires_at: string | null;

  description: string | null;

  created_at: string;
  updated_at: string;
};

export type BookCardSimple = {
  id: string;

  slug: string;

  book_name_translated: string | null;

  cover_image_url: string | null;
};


export type BookCardWithAuthor = {
  id: string;

  slug: string;

  book_name_translated: string | null;

  author_name_translated: string | null;

  cover_image_url: string | null;
};


export type BookInfo = {
  id: string;

  slug: string;

  user_name: string;

  book_name_translated: string | null;

  author_name_translated: string | null;

  publication_status: string | null;

  description: string | null;

  count_word: number;

  count_chapter: number;

  view: number;

  cover_image_url: string | null;
};

export type UserBookItem = {
  id: string;
  slug: string;

  title: string | null;
  author: string | null;
  status: string | null;

  coverImageUrl: string | null;

  totalChapters: number;
  translatedChapters: number;  

  updatedAt: string;

  genres: string[];
};
