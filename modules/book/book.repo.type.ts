export type UserBookItemRow = {
  id: string;
  name: string | null;
  updated_at: string;
  chapters: {
    content_translated: string | null;
  }[];
};

export type BookInsertPayload = {
  user_id: string;
  name: string;
  expire_at?: string;
};

export type ManagedBookRow = {
  id: string;
  name: string | null;
  created_at: string;
  updated_at: string;
};

export type ManagedChapterRow = {
  id: string;
  chapter_number: number;
  chapter_title_translated: string | null;
  chapter_title_raw: string | null;
  updated_at: string;
  total_words_raw: number | null;
  content_translated: string | null;
};

export type ChapterContentRow = {
  id: string;
  content_raw: string | null;
  content_translated: string | null;
};

export type BookInfoRow = {
  id: string;
  name: string | null;
  profiles:
    | {
        full_name: string | null;
      }[]
    | null;
};
