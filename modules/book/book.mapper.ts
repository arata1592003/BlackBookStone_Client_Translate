// modules/book/book.mapper.ts
import {
  BookCardWithAuthorRow,
  BookInfoRow,
  ChapterStatRow,
  UserBookItemRow,
  ManagedBookRow,
  ManagedChapterRow,
  ChapterContentRow,
  BookNewChapterCardRow,
  BookCompletedCardRow,
} from "@/modules/book/book.repo.type";
import {
  BookCardWithAuthor,
  BookInfo,
  UserBookItem,
  ManagedBookDetails,
  ManagedChapter,
  ChapterContent,
  BookNewChapterCard,
  BookCompletedCard,
} from "@/modules/book/book.types";

export const mapToBookCardWithAuthor = (
  row: BookCardWithAuthorRow & { total_views?: number },
): BookCardWithAuthor => ({
  id: row.id,
  slug: row.slug,
  book_name_translated: row.book_name_translated,
  author_name_translated: row.author_name_translated,
  cover_image_url: row.cover_image_url,
  view: row.total_views ?? 0,
});

export const mapToBookNewChapterCard = (
  row: BookNewChapterCardRow,
): BookNewChapterCard => {
  const genres =
    row.book_tags
      ?.map((bt) => bt.tags?.[0]?.name)
      .filter((name): name is string => Boolean(name)) ?? [];

  const latestChapter = row.chapters?.sort(
    (a, b) => b.chapter_number - a.chapter_number,
  )[0];

  return {
    id: row.id,
    slug: row.slug,
    book_name_translated: row.book_name_translated,
    author_name_translated: row.author_name_translated,
    cover_image_url: row.cover_image_url,
    view: 0,
    latestChapterNumber: latestChapter?.chapter_number ?? null,
    latestChapterUpdatedAt: latestChapter?.updated_at ?? null,
    genres: genres,
  };
};

export const mapToBookCompletedCard = (
  row: BookCompletedCardRow,
): BookCompletedCard => {
  const totalChapters = row.book_chapter_stats?.[0]?.total_chapters ?? 0;

  return {
    id: row.id,
    slug: row.slug,
    book_name_translated: row.book_name_translated,
    author_name_translated: row.author_name_translated,
    cover_image_url: row.cover_image_url,
    view: 0, // Default view to 0
    totalChapters: totalChapters,
  };
};

export const mapToBookInfo = (
  book: BookInfoRow,
  chapters: ChapterStatRow[],
): BookInfo => {
  const count_chapter = chapters.length;
  const count_word = chapters.reduce(
    (s, c) => s + (c.total_words_translate ?? 0),
    0,
  );
  const view = chapters.reduce((s, c) => s + (c.view_count ?? 0), 0);

  const user = book.users?.[0];

  return {
    id: book.id,
    slug: book.slug,
    book_name_translated: book.book_name_translated,
    author_name_translated: book.author_name_translated,
    publication_status: book.publication_status,
    cover_image_url: book.cover_image_url,
    description: book.description,

    user_name: user
      ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
      : "Unknown",

    count_chapter,
    count_word,
    view,
  };
};

export const mapToUserBookItem = (row: UserBookItemRow): UserBookItem => {
  const genres =
    row.book_tags
      ?.map((bt) => bt.tags[0]?.name)
      .filter((name): name is string => Boolean(name)) ?? [];

  const stats = row.book_chapter_stats?.[0];

  const totalChapters = stats?.total_chapters ?? 0;
  const translatedChapters = stats?.translated_chapters ?? 0;

  return {
    id: row.id,
    slug: row.slug,
    title: row.book_name_translated,
    author: row.author_name_translated,
    status: row.publication_status,
    coverImageUrl: row.cover_image_url,

    totalChapters,
    translatedChapters,

    updatedAt: row.updated_at,
    genres,
  };
};

export const mapToManagedChapter = (
  chapter: ManagedChapterRow,
): ManagedChapter => ({
  id: chapter.id,
  chapterNumber: chapter.chapter_number,
  title: chapter.chapter_title_translated || `Chương ${chapter.chapter_number}`,
  originalTitle: chapter.chapter_title_raw,
  status: chapter.chapter_status,
  lastUpdated: chapter.updated_at,
  totalWordsRaw: chapter.total_words_raw, // Ánh xạ trường mới
  urlRaw: chapter.url_raw, // Ánh xạ trường mới
});

export const mapToManagedBookDetails = (
  bookRow: ManagedBookRow,
  chapterRows: ManagedChapterRow[],
): ManagedBookDetails => ({
  id: bookRow.id,
  slug: bookRow.slug,
  title:
    bookRow.book_name_translated || bookRow.book_name_raw || "Không có tiêu đề",
  originalTitle: bookRow.book_name_raw,
  author:
    bookRow.author_name_translated || bookRow.author_name_raw || "Ẩn danh",
  originalAuthor: bookRow.author_name_raw,
  description: bookRow.description,
  status: bookRow.publication_status,
  coverImageUrl: bookRow.cover_image_url,
  source: bookRow.source_name,
  sourceUrl: bookRow.source_url,

  genres: bookRow.tags,

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
