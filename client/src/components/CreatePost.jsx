import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";

export function CreatePost({ onCreatePost, isCreating, isConnected }) {
  const [message, setMessage] = useState("");
  const maxLength = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isCreating) return;

    await onCreatePost(message.trim());
    setMessage("");
  };

  if (!isConnected) {
    return (
      <Card className="p-6 backdrop-blur-md bg-card/50">
        <p className="text-center text-muted-foreground">
          Connect your wallet to start posting
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 backdrop-blur-md bg-card/50">
      <form onSubmit={handleSubmit}>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
          placeholder="What's on your mind? Share with the Web3 community..."
          className="min-h-[120px] resize-none text-base mb-4"
          disabled={isCreating}
          data-testid="input-create-post"
        />
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground" data-testid="text-character-count">
            {message.length}/{maxLength}
          </span>
          
          <Button
            type="submit"
            disabled={!message.trim() || isCreating}
            className="gap-2"
            data-testid="button-submit-post"
          >
            <Send className="h-4 w-4" />
            {isCreating ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
