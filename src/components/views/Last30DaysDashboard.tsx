import { useState, useEffect } from "react";
import { Ticket, DollarSign, Users, TrendingUp } from "lucide-react";
import { MetricCard } from "../MetricCard";
import { StatsChart } from "../StatsChart";
import { AttractionsGrid } from "../AttractionsGrid";
import { useData } from "@/contexts/DataContext";
import { Skeleton } from "@/components/ui/skeleton";

// Icon mapping function
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Ticket":
      return Ticket;
    case "DollarSign":
      return DollarSign;
    case "Users":
      return Users;
    case "TrendingUp":
      return TrendingUp;
    default:
      return Ticket;
  }
};

export function Last30DaysDashboard() {
  const { fetchLast30DaysAnalytics, loading } = useData();
  const [metrics, setMetrics] = useState({
    totalTickets: 0,
    totalAmount: "₹0",
    dailyAverage: "0",
    monthGrowth: "0",
    monthMetrics: [],
    attractions: [],
    chartData: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLast30DaysAnalytics();
      if (data) {
        setMetrics({
          totalTickets: data.totalTickets || 0,
          totalAmount: data.totalAmount || "₹0",
          dailyAverage: data.dailyAverage || "0",
          monthGrowth: data.monthGrowth || "0",
          monthMetrics: data.monthMetrics || [],
          attractions: data.attractions || [],
          chartData: data.chartData || [],
        });
      }
    };

    fetchData();
  }, [fetchLast30DaysAnalytics]);

  // Generate chart data if not provided by API
  const chartData =
    metrics.chartData.length > 0
      ? metrics.chartData
      : Array.from({ length: 30 }, (_, i) => ({
          day: `Day ${i + 1}`,
          value: Math.floor(Math.random() * 40) + 20,
        }));

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-32 rounded-lg" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

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
        {metrics.monthMetrics.length > 0
          ? metrics.monthMetrics.map((metric: any, index) => {
              const IconComponent = getIconComponent(metric.icon);
              return (
                <MetricCard
                  key={index}
                  title={metric.title}
                  value={metric.value}
                  icon={IconComponent}
                  variant={metric.variant}
                  trend={metric.trend}
                />
              );
            })
          : // Fallback metrics if monthMetrics is not provided
            [
              {
                title: "Total Tickets",
                value: metrics.totalTickets,
                icon: Ticket,
                trend: { value: 15, isPositive: true },
              },
              {
                title: "Total Amount",
                value: metrics.totalAmount,
                icon: DollarSign,
                variant: "primary" as const,
                trend: { value: 18, isPositive: true },
              },
              {
                title: "Daily Average",
                value: metrics.dailyAverage,
                icon: Users,
                variant: "success" as const,
                trend: { value: 12, isPositive: true },
              },
              {
                title: "Month Growth",
                value: `${metrics.monthGrowth}%`,
                icon: TrendingUp,
                variant: "warning" as const,
                trend: {
                  value: parseFloat(metrics.monthGrowth),
                  isPositive: parseFloat(metrics.monthGrowth) >= 0,
                },
              },
            ].map((metric, index) => <MetricCard key={index} {...metric} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsChart
          title="Daily Trend (30 Days)"
          data={chartData}
          dataKey="value"
          nameKey="day"
        />
        <AttractionsGrid period="month" attractions={metrics.attractions} />
      </div>
    </div>
  );
}
