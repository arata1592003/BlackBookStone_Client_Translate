"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { getActivePlans } from "@/modules/plan/plan.service";
import { getTransactionsForCurrentUser } from "@/modules/wallet/wallet.service";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Wallet,
  ArrowUpCircle,
  History,
  Plus,
  ArrowRight,
  Loader2,
  Sparkles,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import { createPaymentOrderAction } from "@/app/actions/payment";
import { PaymentOrder } from "@/modules/plan/plan.types";
import { PaymentDialog } from "@/components/features/plan/PaymentDialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WalletManagementPage() {
  const { user, walletBalance, isProfileLoading } = useAuth();
  const queryClient = useQueryClient();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<PaymentOrder | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Lấy danh sách gói nạp
  const { data: plans, isLoading: isPlansLoading } = useQuery({
    queryKey: ["activePlans"],
    queryFn: getActivePlans,
    staleTime: 15 * 60 * 1000,
  });

  // Lấy lịch sử giao dịch gần đây (10 giao dịch)
  const { data: transactions, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["transactions", user?.id, 10],
    queryFn: () => (user ? getTransactionsForCurrentUser(user, 10) : []),
    enabled: !!user,
  });

  const handlePlanClick = async (planId: string) => {
    setSelectedPlanId(planId);
    setIsCreatingOrder(true);
    try {
      const result = await createPaymentOrderAction(planId);
      if (result.success && result.data) {
        setCurrentOrder(result.data);
        setIsPaymentModalOpen(true);
      } else {
        alert(result.error || "Lỗi tạo đơn hàng.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handlePaymentSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["userProfile", user?.id] });
    queryClient.invalidateQueries({ queryKey: ["walletBalance", user?.id] });
    queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
  };

  return (
    <div className="flex flex-col flex-1 p-6 bg-surface-section gap-8 animate-in fade-in duration-500">
      {/* 1. OVERVIEW SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Balance Card */}
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-primary to-primary-accent rounded-[2.5rem] p-10 text-white shadow-2xl shadow-primary/20 group">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <Wallet
              size={300}
              className="absolute -bottom-20 -right-20 group-hover:scale-110 transition-transform duration-700"
            />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Wallet size={20} />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">
                Số dư hiện tại
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter">
                {isProfileLoading ? "---" : formatNumber(walletBalance)}
              </h1>
              <span className="text-xl font-bold opacity-70">Credit</span>
            </div>

            <div className="pt-4 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase opacity-60">
                  Loại tài khoản
                </span>
                <span className="text-sm font-black uppercase tracking-wider">
                  Premium User
                </span>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase opacity-60">
                  Trạng thái ví
                </span>
                <span className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />{" "}
                  Đang hoạt động
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-surface-card rounded-[2.5rem] border border-border-default p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="space-y-6">
            <h3 className="text-xs font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={14} className="text-primary" /> Thống kê chi
              tiêu
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-surface-raised rounded-2xl border border-border-default flex items-center justify-between">
                <span className="text-sm text-text-secondary font-medium">
                  Giao dịch thành công
                </span>
                <span className="text-lg font-black text-text-primary">
                  {transactions?.length || 0}
                </span>
              </div>
              <div className="p-4 bg-surface-raised rounded-2xl border border-border-default flex items-center justify-between">
                <span className="text-sm text-text-secondary font-medium">
                  Khuyến mãi khả dụng
                </span>
                <span className="text-xs font-black text-success uppercase">
                  Tặng 10k (Mới)
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full mt-6 rounded-xl font-bold group"
            asChild
          >
            <Link href="/tai-khoan/lich-su-giao-dich">
              Xem tất cả lịch sử{" "}
              <ArrowRight
                size={16}
                className="ml-2 group-hover:translate-x-1 transition-all"
              />
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Quick Topup */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-text-primary flex items-center gap-3">
              <Plus className="text-primary" size={24} /> Nạp Credit nhanh
            </h2>
            <span className="text-[10px] font-black text-text-muted uppercase bg-surface-raised px-3 py-1 rounded-full border border-border-default">
              Xử lý tự động 24/7
            </span>
          </div>

          {isPlansLoading ? (
            <div className="flex justify-center p-20">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plans?.slice(0, 4).map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handlePlanClick(plan.id)}
                  disabled={isCreatingOrder}
                  className={cn(
                    "p-6 rounded-3xl border-2 transition-all text-left relative overflow-hidden group",
                    selectedPlanId === plan.id && isCreatingOrder
                      ? "border-primary bg-primary/5"
                      : "bg-surface-card border-border-default hover:border-primary/40 hover:shadow-md",
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        {plan.name}
                      </p>
                      <p className="text-2xl font-black text-text-primary">
                        {formatNumber(plan.credits)}{" "}
                        <span className="text-xs opacity-60">Credit</span>
                      </p>
                    </div>
                    {plan.bonusCredits > 0 && (
                      <span className="bg-success text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                        +{formatNumber(plan.bonusCredits)} Bonus
                      </span>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border-default flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">
                      {formatCurrency(plan.priceVnd)}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      {selectedPlanId === plan.id && isCreatingOrder ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <ArrowRight size={14} />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Transactions */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-xl font-black text-text-primary flex items-center gap-3">
            <History className="text-text-muted" size={24} /> Lịch sử gần đây
          </h2>

          <div className="bg-surface-card rounded-[2rem] border border-border-default overflow-hidden shadow-sm">
            <div className="divide-y divide-border-default">
              {isHistoryLoading ? (
                <div className="p-10 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-text-muted"
                    size={20}
                  />
                </div>
              ) : transactions?.length === 0 ? (
                <div className="p-10 text-center text-xs text-text-muted italic uppercase font-bold tracking-widest">
                  Chưa có giao dịch
                </div>
              ) : (
                transactions?.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-5 hover:bg-surface-raised transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          tx.change > 0
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive",
                        )}
                      >
                        {tx.change > 0 ? (
                          <ArrowUpCircle size={20} />
                        ) : (
                          <CreditCard size={20} />
                        )}
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <span className="text-xs font-black text-text-primary truncate">
                          {tx.content}
                        </span>
                        <span className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">
                          {tx.createdAt}
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "text-sm font-black tabular-nums",
                        tx.change > 0 ? "text-success" : "text-text-primary",
                      )}
                    >
                      {tx.change > 0 ? "+" : ""}
                      {formatNumber(tx.change)}
                    </div>
                  </div>
                ))
              )}
            </div>
            {transactions && transactions.length > 0 && (
              <Link
                href="/tai-account/lich-su-giao-dich"
                className="block py-4 text-center text-[10px] font-black uppercase text-text-muted hover:text-primary border-t border-border-default transition-colors"
              >
                Xem tất cả lịch sử
              </Link>
            )}
          </div>
        </div>
      </div>

      <PaymentDialog
        order={currentOrder}
        isOpen={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
