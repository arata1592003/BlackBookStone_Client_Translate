import { supabaseClient } from "@/lib/supabase/client";

export type ChapterWithBookSlugRow = {
  id: string;
  chapter_number: number;
  chapter_title_translated: string | null;
  created_at: string;
  view_count: number | null;
  books:
    | {
        slug: string;
      }[]
    | null;
};

export type ChapterContentRow = {
  id: string;
  chapter_number: number;
  chapter_title_translated: string | null;
  total_words_translate: number | null;
  view_count: number | null;
  created_at: string;
  chapter_content:
    | { content_translated: string | null }
    | { content_translated: string | null }[]
    | null;
};

export interface AllChapterContentRow {
  chapter_number: number;
  chapter_title_raw: string | null;
  chapter_title_translated: string | null;
  summary_translated: string | null;
  chapter_content: {
    content_raw: string | null;
    content_translated: string | null;
  } | {
    content_raw: string | null;
    content_translated: string | null;
  }[] | null;
}

export async function fetchNewestChaptersByBookSlug(
  slug: string,
  limit: number,
): Promise<ChapterWithBookSlugRow[]> {
  const { data, error } = await supabaseClient
    .from("chapters")
    .select(
      `
      id,
      chapter_number,
      chapter_title_translated,
      created_at,
      view_count,
      books!inner ( slug )
    `,
    )
    .eq("books.slug", slug)
    .eq("chapter_status", true)
    .order("chapter_number", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function fetchChapterListByBookSlug(
  slug: string,
  from: number,
  to: number,
  newestFirst: boolean,
): Promise<ChapterWithBookSlugRow[]> {
  const { data, error } = await supabaseClient
    .from("chapters")
    .select(
      `
      id,
      chapter_number,
      chapter_title_translated,
      created_at,
      view_count,
      books!inner ( slug )
    `,
    )
    .eq("books.slug", slug)
    .eq("chapter_status", true)
    .order("chapter_number", { ascending: !newestFirst })
    .range(from, to);

  if (error) throw error;
  return data ?? [];
}

export async function fetchChapterCountByBookId(
  bookId: string,
): Promise<number> {
  const { count, error } = await supabaseClient
    .from("chapters")
    .select("*", { count: "exact", head: true })
    .eq("book_id", bookId)
    .eq("chapter_status", true);

  if (error) throw error;
  return count ?? 0;
}

export async function fetchChapterCountByBookSlug(
  slug: string,
): Promise<number> {
  const { data: book, error: bookError } = await supabaseClient
    .from("books")
    .select("id")
    .eq("slug", slug)
    .single();

  if (bookError || !book) return 0;

  const { count, error } = await supabaseClient
    .from("chapters")
    .select("*", { count: "exact", head: true })
    .eq("book_id", book.id)
    .eq("chapter_status", true);

  if (error) throw error;
  return count ?? 0;
}

export async function fetchChapterDetail(
  bookId: string,
  chapterNumber: number,
): Promise<ChapterContentRow | null> {
  const { data, error } = await supabaseClient
    .from("chapters")
    .select(
      `
      id,
      chapter_number,
      chapter_title_translated,
      total_words_translate,
      view_count,
      created_at,
      chapter_content ( content_translated )
    `,
    )
    .eq("book_id", bookId)
    .eq("chapter_number", chapterNumber)
    .eq("chapter_status", true)
    .maybeSingle();

  if (error) throw error;
  return data as ChapterContentRow | null;
}

export async function fetchPrevChapterNumber(
  bookId: string,
  chapterNumber: number,
): Promise<number | null> {
  const { data } = await supabaseClient
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
): Promise<number | null> {
  const { data } = await supabaseClient
    .from("chapters")
    .select("chapter_number")
    .eq("book_id", bookId)
    .gt("chapter_number", chapterNumber)
    .order("chapter_number", { ascending: true })
    .limit(1)
    .maybeSingle();

  return data?.chapter_number ?? null;
}

export async function fetchAllChaptersContentByBookId(bookId: string): Promise<AllChapterContentRow[]> {
  const { data, error } = await supabaseClient
    .from("chapters")
    .select(`
      chapter_number,
      chapter_title_raw,
      chapter_title_translated,
      summary_translated,
      chapter_content (
        content_raw,
        content_translated
      )
    `)
    .eq("book_id", bookId)
    .order("chapter_number", { ascending: true });

  if (error) {
    console.error("Error fetching all chapters content:", error.message);
    throw error;
  }

  return (data as any) || [];
}

export async function incrementChapterView(chapterId: string): Promise<void> {
  const { error } = await supabaseClient.rpc("increment_chapter_view", {
    target_chapter_id: chapterId,
  });

  if (error) {
    console.error("Error incrementing chapter view:", error.message);
  }
}

import { SupabaseClient } from "@supabase/supabase-js";

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

  // 1. Reset chapters table for multiple IDs
  const { error: chapterError } = await supabase
    .from("chapters")
    .update({
      chapter_title_translated: null,
      summary_translated: null,
      chapter_status: false,
    })
    .in("id", chapterIds);

  if (chapterError) {
    console.error("Error resetting chapters metadata:", chapterError.message);
    throw chapterError;
  }

  // 2. Reset chapter_content table for multiple IDs
  const { error: contentError } = await supabase
    .from("chapter_content")
    .update({
      content_translated: null,
    })
    .in("chapter_id", chapterIds);

  if (contentError) {
    console.error("Error resetting chapters content:", contentError.message);
    throw contentError;
  }
}
