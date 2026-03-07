"use client";

import { getActivePlans } from "@/modules/plan/plan.service";
import { Coins, Loader2, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createPaymentOrderAction } from "@/app/actions/payment";
import { PaymentOrder } from "@/modules/plan/plan.types";
import { PaymentDialog } from "@/components/features/plan/PaymentDialog";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";

export default function NapTienPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<PaymentOrder | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { data: plans, isLoading } = useQuery({
    queryKey: ["activePlans"],
    queryFn: getActivePlans,
    staleTime: 15 * 60 * 1000,
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
        alert(result.error || "Không thể tạo đơn hàng. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Đã xảy ra lỗi không mong muốn.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handlePaymentSuccess = (payload: any) => {
    // Làm mới số dư người dùng trong cache của React Query
    queryClient.invalidateQueries({ queryKey: ["userProfile", user?.id] });
    // Không dùng alert nữa vì Dialog đã hiển thị trạng thái thành công
  };

  return (
    <section className="flex flex-col items-start gap-8 p-6 relative flex-1 self-stretch w-full grow bg-surface-section animate-in fade-in duration-500">
      <div className="flex flex-col items-start gap-2 max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Zap className="text-primary" size={24} />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-text-primary uppercase">Nạp tiền</h2>
        </div>
        <p className="text-base text-text-secondary leading-relaxed">
          Tăng số dư Credit để sử dụng các tính năng dịch thuật nâng cao và ủng hộ dự án. 
          Hệ thống hỗ trợ nạp tiền tự động qua chuyển khoản ngân hàng 24/7.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center w-full p-20 gap-4 text-text-muted">
          <Loader2 className="animate-spin" size={48} />
          <p className="font-bold animate-pulse">Đang tải danh sách gói nạp...</p>
        </div>
      ) : !plans || plans.length === 0 ? (
        <div className="bg-surface-card border border-border-default rounded-3xl p-20 text-center w-full shadow-sm">
          <p className="text-text-muted font-bold italic">Hiện không có gói nạp nào khả dụng.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={cn(
                "flex flex-col items-center justify-between p-8 rounded-[2rem] border-2 transition-all duration-300 relative overflow-hidden group",
                selectedPlanId === plan.id 
                  ? "bg-primary/5 border-primary shadow-xl shadow-primary/10 scale-[1.02]" 
                  : "bg-surface-card border-border-default hover:border-primary/40 hover:shadow-md cursor-pointer"
              )}
              onClick={() => !isCreatingOrder && handlePlanClick(plan.id)}
              tabIndex={0}
              role="button"
            >
              <div className="flex flex-col items-center gap-4 w-full relative z-10">
                {plan.bonusCredits > 0 && (
                  <div className="absolute -top-4 -right-4 bg-success text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest flex items-center gap-1 shadow-sm">
                    <Sparkles size={10} /> +{formatNumber(plan.bonusCredits)}
                  </div>
                )}
                
                <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-2 group-hover:text-primary transition-colors">
                  {plan.name}
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-5xl font-black text-text-primary tracking-tighter">
                    {formatNumber(plan.credits)}
                  </span>
                  <Coins size={32} className="text-primary group-hover:rotate-12 transition-transform" />
                </div>

                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(plan.priceVnd)}
                </p>

                {plan.description && (
                  <p className="text-[10px] text-text-muted text-center mt-2 line-clamp-2 px-2 italic">
                    {plan.description}
                  </p>
                )}
              </div>

              <div className="w-full mt-8">
                <button 
                  disabled={isCreatingOrder}
                  className={cn(
                    "w-full py-4 font-black rounded-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2",
                    selectedPlanId === plan.id && isCreatingOrder
                      ? "bg-surface-raised text-text-muted"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 group-hover:scale-[1.02]"
                  )}
                >
                  {selectedPlanId === plan.id && isCreatingOrder ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Đang xử lý
                    </>
                  ) : (
                    "Nạp ngay"
                  )}
                </button>
              </div>

              {/* Decorative Background Icon */}
              <div className="absolute -bottom-6 -right-6 opacity-5 text-primary group-hover:opacity-10 transition-opacity">
                <Coins size={120} />
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Realtime Payment Dialog */}
      <PaymentDialog 
        order={currentOrder}
        isOpen={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        onSuccess={handlePaymentSuccess}
      />
    </section>
  );
}
