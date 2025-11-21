"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Users,
  Flag,
  Edit,
  Trash2,
  Archive,
  FolderKanban,
  CheckCircle2,
  Zap,
  AlertTriangle,
  MoreHorizontal,
  Share2,
  Star,
  StarOff,
  Copy,
  MessageSquare,
  Paperclip,
  ChevronRight,
  Plus,
  Settings,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProjectDetailPage() {
  const [isStarred, setIsStarred] = useState(false);

  // Sample project data (would come from API based on ID)
  const project = {
    _id: "6900ba4e267b23e9f7c00674",
    name: "E-Commerce Platform",
    description:
      "Building a modern e-commerce platform with React and Node.js. This project involves creating a fully-featured online shopping experience with product catalog, cart management, checkout process, payment integration, and order tracking. The platform will support multiple vendors and include an admin dashboard for inventory management.",
    status: "active",
    priority: "high",
    manager: {
      _id: "1",
      name: "Amegh T S",
      email: "amegh2002@gmail.com",
      avatar: "AT",
      role: "Project Manager",
    },
    teams: [
      { _id: "t1", name: "Frontend", members: 5 },
      { _id: "t2", name: "Backend", members: 4 },
      { _id: "t3", name: "Design", members: 3 },
    ],
    createdBy: { name: "Amegh T S", avatar: "AT" },
    updatedBy: { name: "Sarah Johnson", avatar: "SJ" },
    startDate: "2025-10-01T00:00:00.000Z",
    endDate: "2025-12-31T00:00:00.000Z",
    createdAt: "2025-09-25T10:30:00.000Z",
    updatedAt: "2025-10-28T14:45:00.000Z",
    color: "#f97316",
    progress: 65,
  };

  const teamMembers = [
    {
      name: "Amegh T S",
      avatar: "AT",
      role: "Project Manager",
      email: "amegh@example.com",
    },
    {
      name: "Sarah Johnson",
      avatar: "SJ",
      role: "Lead Developer",
      email: "sarah@example.com",
    },
    {
      name: "Michael Chen",
      avatar: "MC",
      role: "Backend Developer",
      email: "michael@example.com",
    },
    {
      name: "Emma Wilson",
      avatar: "EW",
      role: "UI/UX Designer",
      email: "emma@example.com",
    },
    {
      name: "James Martinez",
      avatar: "JM",
      role: "Frontend Developer",
      email: "james@example.com",
    },
  ];

  const activities = [
    {
      user: "Sarah Johnson",
      avatar: "SJ",
      action: "completed task",
      target: "Payment Integration",
      time: "2 hours ago",
    },
    {
      user: "Michael Chen",
      avatar: "MC",
      action: "added comment on",
      target: "API Documentation",
      time: "5 hours ago",
    },
    {
      user: "Amegh T S",
      avatar: "AT",
      action: "updated status of",
      target: "User Authentication",
      time: "1 day ago",
    },
    {
      user: "Emma Wilson",
      avatar: "EW",
      action: "uploaded design for",
      target: "Checkout Page",
      time: "2 days ago",
    },
  ];

  const milestones = [
    { name: "Project Kickoff", date: "2025-10-01", status: "completed" },
    { name: "Design Phase Complete", date: "2025-10-15", status: "completed" },
    { name: "MVP Development", date: "2025-11-15", status: "in-progress" },
    { name: "Beta Testing", date: "2025-12-01", status: "pending" },
    { name: "Production Launch", date: "2025-12-31", status: "pending" },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "active":
        return {
          icon: Zap,
          color: "bg-blue-500",
          variant: "default",
          label: "Active",
        };
      case "completed":
        return {
          icon: CheckCircle2,
          color: "bg-green-500",
          variant: "secondary",
          label: "Completed",
        };
      case "archived":
        return {
          icon: Archive,
          color: "bg-gray-500",
          variant: "outline",
          label: "Archived",
        };
      default:
        return {
          icon: FolderKanban,
          color: "bg-gray-500",
          variant: "outline",
          label: status,
        };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "urgent":
        return {
          icon: AlertTriangle,
          color: "text-red-500 bg-red-500/10 border-red-500/30",
          label: "Urgent",
        };
      case "high":
        return {
          icon: Flag,
          color: "text-orange-500 bg-orange-500/10 border-orange-500/30",
          label: "High",
        };
      case "medium":
        return {
          icon: Flag,
          color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
          label: "Medium",
        };
      case "low":
        return {
          icon: Flag,
          color: "text-green-500 bg-green-500/10 border-green-500/30",
          label: "Low",
        };
      default:
        return {
          icon: Flag,
          color: "text-gray-500 bg-gray-500/10 border-gray-500/30",
          label: priority,
        };
    }
  };

  const getDaysRemaining = () => {
    const end = new Date(project.endDate);
    const today = new Date();
    return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  };

  const getTotalDays = () => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const statusConfig = getStatusConfig(project.status);
  const priorityConfig = getPriorityConfig(project.priority);
  const daysRemaining = getDaysRemaining();
  const totalDays = getTotalDays();
  const daysElapsed = totalDays - daysRemaining;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Color Banner */}
      <div className="h-32 relative" style={{ backgroundColor: project.color }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-4 relative z-10">
          <Button variant="secondary" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 -mt-16 relative z-10 pb-8">
        {/* Project Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
                    style={{
                      backgroundColor: `${project.color}20`,
                      border: `2px solid ${project.color}`,
                    }}
                  >
                    <FolderKanban
                      className="h-8 w-8"
                      style={{ color: project.color }}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl md:text-3xl font-bold">
                        {project.name}
                      </h1>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsStarred(!isStarred)}
                      >
                        {isStarred ? (
                          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <StarOff className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={statusConfig.variant} className="gap-1">
                        <statusConfig.icon className="h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`gap-1 ${priorityConfig.color}`}
                      >
                        <priorityConfig.icon className="h-3 w-3" />
                        {priorityConfig.label} Priority
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        {daysRemaining > 0
                          ? `${daysRemaining} days remaining`
                          : "Overdue"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: project.color }}
                  >
                    {project.progress}%
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">{daysRemaining}</div>
                  <div className="text-sm text-muted-foreground">Days Left</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">
                    {project.teams.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Teams</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">
                    {project.teams.reduce((acc, t) => acc + t.members, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Members</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6">
                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          Overall Completion
                        </span>
                        <span className="font-semibold">
                          {project.progress}%
                        </span>
                      </div>
                      <Progress value={project.progress} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>{formatDate(project.startDate)}</span>
                        <span>{formatDate(project.endDate)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Teams */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Teams</CardTitle>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Team
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {project.teams.map((team) => (
                          <div
                            key={team._id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{team.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {team.members} members
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="team" className="mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>
                          People working on this project
                        </CardDescription>
                      </div>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Member
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {teamMembers.map((member, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                                  {member.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {member.role}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Change Role
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="milestones" className="mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Milestones</CardTitle>
                        <CardDescription>
                          Project timeline and key dates
                        </CardDescription>
                      </div>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Milestone
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="relative space-y-4">
                        {milestones.map((milestone, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex gap-4"
                          >
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${
                                  milestone.status === "completed"
                                    ? "bg-green-500 border-green-500"
                                    : milestone.status === "in-progress"
                                    ? "bg-blue-500 border-blue-500"
                                    : "bg-background border-muted-foreground"
                                }`}
                              />
                              {i < milestones.length - 1 && (
                                <div className="w-0.5 h-full bg-border mt-1" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{milestone.name}</p>
                                <Badge
                                  variant={
                                    milestone.status === "completed"
                                      ? "secondary"
                                      : milestone.status === "in-progress"
                                      ? "default"
                                      : "outline"
                                  }
                                >
                                  {milestone.status === "completed"
                                    ? "Completed"
                                    : milestone.status === "in-progress"
                                    ? "In Progress"
                                    : "Pending"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatDate(milestone.date)}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Latest updates and changes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {activities.map((activity, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                                {activity.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-medium">
                                  {activity.user}
                                </span>{" "}
                                <span className="text-muted-foreground">
                                  {activity.action}
                                </span>{" "}
                                <span className="font-medium">
                                  {activity.target}
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {activity.time}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Project Manager */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Manager</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-lg">
                        {project.manager.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{project.manager.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.manager.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={statusConfig.variant}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority</span>
                    <Badge variant="outline" className={priorityConfig.color}>
                      {priorityConfig.label}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date</span>
                    <span className="font-medium">
                      {formatDate(project.startDate)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date</span>
                    <span className="font-medium">
                      {formatDate(project.endDate)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="text-sm">
                      {formatDateTime(project.createdAt)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated</span>
                    <span className="text-sm">
                      {formatDateTime(project.updatedAt)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Project ID</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {project._id.slice(-8)}
                    </code>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach Files
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Project Settings
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
