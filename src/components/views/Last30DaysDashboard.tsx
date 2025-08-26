import { Ticket, DollarSign, Users, TrendingUp } from "lucide-react";
import { MetricCard } from "../MetricCard";
import { StatsChart } from "../StatsChart";
import { AttractionsGrid } from "../AttractionsGrid";

export function Last30DaysDashboard() {
  const monthMetrics = [
    {
      title: "Total Tickets",
      value: 1156,
      icon: Ticket,
      trend: { value: 15, isPositive: true },
    },
    {
      title: "Total Amount",
      value: "₹264,510",
      icon: DollarSign,
      variant: "primary" as const,
      trend: { value: 18, isPositive: true },
    },
    {
      title: "Daily Average",
      value: 39,
      icon: Users,
      variant: "success" as const,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Month Growth",
      value: "+15%",
      icon: TrendingUp,
      variant: "warning" as const,
      trend: { value: 8, isPositive: true },
    },
  ];

  const chartData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 40) + 20,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Last 30 Days Analytics
        </h2>
        <p className="text-muted-foreground">
          Monthly performance and visitor patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {monthMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsChart
          title="Daily Trend (30 Days)"
          data={chartData}
          dataKey="value"
          nameKey="day"
        />
        <AttractionsGrid period="month" />
      </div>
    </div>
  );
}
