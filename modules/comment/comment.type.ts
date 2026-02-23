export type CommentRow = {
  id: string;
  book_id: string;
  user_id: string;
  content: string;
  created_at: string;
  users: {
    first_name: string | null;
    last_name: string | null;
  } | null;
};

export type CommentItem = {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  userInitials: string;
};
