"use client";
import { useInfiniteTasks } from "@/hooks/useTask";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { HeaderSection } from "../ui/header-section";
import { StatsCard } from "../ui/stats-card";
import { motion } from "framer-motion";
import {
  ListTodo,
  Play,
  Pause,
  Check,
  CheckCircle2,
  AlertTriangle,
  Search,
} from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface TaskFilters {
  status?: string;
  priority?: string;
  projectId?: string;
  teamId?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

const TasksMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<TaskFilters>({
    status: "all",
    priority: "all",
    sortBy: "createdAt",
    order: "desc",
    // projectId and teamId can be added here if you have a way to select them
  });

  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteTasks(searchTerm);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredTasks = data?.pages.flat() || [];

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
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
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
              <Select>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
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
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  );
};

export default TasksMain;
