/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from "framer-motion";
import { Project } from "@/types/project";
import { HeaderSection } from "../ui/header-section";
import CreateProject from "./CreateProject";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Eye,
  FolderKanban,
  Grid3X3,
  List,
  MoreHorizontal,
  Search,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import { StatsCard } from "../ui/stats-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getPriorityConfig, getStatusConfig } from "@/utils/project";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { SignedAvatar } from "../ui/signed-avatar";

type Props = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isLoading?: boolean;
  filteredProjects: Project[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  ref: any;
};

const ProjectAdmin = ({
  searchTerm,
  setSearchTerm,
  isLoading,
  filteredProjects,
  isFetchingNextPage,
  hasNextPage,
  ref,
}: Props) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("list");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const stats = [
    {
      title: "Total Projects",
      value: 10,
      icon: FolderKanban,
      color: "from-red-400 to-red-500",
    },
    {
      title: "Active",
      value: 4,
      icon: Zap,
      color: "from-blue-400 to-blue-500",
    },
    {
      title: "Completed",
      value: 3,
      icon: CheckCircle2,
      color: "from-green-400 to-green-500",
    },
    {
      title: "High Priority",
      value: 1,
      icon: AlertTriangle,
      color: "from-orange-400 to-orange-500",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <HeaderSection
        title="Projects"
        subtitle="Manage and track all your projects in your workspace"
        actions={<CreateProject />}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            index={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </motion.div>

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
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

            {/* <AnimatePresence>
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
              </AnimatePresence> */}

            <Separator />

            {viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {isLoading
                    ? null
                    : filteredProjects.map((project, index) => {
                        const statusConfig = getStatusConfig(
                          project.status as string
                        );
                        const priorityConfig = getPriorityConfig(
                          project.priority as string
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
                                      <DropdownMenuItem
                                        onClick={() => {
                                          router.push(``);
                                        }}
                                      >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
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
                                    {project.priority}
                                  </Badge>
                                </div>
                                {/* <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Progress
                                </span>
                                <span className="font-medium">{}%</span>
                              </div>
                              <Progress
                                value={project.progress}
                                className="h-2"
                              />
                            </div> */}
                                {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>
                                {formatDate(project.startDate)} -{" "}
                                {formatDate(project.endDate)}
                              </span>
                            </div> */}
                                <Separator />
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <SignedAvatar
                                      src={""}
                                      name={
                                        project.createdBy &&
                                        project.createdBy.name
                                      }
                                    />
                                    <span className="text-sm text-muted-foreground">
                                      {project.createdBy &&
                                        project.createdBy.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Users className="h-3 w-3" />
                                    {project.teams && project.teams.length}{" "}
                                    teams
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
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created by</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading
                      ? [...Array(5)].map((_, i) => (
                          <TableRow key={i}>
                            {Array(5)
                              .fill(0)
                              .map((_, j) => (
                                <TableCell key={j}>
                                  <Skeleton className="h-4 w-[100px]" />
                                </TableCell>
                              ))}
                          </TableRow>
                        ))
                      : filteredProjects.map((project, index) => {
                          const statusConfig = getStatusConfig(
                            project.status as string
                          );
                          const priorityConfig = getPriorityConfig(
                            project.priority as string
                          );
                          return (
                            <TableRow key={index}>
                              <TableCell>
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
                                    <p className="font-medium">
                                      {project.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                      {project.description}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`capitalize gap-1 ${priorityConfig.color}`}
                                >
                                  {project.priority}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={statusConfig.variant as any}
                                  className="gap-1"
                                >
                                  <statusConfig.icon className="h-3 w-3" />
                                  {statusConfig.label}
                                </Badge>
                              </TableCell>
                              <TableCell>{project.createdBy?.name}</TableCell>
                              <TableCell>
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
                                    <DropdownMenuItem
                                      onClick={() => {
                                        router.push(`/projects/${project._id}`);
                                      }}
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      View
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* bottom */}
      <div className="flex justify-center" ref={ref}>
        <span className="p-4 text-center text-muted-foreground text-xs">
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Scroll to load more"
            : "No more projects"}
        </span>
      </div>
    </div>
  );
};

export default ProjectAdmin;
