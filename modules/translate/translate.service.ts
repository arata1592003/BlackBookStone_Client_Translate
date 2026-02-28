import { apiClient } from "@/lib/api/utils/apiClient";
import { TranslateChapterRequest, TranslateChapterResponse } from "./translate.type";

export async function translateChapterService(
  request: TranslateChapterRequest,
  accessToken: string
): Promise<TranslateChapterResponse> {
  const { book_id, chapter_id, mode, rules, prev_chapters_count, next_chapters_count } = request;

  if (mode === "basic") {
    const path = `/translate/basic/books/${book_id}/chapters/${chapter_id}`;
    return await apiClient<TranslateChapterResponse>(path, {
      method: "POST",
      accessToken,
      body: { rules } as any, // Basic also takes rules now
    });
  } else {
    // Advance mode
    const path = `/translate/advance/books/${book_id}/chapters/${chapter_id}`;
    return await apiClient<TranslateChapterResponse>(path, {
      method: "POST",
      accessToken,
      body: {
        rules,
        prev_chapters_count,
        next_chapters_count
      } as any,
    });
  }
}
