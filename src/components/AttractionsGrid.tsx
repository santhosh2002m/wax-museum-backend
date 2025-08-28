import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttractionData {
  name: string;
  total: string;
  show_name: string;
  category: string;
}

interface AttractionsGridProps {
  period?: "today" | "week" | "month" | "year";
  attractions: AttractionData[];
}

export function AttractionsGrid({
  period = "today",
  attractions,
}: AttractionsGridProps) {
  // Generate colors for each attraction
  const colorClasses = [
    "bg-blue-500",
    "bg-green-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-lime-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-rose-500",
  ];

  const periodTitles = {
    today: "Today's Attractions",
    week: "Weekly Attractions",
    month: "Monthly Attractions",
    year: "Yearly Attractions",
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          {periodTitles[period]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {attractions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No attraction data available
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 gap-3 ${
              attractions.length > 6
                ? "max-h-72 overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                : ""
            }`}
          >
            {attractions.map((attraction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      colorClasses[index % colorClasses.length]
                    }`}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground truncate">
                      {attraction.show_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {attraction.category}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary min-w-[4rem] text-right">
                  ₹{attraction.total}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
