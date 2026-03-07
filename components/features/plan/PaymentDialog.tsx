"use client";

import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, AlertCircle, Banknote, QrCode, CheckCircle2, PartyPopper, Coins } from "lucide-react";
import { PaymentOrder } from "@/modules/plan/plan.types";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { supabaseClient } from "@/lib/supabase/client";
import { getWalletBalance } from "@/modules/wallet/wallet.service";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PaymentDialogProps {
  order: PaymentOrder | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (payload: any) => void;
}

export const PaymentDialog = ({
  order,
  isOpen,
  onOpenChange,
  onSuccess,
}: PaymentDialogProps) => {
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success">("pending");
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset status khi mở dialog
  useEffect(() => {
    if (isOpen) {
      setPaymentStatus("pending");
      setCurrentBalance(null);
      setRetryCount(0);
    }
  }, [isOpen, order?.id]);

  const handleSuccessInternal = async (updatedOrder: any) => {
    if (paymentStatus === "success") return; // Tránh chạy nhiều lần

    console.log("Xử lý thanh toán thành công...");
    try {
      const balance = await getWalletBalance(updatedOrder.user_id);
      setCurrentBalance(balance);
    } catch (err) {
      console.error("Lỗi khi lấy số dư ví:", err);
    }
    setPaymentStatus("success");
    onSuccess(updatedOrder);
    
    // Dọn dẹp polling nếu có
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
  };

  // 1. Cơ chế Realtime (Ưu tiên)
  useEffect(() => {
    if (!order || !isOpen || paymentStatus === "success") return;

    const channel = supabaseClient
      .channel(`order_status_${order.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          console.log("Realtime: Phát hiện thay đổi dữ liệu!", payload);
          const updatedOrder = payload.new as PaymentOrder;
          if (updatedOrder.payment_status === "paid") {
            handleSuccessInternal(updatedOrder);
          }
        },
      )
      .subscribe((status) => {
        console.log(`Realtime Status (${order.order_code}):`, status);
        if (status === "TIMED_OUT" || status === "CHANNEL_ERROR") {
          // Thử lại sau 2 giây nếu lỗi kết nối
          setTimeout(() => setRetryCount(prev => prev + 1), 2000);
        }
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [order, isOpen, paymentStatus, retryCount]);

  // 2. Cơ chế Polling dự phòng (Chạy song song để đảm bảo 100% không sót)
  useEffect(() => {
    if (!order || !isOpen || paymentStatus === "success") {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      return;
    }

    const checkStatus = async () => {
      console.log("Polling: Đang kiểm tra trạng thái đơn hàng...");
      const { data, error } = await supabaseClient
        .from("orders")
        .select("*")
        .eq("id", order.id)
        .single();
      
      if (data && data.payment_status === "paid") {
        handleSuccessInternal(data);
      }
    };

    // Kiểm tra ngay lập tức khi mở và sau đó mỗi 10 giây
    checkStatus();
    pollingIntervalRef.current = setInterval(checkStatus, 10000);

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [order, isOpen, paymentStatus]);

  if (!order) return null;

  const bankId = process.env.NEXT_PUBLIC_BANK_ID || "MB";
  const accountNo = process.env.NEXT_PUBLIC_BANK_ACCOUNT || "123456789";
  const accountName = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "BLACKSTONEBOOK";
  
  const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${order.amount_vnd}&addInfo=${order.order_code}&accountName=${encodeURIComponent(accountName)}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[95vw] md:max-w-[800px] bg-surface-card border-border-default text-text-primary overflow-hidden p-0 transition-all duration-500",
        paymentStatus === "success" && "md:max-w-[500px]"
      )}>
        {paymentStatus === "pending" ? (
          <>
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-2xl font-black flex items-center gap-2">
                <Banknote className="text-primary" size={28} />
                Thanh toán nạp Credit
              </DialogTitle>
              <DialogDescription className="text-text-secondary text-sm">
                Quét mã QR để thanh toán nhanh hoặc chuyển khoản thủ công theo thông tin bên dưới.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col md:flex-row gap-0 md:gap-6 p-6">
              {/* Left Side: QR Code */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-gray-100 shadow-inner mb-6 md:mb-0">
                <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold text-xs uppercase tracking-widest">
                  <QrCode size={16} className="text-primary" />
                  Mã QR VietQR
                </div>
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-primary/20 to-primary-accent/20 rounded-2xl blur-xl opacity-50"></div>
                  <Image 
                    src={qrUrl} 
                    alt="Payment QR Code" 
                    width={220} 
                    height={220}
                    className="relative rounded-lg"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
                <p className="mt-4 text-[10px] text-gray-400 font-medium text-center">
                  Sử dụng App Ngân hàng hoặc Ví điện tử để quét mã
                </p>
              </div>

              {/* Right Side: Manual Info & Status */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="space-y-4 bg-surface-raised p-6 rounded-3xl border border-border-default flex-1">
                  <div className="space-y-1">
                    <span className="text-[10px] text-text-muted uppercase font-black tracking-widest">Số tiền thanh toán</span>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-primary tracking-tight">
                        {formatCurrency(order.amount_vnd)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleCopy(order.amount_vnd.toString())}
                        className="h-8 px-2 text-text-faint hover:text-primary hover:bg-primary/10 rounded-lg"
                      >
                        <Copy size={14} className="mr-1.5" /> Sao chép
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] text-text-muted uppercase font-black tracking-widest">Nội dung chuyển khoản</span>
                    <div className="flex items-center justify-between p-3 bg-background border border-primary/20 rounded-xl">
                      <span className="text-sm font-mono font-black text-primary">
                        {order.order_code}
                      </span>
                      <button onClick={() => handleCopy(order.order_code)} className="text-text-faint hover:text-primary transition-colors">
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border-default/50 grid grid-cols-2 gap-y-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-text-muted uppercase font-bold">Ngân hàng</span>
                      <span className="text-xs text-text-primary font-black uppercase">{bankId}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-text-muted uppercase font-bold">Chủ tài khoản</span>
                      <span className="text-xs text-text-primary font-black uppercase">{accountName}</span>
                    </div>
                    <div className="flex flex-col col-span-2">
                      <span className="text-[9px] text-text-muted uppercase font-bold">Số tài khoản</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-primary font-black tracking-wider">{accountNo}</span>
                        <button onClick={() => handleCopy(accountNo)} className="text-text-faint hover:text-primary transition-colors">
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warning Message */}
                <div className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                  <AlertCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-orange-200 leading-relaxed font-medium">
                    <strong>QUAN TRỌNG:</strong> Vui lòng nhập <strong>chính xác</strong> mã đơn hàng vào nội dung chuyển khoản để được cộng tiền tự động ngay lập tức.
                  </p>
                </div>
              </div>
            </div>

            {/* Status Bar / Footer */}
            <div className="bg-surface-raised/50 p-4 border-t border-border-default flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <Loader2 className="animate-spin text-primary" size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-text-primary uppercase tracking-wider">Đang kiểm tra giao dịch...</span>
                  <span className="text-[9px] text-text-muted italic">Đừng đóng cửa sổ này cho đến khi nhận được thông báo thành công</span>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                className="text-xs font-bold text-text-muted hover:text-destructive transition-colors hover:bg-destructive/5 px-6 h-10 rounded-xl"
              >
                Hủy thanh toán
              </Button>
            </div>
          </>
        ) : (
          /* SUCCESS STATE */
          <div className="p-10 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-success/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-24 h-24 bg-success/10 rounded-full flex items-center justify-center text-success border-4 border-success/20">
                <PartyPopper size={48} className="animate-bounce" />
              </div>
              <div className="absolute -top-2 -right-2 bg-success text-white p-1 rounded-full border-4 border-surface-card">
                <CheckCircle2 size={24} />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-text-primary tracking-tight">Thành công!</h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                Giao dịch của bạn đã được xác nhận. <br />
                Credit đã được cộng vào tài khoản của bạn.
              </p>
            </div>

            <div className="w-full bg-success/5 border border-success/10 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center text-xs uppercase font-bold tracking-widest text-text-muted">
                <span>Gói nạp</span>
                <span className="text-text-primary font-black">{formatNumber(order.total_credits)} Credit</span>
              </div>
              <div className="flex justify-between items-center text-xs uppercase font-bold tracking-widest text-text-muted">
                <span>Mã đơn hàng</span>
                <span className="text-text-primary font-mono font-black">{order.order_code}</span>
              </div>
              <div className="pt-4 border-t border-success/10 flex items-center justify-center gap-3">
                <div className="p-2 bg-success/20 rounded-lg">
                  <Coins className="text-success" size={24} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-success font-black uppercase tracking-tighter">Số dư hiện tại</p>
                  <p className="text-xl font-black text-text-primary">
                    {currentBalance !== null ? formatNumber(currentBalance) : "--"} <span className="text-xs">Credit</span>
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full h-14 bg-success hover:bg-success/90 text-white font-black rounded-2xl shadow-xl shadow-success/20 text-lg uppercase tracking-widest"
            >
              Tiếp tục sử dụng
            </Button>
          </div>
        )}

        {copied && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-success text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg shadow-success/20 animate-in fade-in slide-in-from-bottom-4 duration-300 z-[100]">
            Đã sao chép vào bộ nhớ tạm!
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
