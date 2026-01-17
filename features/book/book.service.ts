// src/features/book/book.service.ts
import { Book } from "@/features/book/book.types";
import { supabase } from "@/lib/supabase";

export async function getNewestBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("id, book_name_translated, author_name_translated, cover_image_url, slug")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data ?? [];
}
