/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  Calendar,
  Users,
  Flag,
  Plus,
  Download,
  RefreshCw,
  FolderKanban,
  CheckCircle2,
  Archive,
  Zap,
  AlertTriangle,
  Edit,
  Trash2,
  Eye,
  Grid3X3,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export default function ProjectsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedProjects, setSelectedProjects] = useState([]);

  const projects = [
    {
      _id: "1",
      name: "E-Commerce Platform",
      description:
        "Building a modern e-commerce platform with React and Node.js",
      status: "active",
      priority: "high",
      manager: { name: "Amegh T S", avatar: "AT" },
      teams: [{ name: "Frontend" }, { name: "Backend" }],
      createdBy: { name: "Amegh T S" },
      startDate: "2025-10-01",
      endDate: "2025-12-31",
      color: "#f97316",
      progress: 65,
    },
    {
      _id: "2",
      name: "Mobile App Redesign",
      description: "Complete UI/UX overhaul for the mobile application",
      status: "active",
      priority: "urgent",
      manager: { name: "Sarah Johnson", avatar: "SJ" },
      teams: [{ name: "Design" }, { name: "Mobile" }],
      createdBy: { name: "Sarah Johnson" },
      startDate: "2025-09-15",
      endDate: "2025-11-30",
      color: "#ef4444",
      progress: 40,
    },
    {
      _id: "3",
      name: "API Integration Hub",
      description: "Centralized API management and integration platform",
      status: "completed",
      priority: "medium",
      manager: { name: "Michael Chen", avatar: "MC" },
      teams: [{ name: "Backend" }, { name: "DevOps" }],
      createdBy: { name: "Michael Chen" },
      startDate: "2025-07-01",
      endDate: "2025-10-15",
      color: "#22c55e",
      progress: 100,
    },
    {
      _id: "4",
      name: "Analytics Dashboard",
      description: "Real-time analytics and reporting dashboard",
      status: "active",
      priority: "medium",
      manager: { name: "Emma Wilson", avatar: "EW" },
      teams: [{ name: "Data" }, { name: "Frontend" }],
      createdBy: { name: "Emma Wilson" },
      startDate: "2025-10-10",
      endDate: "2026-01-31",
      color: "#8b5cf6",
      progress: 25,
    },
    {
      _id: "5",
      name: "Legacy System Migration",
      description: "Migrating legacy systems to modern cloud infrastructure",
      status: "archived",
      priority: "low",
      manager: { name: "James Martinez", avatar: "JM" },
      teams: [{ name: "DevOps" }, { name: "Backend" }],
      createdBy: { name: "James Martinez" },
      startDate: "2025-03-01",
      endDate: "2025-08-31",
      color: "#6b7280",
      progress: 100,
    },
    {
      _id: "6",
      name: "Security Audit System",
      description: "Automated security scanning and compliance reporting",
      status: "active",
      priority: "high",
      manager: { name: "Olivia Brown", avatar: "OB" },
      teams: [{ name: "Security" }, { name: "Backend" }],
      createdBy: { name: "Olivia Brown" },
      startDate: "2025-11-01",
      endDate: "2026-02-28",
      color: "#0ea5e9",
      progress: 10,
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: string) => {
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

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "urgent":
        return {
          icon: AlertTriangle,
          color: "text-red-500 bg-red-500/10 border-red-500/30",
        };
      case "high":
        return {
          icon: Flag,
          color: "text-orange-500 bg-orange-500/10 border-orange-500/30",
        };
      case "medium":
        return {
          icon: Flag,
          color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
        };
      case "low":
        return {
          icon: Flag,
          color: "text-green-500 bg-green-500/10 border-green-500/30",
        };
      default:
        return {
          icon: Flag,
          color: "text-gray-500 bg-gray-500/10 border-gray-500/30",
        };
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || project.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || project.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects((prev: any) =>
      prev.includes(projectId)
        ? prev.filter((id: string) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: FolderKanban,
      color: "text-primary",
    },
    {
      label: "Active",
      value: projects.filter((p) => p.status === "active").length,
      icon: Zap,
      color: "text-blue-500",
    },
    {
      label: "Completed",
      value: projects.filter((p) => p.status === "completed").length,
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      label: "High Priority",
      value: projects.filter(
        (p) => p.priority === "high" || p.priority === "urgent"
      ).length,
      icon: AlertTriangle,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Projects
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your projects
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Projects Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Directory</CardTitle>
                  <CardDescription>
                    Browse and manage all projects
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterPriority}
                    onValueChange={setFilterPriority}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bulk Actions */}
              <AnimatePresence>
                {selectedProjects.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20"
                  >
                    <span className="text-sm font-medium">
                      {selectedProjects.length} project
                      {selectedProjects.length > 1 ? "s" : ""} selected
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Archive
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Separator />

              {/* Grid View */}
              {viewMode === "grid" ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {filteredProjects.map((project, index) => {
                      const statusConfig = getStatusConfig(project.status);
                      const priorityConfig = getPriorityConfig(
                        project.priority
                      );
                      return (
                        <motion.div
                          key={project._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -4 }}
                        >
                          <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden group">
                            <div
                              className="h-1.5"
                              style={{ backgroundColor: project.color }}
                            />
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                  {/* <Checkbox
                                    checked={selectedProjects.includes(
                                      project._id
                                    )}
                                    onCheckedChange={() =>
                                      toggleProjectSelection(project._id)
                                    }
                                  /> */}
                                  <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{
                                      backgroundColor: `${project.color}20`,
                                    }}
                                  >
                                    <FolderKanban
                                      className="h-5 w-5"
                                      style={{ color: project.color }}
                                    />
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <CardTitle className="text-lg mt-3">
                                {project.name}
                              </CardTitle>
                              <CardDescription className="line-clamp-2">
                                {project.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex gap-2 flex-wrap">
                                <Badge
                                  variant={statusConfig.variant as any}
                                  className="gap-1"
                                >
                                  <statusConfig.icon className="h-3 w-3" />
                                  {statusConfig.label}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`gap-1 ${priorityConfig.color}`}
                                >
                                  <priorityConfig.icon className="h-3 w-3" />
                                  {project.priority.charAt(0).toUpperCase() +
                                    project.priority.slice(1)}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Progress
                                  </span>
                                  <span className="font-medium">
                                    {project.progress}%
                                  </span>
                                </div>
                                <Progress
                                  value={project.progress}
                                  className="h-2"
                                />
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                  {formatDate(project.startDate)} -{" "}
                                  {formatDate(project.endDate)}
                                </span>
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-7 w-7">
                                    <AvatarFallback className="text-xs bg-linear-to-br from-primary to-secondary text-primary-foreground">
                                      {project.manager.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-muted-foreground">
                                    {project.manager.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Users className="h-3 w-3" />
                                  {project.teams.length} teams
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                /* List View */
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[50px]">
                          <Checkbox
                            checked={
                              selectedProjects.length ===
                                filteredProjects.length &&
                              filteredProjects.length > 0
                            }
                            // onCheckedChange={() =>
                            //   setSelectedProjects(
                            //     selectedProjects.length ===
                            //       filteredProjects.length
                            //       ? []
                            //       : filteredProjects.map((p) => p._id)
                            //   )
                            // }
                          />
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Project
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Priority
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Progress
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Manager
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Timeline
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredProjects.map((project, index) => {
                        const statusConfig = getStatusConfig(project.status);
                        const priorityConfig = getPriorityConfig(
                          project.priority
                        );
                        return (
                          <motion.tr
                            key={project._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="group hover:bg-muted/50 transition-colors"
                          >
                            <td className="p-4 align-middle">
                              <Checkbox
                                // checked={selectedProjects.includes(project._id)}
                                onCheckedChange={() =>
                                  toggleProjectSelection(project._id)
                                }
                              />
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                                  style={{
                                    backgroundColor: `${project.color}20`,
                                  }}
                                >
                                  <FolderKanban
                                    className="h-4 w-4"
                                    style={{ color: project.color }}
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{project.name}</p>
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {project.description}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <Badge
                                variant={statusConfig.variant as any}
                                className="gap-1"
                              >
                                <statusConfig.icon className="h-3 w-3" />
                                {statusConfig.label}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle">
                              <Badge
                                variant="outline"
                                className={`gap-1 ${priorityConfig.color}`}
                              >
                                {project.priority.charAt(0).toUpperCase() +
                                  project.priority.slice(1)}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2 min-w-[120px]">
                                <Progress
                                  value={project.progress}
                                  className="h-2 flex-1"
                                />
                                <span className="text-sm font-medium w-10">
                                  {project.progress}%
                                </span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className="text-xs bg-linear-to-br from-primary to-secondary text-primary-foreground">
                                    {project.manager.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">
                                  {project.manager.name}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="text-sm text-muted-foreground">
                                <div>{formatDate(project.startDate)}</div>
                                <div>{formatDate(project.endDate)}</div>
                              </div>
                            </td>
                            <td className="p-4 align-middle text-right">
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
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {filteredProjects.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <FolderKanban className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No projects found</p>
                  <p className="text-sm">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}

              {filteredProjects.length > 0 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium">
                      {filteredProjects.length}
                    </span>{" "}
                    of <span className="font-medium">{projects.length}</span>{" "}
                    projects
                  </p>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
