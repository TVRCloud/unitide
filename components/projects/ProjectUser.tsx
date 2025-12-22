import { AnimatePresence, motion } from "framer-motion";
import { useInfiniteProjects } from "@/hooks/useProjects";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { HeaderSection } from "../ui/header-section";
import CreateProject from "./CreateProject";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

type Project = {
  _id: string;
  name: string;
  description?: string;
  status?: string;
  teams?: {
    name: string;
  }[];
  createdBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
};

const ProjectUser = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteProjects(searchTerm);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredProjects: Project[] = data?.pages.flat() || [];

  return (
    <div className="flex flex-col gap-3">
      <HeaderSection
        title="Projects"
        subtitle="Manage all projects in your workspace"
        actions={<CreateProject />}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle>Project Directory</CardTitle>
              <CardDescription>
                Search for a project to get started
              </CardDescription>
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
          </CardHeader>
          <Separator />

          <CardContent className="space-y-4">
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Teams</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {isLoading
                        ? [...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                              {Array(4)
                                .fill(0)
                                .map((_, j) => (
                                  <TableCell key={j}>
                                    <Skeleton className="h-4 w-[100px]" />
                                  </TableCell>
                                ))}
                            </TableRow>
                          ))
                        : filteredProjects.map((project) => (
                            <TableRow key={project._id}>
                              <TableCell>{project.name}</TableCell>
                              <TableCell className="capitalize">
                                {project.status || "—"}
                              </TableCell>
                              <TableCell>
                                {project?.teams?.length || 0}
                              </TableCell>
                              <TableCell>
                                {project.createdBy?.name || "—"}
                              </TableCell>
                              <TableCell className="max-w-[70px]">
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() =>
                                    router.push(`/projects/${project._id}`)
                                  }
                                >
                                  View Project
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>

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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProjectUser;
