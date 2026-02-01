import { getCurrentUser } from "../user/user.service";
import { fetchTransactionsByUserId } from "./wallet.repo";
import { WalletTransaction, WalletTransactionEntity } from "./wallet.types";

function mapTransaction(entity: WalletTransactionEntity): WalletTransaction {
  return {
    id: entity.id,
    content: entity.reason,
    change: entity.change_gem,
    balanceAfter: entity.balance_after,
    createdAt: new Date(entity.created_at).toLocaleString('vi-VN'),
  };
}

export async function getTransactionsForCurrentUser(limit = 50): Promise<WalletTransaction[]> {
  const user = await getCurrentUser();
  if (!user) {
    console.warn("No current user found to fetch transactions.");
    return [];
  }

  const transactions = await fetchTransactionsByUserId(user.id, limit);
  return transactions.map(mapTransaction);
}
