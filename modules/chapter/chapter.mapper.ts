import { ChapterContentRow, ChapterWithBookSlugRow } from "./chapter.repo";
import { ChapterDetail, ChapterRow } from "./chapter.type";

export const mapToChapterRow = (row: ChapterWithBookSlugRow): ChapterRow => ({
  id: row.id,
  chapter_number: row.chapter_number,
  chapter_title_translated: row.chapter_title_translated,
  created_at: row.created_at,
});

export const mapToChapterDetail = (
  slug: string,
  bookTitle: string,
  row: ChapterContentRow,
  prev: number | null,
  next: number | null,
): ChapterDetail => {
  return {
    id: row.id,
    slug,
    book_name: bookTitle,
    chapter_number: row.chapter_number,
    title: row.chapter_title_translated ?? `Chương ${row.chapter_number}`,
    content: (row.chapter_content as any)?.content_translated ?? "",
    views: row.view_count ?? 0,
    total_words: row.total_words_translate ?? 0,
    created_at: row.created_at,
    prev_chapter: prev,
    next_chapter: next,
  };
};
