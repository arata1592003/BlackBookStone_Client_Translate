export type TopupPlanEntity = {
  id: string;
  code: string;
  price_amount: number;
  currency: string;
  gems: number;
  bonus_gems: number;
  is_active: boolean;
  note: string | null;
  created_at: string;
};

export type TopupPlan = {
  id: string;
  code: string;
  priceAmount: number;
  currency: string;
  gems: number;
  bonusGems: number;
  note: string | null;
};
