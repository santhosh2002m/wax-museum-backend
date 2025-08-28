import { useState, useEffect } from "react";
import { Ticket, DollarSign, Users, TrendingUp } from "lucide-react";
import { MetricCard } from "../MetricCard";
import { StatsChart } from "../StatsChart";
import { AttractionsGrid } from "../AttractionsGrid";
import { useData } from "@/contexts/DataContext";
import { Skeleton } from "@/components/ui/skeleton";

export function Last7DaysDashboard() {
  const { fetchLast7DaysAnalytics, loading } = useData();
  const [metrics, setMetrics] = useState({
    totalTickets: 0,
    totalAmount: "₹0",
    dailyAverage: 0,
    weekGrowth: "0",
    attractions: [],
    chartData: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLast7DaysAnalytics();
      if (data) {
        setMetrics({
          totalTickets: data.totalTickets || 0,
          totalAmount: data.totalAmount || "₹0",
          dailyAverage: data.dailyAverage || 0,
          weekGrowth: data.weekGrowth || "0",
          attractions: data.attractions || [],
          chartData: data.chartData || [],
        });
      }
    };

    fetchData();
  }, [fetchLast7DaysAnalytics]);

  const weekMetrics = [
    {
      title: "Total Tickets",
      value: metrics.totalTickets,
      icon: Ticket,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Total Amount",
      value: metrics.totalAmount,
      icon: DollarSign,
      variant: "primary" as const,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Daily Average",
      value: metrics.dailyAverage,
      icon: Users,
      variant: "success" as const,
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Week Growth",
      value: `${metrics.weekGrowth}%`,
      icon: TrendingUp,
      variant: "warning" as const,
      trend: {
        value: parseFloat(metrics.weekGrowth),
        isPositive: parseFloat(metrics.weekGrowth) >= 0,
      },
    },
  ];

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
          data={metrics.chartData}
          dataKey="value"
          nameKey="day"
        />
        <AttractionsGrid period="week" attractions={metrics.attractions} />
      </div>
    </div>
  );
}
