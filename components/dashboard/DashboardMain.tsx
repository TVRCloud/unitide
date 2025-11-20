/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Briefcase,
  Calendar,
  ChevronRight,
  Clock,
  Flame,
  ListTodo,
  User,
  Users,
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

const tasksByStatus = [
  {
    status: "To Do",
    count: 89,
    color: "from-slate-500 to-slate-600",
    percentage: 28.5,
  },
  {
    status: "In Progress",
    count: 124,
    color: "from-blue-500 to-blue-600",
    percentage: 39.7,
  },
  {
    status: "Review",
    count: 56,
    color: "from-amber-500 to-amber-600",
    percentage: 17.9,
  },
  {
    status: "Completed",
    count: 43,
    color: "from-green-500 to-green-600",
    percentage: 13.8,
  },
];

const recentProjects = [
  {
    id: 1,
    name: "Mobile App Redesign",
    status: "active",
    progress: 75,
    team: "Design Team",
    dueDate: "2025-11-15",
    members: 8,
  },
  {
    id: 2,
    name: "API Integration",
    status: "active",
    progress: 60,
    team: "Engineering",
    dueDate: "2025-11-20",
    members: 5,
  },
  {
    id: 3,
    name: "Marketing Campaign",
    status: "active",
    progress: 90,
    team: "Marketing",
    dueDate: "2025-11-08",
    members: 6,
  },
  {
    id: 4,
    name: "Database Migration",
    status: "review",
    progress: 45,
    team: "DevOps",
    dueDate: "2025-11-25",
    members: 4,
  },
];

const tasksByPriority = [
  { priority: "Urgent", count: 28, color: "destructive" },
  { priority: "High", count: 87, color: "default" },
  { priority: "Medium", count: 145, color: "secondary" },
  { priority: "Low", count: 52, color: "outline" },
];

const topTeams = [
  {
    name: "Engineering Team",
    members: 24,
    projects: 8,
    completion: 78,
    avatar: "E",
  },
  {
    name: "Design Squad",
    members: 16,
    projects: 5,
    completion: 85,
    avatar: "D",
  },
  {
    name: "Marketing Team",
    members: 12,
    projects: 6,
    completion: 72,
    avatar: "M",
  },
  {
    name: "Product Team",
    members: 10,
    projects: 4,
    completion: 90,
    avatar: "P",
  },
];

const recentActivity = [
  {
    user: "John Doe",
    action: "completed",
    entity: "Authentication Module",
    time: "5 min ago",
    avatar: "JD",
  },
  {
    user: "Sarah Smith",
    action: "created",
    entity: "New Dashboard Design",
    time: "12 min ago",
    avatar: "SS",
  },
  {
    user: "Mike Johnson",
    action: "updated",
    entity: "API Documentation",
    time: "23 min ago",
    avatar: "MJ",
  },
  {
    user: "Emily Brown",
    action: "assigned",
    entity: "Bug Fix #342",
    time: "1 hour ago",
    avatar: "EB",
  },
  {
    user: "Alex Lee",
    action: "commented",
    entity: "Project Timeline",
    time: "2 hours ago",
    avatar: "AL",
  },
];

const upcomingDeadlines = [
  {
    task: "Mobile App Beta Release",
    project: "Mobile App",
    dueDate: "2025-11-05",
    daysLeft: 2,
    priority: "urgent",
  },
  {
    task: "Client Presentation",
    project: "Marketing Campaign",
    dueDate: "2025-11-08",
    daysLeft: 5,
    priority: "high",
  },
  {
    task: "Database Backup",
    project: "Infrastructure",
    dueDate: "2025-11-10",
    daysLeft: 7,
    priority: "medium",
  },
  {
    task: "Code Review Session",
    project: "API Integration",
    dueDate: "2025-11-12",
    daysLeft: 9,
    priority: "high",
  },
];

const DashboardMain = () => {
  return (
    <div className="flex flex-col gap-3">
      <HeaderSection title="Dashboard" subtitle="Welcome back!" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          icon={User}
          value="100"
          trend="up"
          description="Since last month"
        />

        <StatsCard
          title="Active Teams"
          value="100"
          icon={Users}
          trend="down"
          description="Since last month"
        />
        <StatsCard
          title="Total Projects"
          value="100"
          icon={Briefcase}
          trend="up"
          description="Since last month"
        />
        <StatsCard
          title="Active Tasks"
          value="100"
          icon={ListTodo}
          trend="up"
          description="Since last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tasks Overview</CardTitle>
                <CardDescription>Task distribution by status</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {tasksByStatus.map((item, idx) => (
              <motion.div
                key={item.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full bg-linear-to-r ${item.color}`}
                    />
                    <span className="font-medium">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {item.percentage}%
                    </span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Breakdown</CardTitle>
            <CardDescription>Tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasksByPriority.map((item, idx) => (
              <motion.div
                key={item.priority}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{item.priority}</span>
                </div>
                <Badge variant={item.color as any}>{item.count}</Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>
                  Active projects and their progress
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{project.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {project.team}
                      </span>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(project.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      project.status === "active" ? "default" : "secondary"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Critical tasks due soon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.map((item, idx) => (
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
                    className="text-xs"
                  >
                    {item.daysLeft}d
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {item.project}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {new Date(item.dueDate).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Performing Teams</CardTitle>
                <CardDescription>Based on completion rate</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {topTeams.map((team, idx) => (
              <motion.div
                key={team.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-linear-to-br from-primary to-secondary text-primary-foreground font-bold">
                    {team.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{team.name}</h3>
                    <Badge variant="outline">{team.completion}%</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{team.members} members</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>{team.projects} projects</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your team</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Activity className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-xs bg-muted">
                    {activity.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      {activity.action}{" "}
                    </span>
                    <span className="font-medium">{activity.entity}</span>
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

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
              },
              {
                label: "Add Team Member",
                icon: Users,
                color: "from-green-500 to-green-600",
              },
              {
                label: "New Task",
                icon: ListTodo,
                color: "from-purple-500 to-purple-600",
              },
              {
                label: "View Reports",
                icon: BarChart3,
                color: "from-orange-500 to-orange-600",
              },
            ].map((action, idx) => (
              <motion.button
                key={action.label}
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
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMain;
