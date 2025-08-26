import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttractionData {
  name: string;
  count: number;
  color: string;
}

interface AttractionsGridProps {
  period?: "today" | "week" | "month" | "year";
}

export function AttractionsGrid({ period = "today" }: AttractionsGridProps) {
  const getAttractionsData = (): AttractionData[] => {
    const baseData = [
      { name: "Combo", count: 17, color: "bg-blue-500" },
      { name: "Wax Museum", count: 26, color: "bg-green-500" },
      { name: "Horror House", count: 2, color: "bg-red-500" },
      { name: "90 combo", count: 0, color: "bg-purple-500" },
      { name: "80 combo", count: 0, color: "bg-yellow-500" },
      { name: "70 combo", count: 0, color: "bg-pink-500" },
      { name: "60 combo", count: 0, color: "bg-indigo-500" },
      { name: "Bike ride", count: 0, color: "bg-orange-500" },
      { name: "Bowling", count: 0, color: "bg-teal-500" },
      { name: "Kids games", count: 0, color: "bg-cyan-500" },
      { name: "Archery", count: 0, color: "bg-lime-500" },
      { name: "Bull ride", count: 0, color: "bg-amber-500" },
      { name: "30 h.h or wax", count: 0, color: "bg-emerald-500" },
      { name: "50 combo", count: 0, color: "bg-rose-500" },
    ];

    // Adjust data based on period
    const multiplier =
      period === "today"
        ? 1
        : period === "week"
        ? 7
        : period === "month"
        ? 30
        : 365;
    return baseData.map((item) => ({
      ...item,
      count: Math.floor(item.count * multiplier * (0.8 + Math.random() * 0.4)),
    }));
  };

  const attractions = getAttractionsData();

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Attractions Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {attractions.map((attraction, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${attraction.color}`} />
                <span className="text-sm font-medium text-foreground truncate">
                  {attraction.name}
                </span>
              </div>
              <span className="text-sm font-bold text-primary min-w-[2rem] text-right">
                {attraction.count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
