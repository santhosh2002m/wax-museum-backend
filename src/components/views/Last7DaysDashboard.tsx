import { Ticket, DollarSign, Users, TrendingUp } from "lucide-react";
import { MetricCard } from "../MetricCard";
import { StatsChart } from "../StatsChart";
import { AttractionsGrid } from "../AttractionsGrid";

export function Last7DaysDashboard() {
  const weekMetrics = [
    {
      title: "Total Tickets",
      value: 316,
      icon: Ticket,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Total Amount",
      value: "₹55,510",
      icon: DollarSign,
      variant: "primary" as const,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Daily Average",
      value: 45,
      icon: Users,
      variant: "success" as const,
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Week Growth",
      value: "+8%",
      icon: TrendingUp,
      variant: "warning" as const,
      trend: { value: 3, isPositive: true },
    },
  ];

  const chartData = [
    { day: "Mon", value: 45 },
    { day: "Tue", value: 52 },
    { day: "Wed", value: 38 },
    { day: "Thu", value: 41 },
    { day: "Fri", value: 58 },
    { day: "Sat", value: 65 },
    { day: "Sun", value: 42 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Last 7 Days Performance
        </h2>
        <p className="text-muted-foreground">
          Weekly trends and visitor analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {weekMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsChart
          title="Daily Ticket Sales"
          data={chartData}
          dataKey="value"
          nameKey="day"
        />
        <AttractionsGrid period="week" />
      </div>
    </div>
  );
}
