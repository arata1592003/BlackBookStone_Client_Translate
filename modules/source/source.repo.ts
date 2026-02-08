import { supabaseClient } from "@/lib/supabase/client";

export async function getSourceIdByUrlRaw(
  urlRaw: string,
): Promise<string | null> {
  const { data, error } = await supabaseClient
    .from("sources")
    .select("id, base_url")
    .eq("is_active", true);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return null;
  }

  console.log(data);

  const matchedSource = data.find((source) =>
    urlRaw.startsWith(source.base_url),
  );

  return matchedSource?.id ?? null;
}
