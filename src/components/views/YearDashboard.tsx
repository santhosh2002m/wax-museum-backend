import { useState, useEffect } from "react";
import { Ticket, DollarSign, Users, TrendingUp } from "lucide-react";
import { MetricCard } from "../MetricCard";
import { StatsChart } from "../StatsChart";
import { AttractionsGrid } from "../AttractionsGrid";
import { useData } from "@/contexts/DataContext";
import { Skeleton } from "@/components/ui/skeleton";

export function YearDashboard() {
  const { fetchAnnualAnalytics, loading } = useData();
  const [metrics, setMetrics] = useState({
    totalTickets: 0,
    totalAmount: "₹0",
    monthlyAverage: "0",
    annualGrowth: "0",
    chartData: [],
    attractions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAnnualAnalytics();
      if (data) {
        setMetrics({
          totalTickets: data.totalTickets || 0,
          totalAmount: data.totalAmount || "₹0",
          monthlyAverage: data.monthlyAverage || "0",
          annualGrowth: data.annualGrowth || "0",
          chartData: data.chartData || [],
          attractions: data.attractions || [],
        });
      }
    };

    fetchData();
  }, [fetchAnnualAnalytics]);

  const yearMetrics = [
    {
      title: "Total Tickets",
      value: metrics.totalTickets,
      icon: Ticket,
      trend: { value: 22, isPositive: true },
    },
    {
      title: "Total Amount",
      value: metrics.totalAmount,
      icon: DollarSign,
      variant: "primary" as const,
      trend: { value: 28, isPositive: true },
    },
    {
      title: "Monthly Average",
      value: metrics.monthlyAverage,
      icon: Users,
      variant: "success" as const,
      trend: { value: 18, isPositive: true },
    },
    {
      title: "Annual Growth",
      value: `${metrics.annualGrowth}%`,
      icon: TrendingUp,
      variant: "warning" as const,
      trend: {
        value: parseFloat(metrics.annualGrowth),
        isPositive: parseFloat(metrics.annualGrowth) >= 0,
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
          data={metrics.chartData}
          dataKey="value"
          nameKey="month"
        />
        <AttractionsGrid period="year" attractions={metrics.attractions} />
      </div>
    </div>
  );
}
