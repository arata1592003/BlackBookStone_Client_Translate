"use server";

import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import {
  DebugCharacter,
  DebugCharacterRelation,
  DebugTerm,
  KnowledgeInput,
  NewKnowledgeOutput,
  TranslateChapterRequest,
} from "@/modules/translate/translate.type";
import { apiClient } from "@/lib/api/utils/apiClient";
import { translateChapterService } from "@/modules/translate/translate.service";

export async function getChapterKnowledgeInputAction(
  bookId: string,
  chapterId: string,
): Promise<{ success: boolean; data?: KnowledgeInput; error?: string }> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { success: false, error: "Bạn cần đăng nhập để debug." };

  try {
    const data = await apiClient<KnowledgeInput>(
      `/translate/advance/books/${bookId}/chapters/${chapterId}/debug/knowledge_input`,
      { accessToken: session.access_token },
    );
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching knowledge input:", error);
    return {
      success: false,
      error: error.message || "Lỗi khi lấy kiến thức đầu vào.",
    };
  }
}

export async function getChapterNewKnowledgeAction(
  bookId: string,
  chapterId: string,
): Promise<{ success: boolean; data?: NewKnowledgeOutput; error?: string }> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { success: false, error: "Bạn cần đăng nhập để debug." };

  try {
    const data = await apiClient<NewKnowledgeOutput>(
      `/translate/advance/books/${bookId}/chapters/${chapterId}/debug/new_knowledge`,
      { accessToken: session.access_token },
    );
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching new knowledge:", error);
    return {
      success: false,
      error: error.message || "Lỗi khi lấy kiến thức mới.",
    };
  }
}

export async function translateChapterAction(request: TranslateChapterRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      success: false,
      error: "Bạn cần đăng nhập để thực hiện dịch thuật.",
    };
  }

  try {
    const result = await translateChapterService(request, session.access_token);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error in translateChapterAction:", error);
    return {
      success: false,
      error: error.message || "Lỗi khi dịch chương truyện.",
    };
  }
}
