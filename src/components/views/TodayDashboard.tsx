import { Ticket, DollarSign, Users, TrendingUp } from "lucide-react";
import { MetricCard } from "../MetricCard";
import { StatsChart } from "../StatsChart";
import { AttractionsGrid } from "../AttractionsGrid";

export function TodayDashboard() {
  const todayMetrics = [
    {
      title: "Total Tickets",
      value: 44,
      icon: Ticket,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Total Amount",
      value: "₹9720",
      icon: DollarSign,
      variant: "primary" as const,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Active Visitors",
      value: 28,
      icon: Users,
      variant: "success" as const,
      trend: { value: 15, isPositive: true },
    },
    {
      title: "Revenue Growth",
      value: "+18%",
      icon: TrendingUp,
      variant: "warning" as const,
      trend: { value: 5, isPositive: true },
    },
  ];

  const chartData = [
    { time: "9 AM", value: 10 },
    { time: "10 AM", value: 15 },
    { time: "11 AM", value: 8 },
    { time: "12 PM", value: 22 },
    { time: "1 PM", value: 18 },
    { time: "2 PM", value: 12 },
    { time: "3 PM", value: 25 },
    { time: "4 PM", value: 20 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Today's Overview
        </h2>
        <p className="text-muted-foreground">
          Real-time metrics and performance data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {todayMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsChart
          title="Hourly Ticket Sales"
          data={chartData}
          dataKey="value"
          nameKey="time"
        />
        <AttractionsGrid />
      </div>
    </div>
  );
}
