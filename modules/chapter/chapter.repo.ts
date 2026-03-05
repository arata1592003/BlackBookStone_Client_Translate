import { supabaseClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

export type ChapterRowRaw = {
  id: string;
  chapter_number: number;
  chapter_title_translated: string | null;
  created_at: string;
  view_count: number | null;
};

export type ChapterContentRow = {
  id: string;
  chapter_number: number;
  chapter_title_translated: string | null;
  total_words_translate: number | null;
  view_count: number | null;
  created_at: string;
  content_raw: string | null;
  content_translated: string | null;
};

export interface AllChapterContentRow {
  chapter_number: number;
  chapter_title_raw: string | null;
  chapter_title_translated: string | null;
  summary_translated: string | null;
  content_raw: string | null;
  content_translated: string | null;
}

export async function fetchNewestChaptersByBookId(
  bookId: string,
  limit: number,
  supabase: SupabaseClient = supabaseClient,
): Promise<ChapterRowRaw[]> {
  const { data, error } = await supabase
    .from("chapters")
    .select(
      `
      id,
      chapter_number,
      chapter_title_translated,
      created_at,
      view_count
    `,
    )
    .eq("book_id", bookId)
    .not("content_translated", "is", null)
    .order("chapter_number", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function fetchChapterListByBookId(
  bookId: string,
  from: number,
  to: number,
  newestFirst: boolean,
  supabase: SupabaseClient = supabaseClient,
): Promise<ChapterRowRaw[]> {
  const { data, error } = await supabase
    .from("chapters")
    .select(
      `
      id,
      chapter_number,
      chapter_title_translated,
      created_at,
      view_count
    `,
    )
    .eq("book_id", bookId)
    .not("content_translated", "is", null)
    .order("chapter_number", { ascending: !newestFirst })
    .range(from, to);

  if (error) throw error;
  return data ?? [];
}

export async function fetchChapterCountByBookId(
  bookId: string,
  supabase: SupabaseClient = supabaseClient,
): Promise<number> {
  const { count, error } = await supabase
    .from("chapters")
    .select("*", { count: "exact", head: true })
    .eq("book_id", bookId)
    .not("content_translated", "is", null);

  if (error) throw error;
  return count ?? 0;
}

export async function fetchChapterDetail(
  bookId: string,
  chapterNumber: number,
  supabase: SupabaseClient = supabaseClient,
): Promise<ChapterContentRow | null> {
  const { data, error } = await supabase
    .from("chapters")
    .select(
      `
      id,
      chapter_number,
      chapter_title_translated,
      total_words_translate,
      view_count,
      created_at,
      content_raw,
      content_translated
    `,
    )
    .eq("book_id", bookId)
    .eq("chapter_number", chapterNumber)
    .maybeSingle();

  if (error) throw error;
  return data as ChapterContentRow | null;
}

export async function fetchPrevChapterNumber(
  bookId: string,
  chapterNumber: number,
  supabase: SupabaseClient = supabaseClient,
): Promise<number | null> {
  const { data } = await supabase
    .from("chapters")
    .select("chapter_number")
    .eq("book_id", bookId)
    .lt("chapter_number", chapterNumber)
    .order("chapter_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data?.chapter_number ?? null;
}

export async function fetchNextChapterNumber(
  bookId: string,
  chapterNumber: number,
  supabase: SupabaseClient = supabaseClient,
): Promise<number | null> {
  const { data } = await supabase
    .from("chapters")
    .select("chapter_number")
    .eq("book_id", bookId)
    .gt("chapter_number", chapterNumber)
    .order("chapter_number", { ascending: true })
    .limit(1)
    .maybeSingle();

  return data?.chapter_number ?? null;
}

export async function fetchAllChaptersContentByBookId(
  bookId: string,
  supabase: SupabaseClient = supabaseClient,
): Promise<AllChapterContentRow[]> {
  const { data, error } = await supabase
    .from("chapters")
    .select(`
      chapter_number,
      chapter_title_raw,
      chapter_title_translated,
      summary_translated,
      content_raw,
      content_translated
    `)
    .eq("book_id", bookId)
    .order("chapter_number", { ascending: true });

  if (error) {
    console.error("Error fetching all chapters content:", error.message);
    throw error;
  }

  return (data as any) || [];
}

export async function incrementChapterView(
  chapterId: string,
  supabase: SupabaseClient = supabaseClient,
): Promise<void> {
  const { error } = await supabase.rpc("increment_chapter_view", {
    target_chapter_id: chapterId,
  });

  if (error) {
    console.error("Error incrementing chapter view:", error.message);
  }
}

export async function repoDeleteChapterTranslation(
  supabase: SupabaseClient,
  chapterId: string
): Promise<void> {
  await repoDeleteChaptersTranslation(supabase, [chapterId]);
}

export async function repoDeleteChaptersTranslation(
  supabase: SupabaseClient,
  chapterIds: string[]
): Promise<void> {
  if (chapterIds.length === 0) return;

  const { error: chapterError } = await supabase
    .from("chapters")
    .update({
      chapter_title_translated: null,
      summary_translated: null,
      content_translated: null,
    })
    .in("id", chapterIds);

  if (chapterError) {
    console.error("Error resetting chapters metadata:", chapterError.message);
    throw chapterError;
  }
}
