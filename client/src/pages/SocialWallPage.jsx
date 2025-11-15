import { CreatePost } from "@/components/CreatePost.jsx";
import { PostCard } from "@/components/PostCard.jsx";
import { Card } from "@/components/ui/card.jsx";

export function SocialWallPage({
  posts,
  currentAddress,
  isConnected,
  onCreatePost,
  onLike,
  onDislike,
  isCreating,
  isLoading,
  votingPostId,
}) {
  return (
    <div className="flex-1 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-title">
            Social Wall
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your thoughts with the Web3 community
          </p>
        </div>

        <div className="space-y-6">
          <CreatePost
            onCreatePost={onCreatePost}
            isCreating={isCreating}
            isConnected={isConnected}
          />

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg" data-testid="text-no-posts">
                No posts yet. Be the first to share something!
              </p>
            </Card>
          ) : (
            <div className="space-y-4" data-testid="container-posts">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentAddress={currentAddress}
                  onLike={onLike}
                  onDislike={onDislike}
                  isLiking={votingPostId === post.id}
                  isDisliking={votingPostId === post.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
