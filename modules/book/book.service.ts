// modules/book/book.service.ts
import { BookCardWithAuthor, BookInfo, UserBookItem } from "@/modules/book/book.types";
import {
  mapToBookCardWithAuthor,
  mapToBookInfo,
  mapToUserBookItem,
} from "./book.mapper";
import {
  fetchBookInfoBySlug,
  fetchChapterStatsByBookId,
  fetchNewestBooks,
  fetchBooksByOwner,
} from "./book.repo";
import { getCurrentUser } from "../user/user.service";

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

export async function getOwnedBooksForCurrentUser(): Promise<UserBookItem[]> {
  const user = await getCurrentUser();
  if (!user) {
    console.warn("No current user found to fetch owned books.");
    return [];
  }

  const rows = await fetchBooksByOwner(user.id);
  return rows.map(mapToUserBookItem);
}