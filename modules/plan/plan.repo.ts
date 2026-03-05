import { supabaseClient } from "@/lib/supabase/client";
import { TopupPlanEntity } from "./plan.types";

export async function fetchActivePlans(): Promise<TopupPlanEntity[]> {
  const { data, error } = await supabaseClient
    .from("credit_packages")
    .select("*")
    .eq("is_active", true)
    .order("price_vnd", { ascending: true });

  if (error) {
    console.error("Error fetching active topup plans:", error.message);
    throw error;
  }

  return data || [];
}
