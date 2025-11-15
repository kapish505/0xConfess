import { Link, useLocation } from "wouter";
import { Moon, Sun, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useTheme } from "@/lib/theme.jsx";
import { shortenAddress } from "@/lib/wallet.js";

export function Header({ walletAddress, onConnectWallet, onOpenProfile }) {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/70 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-3 py-2 transition-transform" data-testid="link-home">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">0x</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">0xConfess</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                location === "/" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              }`}
              data-testid="link-nav-home"
            >
              Home
            </Link>
            <Link
              href="/confess"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                location === "/confess" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              }`}
              data-testid="link-nav-confess"
            >
              🔥 Confess
            </Link>
            <Link
              href="/about"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                location === "/about" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              }`}
              data-testid="link-nav-about"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {walletAddress ? (
              <Button
                variant="outline"
                onClick={onOpenProfile}
                className="gap-2 font-mono"
                data-testid="button-wallet-address"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {shortenAddress(walletAddress)}
              </Button>
            ) : (
              <Button
                onClick={onConnectWallet}
                className="gap-2"
                data-testid="button-connect-wallet"
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Connect</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
