import { supabaseClient } from "@/lib/supabase/client";
import { UserEntity } from "./user.type";

export async function fetchUserById(userId: string): Promise<UserEntity | null> {
  const { data, error } = await supabaseClient
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }

  return data;
}
