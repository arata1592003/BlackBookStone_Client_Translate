import { supabaseClient } from "@/lib/supabase/client";
import { WalletTransactionEntity } from "./wallet.types";

export async function fetchTransactionsByUserId(
  userId: string,
  limit = 50,
): Promise<WalletTransactionEntity[]> {
  const { data, error } = await supabaseClient
    .from("wallet_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching wallet transactions:", error);
    throw error;
  }

  return data || [];
}
