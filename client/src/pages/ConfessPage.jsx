import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card } from "@/components/ui/card.jsx";
import { ConfessPost } from "@/components/ConfessPost.jsx";
import { ConfessSidebar } from "@/components/ConfessSidebar.jsx";
import { Loader2 } from "lucide-react";

export function ConfessPage({
  posts = [],
  currentAddress,
  isConnected,
  onCreatePost,
  onLike,
  onDislike,
  onAddComment,
  onShowProfile,
  isCreating = false,
  isLoading = false,
  votingPostId,
  commentsMap = {},
}) {
  const [newMessage, setNewMessage] = useState("");
  const [topPosts, setTopPosts] = useState([]);
  const [topUsers, setTopUsers] = useState([]);

  // Compute engagement-based rankings
  useEffect(() => {
    if (posts.length === 0) return;

    // Top 5 posts by engagement (likes*2 + dislikes + comments*1.5)
    const withEngagement = posts.map(p => ({
      ...p,
      commentCount: commentsMap[p.id]?.length || 0,
    })).map(p => ({
      ...p,
      engagement: (p.likes || 0) * 2 + (p.dislikes || 0) + (p.commentCount || 0) * 1.5,
    }));
    
    const sorted = [...withEngagement].sort((a, b) => b.engagement - a.engagement);
    setTopPosts(sorted.slice(0, 5));

    // Most active users: by posts count + likes received
    const userMap = new Map();
    posts.forEach(p => {
      const addr = p.address?.toLowerCase();
      if (!addr) return;
      
      if (!userMap.has(addr)) {
        userMap.set(addr, {
          address: p.address,
          postsCount: 0,
          likesReceived: 0,
        });
      }
      
      const user = userMap.get(addr);
      user.postsCount += 1;
      user.likesReceived += (p.likes || 0);
    });

    const users = Array.from(userMap.values()).map(u => {
      const hash = u.address.toLowerCase();
      let hashNum = 0;
      for (let i = 0; i < hash.length; i++) {
        hashNum = ((hashNum << 5) - hashNum) + hash.charCodeAt(i) | 0;
      }
      const num = Math.abs(hashNum) % 10000;
      
      return {
        anonId: `Anon #${String(num).padStart(4, "0")}`,
        address: u.address,
        postsCount: u.postsCount,
        likesReceived: u.likesReceived,
        activityScore: u.postsCount * 3 + u.likesReceived * 2,
      };
    });

    const sortedUsers = [...users].sort((a, b) => b.activityScore - a.activityScore);
    setTopUsers(sortedUsers.slice(0, 5));
  }, [posts, commentsMap]);

  const handleSubmitPost = async () => {
    if (!newMessage.trim() || !isConnected) return;
    
    try {
      await onCreatePost(newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔥 0xConfess</h1>
        <p className="text-muted-foreground mb-8">
          Share anonymous confessions. AI rates engagement and trends in real-time.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Composer */}
            {isConnected && (
              <Card className="p-4">
                <Textarea
                  placeholder="Write a confession... (max 280 chars)"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value.slice(0, 280))}
                  disabled={isCreating}
                  className="mb-3 resize-none"
                  rows={4}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {newMessage.length}/280
                  </span>
                  <Button
                    size="sm"
                    onClick={handleSubmitPost}
                    disabled={!newMessage.trim() || isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post"
                    )}
                  </Button>
                </div>
              </Card>
            )}

            {/* Posts List */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map(post => (
                  <ConfessPost
                    key={post.id}
                    post={post}
                    currentAddress={currentAddress}
                    onLike={onLike}
                    onDislike={onDislike}
                    onAddComment={onAddComment}
                    onShowProfile={onShowProfile}
                    comments={commentsMap[post.id] || []}
                    isVoting={votingPostId === post.id}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  {isConnected
                    ? "No confessions yet. Be the first!"
                    : "Connect your wallet to see confessions"}
                </p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:block">
            <ConfessSidebar topPosts={topPosts} topUsers={topUsers} />
          </div>
        </div>
      </div>
    </main>
  );
}
