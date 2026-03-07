export type TopupPlanEntity = {
  id: string;
  name: string;
  description: string | null;
  credits: number;
  bonus_credits: number;
  total_credits: number;
  price_vnd: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TopupPlan = {
  id: string;
  name: string;
  description: string | null;
  credits: number;
  bonusCredits: number;
  totalCredits: number;
  priceVnd: number;
};

export type PaymentOrder = {
  id: string;
  package_id: string;
  credits: string;
  bonus_credits: string;
  total_credits: string;
  amount_vnd: string;
  order_code: string;
  payment_status: "pending" | "paid" | "expired";
  expired_at: string;
  paid_at: string | null;
  created_at: string;
};
