import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: "default" | "primary" | "success" | "warning";
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  variant = "default",
}: MetricCardProps) {
  const variants = {
    default: "bg-gradient-card border-border",
    primary: "bg-gradient-primary text-primary-foreground border-primary/20",
    success: "bg-success/5 border-success/20 text-success-foreground",
    warning: "bg-gold/5 border-gold/20 text-gold-foreground",
  };

  return (
    <Card
      className={cn(
        "shadow-card hover:shadow-professional transition-all duration-300 hover:-translate-y-1",
        variants[variant],
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p
              className={cn(
                "text-sm font-medium",
                variant === "primary"
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
              )}
            >
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3
                className={cn(
                  "text-2xl font-bold tracking-tight",
                  variant === "primary"
                    ? "text-primary-foreground"
                    : "text-foreground"
                )}
              >
                {typeof value === "number" ? value.toLocaleString() : value}
              </h3>
              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    trend.isPositive
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              )}
            </div>
          </div>
          <div
            className={cn(
              "p-3 rounded-lg",
              variant === "primary"
                ? "bg-primary-foreground/10"
                : "bg-primary/10"
            )}
          >
            <Icon
              className={cn(
                "w-6 h-6",
                variant === "primary"
                  ? "text-primary-foreground"
                  : "text-primary"
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
