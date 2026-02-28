import { supabaseClient } from "@/lib/supabase/client";
import { TranslationRule, TranslationRuleInsert } from "./translate.type";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Lấy tất cả mảnh ghép quy tắc (Hệ thống + Của User)
 */
export async function fetchAllAvailableRules(
  supabase: SupabaseClient,
  userId: string
): Promise<TranslationRule[]> {
  const { data, error } = await supabase
    .from("translation_rules")
    .select("*")
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .order("type", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching rules library:", error.message);
    return [];
  }
  return data ?? [];
}

export async function insertTranslationRule(
  supabase: SupabaseClient,
  rule: TranslationRuleInsert
): Promise<TranslationRule | null> {
  const { data, error } = await supabase
    .from("translation_rules")
    .insert(rule)
    .select()
    .single();

  if (error) {
    console.error("Error inserting translation rule:", error.message);
    throw error;
  }
  return data;
}

export async function updateTranslationRule(
  supabase: SupabaseClient,
  ruleId: string,
  updates: Partial<TranslationRuleInsert>
): Promise<void> {
  const { error } = await supabase
    .from("translation_rules")
    .update(updates)
    .eq("id", ruleId);

  if (error) {
    console.error("Error updating translation rule:", error.message);
    throw error;
  }
}

export async function deleteTranslationRule(
  supabase: SupabaseClient,
  ruleId: string
): Promise<void> {
  const { error } = await supabase
    .from("translation_rules")
    .delete()
    .eq("id", ruleId);

  if (error) {
    console.error("Error deleting translation rule:", error.message);
    throw error;
  }
}

/**
 * Lấy danh sách các bộ quy tắc (Rule Sets) đã lưu của User
 */
export async function fetchUserRuleSets(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("translation_rule_sets")
    .select(`
      id,
      name,
      translation_rule_set_items (
        rule_id
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching rule sets:", error.message);
    return [];
  }
  return data ?? [];
}

export async function saveRuleSet(
  supabase: SupabaseClient,
  userId: string,
  name: string,
  ruleIds: string[]
) {
  // 1. Tạo Rule Set mới
  const { data: set, error: setError } = await supabase
    .from("translation_rule_sets")
    .insert({ user_id: userId, name })
    .select()
    .single();

  if (setError) throw setError;

  // 2. Thêm các item
  const items = ruleIds.map((id, index) => ({
    rule_set_id: set.id,
    rule_id: id,
    sort_order: index
  }));

  const { error: itemsError } = await supabase
    .from("translation_rule_set_items")
    .insert(items);

  if (itemsError) throw itemsError;

  return set;
}
