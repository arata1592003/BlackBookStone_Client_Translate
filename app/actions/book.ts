"use server";

import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import { revalidatePath } from "next/cache";
import { ManagedBookDetails, ChapterContent } from "@/modules/book/book.types";
import {
  createBook,
  getManagedBookDetails,
  getChapterContent,
} from "@/modules/book/book.service";
import { CreateBookInput } from "@/modules/book/book.service.type";
import { User } from "@supabase/supabase-js";

export async function createBookAction(
  bookName: string,
  user: User,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  bookId?: string;
}> {
  const bookData: CreateBookInput = {
    book_name: bookName,
  };

  try {
    const supabase = await createServerSupabaseClient();

    const newBookId = await createBook(supabase, bookData, user);

    revalidatePath("/tai-khoan/ban-lam-viec");
    return {
      success: true,
      message: `Truyện "${bookName}" đã được thêm thành công!`,
      bookId: newBookId,
    };
  } catch (error: unknown) {
    console.error("Error in createBookAction:", error);
    return {
      success: false,
      error:
        (error as Error).message ||
        "Có lỗi không mong muốn xảy ra khi thêm truyện.",
    };
  }
}

export async function getManagedBookAction(
  bookId: string,
): Promise<{ success: boolean; data?: ManagedBookDetails; error?: string }> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      success: false,
      error: "Bạn cần đăng nhập để xem thông tin truyện này.",
    };
  }

  try {
    const bookDetails = await getManagedBookDetails(bookId, supabase);
    if (!bookDetails) {
      return { success: false, error: "Không tìm thấy truyện." };
    }
    return { success: true, data: bookDetails };
  } catch (error: unknown) {
    console.error("Error in getManagedBookAction:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi lấy thông tin truyện.",
    };
  }
}

export async function getChapterContentAction(
  chapterId: string,
): Promise<{ success: boolean; data?: ChapterContent; error?: string }> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      success: false,
      error: "Bạn cần đăng nhập để xem nội dung chương này.",
    };
  }

  try {
    const chapterContent = await getChapterContent(chapterId, supabase);
    if (!chapterContent) {
      return { success: false, error: "Không tìm thấy nội dung chương." };
    }
    return { success: true, data: chapterContent };
  } catch (error: unknown) {
    console.error("Error in getChapterContentAction:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi lấy nội dung chương.",
    };
  }
}
