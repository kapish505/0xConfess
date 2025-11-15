import { Card } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { SpiceMeter } from "./SpiceMeter.jsx";
import { ConfessComments } from "./ConfessComments.jsx";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export function ConfessPost({
  post,
  currentAddress,
  onLike,
  onDislike,
  onAddComment,
  onShowProfile,
  comments = [],
  isVoting = false,
  isCreatingComment = false,
}) {
  const userAddress = currentAddress?.toLowerCase();
  const hasLiked = userAddress && post.likedBy?.includes(userAddress);
  const hasDisliked = userAddress && post.dislikedBy?.includes(userAddress);

  const getAnonId = (address) => {
    if (!address) return "Anon";
    const s = address.toLowerCase();
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = ((hash << 5) - hash) + s.charCodeAt(i) | 0;
    }
    const num = Math.abs(hash) % 10000;
    return `Anon #${String(num).padStart(4, "0")}`;
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge 
              variant="outline" 
              className="font-mono text-xs cursor-pointer hover-elevate active-elevate-2" 
              onClick={() => onShowProfile?.(post.address)}
              data-testid={`badge-anon-${post.id}`}
            >
              {getAnonId(post.address)}
            </Badge>
            {post.spiceScore && <SpiceMeter spiceScore={post.spiceScore} spiceLabel={post.spiceLabel} />}
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(post.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Message */}
      <p className="mb-4 text-sm leading-relaxed">{post.message}</p>

      {/* Actions */}
      <div className="flex items-center gap-2 mb-3">
        <Button
          variant={hasLiked ? "default" : "outline"}
          size="sm"
          onClick={() => onLike(post.id)}
          disabled={isVoting || !currentAddress}
          className="gap-2"
        >
          <ThumbsUp className="h-4 w-4" />
          {post.likes || 0}
        </Button>
        <Button
          variant={hasDisliked ? "default" : "outline"}
          size="sm"
          onClick={() => onDislike(post.id)}
          disabled={isVoting || !currentAddress}
          className="gap-2"
        >
          <ThumbsDown className="h-4 w-4" />
          {post.dislikes || 0}
        </Button>
      </div>

      {/* Comments */}
      <ConfessComments
        postId={post.id}
        comments={comments}
        isLoading={isCreatingComment}
        onAddComment={onAddComment}
        currentAddress={currentAddress}
      />
    </Card>
  );
}
