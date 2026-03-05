import {
  UserBookItem,
  ManagedBookDetails,
  ChapterContent,
} from "@/modules/book/book.types";
import {
  mapToUserBookItem,
  mapToManagedBookDetails,
  mapToChapterContent,
} from "./book.mapper";
import {
  fetchBooksByOwner,
  insertBook,
  deleteBook,
  fetchManagedBookDetailsById,
  fetchManagedChaptersByBookId,
  fetchChapterContentById,
} from "./book.repo";

import { BookInsertPayload } from "./book.repo.type";

import { SupabaseClient, User } from "@supabase/supabase-js";
import { CreateBookInput } from "./book.service.type";

export async function getOwnedBooksForCurrentUser(
  user: User,
  supabase?: SupabaseClient,
): Promise<UserBookItem[]> {
  if (!user) {
    console.warn("No current user found to fetch owned books.");
    return [];
  }

  const rows = await fetchBooksByOwner(user.id, supabase);
  return rows.map(mapToUserBookItem);
}

export async function createBook(
  supabase: SupabaseClient,
  input: CreateBookInput,
  user: User,
): Promise<string> {
  const bookPayload: BookInsertPayload = {
    user_id: user.id,
    name: input.book_name,
  };

  try {
    const newBookId = await insertBook(supabase, bookPayload);
    return newBookId;
  } catch (error: unknown) {
    console.error("Error inserting book:", error);
    throw new Error(
      `Lỗi khi tạo sách: ${(error as Error).message || "Không xác định"}`,
    );
  }
}

export async function getManagedBookDetails(
  bookId: string,
  supabase?: SupabaseClient,
): Promise<ManagedBookDetails | null> {
  const bookRow = await fetchManagedBookDetailsById(bookId, supabase);
  if (!bookRow) return null;

  const chapterRows = await fetchManagedChaptersByBookId(bookId, supabase);

  return mapToManagedBookDetails(bookRow, chapterRows);
}

export async function getChapterContent(
  chapterId: string,
  supabase?: SupabaseClient,
): Promise<ChapterContent | null> {
  const chapterContentRow = await fetchChapterContentById(chapterId, supabase);
  if (!chapterContentRow) return null;

  return mapToChapterContent(chapterContentRow);
}
