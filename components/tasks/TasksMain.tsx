"use client";
import { useInfiniteTasks } from "@/hooks/useTask";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { HeaderSection } from "../ui/header-section";
import { StatsCard } from "../ui/stats-card";
import { AnimatePresence, motion } from "framer-motion";
import {
  ListTodo,
  Play,
  Pause,
  Check,
  CheckCircle2,
  AlertTriangle,
  Search,
  ListOrdered,
  ArrowUp,
  ArrowDown,
  Users,
  Briefcase,
  Bug,
  Bookmark,
  Lightbulb,
  LucideIcon,
  FolderKanban,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface TaskFilters {
  status?: string;
  priority?: string;
  projectId?: string;
  teamId?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

const typeMap: Record<string, { icon: LucideIcon; color: string }> = {
  task: { icon: ListTodo, color: "text-blue-500" },
  bug: { icon: Bug, color: "text-red-500" },
  story: { icon: Bookmark, color: "text-purple-500" },
  feature: { icon: Lightbulb, color: "text-yellow-500" },
};

const TasksMain = () => {
  const { ref, inView } = useInView();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<TaskFilters>({
    status: "all",
    priority: "all",
    sortBy: "createdAt",
    order: "desc",
  });

  const apiFilters = useMemo(() => {
    const newFilters: TaskFilters = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value && value !== "all") {
        newFilters[key as keyof TaskFilters] = value;
      }
    }
    return newFilters;
  }, [filters]);

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteTasks(searchTerm, 10, apiFilters);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFilterChange = (key: keyof TaskFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filteredTasks = data?.pages.flat() || [];
  const isEmpty = !isLoading && filteredTasks.length === 0;

  return (
    <div className="flex flex-col gap-3">
      <HeaderSection
        title="Tasks"
        subtitle="Manage all tasks in your workspace"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        {[
          { l: "Total", v: 10, i: ListTodo },
          {
            l: "In Progress",
            v: 10,
            i: Play,
          },
          {
            l: "Completed",
            v: 29,
            i: CheckCircle2,
          },
          {
            l: "Blocked",
            v: 33,
            i: AlertTriangle,
          },
        ].map((s, i) => (
          <StatsCard key={i} title={s.l} value={s.v} icon={s.i} index={i} />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle>Task Directory</CardTitle>
              <CardDescription>View all of your tasks here</CardDescription>
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <ListTodo className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.priority}
                  onValueChange={(value) =>
                    handleFilterChange("priority", value)
                  }
                >
                  <SelectTrigger>
                    <AlertTriangle className="h-4 w-4 mr-2" />
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

                {/* <Select
                  value={filters.projectId || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("projectId", value)
                  }
                >
                  <SelectTrigger className="w-[130px]">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="project-a">Project A</SelectItem>
                    <SelectItem value="project-b">Project B</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.teamId || "all"}
                  onValueChange={(value) => handleFilterChange("teamId", value)}
                >
                  <SelectTrigger className="w-[130px]">
                    <Users className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    <SelectItem value="team-alpha">Team Alpha</SelectItem>
                    <SelectItem value="team-beta">Team Beta</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange("sortBy", value)}
                >
                  <SelectTrigger className="w-[130px]">
                    <ListOrdered className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.order}
                  onValueChange={(value) => handleFilterChange("order", value)}
                >
                  <SelectTrigger className="w-[100px]">
                    {filters.order === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select> */}
              </div>
            </div>
          </CardHeader>
          <Separator />

          <CardContent className="space-y-4">
            <AnimatePresence>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i}>
                    <Skeleton key={i} className="h-12" />
                  </div>
                ))
              ) : filteredTasks.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No tasks found.
                </div>
              ) : (
                filteredTasks.map((task, index) => {
                  console.log(task);

                  const type = typeMap[task.type];

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="group p-4 rounded-lg border hover:border-primary/50 hover:shadow-md cursor-pointer transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${type.color}`}>
                          <type.icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium truncate">
                                {task.title}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                                <FolderKanban
                                  className="h-3 w-3"
                                  style={{ color: task.project.color }}
                                />
                                <span style={{ color: task.project.color }}>
                                  {task.project.name}
                                </span>
                              </p>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
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
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TasksMain;
