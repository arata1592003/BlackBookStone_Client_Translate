"use server";

import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import { TranslationRuleInsert } from "@/modules/translate/translate.type";
import { 
  insertTranslationRule, 
  updateTranslationRule, 
  deleteTranslationRule,
  fetchAllAvailableRules,
  fetchUserRuleSets,
  saveRuleSet
} from "@/modules/translate/rule.repo";
import { revalidatePath } from "next/cache";

export async function getRulesLibraryAction() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Chưa đăng nhập" };

  try {
    const rules = await fetchAllAvailableRules(supabase, user.id);
    return { success: true, data: rules };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMyRuleSetsAction() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Chưa đăng nhập" };

  try {
    const sets = await fetchUserRuleSets(supabase, user.id);
    return { success: true, data: sets };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveMyRuleSetAction(name: string, ruleIds: string[]) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Chưa đăng nhập" };

  try {
    const result = await saveRuleSet(supabase, user.id, name, ruleIds);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveTranslationRuleAction(rule: TranslationRuleInsert) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Chưa đăng nhập" };

  try {
    const result = await insertTranslationRule(supabase, { ...rule, user_id: user.id });
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTranslationRuleAction(ruleId: string, updates: Partial<TranslationRuleInsert>) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Chưa đăng nhập" };

  try {
    await updateTranslationRule(supabase, ruleId, updates);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTranslationRuleAction(ruleId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Chưa đăng nhập" };

  try {
    await deleteTranslationRule(supabase, ruleId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
