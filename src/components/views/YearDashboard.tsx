import { Ticket, DollarSign, Users, TrendingUp } from "lucide-react";
import { MetricCard } from "../MetricCard";
import { StatsChart } from "../StatsChart";
import { AttractionsGrid } from "../AttractionsGrid";

export function YearDashboard() {
  const yearMetrics = [
    {
      title: "Total Tickets",
      value: 6195,
      icon: Ticket,
      trend: { value: 22, isPositive: true },
    },
    {
      title: "Total Amount",
      value: "₹1,505,880",
      icon: DollarSign,
      variant: "primary" as const,
      trend: { value: 28, isPositive: true },
    },
    {
      title: "Monthly Average",
      value: 516,
      icon: Users,
      variant: "success" as const,
      trend: { value: 18, isPositive: true },
    },
    {
      title: "Annual Growth",
      value: "+22%",
      icon: TrendingUp,
      variant: "warning" as const,
      trend: { value: 15, isPositive: true },
    },
  ];

  const chartData = [
    { month: "Jan", value: 450 },
    { month: "Feb", value: 380 },
    { month: "Mar", value: 520 },
    { month: "Apr", value: 680 },
    { month: "May", value: 590 },
    { month: "Jun", value: 720 },
    { month: "Jul", value: 890 },
    { month: "Aug", value: 750 },
    { month: "Sep", value: 640 },
    { month: "Oct", value: 580 },
    { month: "Nov", value: 485 },
    { month: "Dec", value: 500 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Annual Performance
        </h2>
        <p className="text-muted-foreground">
          Yearly insights and business growth metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {yearMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsChart
          title="Monthly Sales Overview"
          data={chartData}
          dataKey="value"
          nameKey="month"
        />
        <AttractionsGrid period="year" />
      </div>
    </div>
  );
}
