"use server";

import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import {
  BookTranslateJobRequest,
  KnowledgeInput,
  NewKnowledgeOutput,
} from "@/modules/translate/translate.type";
import { 
  startTranslationJob, 
  fetchJobs, 
  fetchJobDetail, 
  cancelJob,
  fetchChapterKnowledgeInput,
  fetchChapterNewKnowledge
} from "@/modules/translate/translate.service";

/**
 * Bắt đầu tiến trình dịch thuật cho một cuốn sách
 */
export async function startBookTranslationAction(request: BookTranslateJobRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Bạn cần đăng nhập để thực hiện dịch thuật." };
  }

  try {
    const result = await startTranslationJob(request, session.access_token);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error in startBookTranslationAction:", error);
    return {
      success: false,
      error: error.message || "Lỗi khi bắt đầu tiến trình dịch thuật.",
    };
  }
}

/**
 * Lấy trạng thái chi tiết của một job
 */
export async function getJobStatusAction(jobId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return { success: false, error: "Chưa đăng nhập." };

  try {
    const data = await fetchJobDetail(jobId, session.access_token);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Hủy một job đang chạy
 */
export async function cancelJobAction(jobId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return { success: false, error: "Chưa đăng nhập." };

  try {
    const data = await cancelJob(jobId, session.access_token);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Lấy danh sách jobs đang chạy của người dùng
 */
export async function getRunningJobsAction(page = 1, limit = 20) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return { success: false, error: "Chưa đăng nhập." };

  try {
    const data = await fetchJobs("RUNNING", page, limit, session.access_token);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Debug: Lấy kiến thức đầu vào (Prompt Knowledge)
 */
export async function getChapterKnowledgeInputAction(
  bookId: string,
  chapterId: string,
): Promise<{ success: boolean; data?: KnowledgeInput; error?: string }> {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, error: "Bạn cần đăng nhập để debug." };

  try {
    const data = await fetchChapterKnowledgeInput(bookId, chapterId, session.access_token);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching knowledge input:", error);
    return {
      success: false,
      error: error.message || "Lỗi khi lấy kiến thức đầu vào.",
    };
  }
}

/**
 * Debug: Lấy kiến thức mới trích xuất
 */
export async function getChapterNewKnowledgeAction(
  bookId: string,
  chapterId: string,
): Promise<{ success: boolean; data?: NewKnowledgeOutput; error?: string }> {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, error: "Bạn cần đăng nhập để debug." };

  try {
    const data = await fetchChapterNewKnowledge(bookId, chapterId, session.access_token);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching new knowledge:", error);
    return {
      success: false,
      error: error.message || "Lỗi khi lấy kiến thức mới.",
    };
  }
}
