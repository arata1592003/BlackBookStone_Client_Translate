// modules/wallet/wallet.mapper.ts
import { WalletTransaction, WalletTransactionEntity } from "./wallet.types";

export const mapToWalletTransaction = (
  entity: WalletTransactionEntity,
): WalletTransaction => {
  const isDeduction = entity.type === "usage";
  return {
    id: entity.id,
    content:
      entity.description || (isDeduction ? "Sử dụng credit" : "Nạp credit"),
    change: isDeduction ? -Math.abs(entity.amount) : Math.abs(entity.amount),
    balanceAfter: entity.balance_after,
    createdAt: new Date(entity.created_at).toLocaleString("vi-VN"),
  };
};
