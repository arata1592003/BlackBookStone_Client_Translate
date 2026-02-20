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

  view: number;
};

export type BookNewChapterCard = BookCardWithAuthor & {
  latestChapterNumber: number | null;
  latestChapterUpdatedAt: string | null;
  genres: string[];
};

export type BookCompletedCard = BookCardWithAuthor & {
  totalChapters: number;
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

// Kiểu dữ liệu cho phản hồi từ API lấy book-info
export type BookInfoFromSourceResponse = {
  source: string;
  source_book_code: string;
  book_name_raw: string;
  author_name_raw: string;
  url_raw: string;
  cover_image_url: string | null;
};

export type BookCreateRequest = {
  source: string;
  book_id: string;
  book_name_raw: string;
  author_name_raw: string;
  book_name_translated: string;
  author_name_translated: string;
  publication_status: string; // Ví dụ: "ongoing", "completed"
  url_raw: string;
  cover_image_url: string | null;
  description: string | null;
  list_tag: string[];
};

export type BookCreateResponse = {
  book_id: string;
};

export type ManagedBookDetails = {
  id: string;
  slug: string;
  title: string;
  originalTitle: string | null;
  author: string;
  originalAuthor: string | null;
  description: string | null;
  status: string | null;
  coverImageUrl: string | null;
  source: string | null;
  sourceUrl: string | null;
  createdAt: string;
  updatedAt: string;
  chapters: ManagedChapter[];
  genres: string[] | null;
};

export type ManagedChapter = {
  id: string;
  chapterNumber: number;
  title: string;
  originalTitle: string | null;
  status: boolean; // "DONE", "PENDING", "ERROR"
  lastUpdated: string;
  totalWordsRaw: number | null;
  urlRaw: string | null;
};

export type ChapterContent = {
  contentRaw: string | null;
  contentTranslated: string | null;
};
