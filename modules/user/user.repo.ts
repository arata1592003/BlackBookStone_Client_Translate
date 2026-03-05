import { supabaseClient } from "@/lib/supabase/client";
import { UserEntity, UserProfile } from "./user.type";
import { SupabaseClient } from "@supabase/supabase-js";

export async function fetchUserProfileById(
  userId: string,
  supabase: SupabaseClient = supabaseClient,
): Promise<UserEntity | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error.message);
    return null;
  }

  return data;
}

export async function updateUserProfileInDB(
  userId: string,
  updates: Partial<UserProfile>,
  supabase: SupabaseClient = supabaseClient,
): Promise<UserEntity | null> {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: updates.full_name,
      avatar_url: updates.avatar_url,
      // updated_at sẽ tự động cập nhật nếu được cấu hình trong DB
    })
    .eq("id", userId)
    .select() // Trả về bản ghi đã cập nhật
    .single();

  if (error) {
    console.error("Error updating user profile:", error.message);
    throw error; // Ném lỗi để Server Action có thể bắt
  }

  return data;
}

export async function fetchUserTransactionStats(
  userId: string,
  supabase: SupabaseClient = supabaseClient,
) {
  const { data, error } = await supabase
    .from("credit_transactions")
    .select("amount, type")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching transaction stats:", error.message);
    return { totalCost: 0, transactionCount: 0 };
  }

  const transactionCount = data?.length ?? 0;

  const totalCost = data
    .filter((t) => t.type === 'usage')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return { totalCost: Math.abs(totalCost), transactionCount: transactionCount };
}
