export type WalletTransactionEntity = {
  id: string;
  user_id: string;
  type: 'purchase' | 'usage' | 'refund' | 'adjustment' | 'bonus';
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string | null;
  order_id: string | null;
  created_at: string;
};

export type WalletTransaction = {
  id: string;
  content: string;
  change: number;
  balanceAfter: number | null;
  createdAt: string;
};
