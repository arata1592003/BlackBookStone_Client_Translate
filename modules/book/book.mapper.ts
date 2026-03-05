// modules/book/book.mapper.ts
import {
  UserBookItemRow,
  ManagedBookRow,
  ManagedChapterRow,
  ChapterContentRow,
} from "@/modules/book/book.repo.type";
import {
  UserBookItem,
  ManagedBookDetails,
  ManagedChapter,
  ChapterContent,
} from "@/modules/book/book.types";

export const mapToUserBookItem = (row: UserBookItemRow): UserBookItem => {
  const chapters = row.chapters || [];
  const totalChapters = chapters.length;
  const translatedChapters = chapters.filter((c) => !!c.content_translated)
    .length;

  return {
    id: row.id,
    title: row.name || "Không có tiêu đề",
    totalChapters,
    translatedChapters,
    updatedAt: row.updated_at,
  };
};

export const mapToManagedChapter = (
  chapter: ManagedChapterRow,
): ManagedChapter => ({
  id: chapter.id,
  chapterNumber: chapter.chapter_number,
  title: chapter.chapter_title_translated || `Chương ${chapter.chapter_number}`,
  originalTitle: chapter.chapter_title_raw,
  lastUpdated: chapter.updated_at,
  totalWordsRaw: chapter.total_words_raw,
  status: !!chapter.content_translated,
});

export const mapToManagedBookDetails = (
  bookRow: ManagedBookRow,
  chapterRows: ManagedChapterRow[],
): ManagedBookDetails => ({
  id: bookRow.id,
  title: bookRow.name || "Không có tiêu đề",
  createdAt: bookRow.created_at,
  updatedAt: bookRow.updated_at,
  chapters: chapterRows.map(mapToManagedChapter),
});

export const mapToChapterContent = (
  chapterContentRow: ChapterContentRow,
): ChapterContent => ({
  contentRaw: chapterContentRow.content_raw,
  contentTranslated: chapterContentRow.content_translated,
});
