import { apiClient } from "@/lib/api/utils/apiClient";
import {
  BookTranslateJobRequest,
  BookTranslateJobResponse,
  JobListResponse,
  JobDetailResponse,
  JobStatus,
  KnowledgeInput,
  NewKnowledgeOutput,
} from "./translate.type";

/**
 * Bắt đầu một job dịch thuật mới
 */
export async function startTranslationJob(
  request: BookTranslateJobRequest,
  accessToken: string,
): Promise<BookTranslateJobResponse> {
  return await apiClient<BookTranslateJobResponse>("/jobs", {
    method: "POST",
    accessToken,
    body: request as any,
  });
}

/**
 * Lấy danh sách jobs theo trạng thái
 */
export async function fetchJobs(
  status: JobStatus,
  page = 1,
  limit = 20,
  accessToken: string,
): Promise<JobListResponse> {
  return await apiClient<JobListResponse>(
    `/jobs?status=${status}&page=${page}&limit=${limit}`,
    { accessToken },
  );
}

/**
 * Lấy chi tiết một job (bao gồm tiến độ từng chương)
 */
export async function fetchJobDetail(
  jobId: string,
  accessToken: string,
): Promise<JobDetailResponse> {
  return await apiClient<JobDetailResponse>(`/jobs/${jobId}`, {
    accessToken,
  });
}

/**
 * Hủy một job đang chạy
 */
export async function cancelJob(
  jobId: string,
  accessToken: string,
): Promise<{ job_id: string; status: "CANCELLED" }> {
  return await apiClient<{ job_id: string; status: "CANCELLED" }>(
    `/jobs/${jobId}/cancel`,
    {
      method: "PATCH",
      accessToken,
    },
  );
}

/**
 * Lấy kiến thức đầu vào để debug (Dành cho Advance mode)
 */
export async function fetchChapterKnowledgeInput(
  bookId: string,
  chapterId: string,
  accessToken: string,
) {
  return await apiClient<KnowledgeInput>(
    `/translate/advance/books/${bookId}/chapters/${chapterId}/debug/knowledge_input`,
    { accessToken },
  );
}

/**
 * Lấy kiến thức mới trích xuất để debug (Dành cho Advance mode)
 */
export async function fetchChapterNewKnowledge(
  bookId: string,
  chapterId: string,
  accessToken: string,
) {
  return await apiClient<NewKnowledgeOutput>(
    `/translate/advance/books/${bookId}/chapters/${chapterId}/debug/new_knowledge`,
    { accessToken },
  );
}
