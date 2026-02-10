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

// Kiểu dữ liệu cho phản hồi từ API lấy book-info
export type BookInfoFromSourceResponse = {
  source: string;
  book_id: string;
  book_name_raw: string;
  author_name_raw: string;
  url_raw: string;
  cover_image_url: string | null;
};

// Kiểu dữ liệu cho request body API tạo book mới
export type BookCreateRequest = {
  source: string;
  book_id: string; // ID của truyện từ nguồn
  book_name_raw: string;
  author_name_raw: string;
  book_name_translated: string;
  author_name_translated: string;
  publication_status: string; // Ví dụ: "ongoing", "completed"
  url_raw: string; // URL gốc chính thức
  cover_image_url: string | null;
  description: string | null;
  list_tag: string[]; // Mảng các tag_id
};

// Kiểu dữ liệu cho phản hồi API tạo book mới
export type BookCreateResponse = {
  book_id: string; // ID của sách đã được tạo trong hệ thống
};

export type ManagedBookDetails = {
  id: string;
  slug: string;
  title: string; // book_name_translated
  originalTitle: string | null; // book_name_raw
  author: string; // author_name_translated
  originalAuthor: string | null; // author_name_raw
  description: string | null;
  status: string | null; // publication_status
  coverImageUrl: string | null;
  source: string | null; // source_name
  sourceUrl: string | null; // url_raw
  createdAt: string;
  updatedAt: string;
  chapters: ManagedChapter[];
};

export type ManagedChapter = {
  id: string;
  chapterNumber: number;
  title: string; // title_translated
  originalTitle: string | null; // title_raw
  status: boolean; // "DONE", "PENDING", "ERROR"
  lastUpdated: string; // updated_at
};

export type ChapterContent = {
  contentRaw: string | null;
  contentTranslated: string | null;
};
