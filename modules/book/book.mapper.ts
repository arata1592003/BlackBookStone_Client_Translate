// modules/book/book.mapper.ts
import {
  BookCardWithAuthorRow,
  BookInfoRow,
  ChapterStatRow,
  UserBookItemRow,
} from "@/modules/book/book.repo";
import { BookCardWithAuthor, BookInfo, UserBookItem } from "@/modules/book/book.types";

export const mapToBookCardWithAuthor = (
  row: BookCardWithAuthorRow
): BookCardWithAuthor => ({
  id: row.id,
  slug: row.slug,
  book_name_translated: row.book_name_translated,
  author_name_translated: row.author_name_translated,
  cover_image_url: row.cover_image_url,
});

export const mapToBookInfo = (
  book: BookInfoRow,
  chapters: ChapterStatRow[]
): BookInfo => {
  const count_chapter = chapters.length;
  const count_word = chapters.reduce(
    (s, c) => s + (c.total_words_translate ?? 0),
    0
  );
  const view = chapters.reduce(
    (s, c) => s + (c.view_count ?? 0),
    0
  );

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

export const mapToUserBookItem = (
  row: UserBookItemRow
): UserBookItem => {
  const genres =
    row.book_tags
      ?.map(bt => bt.tags[0]?.name)
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
