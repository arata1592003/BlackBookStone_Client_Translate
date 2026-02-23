"use server";

import { increaseChapterView as serviceIncreaseChapterView } from "@/modules/chapter/chapter.service";

/**
 * Server Action để tăng lượt xem cho chương.
 * Được gọi khi người dùng truy cập trang đọc chương.
 */
export async function incrementChapterViewAction(chapterId: string) {
  try {
    await serviceIncreaseChapterView(chapterId);
    return { success: true };
  } catch (error) {
    console.error("Failed to increment chapter view:", error);
    return { success: false, error: "Không thể cập nhật lượt xem." };
  }
}
