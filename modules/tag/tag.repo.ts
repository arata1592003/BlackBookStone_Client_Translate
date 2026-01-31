import { supabaseClient } from "@/lib/supabase/client";
import { TagEntity } from "./tag.type";

export async function fetchAllTags(): Promise<TagEntity[]> {
  const { data, error } = await supabaseClient
    .from("tags")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
