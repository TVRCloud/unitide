"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  type LucideIcon,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  isLoading?: boolean;
  index?: number;
  color?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  isLoading,
  index = 0,
  color,
}: StatsCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  const gradientColor = color ? color : "from-gray-400 to-gray-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
        <div
          className={cn(
            "absolute top-0 right-0 w-24 h-24 bg-linear-to-br opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500",
            gradientColor
          )}
        />

        <CardContent className="pt-3">
          <div className="flex items-center justify-between mb-2">
            <Icon className="w-5 h-5 text-muted-foreground" />
            <span className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                value
              )}
            </span>
          </div>

          <p className="text-sm text-muted-foreground font-medium truncate">
            {title}
          </p>

          {!isLoading && description && (
            <div className="flex items-center text-xs text-muted-foreground mt-1 truncate">
              <TrendIcon
                className={cn(
                  "mr-1 h-3 w-3 shrink-0",
                  trend === "up" && "text-green-600",
                  trend === "down" && "text-red-600",
                  trend === "neutral" && "text-gray-600"
                )}
              />
              {description}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
