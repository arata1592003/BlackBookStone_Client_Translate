"use server";

import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import { revalidatePath } from "next/cache";
import { bookApi } from "@/lib/api";
import { BookInfoFromSourceResponse } from "@/modules/book/book.types";
import { createBook } from "@/modules/book/book.service";
import { CreateBookInput } from "@/modules/book/book.service.type";
import { User } from "@supabase/supabase-js";

interface BookMetadataFromSource {
  source?: string;
  book_id?: string;
  book_name_raw?: string;
  author_name_raw?: string;
  url_raw?: string;
  cover_image_url?: string | null;
}

export async function fetchBookMetadataAction(url: string): Promise<{
  success: boolean;
  data?: BookMetadataFromSource;
  error?: string;
}> {
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
    const apiResponse: BookInfoFromSourceResponse =
      await bookApi.fetchBookInfoFromSource({
        url,
        accessToken: session.access_token,
      });

    const metadata: BookMetadataFromSource = {
      source: apiResponse.source,
      book_id: apiResponse.book_id,
      book_name_raw: apiResponse.book_name_raw,
      author_name_raw: apiResponse.author_name_raw,
      url_raw: apiResponse.url_raw,
      cover_image_url: apiResponse.cover_image_url,
    };

    return { success: true, data: metadata };
  } catch (error: any) {
    console.error("Error fetching book metadata from source:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi lấy metadata từ nguồn.",
    };
  }
}

export async function createBookAction(
  propBookData: {
    rawUrl?: string;
    bookNameRaw: string;
    bookNameTranslated: string;
    authorNameRaw: string;
    authorNameTranslated: string;
    description: string;
    coverImageUrl: string;
    sourceBookCode: string;
    genres: string[];
  },
  user: User,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  bookId?: string;
}> {
  const bookData: CreateBookInput = {
    book_name_raw: propBookData.bookNameRaw || null,
    book_name_translated: propBookData.bookNameTranslated,
    author_name_raw: propBookData.authorNameRaw || null,
    author_name_translated: propBookData.authorNameTranslated,
    url_raw: propBookData.rawUrl || null,
    cover_image_url: propBookData.coverImageUrl || null,
    description: propBookData.description || null,
    source_book_code: propBookData.sourceBookCode || null,
    genres: propBookData.genres?.length ? propBookData.genres : undefined,
  };

  try {
    const supabase = await createServerSupabaseClient();

    const newBookId = await createBook(supabase, bookData, user);

    revalidatePath("/tai-khoan/ban-lam-viec");
    return {
      success: true,
      message: `Truyện "${bookData.book_name_translated}" đã được thêm thành công!`,
    };
  } catch (error: any) {
    console.error("Error in createBookAction:", error);
    return {
      success: false,
      error: error.message || "Có lỗi không mong muốn xảy ra khi thêm truyện.",
    };
  }
}
