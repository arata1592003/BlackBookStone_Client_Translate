import { supabaseClient } from "@/lib/supabase/client";
import { TopupPlanEntity } from "./plan.types";

export async function fetchActivePlans(): Promise<TopupPlanEntity[]> {
  const { data, error } = await supabaseClient
    .from("topup_plans")
    .select("*")
    .eq("is_active", true)
    .order("price_amount", { ascending: true });

  if (error) {
    console.error("Error fetching active topup plans:", error);
    throw error;
  }

  console.log(data);

  return data || [];
}
