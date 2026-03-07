"use server";

import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import { createOrder } from "@/modules/plan/plan.service";
import { PaymentOrder } from "@/modules/plan/plan.types";

export async function createPaymentOrderAction(packageId: string): Promise<{
  success: boolean;
  data?: PaymentOrder;
  error?: string;
}> {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Bạn cần đăng nhập để thực hiện thanh toán." };
  }

  try {
    const order = await createOrder(packageId, session.access_token);
    return { success: true, data: order };
  } catch (error: any) {
    console.error("Error creating payment order:", error);
    return {
      success: false,
      error: error.message || "Lỗi khi tạo đơn hàng thanh toán.",
    };
  }
}
