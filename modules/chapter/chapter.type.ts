export type ChapterDetail = {
  id: string;
  slug: string;
  book_name: string;
  chapter_number: number;
  title: string;
  content: string;
  views: number;
  total_words: number;
  created_at: string;
  prev_chapter: number | null;
  next_chapter: number | null;
};

export type ChapterRow = {
  id: string;
  chapter_number: number;
  chapter_title_translated: string | null;
  created_at: string | null;
};

export type ChapterEntity = {
  id: string;
  book_id: string;
  chapter_number: number;
  chapter_title_raw: string | null;
  chapter_title_translated: string | null;
  summary_translated: string | null;
  published_at_raw: string | null;
  view_count: number;
  chapter_status: boolean | null;
  total_words_translate: number | null;
  total_words_raw: number | null;
  url_raw: string | null;
  created_at: string;
  updated_at: string;
};
