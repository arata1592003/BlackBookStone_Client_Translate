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
  description: string;
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

export type BookChapterStatsRow = {
  total_chapters: number;
  translated_chapters: number;
};

export type UserBookItemRow = {
  id: string;
  slug: string;
  book_name_translated: string | null;
  author_name_translated: string | null;
  publication_status: string | null;
  cover_image_url: string | null;

  is_published: boolean;
  draft_expires_at: string;
  updated_at: string;

  book_tags: {
    tags: {
      name: string;
    }[];
  }[];

  book_chapter_stats: {
    total_chapters: number;
    translated_chapters: number;
  }[] | null;
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
      description,
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

export async function fetchUserBookStats(userId: string) {
  const { count: crawledCount, error: crawlError } = await supabaseClient
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('owner_user_id', userId)
    .eq('type', 'crawl')
    .eq('status', 'DONE');

  if (crawlError) {
    console.error("Error fetching crawled stats:", crawlError.message);
  }

  const { count: translatedCount, error: translateError } = await supabaseClient
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('owner_user_id', userId)
    .eq('type', 'translate')
    .eq('status', 'DONE');

  if (translateError) {
    console.error("Error fetching translated stats:", translateError.message);
  }

  return {
    crawledCount: crawledCount ?? 0,
    translatedCount: translatedCount ?? 0,
  };
}

export async function fetchBooksByOwner(
  userId: string
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
      `
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
  userId: string
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
      `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching followed books:", error.message);
    return [];
  }

  // The query returns an array of { books: { ... } }, so we map to get the book object.
  // We also need to filter out any null book entries that might occur.
  return (
    data
      ?.flatMap(item => item.books ?? [])
      .filter(Boolean) ?? []
  );
}