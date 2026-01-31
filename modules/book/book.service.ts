// modules/book/book.service.ts
import { BookCardWithAuthor, BookInfo, UserBookItem } from "@/modules/book/book.types";
import { getCurrentUser } from "../user/user.service";
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

export async function getOwnedBooksForCurrentUser(): Promise<UserBookItem[]> {
  const user = await getCurrentUser();
  if (!user) {
    console.warn("No current user found to fetch owned books.");
    return [];
  }

  const rows = await fetchBooksByOwner(user.id);
  return rows.map(mapToUserBookItem);
}

import { fetchFollowedBooksByUserId } from "./book.repo"; // Added import for the new repo function

export async function getFollowedBooksForCurrentUser(): Promise<UserBookItem[]> {
  const user = await getCurrentUser();
  if (!user) {
    console.warn("No current user found to fetch followed books.");
    return [];
  }

  const rows = await fetchFollowedBooksByUserId(user.id);
  return rows.map(mapToUserBookItem);
}