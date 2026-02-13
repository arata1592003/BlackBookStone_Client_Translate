import { supabaseClient } from "@/lib/supabase/client";
import { TagEntity } from "./tag.type";

export async function fetchAllTags(limit?: number): Promise<TagEntity[]> {
  let query = supabaseClient
    .from("tags")
    .select("*")
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}
