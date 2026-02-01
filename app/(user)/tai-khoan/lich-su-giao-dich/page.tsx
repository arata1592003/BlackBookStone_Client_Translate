'use client';

import { getTransactionsForCurrentUser } from "@/modules/wallet/wallet.service";
import { WalletTransaction } from "@/modules/wallet/wallet.types";
import { useEffect, useState } from "react";

export default function LichSuGiaoDichPage() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const data = await getTransactionsForCurrentUser(100); // Fetch last 100 transactions
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const formatGemChange = (change: number) => {
    const isPositive = change > 0;
    const sign = isPositive ? '+' : '';
    const colorClass = isPositive ? 'text-green-500' : 'text-red-500';
    return (
      <span className={colorClass}>
        {sign}{change.toLocaleString('vi-VN')}
      </span>
    );
  };

  return (
    <section className="flex flex-col items-start gap-5 p-5 relative flex-1 self-stretch w-full grow bg-surface-section">
      <div className="flex flex-col items-start gap-2.5">
        <h2 className="text-3xl font-bold text-text-primary">Lịch sử giao dịch</h2>
        <p className="text-lg text-text-secondary">
          Lịch sử giao dịch trong các hoạt động gần đây của bạn.
        </p>
      </div>

      {/* Table Container */}
      <div className="flex flex-col w-full bg-surface-card rounded-lg border border-border-default overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center px-4 py-3 bg-surface-overlay border-b border-border-default font-bold text-text-secondary">
          <div className="w-2/5">Nội dung</div>
          <div className="w-1/5 text-right">Thay đổi</div>
          <div className="w-1/5 text-right">Số dư sau</div>
          <div className="w-1/5 text-right">Thời gian</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {loading ? (
            <div className="p-10 text-center text-text-muted">Đang tải lịch sử giao dịch...</div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center text-text-muted">Không có giao dịch nào.</div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="flex items-center px-4 py-4 border-b border-border-default last:border-b-0 hover:bg-surface-hover">
                <div className="w-2/5 text-text-primary">{tx.content}</div>
                <div className="w-1/5 text-right font-mono">{formatGemChange(tx.change)}</div>
                <div className="w-1/5 text-right font-mono text-text-secondary">{tx.balanceAfter?.toLocaleString('vi-VN')}</div>
                <div className="w-1/5 text-right text-text-muted">{tx.createdAt}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
