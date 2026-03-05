"use server";

import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import { getFullBookDataForDownload } from "@/modules/chapter/chapter.service";

export async function getBookDownloadDataAction(bookId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Bạn cần đăng nhập để tải xuống.");
  }

  try {
    const data = await getFullBookDataForDownload(bookId, supabase);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in getBookDownloadDataAction:", error);
    return { success: false, error: error.message || "Lỗi khi lấy dữ liệu tải xuống." };
  }
}
