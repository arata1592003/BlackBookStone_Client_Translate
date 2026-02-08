// lib/api/modules/book.ts
import { apiClient } from "../utils/apiClient";
import { BookInfoFromSourceResponse } from "@/modules/book/book.types";

interface FetchBookInfoOptions {
  url: string;
  accessToken: string;
}

/**
 * Gọi API backend để lấy thông tin metadata của sách từ một URL (có thể rỗng).
 * @param options.url URL của truyện gốc cần crawl.
 * @param options.accessToken Access token của người dùng cho xác thực API.
 * @returns Metadata của sách.
 * @throws Error nếu có lỗi từ API hoặc mạng.
 */
export async function fetchBookInfoFromSource({
  url,
  accessToken,
}: FetchBookInfoOptions): Promise<BookInfoFromSourceResponse> {
  return apiClient<BookInfoFromSourceResponse>("/crawl/preview/book", {
    method: "POST",
    accessToken,
    body: { url },
  });
}
