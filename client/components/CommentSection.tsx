import { useState } from "react";
import { Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Comment } from "@/types/task";

interface CommentSectionProps {
  taskId: string;
  comments: Comment[];
}

export function CommentSection({ taskId, comments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // In a real app, this would make an API call
    console.log("Adding comment:", { taskId, content: newComment });
    setNewComment("");
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <h4 className="font-medium text-foreground flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Comments & Feedback
      </h4>

      {/* Comment Timeline */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {getInitials(comment.author)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-foreground">
                  {comment.author}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimestamp(comment.timestamp)}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-lg p-2">
                {comment.content}
              </p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-4">
            No comments yet. Be the first to provide feedback!
          </p>
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder="Add your feedback or comments..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px] resize-none"
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={!newComment.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Post Comment
          </Button>
        </div>
      </form>
    </div>
  );
}
