import { Card } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { SpiceMeter } from "./SpiceMeter.jsx";
import { TrendingUp, Users } from "lucide-react";

export function ConfessSidebar({ topPosts = [], topUsers = [] }) {
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
    <aside className="w-full md:w-80 space-y-4">
      {/* Top Posts */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5" />
          <h3 className="font-bold">🔥 Top 5 Posts</h3>
          <Badge variant="secondary" className="ml-auto text-xs">AI</Badge>
        </div>
        
        {topPosts.length > 0 ? (
          <div className="space-y-3">
            {topPosts.map((post, idx) => (
              <div key={post.id} className="border-b pb-2 last:border-b-0 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-xs">#{idx + 1}</p>
                    <p className="text-xs line-clamp-2 mt-1">{post.message}</p>
                    {post.spiceScore && (
                      <div className="mt-1">
                        <SpiceMeter spiceScore={post.spiceScore} spiceLabel={post.spiceLabel} />
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    👍 {post.likes || 0}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No posts yet</p>
        )}
      </Card>

      {/* Most Active Users */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5" />
          <h3 className="font-bold">🏆 Most Active</h3>
          <Badge variant="secondary" className="ml-auto text-xs">AI</Badge>
        </div>
        
        {topUsers.length > 0 ? (
          <div className="space-y-2">
            {topUsers.map((user, idx) => (
              <div key={user.anonId} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-xs">#{idx + 1}</p>
                  <p className="text-xs text-muted-foreground">{user.anonId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">{user.postsCount || 0} posts</p>
                  <p className="text-xs text-muted-foreground">{user.likesReceived || 0} likes</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No users yet</p>
        )}
      </Card>
    </aside>
  );
}
