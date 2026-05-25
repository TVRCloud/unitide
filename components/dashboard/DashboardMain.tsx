"use client";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  ListTodo,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { HeaderSection } from "../ui/header-section";
import { Button } from "../ui/button";
import { StatsCard } from "../ui/stats-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { useViewTaskStats } from "@/hooks/useTask";
import { useInfiniteLogs } from "@/hooks/useLog";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  "todo": { label: "To Do", color: "from-slate-500 to-slate-600" },
  "in-progress": { label: "In Progress", color: "from-blue-500 to-blue-600" },
  "review": { label: "Review", color: "from-amber-500 to-amber-600" },
  "completed": { label: "Completed", color: "from-green-500 to-green-600" },
  "blocked": { label: "Blocked", color: "from-red-500 to-red-600" },
};

const PRIORITY_VARIANT: Record<string, "destructive" | "default" | "secondary" | "outline"> = {
  urgent: "destructive",
  high: "default",
  medium: "secondary",
  low: "outline",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const DashboardMain = () => {
  const { data: stats, isLoading: statsLoading } = useViewTaskStats();
  const { data: logsData, isLoading: logsLoading } = useInfiniteLogs();

  const overview = stats?.overview?.[0];
  const tasksByStatus: { _id: string; value: number }[] = stats?.tasksByStatus ?? [];
  const tasksByPriority: { _id: string; count: number }[] = stats?.tasksByPriority ?? [];
  const projectStats: { _id: string; name: string; total: number; completed: number }[] =
    stats?.projectStats ?? [];
  const upcomingDeadlines: {
    task: string;
    project: string;
    dueDate: string;
    priority: string;
  }[] = stats?.upcomingDeadlines ?? [];
  const topPerformers: { name: string; completed: number }[] =
    stats?.topPerformers ?? [];
  const logs = logsData?.pages?.[0] ?? [];

  const totalTasks = overview?.total ?? 0;
  const statusTotal = tasksByStatus.reduce((s, t) => s + t.value, 0) || 1;

  return (
    <div className="flex flex-col gap-3">
      <HeaderSection title="Dashboard" subtitle="Welcome back!" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          icon={ListTodo}
          value={totalTasks}
          isLoading={statsLoading}
          trend="up"
          description="All tasks"
          color="from-blue-400 to-blue-600"
          index={0}
        />
        <StatsCard
          title="In Progress"
          value={overview?.inProgress ?? 0}
          icon={Activity}
          isLoading={statsLoading}
          trend="up"
          description="Currently active"
          color="from-amber-400 to-amber-600"
          index={1}
        />
        <StatsCard
          title="Completed"
          value={overview?.completed ?? 0}
          icon={CheckCircle2}
          isLoading={statsLoading}
          trend="up"
          description="Tasks done"
          color="from-green-400 to-green-600"
          index={2}
        />
        <StatsCard
          title="Blocked"
          value={overview?.blocked ?? 0}
          icon={XCircle}
          isLoading={statsLoading}
          trend="neutral"
          description="Needs attention"
          color="from-red-400 to-red-600"
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks by Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tasks Overview</CardTitle>
                <CardDescription>Task distribution by status</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/tasks">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {statsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))
              : tasksByStatus.map((item, idx) => {
                  const cfg = STATUS_CONFIG[item._id] ?? {
                    label: item._id,
                    color: "from-gray-400 to-gray-500",
                  };
                  const pct = Math.round((item.value / statusTotal) * 100);
                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full bg-linear-to-r ${cfg.color}`}
                          />
                          <span className="font-medium">{cfg.label}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {pct}%
                          </span>
                          <Badge variant="secondary">{item.value}</Badge>
                        </div>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </motion.div>
                  );
                })}
          </CardContent>
        </Card>

        {/* Priority Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Breakdown</CardTitle>
            <CardDescription>Tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))
              : tasksByPriority.map((item, idx) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium capitalize">{item._id}</span>
                    </div>
                    <Badge variant={PRIORITY_VARIANT[item._id] ?? "outline"}>
                      {item.count}
                    </Badge>
                  </motion.div>
                ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Project Progress</CardTitle>
                <CardDescription>Task completion per project</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/projects">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  All Projects
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {statsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))
              : projectStats.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No project data yet
                  </p>
                )
              : projectStats.slice(0, 4).map((project, idx) => {
                  const progress =
                    project.total > 0
                      ? Math.round((project.completed / project.total) * 100)
                      : 0;
                  return (
                    <motion.div
                      key={String(project._id)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{project.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <ListTodo className="w-3 h-3" />
                              {project.total} tasks
                            </span>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              {project.completed} done
                            </span>
                          </div>
                        </div>
                        <Badge variant={progress === 100 ? "default" : "secondary"}>
                          {progress}%
                        </Badge>
                      </div>
                      <Progress value={progress} />
                    </motion.div>
                  );
                })}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Tasks due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {statsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))
              : upcomingDeadlines.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No upcoming deadlines
                  </p>
                )
              : upcomingDeadlines.slice(0, 4).map((item, idx) => {
                  const due = new Date(item.dueDate);
                  const daysLeft = Math.ceil(
                    (due.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm line-clamp-1">
                          {item.task}
                        </h4>
                        <Badge
                          variant={
                            item.priority === "urgent"
                              ? "destructive"
                              : item.priority === "high"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs ml-1 shrink-0"
                        >
                          {daysLeft}d
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.project}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {due.toLocaleDateString()}
                      </div>
                    </motion.div>
                  );
                })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Most tasks completed</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/members">
                  <Users className="w-4 h-4 mr-1" />
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {statsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))
              : topPerformers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No data yet
                  </p>
                )
              : topPerformers.map((performer, idx) => (
                  <motion.div
                    key={performer.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-linear-to-br from-primary to-secondary text-primary-foreground font-bold">
                        {getInitials(performer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{performer.name}</h3>
                        <Badge variant="outline">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {performer.completed}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        tasks completed
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your team</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/settings/logs">
                  <Activity className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {logsLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))
              : logs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No activity yet
                  </p>
                )
              : logs.slice(0, 5).map(
                  (
                    log: {
                      _id: string;
                      user: { name: string };
                      action: string;
                      message: string;
                      entityType: string;
                      createdAt: string;
                    },
                    idx: number
                  ) => (
                    <motion.div
                      key={log._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-xs bg-muted">
                          {getInitials(log.user?.name ?? "?")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">
                            {log.user?.name ?? "Unknown"}
                          </span>
                          <span className="text-muted-foreground">
                            {" "}
                            {log.action}{" "}
                          </span>
                          <span className="font-medium">{log.entityType}</span>
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(log.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </motion.div>
                  )
                )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Create Project",
                icon: Briefcase,
                color: "from-blue-500 to-blue-600",
                href: "/projects",
              },
              {
                label: "Add Team Member",
                icon: Users,
                color: "from-green-500 to-green-600",
                href: "/members",
              },
              {
                label: "New Task",
                icon: ListTodo,
                color: "from-purple-500 to-purple-600",
                href: "/tasks",
              },
              {
                label: "View Logs",
                icon: BarChart3,
                color: "from-orange-500 to-orange-600",
                href: "/settings/logs",
              },
            ].map((action, idx) => (
              <Link href={action.href} key={action.label}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-6 rounded-xl bg-card border hover:shadow-lg transition-shadow flex flex-col items-center gap-3 cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-full bg-linear-to-br ${action.color} flex items-center justify-center`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-center">
                    {action.label}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMain;
