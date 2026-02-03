"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { getTransactionsForCurrentUser } from "@/modules/wallet/wallet.service";
import { useQuery } from "@tanstack/react-query";

export default function LichSuGiaoDichPage() {
  const { user } = useAuth();

  // Sử dụng useQuery để lấy và cache dữ liệu
  const { data: transactions, isLoading } = useQuery({
    // queryKey: khóa duy nhất để định danh và cache query này.
    // Khi user.id thay đổi, React Query sẽ tự động fetch lại.
    queryKey: ["transactions", user?.id],
    // queryFn: hàm sẽ được gọi để fetch dữ liệu.
    queryFn: () => getTransactionsForCurrentUser(user, 100),
    // enabled: chỉ chạy query này khi `user` không phải là null.
    enabled: !!user,
  });

  const formatGemChange = (change: number) => {
    const isPositive = change > 0;
    const sign = isPositive ? "+" : "";
    const colorClass = isPositive ? "text-green-500" : "text-red-500";
    return (
      <span className={colorClass}>
        {sign}
        {change.toLocaleString("vi-VN")}
      </span>
    );
  };

  return (
    <section className="flex flex-col items-start gap-5 p-5 relative flex-1 self-stretch w-full grow bg-surface-section">
      <div className="flex flex-col items-start gap-2.5">
        <h2 className="text-3xl font-bold text-text-primary">
          Lịch sử giao dịch
        </h2>
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
          {isLoading ? ( // Sử dụng isLoading từ useQuery
            <div className="p-10 text-center text-text-muted">
              Đang tải lịch sử giao dịch...
            </div>
          ) : transactions?.length === 0 || !transactions ? ( // Kiểm tra cả trường hợp !transactions
            <div className="p-10 text-center text-text-muted">
              Không có giao dịch nào.
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center px-4 py-4 border-b border-border-default last:border-b-0 hover:bg-surface-hover"
              >
                <div className="w-2/5 text-text-primary">{tx.content}</div>
                <div className="w-1/5 text-right font-mono">
                  {formatGemChange(tx.change)}
                </div>
                <div className="w-1/5 text-right font-mono text-text-secondary">
                  {tx.balanceAfter?.toLocaleString("vi-VN")}
                </div>
                <div className="w-1/5 text-right text-text-muted">
                  {tx.createdAt}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
