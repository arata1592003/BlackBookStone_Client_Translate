import { CommentItem, CommentRow } from "./comment.type";

export const mapToCommentItem = (row: CommentRow): CommentItem => {
  const firstName = row.users?.first_name || "";
  const lastName = row.users?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Người dùng ẩn danh";
  
  const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "?";

  return {
    id: row.id,
    userId: row.user_id,
    userName: fullName,
    content: row.content,
    createdAt: row.created_at,
    userInitials: initials,
  };
};
