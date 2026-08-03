import * as React from "react"
import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface StatCardProps extends React.ComponentProps<"div"> {
  icon?: React.ReactNode
  label: string
  value: React.ReactNode
  trend?: {
    value: string
    direction?: "up" | "down" | "neutral"
  }
}

function StatCard({
  icon,
  label,
  value,
  trend,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card
      data-slot="stat-card"
      className={cn(
        "gap-3 p-5 shadow-sm ring-border/60 transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon && (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-4.5">
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "mb-0.5 flex items-center gap-0.5 text-xs font-medium",
              trend.direction === "down"
                ? "text-destructive"
                : trend.direction === "neutral"
                  ? "text-muted-foreground"
                  : "text-emerald-600 dark:text-emerald-400"
            )}
          >
            {trend.direction === "down" ? (
              <ArrowDownRightIcon className="size-3.5" />
            ) : trend.direction === "neutral" ? null : (
              <ArrowUpRightIcon className="size-3.5" />
            )}
            {trend.value}
          </span>
        )}
      </div>
    </Card>
  )
}

export { StatCard }
