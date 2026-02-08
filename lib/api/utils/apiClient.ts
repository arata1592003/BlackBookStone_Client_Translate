type RequestOptions = Omit<RequestInit, "body"> & {
  accessToken?: string;
  body?: Record<string, any>;
};

/**
 * Hàm tiện ích để thực hiện các cuộc gọi API đến backend.
 * Tự động thêm Content-Type và Authorization header.
 * @param path Đường dẫn cụ thể của API (ví dụ: '/crawl/book-info').
 * @param options Tùy chọn cho fetch request, bao gồm accessToken và body.
 * @returns Promise<T> Kết quả trả về từ API.
 */
export async function apiClient<T>(
  path: string,
  { accessToken, body, headers, ...customConfig }: RequestOptions = {},
): Promise<T> {
  const backendApiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

  if (!backendApiBaseUrl || !backendApiBaseUrl.startsWith("http")) {
    console.error(
      "Backend API base URL is not defined or is invalid (missing http/https scheme). Value:",
      backendApiBaseUrl,
    );
    throw new Error(
      "Backend API base URL is not configured or is invalid. Please check NEXT_PUBLIC_BACKEND_API_BASE_URL in your .env file.",
    );
  }

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    cache: "no-store",
  };

  if (accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    } as HeadersInit;
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${backendApiBaseUrl}${path}`, config);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      const errorMessage =
        errorData.detail || errorData.message || response.statusText;
      console.error(
        `Backend API returned an error for ${path}: ${response.status} - ${errorMessage}`,
      );
      throw new Error(`Lỗi từ Backend API: ${errorMessage}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    const data: T = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error calling backend API:", error);
    let userFriendlyMessage = "Có lỗi xảy ra khi gọi Backend API.";

    // Kiểm tra lỗi network cụ thể như ECONNREFUSED
    if (
      error.cause &&
      typeof error.cause === "object" &&
      "code" in error.cause
    ) {
      if (error.cause.code === "ECONNREFUSED") {
        userFriendlyMessage =
          "Không thể kết nối đến máy chủ Backend. Vui lòng đảm bảo Backend đang chạy và thử lại sau.";
      } else {
        userFriendlyMessage = `Lỗi mạng: ${error.cause.code}. Vui lòng kiểm tra kết nối internet hoặc trạng thái của Backend.`;
      }
    } else if (error.message) {
      userFriendlyMessage = error.message;
    }

    throw new Error(userFriendlyMessage);
  }
}
