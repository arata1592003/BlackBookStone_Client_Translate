export type BookCardWithAuthorRow = {
  id: string;
  slug: string;
  book_name_translated: string | null;
  author_name_translated: string | null;
  cover_image_url: string | null;
  description: string | null;
  publication_status: string | null;
  created_at: string;
};

export type SearchBookRepoRow = BookCardWithAuthorRow & {
  chapter_count: number;
  total_views?: number;
};

export type BookNewChapterCardRow = BookCardWithAuthorRow & {
  book_tags: {
    tags: {
      name: string;
    }[];
  }[];
  chapters: {
    chapter_number: number;
    updated_at: string;
  }[];
};

export type BookCompletedCardRow = BookCardWithAuthorRow & {
  book_chapter_stats: BookChapterStatsRow[];
};

export type BookInfoRow = {
  id: string;
  slug: string;
  book_name_translated: string | null;
  description: string;
  author_name_translated: string | null;
  publication_status: string | null;
  cover_image_url: string | null;
  users:
    | {
        first_name: string | null;
        last_name: string | null;
      }[]
    | null;
};

export type ChapterStatRow = {
  total_words_translate: number | null;
  view_count: number | null;
};

export type BookChapterStatsRow = {
  total_chapters: number;
  translated_chapters: number;
};

export type UserBookItemRow = {
  id: string;
  slug: string;
  book_name_translated: string | null;
  author_name_translated: string | null;
  publication_status: string | null;
  cover_image_url: string | null;

  is_published: boolean;
  draft_expires_at: string;
  updated_at: string;

  book_tags: {
    tags: {
      name: string;
    }[];
  }[];

  book_chapter_stats:
    | {
        total_chapters: number;
        translated_chapters: number;
      }[]
    | null;
};

export type BookInsertPayload = {
  source_id: string;
  owner_user_id: string;
  book_name_raw: string | null;
  book_name_translated: string;
  author_name_raw: string | null;
  author_name_translated: string;
  publication_status: string | null;
  url_raw: string | null;
  cover_image_url: string | null;
  description: string | null;
  source_book_code: string | null;
  slug: string | null;
};

export type BookTagInsertPayload = {
  book_id: string;
  tag_id: string;
};

export type ManagedBookRow = {
  id: string;
  slug: string;
  book_name_translated: string | null;
  book_name_raw: string | null;
  author_name_translated: string | null;
  author_name_raw: string | null;
  description: string | null;
  publication_status: string | null;
  cover_image_url: string | null;
  url_raw: string | null;
  source_name: string;
  source_url: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type ManagedChapterRow = {
  id: string;
  chapter_number: number;
  chapter_title_translated: string | null;
  chapter_title_raw: string | null;
  chapter_status: boolean; // "DONE", "PENDING", "ERROR"
  updated_at: string;
  total_words_raw: number | null; // Thêm trường này
  url_raw: string | null; // Thêm trường này
};

export type ChapterContentRow = {
  id: string;
  content_raw: string | null;
  content_translated: string | null;
};
