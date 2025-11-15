import { useState, useEffect } from "react";
import { X, Copy, LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { getInitials, generateIdenticon } from "@/lib/wallet.js";
import { analyzeWallet } from "@/lib/walletBadge.js";
import { WalletBadge } from "./WalletBadge.jsx";

export function ProfileModal({ address, ensName, userPosts, onClose, onDisconnect, isOwnProfile = false }) {
  const { toast } = useToast();
  const [badgeInfo, setBadgeInfo] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    async function loadBadge() {
      setIsAnalyzing(true);
      try {
        const info = await analyzeWallet(address);
        setBadgeInfo(info);
      } catch (error) {
        console.error('Failed to analyze wallet:', error);
        setBadgeInfo({ address, walletAge: 0, txCount: 0, badge: "New" });
      } finally {
        setIsAnalyzing(false);
      }
    }
    loadBadge();
  }, [address]);

  const getAnonId = (addr) => {
    if (!addr) return "Anon";
    const s = addr.toLowerCase();
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = ((hash << 5) - hash) + s.charCodeAt(i) | 0;
    }
    const num = Math.abs(hash) % 10000;
    return `Anon #${String(num).padStart(4, "0")}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address copied",
      description: "Wallet address copied to clipboard",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        data-testid="overlay-profile-modal"
      />
      
      <Card className="relative w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={generateIdenticon(address)} alt={address} />
                <AvatarFallback>{getInitials(address)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold mb-1" data-testid="text-anon-id">
                  {getAnonId(address)}
                </h2>
                {ensName && (
                  <p className="text-sm text-muted-foreground mb-1" data-testid="text-ens-name">
                    {ensName}
                  </p>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-xs text-muted-foreground break-all font-mono" data-testid="text-full-address">
                    {address.slice(0, 10)}...{address.slice(-8)}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyAddress}
                    className="h-7 w-7 flex-shrink-0"
                    aria-label="Copy address"
                    data-testid="button-copy-address"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {isAnalyzing ? (
                  <p className="text-xs text-muted-foreground">Analyzing wallet...</p>
                ) : badgeInfo ? (
                  <>
                    <WalletBadge 
                      badge={badgeInfo.badge} 
                      walletAge={badgeInfo.walletAge} 
                      txCount={badgeInfo.txCount}
                      showDetails={true}
                    />
                    {badgeInfo.error && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        Badge data may be incomplete
                      </p>
                    )}
                  </>
                ) : null}
                <a
                  href={`https://polygonscan.com/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-2"
                  data-testid="link-polygonscan"
                >
                  View on Polygonscan
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close"
              data-testid="button-close-modal"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="font-semibold mb-4" data-testid="text-posts-count">
            {isOwnProfile ? "Your" : "Their"} Posts ({userPosts.length})
          </h3>
          
          {userPosts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="text-no-posts">
              {isOwnProfile ? "You haven't" : "They haven't"} posted anything yet.
            </p>
          ) : (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <Card key={post.id} className="p-4">
                  <p className="text-sm mb-2" data-testid={`text-post-${post.id}`}>
                    {post.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span data-testid={`text-post-date-${post.id}`}>
                      {new Date(post.timestamp).toLocaleDateString()}
                    </span>
                    <span data-testid={`text-post-likes-${post.id}`}>
                      {post.likes} likes
                    </span>
                    <span data-testid={`text-post-dislikes-${post.id}`}>
                      {post.dislikes} dislikes
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {isOwnProfile && onDisconnect && (
          <div className="p-6 border-t">
            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={onDisconnect}
              data-testid="button-disconnect-wallet"
            >
              <LogOut className="h-4 w-4" />
              Disconnect Wallet
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
