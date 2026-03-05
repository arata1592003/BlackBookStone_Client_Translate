"use server";

import { increaseChapterView as serviceIncreaseChapterView } from "@/modules/chapter/chapter.service";
import { repoDeleteChaptersTranslation } from "@/modules/chapter/chapter.repo";
import { createServerSupabaseClient } from "@/lib/supabase/user/server";

export async function incrementChapterViewAction(chapterId: string) {
  try {
    await serviceIncreaseChapterView(chapterId);
    return { success: true };
  } catch (error) {
    console.error("Failed to increment chapter view:", error);
    return { success: false, error: "Không thể cập nhật lượt xem." };
  }
}

export async function deleteChapterTranslationAction(chapterId: string) {
  return await deleteChaptersTranslationAction([chapterId]);
}

export async function deleteChaptersTranslationAction(chapterIds: string[]) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Bạn cần đăng nhập để thực hiện." };
  }

  try {
    await repoDeleteChaptersTranslation(supabase, chapterIds);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete chapters translation:", error);
    return {
      success: false,
      error: error.message || "Không thể xóa bản dịch.",
    };
  }
}
