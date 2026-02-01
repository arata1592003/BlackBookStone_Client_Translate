export type WalletTransactionEntity = {
  id: string;
  user_id: string;
  change_gem: number;
  balance_after: number | null;
  reason: string;
  method: string | null;
  reference_code: string | null;
  gateway_txn_id: string | null;
  created_at: string;
};

export type WalletTransaction = {
  id: string;
  content: string;
  change: number;
  balanceAfter: number | null;
  createdAt: string;
};
