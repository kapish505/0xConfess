import { useLocation } from "wouter";
import { Wallet, Zap, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Card } from "@/components/ui/card.jsx";

// Hero image: Web3 wallet illustration
const heroImage = null; // Will use styled container instead

export function HomePage({ onConnectWallet, isConnected }) {
  const [, navigate] = useLocation();

  return (
    <div className="flex-1">
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-background to-purple-600/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(147,51,234,0.1),rgba(255,255,255,0))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight" data-testid="text-hero-title">
                  Anonymous{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-600">
                    Confessions
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed" data-testid="text-hero-subtitle">
                  Connect your wallet, share your confessions, and let AI rate the spice. Engage with the decentralized community anonymously.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                {isConnected ? (
                  <Button
                    size="lg"
                    onClick={() => navigate("/confess")}
                    className="gap-2 text-lg px-8 py-6"
                    data-testid="button-view-wall"
                  >
                    <Zap className="h-5 w-5" />
                    View Confessions
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={onConnectWallet}
                    className="gap-2 text-lg px-8 py-6"
                    data-testid="button-hero-connect"
                  >
                    <Wallet className="h-5 w-5" />
                    Connect Wallet
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/about")}
                  className="text-lg px-8 py-6"
                  data-testid="button-learn-more"
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt="0xConfess Illustration"
                  className="w-full h-auto"
                  data-testid="img-hero"
                />
              ) : (
                <div className="loader-wrapper-large">
                  <div className="loader"></div>
                  <span className="loader-letter">0</span>
                  <span className="loader-letter">x</span>
                  <span className="loader-letter">C</span>
                  <span className="loader-letter">o</span>
                  <span className="loader-letter">n</span>
                  <span className="loader-letter">f</span>
                  <span className="loader-letter">e</span>
                  <span className="loader-letter">s</span>
                  <span className="loader-letter">s</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-features-title">
              Why 0xConfess?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience anonymous confessions with AI-powered spice ratings, real-time engagement, and blockchain-verified authenticity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover-elevate transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3" data-testid="text-feature-realtime">
                AI-Powered Ratings
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our AI evaluates the spice level of confessions based on engagement metrics and content.
              </p>
            </Card>

            <Card className="p-8 hover-elevate transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3" data-testid="text-feature-secure">
                Truly Anonymous
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Your wallet verifies your identity, but your confessions are completely anonymous to the community.
              </p>
            </Card>

            <Card className="p-8 hover-elevate transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3" data-testid="text-feature-community">
                Community Engagement
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Like, dislike, and comment on confessions. Trending confessions bubble up based on engagement.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
