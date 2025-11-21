import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import { ThemeProvider } from "@/lib/theme.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { Header } from "@/components/Header.jsx";
import { Footer } from "@/components/Footer.jsx";
import { ProfileModal } from "@/components/ProfileModal.jsx";

import { AboutPage } from "@/pages/AboutPage.jsx";
import { HomePage } from "@/pages/HomePage.jsx";
import { ConfessPage } from "@/pages/ConfessPage.jsx";
import { connectWallet, signMessage } from "@/lib/wallet.js";
import { createPost, subscribeToPostsExclude, toggleLike, toggleDislike, addComment, subscribeToComments } from "@/lib/firestore.js";
import { isConfigured } from "@/lib/firebase.js";

function AppContent() {
  const { toast } = useToast();
  const [wallet, setWallet] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileAddress, setProfileAddress] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [votingPostId, setVotingPostId] = useState();
  const [demoMode, setDemoMode] = useState(!isConfigured);
  const [commentsMap, setCommentsMap] = useState({});

  useEffect(() => {
    if (isConfigured && !demoMode) {
      const unsubscribe = subscribeToPostsExclude(
        (newPosts) => {
          setPosts(newPosts);
          setIsLoading(false);
        },
        () => {
          setDemoMode(true);
          setIsLoading(false);
          toast({
            title: "Demo mode activated",
            description: "Firestore access denied. Using local state only.",
            variant: "default",
          });
        }
      );
      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, [demoMode, toast]);

  useEffect(() => {
    if (!isConfigured || demoMode || posts.length === 0) return;

    const unsubscribers = posts.map(post =>
      subscribeToComments(post.id, (comments) => {
        setCommentsMap(prev => ({
          ...prev,
          [post.id]: comments
        }));
      })
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [posts.map(p => p.id).join(','), isConfigured, demoMode]);

  const handleConnectWallet = async () => {
    try {
      const connection = await connectWallet();
      setWallet(connection);

      toast({
        title: "Wallet connected",
        description: `Connected to ${connection.address.slice(0, 6)}...${connection.address.slice(-4)}`,
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    setWallet(null);
    setShowProfile(false);
    setProfileAddress(null);
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const handleShowProfile = (address) => {
    setProfileAddress(address);
    setShowProfile(true);
  };

  const handleCreatePost = async (message) => {
    if (!wallet?.address) return;

    setIsCreating(true);
    try {
      let signature;

      try {
        const signatureMessage = `0xConfess\n\nI am posting the following message:\n"${message}"\n\nTimestamp: ${Date.now()}`;
        signature = await signMessage(wallet.address, signatureMessage);
      } catch (signError) {
        if (signError.message.includes("rejected")) {
          toast({
            title: "Signature required",
            description: "You need to sign the message to prove ownership",
            variant: "destructive",
          });
          setIsCreating(false);
          return;
        }
      }

      if (isConfigured && !demoMode) {
        try {
          await createPost({
            message,
            address: wallet.address,
            signature,
          });
        } catch (createError) {
          if (createError.message === "PERMISSION_DENIED") {
            setDemoMode(true);
            const newPost = {
              id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              message,
              address: wallet.address.toLowerCase(),
              timestamp: Date.now(),
              likes: 0,
              dislikes: 0,
              likedBy: [],
              dislikedBy: [],
              ensName: wallet.ensName,
              signature,
            };
            setPosts(prev => [newPost, ...prev]);
          } else {
            throw createError;
          }
        }
      } else {
        const newPost = {
          id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          message,
          address: wallet.address.toLowerCase(),
          timestamp: Date.now(),
          likes: 0,
          dislikes: 0,
          likedBy: [],
          dislikedBy: [],
          ensName: wallet.ensName,
          signature,
        };
        setPosts(prev => [newPost, ...prev]);
      }

      toast({
        title: "Post created",
        description: demoMode ? "Post saved locally (demo mode)" : "Your post has been shared with the community",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Failed to create post",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleLike = async (postId) => {
    if (!wallet?.address || votingPostId) return;

    setVotingPostId(postId);

    const updateLocalState = () => {
      setPosts(prev => prev.map(post => {
        if (post.id !== postId) return post;

        const userAddress = wallet.address.toLowerCase();
        const hasLiked = post.likedBy.includes(userAddress);
        const hasDisliked = post.dislikedBy.includes(userAddress);

        if (hasLiked) {
          return {
            ...post,
            likes: post.likes - 1,
            likedBy: post.likedBy.filter(addr => addr !== userAddress),
          };
        }

        if (hasDisliked) {
          return {
            ...post,
            likes: post.likes + 1,
            dislikes: post.dislikes - 1,
            likedBy: [...post.likedBy, userAddress],
            dislikedBy: post.dislikedBy.filter(addr => addr !== userAddress),
          };
        }

        return {
          ...post,
          likes: post.likes + 1,
          likedBy: [...post.likedBy, userAddress],
        };
      }));
    };

    try {
      if (isConfigured && !demoMode) {
        try {
          await toggleLike(postId, wallet.address);
        } catch (likeError) {
          if (likeError.message === "PERMISSION_DENIED") {
            setDemoMode(true);
            updateLocalState();
            toast({
              title: "Demo mode activated",
              description: "Firestore access denied. Using local state only.",
              variant: "default",
            });
          } else {
            throw likeError;
          }
        }
      } else {
        updateLocalState();
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Failed to like post",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setVotingPostId(undefined), 300);
    }
  };

  const handleDislike = async (postId) => {
    if (!wallet?.address || votingPostId) return;

    setVotingPostId(postId);

    const updateLocalState = () => {
      setPosts(prev => prev.map(post => {
        if (post.id !== postId) return post;

        const userAddress = wallet.address.toLowerCase();
        const hasLiked = post.likedBy.includes(userAddress);
        const hasDisliked = post.dislikedBy.includes(userAddress);

        if (hasDisliked) {
          return {
            ...post,
            dislikes: post.dislikes - 1,
            dislikedBy: post.dislikedBy.filter(addr => addr !== userAddress),
          };
        }

        if (hasLiked) {
          return {
            ...post,
            likes: post.likes - 1,
            dislikes: post.dislikes + 1,
            likedBy: post.likedBy.filter(addr => addr !== userAddress),
            dislikedBy: [...post.dislikedBy, userAddress],
          };
        }

        return {
          ...post,
          dislikes: post.dislikes + 1,
          dislikedBy: [...post.dislikedBy, userAddress],
        };
      }));
    };

    try {
      if (isConfigured && !demoMode) {
        try {
          await toggleDislike(postId, wallet.address);
        } catch (dislikeError) {
          if (dislikeError.message === "PERMISSION_DENIED") {
            setDemoMode(true);
            updateLocalState();
            toast({
              title: "Demo mode activated",
              description: "Firestore access denied. Using local state only.",
              variant: "default",
            });
          } else {
            throw dislikeError;
          }
        }
      } else {
        updateLocalState();
      }
    } catch (error) {
      console.error("Error toggling dislike:", error);
      toast({
        title: "Failed to dislike post",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setVotingPostId(undefined), 300);
    }
  };

  const handleAddComment = async (postId, message, userAddress) => {
    if (!wallet?.address) return;

    try {
      let signature;

      try {
        const signatureMessage = `0xConfess\n\nI am commenting on post ${postId}:\n"${message}"\n\nTimestamp: ${Date.now()}`;
        signature = await signMessage(wallet.address, signatureMessage);
      } catch (signError) {
        if (signError.message.includes("rejected")) {
          toast({
            title: "Signature required",
            description: "You need to sign the message to post a comment",
            variant: "destructive",
          });
          return;
        }
      }

      if (isConfigured && !demoMode) {
        try {
          await addComment(postId, message, wallet.address, signature);
        } catch (commentError) {
          if (commentError.message === "PERMISSION_DENIED") {
            setDemoMode(true);
            // Add comment to local state
            setCommentsMap(prev => ({
              ...prev,
              [postId]: [...(prev[postId] || []), {
                id: `comment-${Date.now()}`,
                postId,
                message,
                address: wallet.address,
                timestamp: Date.now(),
                signature,
              }]
            }));
          } else {
            throw commentError;
          }
        }
      } else {
        // Local demo mode - add comment
        setCommentsMap(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), {
            id: `comment-${Date.now()}`,
            postId,
            message,
            address: wallet.address,
            timestamp: Date.now(),
            signature,
          }]
        }));
      }

      toast({
        title: "Comment posted",
        description: demoMode ? "Comment saved locally (demo mode)" : "Your comment has been posted",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Failed to post comment",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };


  const displayAddress = profileAddress || wallet?.address;
  const userPosts = posts.filter(
    post => displayAddress && post.address.toLowerCase() === displayAddress.toLowerCase()
  );
  const isOwnProfile = wallet?.address && displayAddress?.toLowerCase() === wallet.address.toLowerCase();

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        walletAddress={wallet?.address}
        onConnectWallet={handleConnectWallet}
        onOpenProfile={() => handleShowProfile(wallet?.address)}
      />

      <Switch>
        <Route path="/">
          <HomePage
            onConnectWallet={handleConnectWallet}
            isConnected={!!wallet}
          />
        </Route>

        <Route path="/confess">
          <ConfessPage
            posts={posts}
            currentAddress={wallet?.address}
            isConnected={!!wallet}
            onCreatePost={handleCreatePost}
            onLike={handleLike}
            onDislike={handleDislike}
            onAddComment={handleAddComment}
            onShowProfile={handleShowProfile}
            isCreating={isCreating}
            isLoading={isLoading}
            votingPostId={votingPostId}
            commentsMap={commentsMap}
          />
        </Route>

        <Route path="/about">
          <AboutPage />
        </Route>
      </Switch>

      <Footer />

      {showProfile && displayAddress && (
        <ProfileModal
          address={displayAddress}
          ensName={displayAddress === wallet?.address ? wallet.ensName : undefined}
          userPosts={userPosts}
          onClose={() => {
            setShowProfile(false);
            setProfileAddress(null);
          }}
          onDisconnect={isOwnProfile ? handleDisconnect : undefined}
          isOwnProfile={isOwnProfile}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
