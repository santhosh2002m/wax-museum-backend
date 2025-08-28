import { useState, useEffect } from "react";
import { Ticket, DollarSign, Users, TrendingUp } from "lucide-react";
import { MetricCard } from "../MetricCard";
import { StatsChart } from "../StatsChart";
import { AttractionsGrid } from "../AttractionsGrid";
import { useData } from "@/contexts/DataContext";
import { Skeleton } from "@/components/ui/skeleton";

export function TodayDashboard() {
  const { fetchTodayAnalytics, loading } = useData();
  const [metrics, setMetrics] = useState({
    totalTickets: 0,
    totalAmount: "₹0",
    activeVisitors: 0,
    revenueGrowth: "0",
    attractions: [],
    chartData: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTodayAnalytics();
      if (data) {
        setMetrics({
          totalTickets: data.totalTickets || 0,
          totalAmount: data.totalAmount || "₹0",
          activeVisitors: data.activeVisitors || 0,
          revenueGrowth: data.revenueGrowth || "0",
          attractions: data.attractions || [],
          chartData: data.chartData || [],
        });
      }
    };

    fetchData();
  }, [fetchTodayAnalytics]);

  const todayMetrics = [
    {
      title: "Total Tickets",
      value: metrics.totalTickets,
      icon: Ticket,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Total Amount",
      value: metrics.totalAmount,
      icon: DollarSign,
      variant: "primary" as const,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Active Visitors",
      value: metrics.activeVisitors,
      icon: Users,
      variant: "success" as const,
      trend: { value: 15, isPositive: true },
    },
    {
      title: "Revenue Growth",
      value: `${metrics.revenueGrowth}%`,
      icon: TrendingUp,
      variant: "warning" as const,
      trend: {
        value: parseFloat(metrics.revenueGrowth),
        isPositive: parseFloat(metrics.revenueGrowth) >= 0,
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
          data={metrics.chartData}
          dataKey="value"
          nameKey="time"
        />
        <AttractionsGrid attractions={metrics.attractions} />
      </div>
    </div>
  );
}
