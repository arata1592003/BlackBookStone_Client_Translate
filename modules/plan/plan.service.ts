import { fetchActivePlans } from "./plan.repo";
import { TopupPlan, TopupPlanEntity } from "./plan.types";

function mapTopupPlan(entity: TopupPlanEntity): TopupPlan {
  return {
    id: entity.id,
    code: entity.code,
    priceAmount: entity.price_amount,
    currency: entity.currency,
    gems: entity.gems,
    bonusGems: entity.bonus_gems,
    note: entity.note,
  };
}

export async function getActivePlans(): Promise<TopupPlan[]> {
  const plans = await fetchActivePlans();
  return plans.map(mapTopupPlan);
}
