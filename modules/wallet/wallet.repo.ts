import { supabaseClient } from "@/lib/supabase/client";
import { WalletTransactionEntity } from "./wallet.types";

import { SupabaseClient } from "@supabase/supabase-js";

export async function fetchWalletByUserId(
  userId: string,
  supabase: SupabaseClient = supabaseClient,
) {
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching wallet:", error.message);
    return null;
  }

  return data;
}

export async function fetchTransactionsByUserId(
  userId: string,
  limit = 50,
  supabase: SupabaseClient = supabaseClient,
): Promise<WalletTransactionEntity[]> {
  const { data, error } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching wallet transactions:", error.message);
    throw error;
  }

  return data || [];
}
