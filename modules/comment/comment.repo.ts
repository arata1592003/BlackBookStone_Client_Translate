import { supabaseClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { CommentRow } from "./comment.type";

export async function fetchCommentsByBookId(bookId: string): Promise<CommentRow[]> {
  const { data, error } = await supabaseClient
    .from("book_comments")
    .select(`
      id,
      book_id,
      user_id,
      content,
      created_at,
      users:user_id (
        first_name,
        last_name
      )
    `)
    .eq("book_id", bookId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error.message);
    throw error;
  }

  return (data as any) || [];
}

export async function insertComment(
  supabase: SupabaseClient,
  bookId: string,
  userId: string,
  content: string
): Promise<void> {
  const { error } = await supabase
    .from("book_comments")
    .insert({ book_id: bookId, user_id: userId, content });

  if (error) throw error;
}

export async function deleteComment(
  supabase: SupabaseClient,
  commentId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from("book_comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", userId);

  if (error) throw error;
}
