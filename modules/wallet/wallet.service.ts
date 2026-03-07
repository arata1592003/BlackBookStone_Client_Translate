// modules/wallet/wallet.service.ts
import { User, SupabaseClient } from "@supabase/supabase-js";
import { fetchTransactionsByUserId, fetchWalletByUserId } from "./wallet.repo";
import { WalletTransaction } from "./wallet.types";
import { mapToWalletTransaction } from "./wallet.mapper";

/**
 * Lấy số dư hiện tại của ví người dùng
 */
export async function getWalletBalance(
  userId: string,
  supabase?: SupabaseClient,
): Promise<number> {
  const wallet = await fetchWalletByUserId(userId, supabase);
  return Number(wallet?.credits || 0);
}

/**
 * Lấy danh sách giao dịch của người dùng hiện tại
 */
export async function getTransactionsForCurrentUser(
  user: User,
  limit = 50,
  supabase?: SupabaseClient,
): Promise<WalletTransaction[]> {
  if (!user) {
    console.warn("No current user found to fetch transactions.");
    return [];
  }

  const transactions = await fetchTransactionsByUserId(user.id, limit, supabase);
  return transactions.map(mapToWalletTransaction);
}
