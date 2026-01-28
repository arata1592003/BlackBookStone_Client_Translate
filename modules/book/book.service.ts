// modules/book/book.service.ts
import { BookCardWithAuthor, BookInfo } from "@/modules/book/book.types";
import {
  mapToBookCardWithAuthor,
  mapToBookInfo,
} from "./book.mapper";
import {
  fetchBookInfoBySlug,
  fetchChapterStatsByBookId,
  fetchNewestBooks,
} from "./book.repo";

export async function getNewestBookList(): Promise<BookCardWithAuthor[]> {
  const rows = await fetchNewestBooks();
  return rows.map(mapToBookCardWithAuthor);
}

export async function getBookInfo(
  slug: string
): Promise<BookInfo | null> {
  const book = await fetchBookInfoBySlug(slug);
  if (!book) return null;

  const chapters = await fetchChapterStatsByBookId(book.id);
  console.log(chapters)
  return mapToBookInfo(book, chapters);
}