import { supabaseClient } from "@/lib/supabase/client";
import {
  BookCardWithAuthorRow,
  BookInfoRow,
  ChapterStatRow,
  UserBookItemRow,
  BookInsertPayload,
  BookTagInsertPayload,
  ManagedBookRow,
  ManagedChapterRow,
  ChapterContentRow,
  BookNewChapterCardRow,
  BookCompletedCardRow,
} from "@/modules/book/book.repo.type";
import { SupabaseClient } from "@supabase/supabase-js";

export async function fetchNewestBooks(): Promise<BookNewChapterCardRow[]> {
  const { data, error } = await supabaseClient
    .from("books")
    .select(
      `
      id,
      slug,
      book_name_translated,
      author_name_translated,
      cover_image_url,
      book_tags (
        tags ( name )
      ),
      chapters (
        chapter_number,
        updated_at
      )
      `,
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data ?? [];
}

export type BookHotRow = BookCardWithAuthorRow & {
  total_views: number;
};

export async function fetchHotBooks(limit: number = 15): Promise<BookHotRow[]> {
  const { data, error } = await supabaseClient
    .from("books")
    .select(
      `
      id,
      slug,
      book_name_translated,
      author_name_translated,
      cover_image_url,
      chapters(view_count)
      `,
    )
    .eq("is_published", true);

  if (error) {
    console.error(
      "Error fetching hot books with chapter views:",
      error.message,
    );
    throw error;
  }

  const booksWithAggregatedViews = data.map((book: any) => {
    const total_views =
      (book.chapters as { view_count: number }[] | null)?.reduce(
        (sum, chapter) => sum + (chapter.view_count || 0),
        0,
      ) || 0;

    const { chapters, ...restBook } = book;
    return {
      ...restBook,
      total_views,
    } as BookHotRow;
  });

  return booksWithAggregatedViews
    .sort((a, b) => b.total_views - a.total_views)
    .slice(0, limit);
}

export async function fetchCompletedBooks(
  limit?: number,
): Promise<BookCompletedCardRow[]> {
  let query = supabaseClient
    .from("books")
    .select(
      `
      id,
      slug,
      book_name_translated,
      author_name_translated,
      cover_image_url,
      book_chapter_stats (
        total_chapters,
        translated_chapters
      )
      `,
    )
    .eq("is_published", true)
    .eq("publication_status", "full")
    .order("created_at", { ascending: false });
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

export async function fetchBookInfoBySlug(
  slug: string,
): Promise<BookInfoRow | null> {
  const { data, error } = await supabaseClient
    .from("books")
    .select(
      `
      id,
      slug,
      book_name_translated,
      author_name_translated,
      description,
      publication_status,
      cover_image_url,
      users:owner_user_id (
        first_name,
        last_name
      )
    `,
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) return null;
  return data;
}

export async function fetchChapterStatsByBookId(
  bookId: string,
): Promise<ChapterStatRow[]> {
  const { data, error } = await supabaseClient
    .from("chapters")
    .select("total_words_translate, view_count")
    .eq("book_id", bookId)
    .eq("chapter_status", true);

  if (error) throw error;
  return data ?? [];
}

export async function fetchUserBookStats(userId: string) {
  const { count: crawledCount, error: crawlError } = await supabaseClient
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("owner_user_id", userId)
    .eq("type", "crawl")
    .eq("status", "DONE");

  if (crawlError) {
    console.error("Error fetching crawled stats:", crawlError.message);
  }

  const { count: translatedCount, error: translateError } = await supabaseClient
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("owner_user_id", userId)
    .eq("type", "translate")
    .eq("status", "DONE");

  if (translateError) {
    console.error("Error fetching translated stats:", translateError.message);
  }

  return {
    crawledCount: crawledCount ?? 0,
    translatedCount: translatedCount ?? 0,
  };
}

export async function fetchBooksByOwner(
  userId: string,
): Promise<UserBookItemRow[]> {
  const { data, error } = await supabaseClient
    .from("books")
    .select(
      `
      id,
      slug,
      book_name_translated,
      author_name_translated,
      publication_status,
      cover_image_url,
      is_published,
      draft_expires_at,
      updated_at,

      book_tags (
        tags ( name )
      ),

      book_chapter_stats (
        total_chapters,
        translated_chapters
      )
      `,
    )
    .eq("owner_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching books by owner:", error.message);
    return [];
  }

  return data ?? [];
}

export async function fetchFollowedBooksByUserId(
  userId: string,
): Promise<UserBookItemRow[]> {
  const { data, error } = await supabaseClient
    .from("book_follows")
    .select(
      `
      books (
        id,
        slug,
        book_name_translated,
        author_name_translated,
        publication_status,
        cover_image_url,
        is_published,
        draft_expires_at,
        updated_at,
        book_tags (
          tags ( name )
        ),
        book_chapter_stats (
          total_chapters,
          translated_chapters
        )
      )
      `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching followed books:", error.message);
    return [];
  }

  return data?.flatMap((item) => item.books ?? []).filter(Boolean) ?? [];
}

/**
 * Lấy ID của nguồn từ tên nguồn.
 * @param sourceName Tên của nguồn (ví dụ: "manual").
 * @returns ID của nguồn hoặc null nếu không tìm thấy.
 */
export async function getSourceIdByName(
  sourceName: string,
): Promise<string | null> {
  const { data, error } = await supabaseClient
    .from("sources")
    .select("id")
    .eq("name", sourceName)
    .single();

  if (error) {
    console.error("Error in getSourceIdByName:", error.message);
    return null;
  }
  return data?.id || null;
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
  console.log(bookPayload);
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

export async function insertBookTags(
  supabase: SupabaseClient,
  bookTagsPayloads: BookTagInsertPayload[],
): Promise<void> {
  const { error } = await supabase.from("book_tags").insert(bookTagsPayloads);

  if (error) {
    console.error("Error inserting book tags:", error.message);
    throw new Error(`Lỗi khi chèn thẻ sách: ${error.message}`);
  }
}

/**
 * Xóa một cuốn sách khỏi cơ sở dữ liệu.
 * Dùng để rollback nếu việc chèn các thẻ sách thất bại.
 *
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
): Promise<ManagedBookRow | null> {
  const { data, error } = await supabaseClient
    .from("books")
    .select(
      `
      id,
      slug,
      book_name_translated,
      book_name_raw,
      author_name_translated,
      author_name_raw,
      description,
      publication_status,
      cover_image_url,
      url_raw,
      created_at,
      updated_at,
      sources:source_id (
        source_name:name,
        source_url:base_url
      )
      `,
    )
    .eq("id", bookId)
    .single();

  if (error) {
    console.error("Error fetching managed book details by id:", error.message);
    return null;
  }

  const bookData = data as any;
  if (bookData && bookData.sources && Array.isArray(bookData.sources)) {
    bookData.sources = bookData.sources[0] || null;
  }

  return bookData as ManagedBookRow | null;
}

export async function fetchManagedChaptersByBookId(
  bookId: string,
): Promise<ManagedChapterRow[]> {
  const { data, error } = await supabaseClient
    .from("chapters")
    .select(
      `
      id,
      chapter_number,
      chapter_title_translated,
      chapter_title_raw,
      chapter_status,
      updated_at
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
): Promise<ChapterContentRow | null> {
  const { data, error } = await supabaseClient
    .from("chapter_content")
    .select(
      `
      content_raw,
      content_translated
      `,
    )
    .eq("chapter_id", chapterId)
    .single();

  if (error) {
    console.error("Error fetching chapter content by id:", error.message);
    return null;
  }

  return data as ChapterContentRow | null;
}
