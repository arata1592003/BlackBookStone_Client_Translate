import {
  BookCardWithAuthor,
  BookInfo,
  UserBookItem,
  ManagedBookDetails,
  ChapterContent,
  BookNewChapterCard,
  BookCompletedCard,
  SearchBookResult,
} from "@/modules/book/book.types";
import {
  mapToBookCardWithAuthor,
  mapToBookInfo,
  mapToUserBookItem,
  mapToManagedBookDetails,
  mapToChapterContent,
  mapToBookNewChapterCard,
  mapToBookCompletedCard,
  mapToSearchBookResult,
} from "./book.mapper";
import {
  fetchBookInfoBySlug,
  fetchBooksByOwner,
  fetchChapterStatsByBookId,
  fetchNewestBooks,
  fetchFollowedBooksByUserId,
  insertBookTags,
  insertBook,
  deleteBook,
  fetchManagedBookDetailsById,
  fetchManagedChaptersByBookId,
  fetchChapterContentById,
  fetchHotBooks,
  fetchCompletedBooks,
  searchBooks as repoSearchBooks,
  countSearchResults as repoCountSearchResults,
  searchBooksForClient,
  updateBookPublishStatus as repoUpdateBookPublishStatus,
  checkBookFollowStatus as repoCheckBookFollowStatus,
  insertBookFollow as repoInsertBookFollow,
  deleteBookFollow as repoDeleteBookFollow,
} from "./book.repo";

import { BookInsertPayload, BookTagInsertPayload } from "./book.repo.type";

import { SupabaseClient, User } from "@supabase/supabase-js";
import { CreateBookInput } from "./book.service.type";
import { getSourceIdByUrlRaw } from "../source/source.repo";

export async function getNewestBookList(): Promise<BookNewChapterCard[]> {
  const rows = await fetchNewestBooks();
  return rows.map(mapToBookNewChapterCard);
}

export async function getHotBookList(
  limit: number = 15,
): Promise<BookCardWithAuthor[]> {
  const rows = await fetchHotBooks(limit);
  return rows.map(mapToBookCardWithAuthor);
}

export async function getCompletedBookList(
  limit?: number,
): Promise<BookCompletedCard[]> {
  const rows = await fetchCompletedBooks(limit);
  return rows.map(mapToBookCompletedCard);
}

export async function searchBooks(
  query: string,
  offset?: number,
  limit?: number,
): Promise<BookCardWithAuthor[]> {
  const rows = await repoSearchBooks(query, offset, limit);
  return rows.map(mapToBookCardWithAuthor);
}

export async function getSearchBooksWithDetails(
  query: string,
  offset?: number,
  limit?: number,
): Promise<SearchBookResult[]> {
  const rows = await searchBooksForClient(query, offset, limit);
  return rows.map(mapToSearchBookResult);
}

export async function countSearchResults(query: string): Promise<number> {
  return repoCountSearchResults(query);
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

export async function createBook(
  supabase: SupabaseClient,
  input: CreateBookInput,
  user: User,
): Promise<string> {
  let sourceId = null;
  if (input.url_raw) {
    sourceId = await getSourceIdByUrlRaw(input.url_raw);
  }

  const bookPayload: BookInsertPayload = {
    source_id: sourceId,
    owner_user_id: user.id,
    book_name_raw: input.book_name_raw ?? null,
    book_name_translated: input.book_name_translated,
    author_name_raw: input.author_name_raw ?? null,
    author_name_translated: input.author_name_translated,
    publication_status: "ongoing",
    url_raw: input.url_raw ?? null,
    cover_image_url: input.cover_image_url ?? null,
    description: input.description ?? null,
    source_book_code: input.source_book_code ?? null,
    slug: null,
  };

  let newBookId: string;

  try {
    newBookId = await insertBook(supabase, bookPayload);
  } catch (error: unknown) {
    console.error("Error inserting book:", error);
    throw new Error(
      `Lỗi khi tạo sách: ${(error as Error).message || "Không xác định"}`,
    );
  }

  if (!input.genres || input.genres.length === 0) {
    return newBookId;
  }

  try {
    const bookTags: BookTagInsertPayload[] = input.genres.map((tagId) => ({
      book_id: newBookId,
      tag_id: tagId,
    }));

    await insertBookTags(supabase, bookTags);
    return newBookId;
  } catch (error: unknown) {
    console.error("Error inserting book tags, attempting rollback:", error);

    try {
      await deleteBook(supabase, newBookId);
      console.log(`Rollback successful for book ID: ${newBookId}`);
    } catch (rollbackError) {
      console.error(
        `CRITICAL: Rollback failed for book ID ${newBookId}`,
        rollbackError,
      );
    }

    throw new Error(
      `Đã tạo sách nhưng lỗi khi gán thể loại. Đã hủy tạo sách. Lỗi: ${
        (error as Error).message || "Không xác định"
      }`,
    );
  }
}

export async function getManagedBookDetails(
  bookId: string,
): Promise<ManagedBookDetails | null> {
  const bookRow = await fetchManagedBookDetailsById(bookId);
  if (!bookRow) return null;

  const chapterRows = await fetchManagedChaptersByBookId(bookId);

  return mapToManagedBookDetails(bookRow, chapterRows);
}

export async function getChapterContent(
  chapterId: string,
): Promise<ChapterContent | null> {
  const chapterContentRow = await fetchChapterContentById(chapterId);
  if (!chapterContentRow) return null;

  return mapToChapterContent(chapterContentRow);
}

export async function toggleBookPublishStatus(
  supabase: SupabaseClient,
  bookId: string,
  currentStatus: boolean,
): Promise<boolean> {
  const newStatus = !currentStatus;
  await repoUpdateBookPublishStatus(supabase, bookId, newStatus);
  return newStatus;
}

export async function isBookFollowed(
  supabase: SupabaseClient,
  userId: string,
  bookId: string,
): Promise<boolean> {
  return repoCheckBookFollowStatus(supabase, userId, bookId);
}

export async function toggleFollowBook(
  supabase: SupabaseClient,
  userId: string,
  bookId: string,
): Promise<boolean> {
  const isFollowed = await repoCheckBookFollowStatus(supabase, userId, bookId);
  
  if (isFollowed) {
    await repoDeleteBookFollow(supabase, userId, bookId);
    return false;
  } else {
    await repoInsertBookFollow(supabase, userId, bookId);
    return true;
  }
}
