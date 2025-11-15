import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { SpiceMeter } from "./SpiceMeter.jsx";
import { MessageSquare } from "lucide-react";

export function ConfessComments({ 
  postId, 
  comments = [], 
  isLoading = false,
  onAddComment,
  currentAddress 
}) {
  const [showComposer, setShowComposer] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentAddress) return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(postId, newComment, currentAddress);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        <span className="text-sm font-medium">{comments.length} Comments</span>
      </div>

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-2 border-l-2 border-muted pl-4">
          {comments.map(comment => (
            <div key={comment.id} className="text-sm">
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="font-medium text-xs text-muted-foreground">
                    {comment.address.slice(0, 6)}...{comment.address.slice(-4)}
                  </p>
                  <p className="text-sm mt-1">{comment.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(comment.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment Composer */}
      {currentAddress && (
        <div className="mt-2">
          {!showComposer ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComposer(true)}
            >
              Add Comment
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSubmitting}
              />
              <Button
                size="sm"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? "..." : "Post"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComposer(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
