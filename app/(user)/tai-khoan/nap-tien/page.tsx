"use client";

import { getActivePlans } from "@/modules/plan/plan.service";
import { Coins } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function NapTienPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const { data: plans, isLoading } = useQuery({
    queryKey: ["activePlans"],
    queryFn: getActivePlans,
    staleTime: 15 * 60 * 1000,
  });

  const handlePlanClick = (planId: string) => {
    setSelectedPlanId(planId);
    console.log(`Plan ${planId} selected. Initiate payment.`);
  };

  return (
    <section className="flex flex-col items-start gap-5 p-5 relative flex-1 self-stretch w-full grow bg-surface-section">
      <div className="flex flex-col items-start gap-2.5">
        <h2 className="text-3xl font-bold text-text-primary">Nạp tiền</h2>
        <p className="text-lg text-text-secondary">
          Chọn một gói nạp để tăng thêm Credit vào tài khoản của bạn.
        </p>
      </div>

      {isLoading ? (
        <div className="text-text-primary text-center w-full p-10">
          Đang tải các gói nạp...
        </div>
      ) : !plans || plans.length === 0 ? (
        <div className="text-text-primary text-center w-full p-10">
          Hiện không có gói nạp nào khả dụng.
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 w-full mt-5">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`flex flex-col items-center justify-between p-6 rounded-lg shadow-lg border-2 cursor-pointer transition-all duration-200
                ${selectedPlanId === plan.id ? "border-primary ring-2 ring-primary" : "border-border-default hover:border-text-secondary"}
                bg-surface-card
              `}
              onClick={() => handlePlanClick(plan.id)}
              tabIndex={0}
              role="button"
              aria-label={`Gói nạp ${plan.priceVnd.toLocaleString("vi-VN")} VNĐ được ${plan.totalCredits.toLocaleString("vi-VN")} Credit`}
            >
              <div className="flex flex-col items-center gap-3 w-full">
                <h3 className="text-2xl font-bold text-text-primary">
                  {plan.priceVnd.toLocaleString("vi-VN")} VNĐ
                </h3>
                <div className="flex items-center gap-2 text-3xl font-extrabold text-primary">
                  <span>{plan.credits.toLocaleString("vi-VN")}</span>
                  <Coins size={32} className="text-primary" />
                </div>
                {plan.bonusCredits > 0 && (
                  <p className="text-sm text-text-secondary flex items-center gap-1">
                    Thưởng thêm{" "}
                    <span className="text-success font-bold">
                      {plan.bonusCredits.toLocaleString("vi-VN")}
                    </span>{" "}
                    <Coins size={16} className="text-success" />
                  </p>
                )}
                {plan.description && (
                  <p className="text-xs text-text-muted mt-2 text-center">
                    {plan.description}
                  </p>
                )}
              </div>
              <button className="mt-5 w-full py-2 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary-hover transition-colors">
                Nạp ngay
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
