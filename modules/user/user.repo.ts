import { supabaseClient } from "@/lib/supabase/client";
import { UserEntity } from "./user.type";

export async function fetchUserProfileById(
  userId: string,
): Promise<UserEntity | null> {
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
