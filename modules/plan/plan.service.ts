import { fetchActivePlans } from "./plan.repo";
import { TopupPlan, TopupPlanEntity } from "./plan.types";

function mapTopupPlan(entity: TopupPlanEntity): TopupPlan {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    credits: entity.credits,
    bonusCredits: entity.bonus_credits,
    totalCredits: entity.total_credits,
    priceVnd: entity.price_vnd,
  };
}

export async function getActivePlans(): Promise<TopupPlan[]> {
  const plans = await fetchActivePlans();
  return plans.map(mapTopupPlan);
}
