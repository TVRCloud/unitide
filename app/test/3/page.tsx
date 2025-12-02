"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ListTodo,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  Target,
  Activity,
  Zap,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeaderSection } from "@/components/ui/header-section";
import { StatsCard } from "@/components/ui/stats-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

import {
  PieChart,
  Pie,
  Label as PieLabel,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

// ----------------- Data -----------------

const tasksByStatus = [
  { name: "To Do", value: 45, fill: "hsl(var(--muted))" },
  { name: "In Progress", value: 32, fill: "hsl(var(--primary))" },
  { name: "Review", value: 18, fill: "hsl(var(--warning))" },
  { name: "Completed", value: 89, fill: "hsl(var(--success))" },
  { name: "Blocked", value: 12, fill: "hsl(var(--destructive))" },
];

const tasksByPriority = [
  { priority: "Urgent", count: 15, fill: "hsl(var(--destructive))" },
  { priority: "High", count: 38, fill: "hsl(var(--warning))" },
  { priority: "Medium", count: 67, fill: "hsl(var(--primary))" },
  { priority: "Low", count: 76, fill: "hsl(var(--muted))" },
];

const weeklyProgress = [
  { day: "Mon", completed: 12, created: 15 },
  { day: "Tue", completed: 15, created: 18 },
  { day: "Wed", completed: 20, created: 14 },
  { day: "Thu", completed: 18, created: 22 },
  { day: "Fri", completed: 25, created: 20 },
  { day: "Sat", completed: 8, created: 5 },
  { day: "Sun", completed: 5, created: 3 },
];

const topPerformers = [
  { name: "Sarah Chen", avatar: "SC", completed: 45, efficiency: 92 },
  { name: "Mike Johnson", avatar: "MJ", completed: 38, efficiency: 88 },
  { name: "Emma Davis", avatar: "ED", completed: 35, efficiency: 85 },
  { name: "Alex Kumar", avatar: "AK", completed: 32, efficiency: 83 },
  { name: "Lisa Wang", avatar: "LW", completed: 28, efficiency: 80 },
];

const projectStats = [
  {
    name: "E-commerce Platform",
    total: 48,
    completed: 32,
    inProgress: 12,
    blocked: 4,
  },
  {
    name: "Mobile App Redesign",
    total: 35,
    completed: 20,
    inProgress: 10,
    blocked: 5,
  },
  {
    name: "Data Analytics Dashboard",
    total: 42,
    completed: 28,
    inProgress: 11,
    blocked: 3,
  },
  {
    name: "Marketing Campaign",
    total: 25,
    completed: 18,
    inProgress: 6,
    blocked: 1,
  },
];

const upcomingDeadlines = [
  {
    task: "Implement user authentication",
    project: "E-commerce Platform",
    dueDate: "2024-12-05",
    assignee: "SC",
    priority: "urgent",
  },
  {
    task: "Design review for homepage",
    project: "Mobile App Redesign",
    dueDate: "2024-12-06",
    assignee: "MJ",
    priority: "high",
  },
  {
    task: "Database optimization",
    project: "Data Analytics Dashboard",
    dueDate: "2024-12-07",
    assignee: "ED",
    priority: "high",
  },
];

// ----------------- Component -----------------

const TaskDashboard = () => {
  const [userRole] = useState<"admin" | "manager" | "user">("admin");
  const isAdminOrManager = userRole !== "user";

  return (
    <div className="flex flex-col gap-6">
      <HeaderSection
        title="Task Dashboard"
        subtitle={
          isAdminOrManager
            ? "Overview of all tasks and team performance"
            : "Your personal task overview"
        }
      />

      {/* Overview stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        {[
          { l: "Total Tasks", v: 196, i: ListTodo },
          { l: "In Progress", v: 32, i: Play },
          { l: "Completed", v: 89, i: CheckCircle2 },
          { l: "Blocked", v: 12, i: AlertTriangle },
        ].map((s, i) => (
          <StatsCard key={i} title={s.l} value={s.v} icon={s.i} index={i} />
        ))}
      </motion.div>

      {isAdminOrManager && (
        <>
          {/* Additional metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-4 grid-cols-2 lg:grid-cols-4"
          >
            {[
              { l: "Avg. Completion Time", v: "3.2d", i: Clock },
              { l: "Active Team Members", v: 24, i: Users },
              { l: "Completion Rate", v: "76%", i: TrendingUp },
              { l: "Tasks Due This Week", v: 18, i: Calendar },
            ].map((s, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {s.l}
                      </p>
                      <p className="text-2xl font-bold mt-2">{s.v}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <s.i className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid gap-4 lg:grid-cols-2"
          >
            {/* Task Distribution Pie */}
            <Card>
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
                <CardDescription>Tasks grouped by status</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px] w-full">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />

                    <Pie
                      data={tasksByStatus}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={100}
                      paddingAngle={4}
                    >
                      <PieLabel />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Weekly Progress Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Tasks created vs completed</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px] w-full" config={{}}>
                  <LineChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="created"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Priority Distribution Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Tasks by Priority</CardTitle>
                <CardDescription>
                  Distribution across priority levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px] w-full">
                  <BarChart data={tasksByPriority}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="priority" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Performers & Project Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
                  Team members by tasks completed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topPerformers.map((member, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{member.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.completed} tasks completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {member.efficiency}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          efficiency
                        </p>
                      </div>
                      <Zap className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Project Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Project Progress
                </CardTitle>
                <CardDescription>Tasks status by project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {projectStats.map((project, index) => (
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
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Deadlines
                </CardTitle>
                <CardDescription>Tasks due in the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {item.assignee}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{item.task}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.project}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={
                            item.priority === "urgent"
                              ? "border-red-500 text-red-500"
                              : "border-orange-500 text-orange-500"
                          }
                        >
                          {item.priority}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {item.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default TaskDashboard;
