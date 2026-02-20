"use server";

import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import { ChapterRaw } from "@/modules/crawl/crawl.types";
import { apiClient } from "@/lib/api/utils/apiClient";

interface FetchRawChaptersResponse {
  success: boolean;
  chapters?: ChapterRaw[];
  error?: string;
}

export async function fetchRawChaptersAction(
  bookId: string,
): Promise<FetchRawChaptersResponse> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      success: false,
      error: "Bạn cần đăng nhập để thực hiện tác vụ này.",
    };
  }

  try {
    const data = await apiClient<{ chapters: ChapterRaw[] }>(
      `/crawl/basic/book/${bookId}/chapters`,
      {
        method: "POST",
        accessToken: session.access_token,
        body: {},
      },
    );
    return { success: true, chapters: data.chapters };
  } catch (error: any) {
    console.error("Error fetching raw chapters:", error);
    return {
      success: false,
      error: error.message || "Có lỗi xảy ra khi lấy danh sách chương gốc.",
    };
  }
}

interface CrawlChapterContentResponse {
  success: boolean;
  chapter_id?: string;
  chapter_number?: number;
  chapter_title_raw?: string;
  error?: string;
}

export async function crawlChapterContentAction(
  bookId: string,
  chapterNumber: number,
  chapterUrl: string,
): Promise<CrawlChapterContentResponse> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      success: false,
      error: "Bạn cần đăng nhập để thực hiện tác vụ này.",
    };
  }

  try {
    const data = await apiClient<{
      chapter_id: string;
      chapter_number: number;
      chapter_title_raw: string;
    }>(`/crawl/basic/book/${bookId}/chapter`, {
      method: "POST",
      accessToken: session.access_token,
      body: {
        chapter_number: chapterNumber,
        chapter_url: chapterUrl,
      },
    });
    return {
      success: true,
      chapter_id: data.chapter_id,
      chapter_number: data.chapter_number,
      chapter_title_raw: data.chapter_title_raw,
    };
  } catch (error: any) {
    console.error("Error crawling chapter content:", error);
    return {
      success: false,
      error: error.message || "Có lỗi xảy ra khi cào nội dung chương.",
    };
  }
}
