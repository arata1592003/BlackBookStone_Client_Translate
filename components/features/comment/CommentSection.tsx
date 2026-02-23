"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useState, useEffect } from "react";
import {
  createCommentAction,
  deleteCommentAction,
  getCommentsAction,
} from "@/app/actions/comment";
import { CommentItem } from "@/modules/comment/comment.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { timeAgo } from "@/utils/date";
import { Loader2, Send, Trash2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  bookId: string;
}

export const CommentSection = ({ bookId }: Props) => {
  const { user, userProfile } = useAuth();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async () => {
    setIsLoading(true);
    const result = await getCommentsAction(bookId);
    if (result.success && result.data) {
      setComments(result.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [bookId]);

  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const result = await createCommentAction(bookId, newComment);
    if (result.success) {
      setNewComment("");
      await fetchComments(); // Refresh list
    } else {
      alert(result.error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    const result = await deleteCommentAction(commentId);
    if (result.success) {
      await fetchComments();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-6">
      {/* Input Area */}
      <section className="flex flex-col gap-4 p-4 rounded-xl bg-surface-card border border-border-default shadow-sm">
        <div className="flex items-start gap-4">
          <Avatar className="w-10 h-10 border border-border-default">
            <AvatarFallback className="bg-primary/20 text-primary font-bold">
              {userProfile
                ? (userProfile.first_name?.[0] || "") +
                  (userProfile.last_name?.[0] || "")
                : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex flex-col gap-3">
            <Textarea
              placeholder={
                user
                  ? "Viết bình luận của bro về bộ truyện này..."
                  : "Vui lòng đăng nhập để bình luận"
              }
              className="min-h-[100px] bg-background/50 border-border-default focus:border-primary-accent resize-none transition-all"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!user || isSubmitting}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!user || !newComment.trim() || isSubmitting}
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                Gửi bình luận
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Comments List */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-border-default pb-4">
          <MessageCircle size={20} className="text-primary-accent" />
          <h3 className="text-lg font-bold text-text-primary">
            Bình luận ({comments.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 text-text-muted italic bg-surface-card/30 rounded-xl border border-dashed border-border-default">
            Chưa có bình luận nào. Hãy là người đầu tiên bro nhé!
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="group flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <Avatar className="w-10 h-10 shrink-0 border border-border-default">
                  <AvatarFallback className="bg-surface-raised text-text-secondary">
                    {comment.userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-text-primary">
                        {comment.userName}
                      </span>
                      <span className="text-[10px] text-text-muted">•</span>
                      <time className="text-[11px] text-text-muted">
                        {timeAgo(comment.createdAt)}
                      </time>
                    </div>
                    {user?.id === comment.userId && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-text-muted hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                        title="Xóa bình luận"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="bg-surface-raised/50 p-3 rounded-2xl rounded-tl-none border border-border-default/30">
                    <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
