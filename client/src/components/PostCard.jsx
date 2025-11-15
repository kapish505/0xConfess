import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { getInitials, generateIdenticon, shortenAddress } from "@/lib/wallet.js";
import { formatDistanceToNow } from "date-fns";

export function PostCard({ post, currentAddress, onLike, onDislike, isLiking, isDisliking }) {
  const hasLiked = currentAddress ? post.likedBy.includes(currentAddress.toLowerCase()) : false;
  const hasDisliked = currentAddress ? post.dislikedBy.includes(currentAddress.toLowerCase()) : false;
  const isOwnPost = currentAddress?.toLowerCase() === post.address.toLowerCase();

  return (
    <Card className="p-6 hover-elevate transition-all duration-200" data-testid={`card-post-${post.id}`}>
      <div className="flex gap-4">
        <Avatar className="w-12 h-12 flex-shrink-0">
          <AvatarImage src={generateIdenticon(post.address)} alt={post.address} />
          <AvatarFallback>{getInitials(post.address)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              {post.ensName && (
                <p className="font-semibold text-sm mb-1" data-testid={`text-ens-${post.id}`}>
                  {post.ensName}
                </p>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <code className="text-sm text-muted-foreground font-mono" data-testid={`text-address-${post.id}`}>
                  {shortenAddress(post.address)}
                </code>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground" data-testid={`text-timestamp-${post.id}`}>
                  {formatDistanceToNow(post.timestamp, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>

          <p className="text-base leading-relaxed mb-4 break-words" data-testid={`text-message-${post.id}`}>
            {post.message}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant={hasLiked ? "default" : "outline"}
              size="sm"
              onClick={() => onLike(post.id)}
              disabled={!currentAddress || isLiking || isDisliking || isOwnPost}
              className={`gap-2 ${hasLiked ? "bg-green-500 hover:bg-green-600 text-white" : ""}`}
              data-testid={`button-like-${post.id}`}
            >
              <ThumbsUp className="h-4 w-4" />
              <span data-testid={`text-likes-${post.id}`}>{post.likes}</span>
            </Button>

            <Button
              variant={hasDisliked ? "default" : "outline"}
              size="sm"
              onClick={() => onDislike(post.id)}
              disabled={!currentAddress || isLiking || isDisliking || isOwnPost}
              className={`gap-2 ${hasDisliked ? "bg-red-500 hover:bg-red-600 text-white" : ""}`}
              data-testid={`button-dislike-${post.id}`}
            >
              <ThumbsDown className="h-4 w-4" />
              <span data-testid={`text-dislikes-${post.id}`}>{post.dislikes}</span>
            </Button>

            {isOwnPost && (
              <span className="text-xs text-muted-foreground ml-2">Your post</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
