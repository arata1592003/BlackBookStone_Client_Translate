"use server";

import { increaseChapterView as serviceIncreaseChapterView, addRawChapter } from "@/modules/chapter/chapter.service";
import { repoDeleteChaptersTranslation } from "@/modules/chapter/chapter.repo";
import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import { revalidatePath } from "next/cache";

export async function addRawChapterAction(data: {
  bookId: string;
  chapterNumber: number;
  title: string;
  content: string;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Bạn cần đăng nhập để thực hiện." };
  }

  try {
    const chapterId = await addRawChapter(supabase, data);
    revalidatePath(`/tai-khoan/truyen/${data.bookId}`);
    revalidatePath(`/tai-khoan/truyen/${data.bookId}/dich`);
    return { success: true, chapterId };
  } catch (error: any) {
    console.error("Failed to add raw chapter:", error);
    return {
      success: false,
      error: error.message || "Không thể thêm chương mới.",
    };
  }
}

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
