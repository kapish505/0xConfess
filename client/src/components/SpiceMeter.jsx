import { Badge } from "@/components/ui/badge.jsx";

export function SpiceMeter({ spiceScore = 1, spiceLabel = "Mild" }) {
  const scoreMap = {
    1: { icon: "🌱", label: "Mild", color: "bg-green-500" },
    2: { icon: "🔥", label: "Spicy", color: "bg-yellow-500" },
    3: { icon: "🔥🔥", label: "Very Spicy", color: "bg-orange-500" },
    4: { icon: "🔥🔥🔥", label: "Wild", color: "bg-red-500" },
    5: { icon: "🚨", label: "Nuclear", color: "bg-red-700" },
  };

  const score = Math.min(Math.max(spiceScore || 1, 1), 5);
  const data = scoreMap[score] || scoreMap[1];

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className={`${data.color} text-white`}>
        <span className="mr-1">{data.icon}</span>
        {data.label}
      </Badge>
      <span className="text-xs text-muted-foreground">Score: {score}/5</span>
    </div>
  );
}
