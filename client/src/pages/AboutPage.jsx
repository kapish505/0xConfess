import { Card } from "@/components/ui/card.jsx";
import { Code, Database, Wallet, Sparkles, Shield, Award, Star, Flame } from "lucide-react";

export function AboutPage() {
  return (
    <div className="flex-1 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="text-about-title">
              About 0xConfess
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              An anonymous Web3 confession platform with AI-powered spice ratings, built for the decentralized community.
            </p>
          </div>

          <Card className="p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6" data-testid="text-project-description">
              Project Overview
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                0xConfess is a demonstration project that combines the power of blockchain identity with anonymous confessions and AI-powered engagement ratings. By connecting your MetaMask wallet, you become part of a decentralized community where you can share confessions anonymously while maintaining verified identity.
              </p>
              <p>
                This platform showcases how Web3 technologies can be integrated into social applications, featuring AI spice ratings based on engagement metrics, trending posts, and real-time community interactions. Users maintain true ownership of their identity while sharing thoughts anonymously.
              </p>
              <p>
                Built as a hackathon project, this application demonstrates real-time data synchronization, wallet-based authentication, AI integration, and community engagement features in a beautiful, modern interface.
              </p>
            </div>
          </Card>

          <div>
            <h2 className="text-2xl font-bold mb-6" data-testid="text-key-features">
              Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="p-6 hover-elevate transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Flame className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Spice Meter</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Every confession gets an AI-powered "spice rating" that evaluates engagement potential. The meter dynamically updates based on community reactions!
                    </p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <Flame className="h-3 w-3 text-red-500" />
                        <span>Hot (High engagement)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <Sparkles className="h-3 w-3 text-orange-500" />
                        <span>Spicy (Medium engagement)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <Star className="h-3 w-3 text-blue-500" />
                        <span>Mild (Low engagement)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover-elevate transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Wallet Reputation Badges</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your wallet's on-chain history determines your reputation badge. Click on any anonymous ID to view their profile and badge!
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Star className="h-3 w-3 text-amber-500" />
                        <span className="font-semibold text-amber-700 dark:text-amber-400">OG Wallet</span>
                        <span className="text-muted-foreground">- 200k+ blocks or 100+ txs</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Award className="h-3 w-3 text-blue-500" />
                        <span className="font-semibold text-blue-700 dark:text-blue-400">Trusted Wallet</span>
                        <span className="text-muted-foreground">- 50k+ blocks or 10+ txs</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Shield className="h-3 w-3 text-muted-foreground" />
                        <span className="font-semibold">New Wallet</span>
                        <span className="text-muted-foreground">- Just getting started</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <h2 className="text-2xl font-bold mb-6" data-testid="text-tech-stack">
              Technology Stack
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 hover-elevate transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">MetaMask Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Wallet connection and message signing for verified posts
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover-elevate transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Firebase Firestore</h3>
                    <p className="text-sm text-muted-foreground">
                      Real-time database for posts, likes, and user interactions
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover-elevate transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">React & JavaScript</h3>
                    <p className="text-sm text-muted-foreground">
                      Modern frontend with component architecture
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover-elevate transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Tailwind CSS</h3>
                    <p className="text-sm text-muted-foreground">
                      Glassmorphism design with smooth animations
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <Card className="p-8 md:p-12 bg-primary/5">
            <h2 className="text-2xl font-bold mb-6" data-testid="text-hackathon">
              Built for Innovation
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This project was created as a hackathon demonstration to explore the possibilities of Web3 social platforms. It showcases how blockchain technology can enhance user identity and create more transparent, community-driven social experiences.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              While this is a demo project, it implements production-ready features including transaction-safe voting, real-time updates, and secure wallet integration. We welcome feedback and contributions from the community!
            </p>
          </Card>

          <Card className="p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6">Contact & Support</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Have questions or feedback? We'd love to hear from you! This is an open-source demonstration project built to inspire and educate about Web3 technologies.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/kapish505/0xConfess"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                data-testid="link-github-about"
              >
                GitHub Repository
              </a>
              <span className="text-muted-foreground">•</span>
              <a
                href="https://x.com/cipher_lnmiit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                data-testid="link-twitter-about"
              >
                Follow on Twitter
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
