import { SupabaseClient } from "@supabase/supabase-js";
import { mapToCommentItem } from "./comment.mapper";
import { deleteComment, fetchCommentsByBookId, insertComment } from "./comment.repo";
import { CommentItem } from "./comment.type";

export async function getBookComments(bookId: string): Promise<CommentItem[]> {
  const rows = await fetchCommentsByBookId(bookId);
  return rows.map(mapToCommentItem);
}

export async function addComment(
  supabase: SupabaseClient,
  bookId: string,
  userId: string,
  content: string
): Promise<void> {
  if (!content.trim()) throw new Error("Nội dung bình luận không được để trống.");
  await insertComment(supabase, bookId, userId, content);
}

export async function removeComment(
  supabase: SupabaseClient,
  commentId: string,
  userId: string
): Promise<void> {
  await deleteComment(supabase, commentId, userId);
}
