"use server";

import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import { addComment, getBookComments, removeComment } from "@/modules/comment/comment.service";
import { revalidatePath } from "next/cache";

export async function getCommentsAction(bookId: string) {
  try {
    const comments = await getBookComments(bookId);
    return { success: true, data: comments };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCommentAction(bookId: string, content: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Bạn cần đăng nhập để bình luận." };
  }

  try {
    await addComment(supabase, bookId, user.id, content);
    revalidatePath(`/truyen/[slug]`, "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCommentAction(commentId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Chưa đăng nhập." };

  try {
    await removeComment(supabase, commentId, user.id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
