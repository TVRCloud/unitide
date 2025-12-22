/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Project } from "@/types/project";
import { HeaderSection } from "../ui/header-section";
import CreateProject from "./CreateProject";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FolderKanban,
  Grid3X3,
  List,
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
  const [viewMode, setViewMode] = useState("grid");

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
          <CardContent className="space-y-4"></CardContent>
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
