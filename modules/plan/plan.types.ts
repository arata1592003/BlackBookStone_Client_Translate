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
