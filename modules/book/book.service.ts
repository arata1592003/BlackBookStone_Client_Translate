// modules/book/book.service.ts
import {
  BookCardWithAuthor,
  BookInfo,
  UserBookItem,
} from "@/modules/book/book.types";
import {
  mapToBookCardWithAuthor,
  mapToBookInfo,
  mapToUserBookItem,
} from "./book.mapper";
import {
  fetchBookInfoBySlug,
  fetchBooksByOwner,
  fetchChapterStatsByBookId,
  fetchNewestBooks,
  fetchFollowedBooksByUserId,
} from "./book.repo";

import { User } from "@supabase/supabase-js";

export async function getNewestBookList(): Promise<BookCardWithAuthor[]> {
  const rows = await fetchNewestBooks();
  return rows.map(mapToBookCardWithAuthor);
}

export async function getBookInfo(slug: string): Promise<BookInfo | null> {
  const book = await fetchBookInfoBySlug(slug);
  if (!book) return null;

  const chapters = await fetchChapterStatsByBookId(book.id);
  return mapToBookInfo(book, chapters);
}

export async function getOwnedBooksForCurrentUser(
  user: User,
): Promise<UserBookItem[]> {
  if (!user) {
    console.warn("No current user found to fetch owned books.");
    return [];
  }

  const rows = await fetchBooksByOwner(user.id);
  return rows.map(mapToUserBookItem);
}

export async function getFollowedBooksForCurrentUser(
  user: User,
): Promise<UserBookItem[]> {
  if (!user) {
    console.warn("No current user found to fetch followed books.");
    return [];
  }

  const rows = await fetchFollowedBooksByUserId(user.id);
  return rows.map(mapToUserBookItem);
}
