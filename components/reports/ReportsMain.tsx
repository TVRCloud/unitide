"use client";
import { motion } from "framer-motion";
import { useViewTaskStats } from "@/hooks/useTask";
import { useInfiniteLogs } from "@/hooks/useLog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DateTime } from "luxon";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";

const STATUS_COLOR: Record<string, string> = {
  completed: "bg-green-500",
  "in-progress": "bg-blue-500",
  todo: "bg-gray-400",
  review: "bg-yellow-500",
  blocked: "bg-red-500",
  cancelled: "bg-gray-300",
};

const PRIORITY_COLOR: Record<string, string> = {
  urgent: "text-red-600 bg-red-50 dark:bg-red-950/40",
  high: "text-orange-600 bg-orange-50 dark:bg-orange-950/40",
  medium: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40",
  low: "text-blue-600 bg-blue-50 dark:bg-blue-950/40",
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReportsMain() {
  const { data: stats, isLoading } = useViewTaskStats();
  const { data: logPages } = useInfiniteLogs();
  const logs = logPages?.pages.flat() ?? [];

  const overview = stats?.overview?.[0];
  const tasksByStatus: { _id: string; value: number }[] =
    stats?.tasksByStatus ?? [];
  const tasksByPriority: { _id: string; count: number }[] =
    stats?.tasksByPriority ?? [];
  const topPerformers: { name: string; completed: number }[] =
    stats?.topPerformers ?? [];
  const projectStats: {
    name: string;
    total: number;
    completed: number;
  }[] = stats?.projectStats ?? [];

  const completionRate =
    overview?.total > 0
      ? Math.round((overview.completed / overview.total) * 100)
      : 0;

  // Activity by day from logs (last 7 days)
  const dayMap: Record<string, number> = {};
  logs.forEach((log) => {
    const day = DateTime.fromISO(log.createdAt).toFormat("EEE");
    dayMap[day] = (dayMap[day] ?? 0) + 1;
  });
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxActivity = Math.max(...days.map((d) => dayMap[d] ?? 0), 1);

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-3xl font-semibold">Reports</h1>
        <p className="text-muted-foreground">
          Overview of task performance, team activity, and project progress.
        </p>
      </motion.div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={BarChart3}
            label="Total Tasks"
            value={overview?.total ?? 0}
            color="bg-primary/10 text-primary"
          />
          <StatCard
            icon={CheckCircle}
            label="Completed"
            value={overview?.completed ?? 0}
            sub={`${completionRate}% completion rate`}
            color="bg-green-100 text-green-700 dark:bg-green-900/40"
          />
          <StatCard
            icon={Clock}
            label="In Progress"
            value={overview?.inProgress ?? 0}
            color="bg-blue-100 text-blue-700 dark:bg-blue-900/40"
          />
          <StatCard
            icon={AlertTriangle}
            label="Blocked"
            value={overview?.blocked ?? 0}
            color="bg-red-100 text-red-700 dark:bg-red-900/40"
          />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tasks by Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))
              : tasksByStatus.map((s) => {
                  const pct =
                    overview?.total > 0
                      ? Math.round((s.value / overview.total) * 100)
                      : 0;
                  return (
                    <div key={s._id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{s._id}</span>
                        <span className="text-muted-foreground">
                          {s.value} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${STATUS_COLOR[s._id] ?? "bg-gray-400"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
          </CardContent>
        </Card>

        {/* Priority breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {tasksByPriority.map((p) => (
                  <div
                    key={p._id}
                    className={`p-3 rounded-lg ${PRIORITY_COLOR[p._id] ?? "bg-muted"}`}
                  >
                    <p className="text-2xl font-bold">{p.count}</p>
                    <p className="text-sm capitalize">{p._id}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))
            ) : projectStats.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No project data
              </p>
            ) : (
              projectStats.slice(0, 6).map((p) => {
                const pct =
                  p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
                return (
                  <div key={p.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium truncate max-w-[60%]">
                        {p.name}
                      </span>
                      <span className="text-muted-foreground">
                        {p.completed}/{p.total}
                      </span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Top performers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : topPerformers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No data yet
              </p>
            ) : (
              <div className="space-y-3">
                {topPerformers.map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium">{p.name}</span>
                    </div>
                    <Badge variant="secondary">{p.completed} tasks</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Weekly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-24">
            {days.map((day) => {
              const count = dayMap[day] ?? 0;
              const height = maxActivity > 0 ? (count / maxActivity) * 100 : 0;
              return (
                <div
                  key={day}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-xs text-muted-foreground">{count}</span>
                  <div className="w-full rounded-t-lg bg-muted overflow-hidden" style={{ height: "72px" }}>
                    <div
                      className="w-full bg-primary rounded-t-lg transition-all"
                      style={{ height: `${height}%`, marginTop: `${100 - height}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
