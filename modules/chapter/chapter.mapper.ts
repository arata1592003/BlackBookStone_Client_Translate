import { ChapterContentRow, ChapterWithBookSlugRow } from "@/modules/chapter/chapter.repo";
import { ChapterDetail, ChapterRow } from "@/modules/chapter/chapter.type";

export const mapToChapterRow = (
  row: ChapterWithBookSlugRow
): ChapterRow => ({
  id: row.id,
  chapter_number: row.chapter_number,
  chapter_title_translated: row.chapter_title_translated,
  created_at: row.created_at,
});

export const mapToChapterDetail = (
  slug: string,
  bookName: string,
  row: ChapterContentRow,
  prev: number | null,
  next: number | null
): ChapterDetail => {
    const content = Array.isArray(row.chapter_content)
    ? row.chapter_content[0]?.content_translated
    : row.chapter_content?.content_translated ?? "";

    return {
        slug,
        book_name: bookName,
        chapter_number: row.chapter_number,
        title: row.chapter_title_translated,
        content: content,
        views: row.view_count ?? 0,
        total_words: row.total_words_translate ?? 0,
        created_at: new Date(row.created_at).toLocaleDateString("vi-VN"),
        prev_chapter: prev,
        next_chapter: next,
    }

};
