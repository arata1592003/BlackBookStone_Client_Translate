"use server";

import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import { TranslateChapterRequest, TranslateChapterResponse } from "@/modules/translate/translate.type";
import { translateChapterService } from "@/modules/translate/translate.service";

export async function translateChapterAction(request: TranslateChapterRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Bạn cần đăng nhập để thực hiện dịch thuật." };
  }

  try {
    const result = await translateChapterService(request, session.access_token);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error in translateChapterAction:", error);
    return { success: false, error: error.message || "Lỗi khi dịch chương truyện." };
  }
}
