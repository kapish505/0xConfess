import { Badge } from "@/components/ui/badge.jsx";
import { Shield, Award, Star } from "lucide-react";

export function WalletBadge({ badge, walletAge, txCount, showDetails = false }) {
  const getBadgeVariant = () => {
    switch (badge) {
      case "OG":
        return "default";
      case "Trusted":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getBadgeIcon = () => {
    switch (badge) {
      case "OG":
        return <Star className="h-3 w-3 mr-1" />;
      case "Trusted":
        return <Award className="h-3 w-3 mr-1" />;
      default:
        return <Shield className="h-3 w-3 mr-1" />;
    }
  };

  const getBadgeColor = () => {
    switch (badge) {
      case "OG":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "Trusted":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-2">
      <Badge variant={getBadgeVariant()} className={`flex items-center w-fit ${getBadgeColor()}`} data-testid={`badge-${badge.toLowerCase()}`}>
        {getBadgeIcon()}
        {badge} Wallet
      </Badge>
      {showDetails && (
        <p className="text-xs text-muted-foreground" data-testid="text-badge-details">
          {txCount.toLocaleString()} transactions • {walletAge.toLocaleString()} blocks age
        </p>
      )}
    </div>
  );
}
