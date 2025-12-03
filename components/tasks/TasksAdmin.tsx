/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useViewTaskStats } from "@/hooks/useTask";
import { Button } from "../ui/button";
import { HeaderSection } from "../ui/header-section";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { StatsCard } from "../ui/stats-card";
import {
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  Play,
  Target,
  Activity,
  Calendar,
  Zap,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import TaskPieChart from "./TaskPieChart";
import TaskPriorityChart from "./TaskPriorityChart";

const TasksAdmin = () => {
  const router = useRouter();
  const { data, isLoading } = useViewTaskStats();

  if (isLoading) return <div>Loading Task Data...</div>;

  const overview = data?.overview?.[0] ?? {};

  return (
    <div className="flex flex-col gap-6">
      <HeaderSection
        title="Tasks"
        subtitle="Overview of all tasks and team performance"
        actions={
          <Button variant="secondary" onClick={() => router.push("/tasks/all")}>
            View all
          </Button>
        }
      />

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        {[
          { l: "Total Tasks", v: overview.total, i: ListTodo },
          { l: "In Progress", v: overview.inProgress, i: Play },
          { l: "Completed", v: overview.completed, i: CheckCircle2 },
          { l: "Blocked", v: overview.blocked, i: AlertTriangle },
        ].map((s, i) => (
          <StatsCard key={i} title={s.l} value={s.v} icon={s.i} index={i} />
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 lg:grid-cols-2"
      >
        {/* Tasks by Status Pie */}

        <TaskPieChart data={data.tasksByStatus} />
        <TaskStatusChart data={data.tasksByStatus} />

        {/* Tasks by Priority */}
        <TaskPriorityChart data={data.tasksByPriority} />
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
            <CardDescription>Distribution of priority levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px] w-full" config={{}}>
              <BarChart data={data.tasksByPriority}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="var(--secondary)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Performers + Project Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4 lg:grid-cols-2"
      >
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Top Performers
            </CardTitle>
            <CardDescription>
              Team members ranked by tasks completed
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {data.topPerformers.map((p: any, i: number) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm font-medium w-6 text-muted-foreground">
                  #{i + 1}
                </span>

                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {p.name
                      ?.split(" ")
                      .map((w: string) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.completed} tasks completed
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{p.efficiency}%</p>
                  <Zap className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Project Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Project Progress
            </CardTitle>
            <CardDescription>Tasks status per project</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {data.projectStats.map((project: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{project.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {project.completed}/{project.total}
                  </span>
                </div>

                <Progress
                  value={(project.completed / project.total) * 100}
                  className="h-2"
                />

                <div className="flex gap-4 mt-2">
                  <span className="text-xs text-muted-foreground">
                    <span className="text-primary font-medium">
                      {project.inProgress}
                    </span>{" "}
                    in progress
                  </span>

                  {project.blocked > 0 && (
                    <span className="text-xs text-muted-foreground">
                      <span className="text-red-500 font-medium">
                        {project.blocked}
                      </span>{" "}
                      blocked
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Deadlines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Tasks due soon</CardDescription>
          </CardHeader>

          <CardContent>
            {data.upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming tasks</p>
            ) : (
              <div className="space-y-4">
                {data.upcomingDeadlines.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{item.assignee}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{item.task}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.project}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{item.priority}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {item.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TasksAdmin;
