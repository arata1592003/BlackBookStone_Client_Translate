"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { getTransactionsForCurrentUser } from "@/modules/wallet/wallet.service";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LichSuGiaoDichPage() {
  const { user } = useAuth();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: () => getTransactionsForCurrentUser(user, 100),
    enabled: !!user,
  });

  const formatCreditChange = (change: number) => {
    const isPositive = change > 0;
    const sign = isPositive ? "+" : "";
    const colorClass = isPositive ? "text-success" : "text-destructive";
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
      <div className="w-full bg-surface-card rounded-lg border border-border-default overflow-hidden">
        <Table>
          <TableHeader className="bg-surface-overlay">
            <TableRow className="hover:bg-transparent border-border-default">
              <TableHead className="w-2/5 font-bold text-text-secondary">
                Nội dung
              </TableHead>
              <TableHead className="w-1/5 text-right font-bold text-text-secondary">
                Thay đổi
              </TableHead>
              <TableHead className="w-1/5 text-right font-bold text-text-secondary">
                Số dư sau
              </TableHead>
              <TableHead className="w-1/5 text-right font-bold text-text-secondary">
                Thời gian
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="p-10 text-center text-text-muted"
                >
                  Đang tải lịch sử giao dịch...
                </TableCell>
              </TableRow>
            ) : transactions?.length === 0 || !transactions ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="p-10 text-center text-text-muted"
                >
                  Không có giao dịch nào.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  className="border-border-default hover:bg-surface-hover"
                >
                  <TableCell className="w-2/5 text-text-primary">
                    {tx.content}
                  </TableCell>
                  <TableCell className="w-1/5 text-right font-mono">
                    {formatCreditChange(tx.change)}
                  </TableCell>
                  <TableCell className="w-1/5 text-right font-mono text-text-secondary">
                    {tx.balanceAfter?.toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="w-1/5 text-right text-text-muted">
                    {tx.createdAt}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
