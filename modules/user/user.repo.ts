import { supabaseClient } from "@/lib/supabase/client";
import { UserEntity, UserProfile } from "./user.type";

export async function fetchUserProfileById(
  userId: string,
): Promise<UserEntity | null> {
  const { data, error } = await supabaseClient
    .from("users")
    .select("*, phone, date_of_birth") // Chọn thêm phone và date_of_birth
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }

  return data;
}

export async function updateUserProfileInDB(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserEntity | null> {
  const { data, error } = await supabaseClient
    .from("users")
    .update({
      first_name: updates.first_name,
      last_name: updates.last_name,
      phone: updates.phone,
      date_of_birth: updates.date_of_birth,
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

export async function fetchUserTransactionStats(userId: string) {
  const { data, error, count } = await supabaseClient
    .from("wallet_transactions")
    .select("change_gem")
    .eq("user_id", userId);

  console.log(data);

  if (error) {
    console.error("Error fetching transaction stats:", error.message);
    return { totalCost: 0, transactionCount: 0 };
  }

  const transactionCount = data?.length ?? 0;

  const totalCost = data
    .filter((t) => t.change_gem < 0)
    .reduce((sum, t) => sum + t.change_gem, 0);

  return { totalCost: Math.abs(totalCost), transactionCount: transactionCount };
}
