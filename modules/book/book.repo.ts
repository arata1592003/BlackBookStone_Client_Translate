export type BookCardWithAuthorRow = {
  id: string;
  slug: string;
  book_name_translated: string | null;
  author_name_translated: string | null;
  cover_image_url: string | null;
};

export type BookInfoRow = {
  id: string;
  slug: string;
  book_name_translated: string | null;
  author_name_translated: string | null;
  publication_status: string | null;
  cover_image_url: string | null;
  users: {
    first_name: string | null;
    last_name: string | null;
  }[] | null;
};

export type ChapterStatRow = {
  total_words_translate: number | null;
  view_count: number | null;
};

import { supabaseClient } from "@/lib/supabase/client";

export async function fetchNewestBooks(): Promise<BookCardWithAuthorRow[]> {
  const { data, error } = await supabaseClient
    .from("books")
    .select(
      "id, slug, book_name_translated, author_name_translated, cover_image_url"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data ?? [];
}

export async function fetchBookInfoBySlug(
  slug: string
): Promise<BookInfoRow | null> {
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
      users:owner_user_id (
        first_name,
        last_name
      )
    `
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) return null;
  return data;
}

export async function fetchChapterStatsByBookId(
  bookId: string
): Promise<ChapterStatRow[]> {
  const { data, error } = await supabaseClient
    .from("chapters")
    .select("total_words_translate, view_count")
    .eq("book_id", bookId)
    .eq("chapter_status", true);

  if (error) throw error;
  return data ?? [];
}