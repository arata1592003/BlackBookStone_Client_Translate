import { supabaseClient } from "@/lib/supabase/client";
import {
  UserBookItemRow,
  BookInsertPayload,
  ManagedBookRow,
  ManagedChapterRow,
  ChapterContentRow,
  BookInfoRow,
} from "@/modules/book/book.repo.type";
import { SupabaseClient } from "@supabase/supabase-js";

export async function fetchUserBookStats(
  userId: string,
  supabase: SupabaseClient = supabaseClient,
) {
  const { count: crawledCount, error: crawlError } = await supabase
    .from("book_jobs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "DONE");

  if (crawlError) {
    console.error("Error fetching job stats:", crawlError.message);
  }

  return {
    crawledCount: crawledCount ?? 0,
    translatedCount: 0, 
  };
}

export async function fetchBooksByOwner(
  userId: string,
  supabase: SupabaseClient = supabaseClient,
): Promise<UserBookItemRow[]> {
  const { data, error } = await supabase
    .from("books")
    .select(
      `
      id,
      name,
      updated_at,
      chapters (
        content_translated
      )
      `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching books by owner:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Chèn một cuốn sách mới vào cơ sở dữ liệu.
 * @param bookPayload Dữ liệu của cuốn sách để chèn.
 * @returns ID của cuốn sách mới được tạo.
 */
export async function insertBook(
  supabase: SupabaseClient,
  bookPayload: BookInsertPayload,
): Promise<string> {
  const { data, error } = await supabase
    .from("books")
    .insert(bookPayload)
    .select("id")
    .single();

  if (error) {
    console.error("Error inserting book:", error.message);
    throw new Error(`Lỗi khi chèn sách: ${error.message}`);
  }
  if (!data) {
    throw new Error("Không nhận được ID sách sau khi chèn.");
  }
  return data.id;
}

/**
 * Xóa một cuốn sách khỏi cơ sở dữ liệu.
 * @param bookId ID của cuốn sách cần xóa
 */
export async function deleteBook(
  supabase: SupabaseClient,
  bookId: string,
): Promise<void> {
  const { error } = await supabase.from("books").delete().eq("id", bookId);

  if (error) {
    console.error("Error deleting book:", error.message);
    throw new Error(`Lỗi khi xóa sách (rollback): ${error.message}`);
  }
}

export async function fetchManagedBookDetailsById(
  bookId: string,
  supabase: SupabaseClient = supabaseClient,
): Promise<ManagedBookRow | null> {
  const { data, error } = await supabase
    .from("books")
    .select("id, name, created_at, updated_at")
    .eq("id", bookId)
    .single();

  if (error || !data) {
    console.error("Error fetching managed book details by id:", error?.message);
    return null;
  }

  return data;
}

export async function fetchManagedChaptersByBookId(
  bookId: string,
  supabase: SupabaseClient = supabaseClient,
): Promise<ManagedChapterRow[]> {
  const { data, error } = await supabase
    .from("chapters")
    .select(
      `
      id,
      chapter_number,
      chapter_title_translated,
      chapter_title_raw,
      updated_at,
      total_words_raw,
      content_translated
      `,
    )
    .eq("book_id", bookId)
    .order("chapter_number", { ascending: true });

  if (error) {
    console.error("Error fetching managed chapters by book id:", error.message);
    return [];
  }

  return data ?? [];
}

export async function fetchChapterContentById(
  chapterId: string,
  supabase: SupabaseClient = supabaseClient,
): Promise<ChapterContentRow | null> {
  const { data, error } = await supabase
    .from("chapters")
    .select(
      `
      id,
      content_raw,
      content_translated
      `,
    )
    .eq("id", chapterId)
    .single();

  if (error) {
    console.error("Error fetching chapter content by id:", error.message);
    return null;
  }

  return data as any;
}

export async function fetchBookInfoById(
  id: string,
  supabase: SupabaseClient = supabaseClient,
): Promise<BookInfoRow | null> {
  const { data, error } = await supabase
    .from("books")
    .select(
      `
      id,
      name,
      profiles:user_id (
        full_name
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}
