"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  Flag,
  MoreHorizontal,
  Copy,
  Trash2,
  Plus,
  Timer,
  Tag,
  FileText,
  Download,
} from "lucide-react";
import { useParams } from "next/navigation";
import { priorityMap, statusMap, typeMap } from "@/utils/task";
import { useViewTask } from "@/hooks/useTask";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { DateTime } from "luxon";
import EditTask from "./EditTask";
import TaskAssignees from "./TaskAssignees";

export default function ViewTaskPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useViewTask(params.id);

  if (isLoading) {
    return <div>Loading Task Data...</div>;
  }

  if (!data) {
    return <div className="p-6 text-center text-red-500">Task not found</div>;
  }

  const type = typeMap[data.type];
  const status = statusMap[data.status];

  return (
    <div className="flex flex-col gap-3">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-b pb-8 px-4 sm:px-6 pt-4"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center shadow-lg",
                  type.color
                )}
              >
                <type.icon className="h-8 w-8" />
              </div>
            </motion.div>

            {/* Task details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className={status.color}>
                  <status.icon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>

                <Badge variant="outline" className={priorityMap[data.priority]}>
                  <Flag className="h-3 w-3 mr-1" />
                  {data.priority}
                </Badge>

                <Badge variant="outline">{data.type}</Badge>
              </div>

              <h1 className="text-2xl font-bold mb-2">{data.title}</h1>

              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <FolderKanban
                  className="h-4 w-4"
                  style={{ color: data.project.color }}
                />
                <span style={{ color: data.project.color }}>
                  {data.project.name}
                </span>
                <span>•</span>
                Created by {data.createdBy[0]?.name ?? "Unknown"}
              </p>
            </motion.div>
          </div>

          {/* Edit + Menu */}
          <div className="inline-flex gap-2">
            <EditTask
              defaultValue={{
                id: data._id,
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                type: data.type,
                dueDate: data.dueDate,
                tags: data.tags,
              }}
            />

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

                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>

      {/* ========== MAIN CONTENT ======== */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="checklist">Checklist</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* Details */}
              <TabsContent value="details" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {data.description || "No description"}
                    </p>
                  </CardContent>
                </Card>

                {data.tags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {data.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Checklist */}
              <TabsContent value="checklist" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Checklist</CardTitle>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {data.checklists.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No checklist items
                      </p>
                    ) : (
                      <p>Checklist items UI here</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Files */}
              <TabsContent value="files" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Attachments</CardTitle>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </CardHeader>

                  <CardContent>
                    {data.attachments.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No files
                      </p>
                    ) : (
                      data.attachments.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg border mb-2"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{file.name}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity */}
              <TabsContent value="activity" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Activity</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* SAMPLE ACTIVITY */}
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AT</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">
                            {data.createdBy[0]?.name}
                          </span>{" "}
                          <span className="text-muted-foreground">
                            created this task
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {DateTime.fromISO(data.createdAt).toRelative()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-1 space-y-6">
          {/* Assignees */}

          <TaskAssignees id={data._id} assignees={data.assignedTo} />

          {/* Extra details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className={status.color}>
                  {status.label}
                </Badge>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-muted-foreground">Priority</span>
                <Badge variant="outline" className={priorityMap[data.priority]}>
                  {data.priority}
                </Badge>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="outline">{data.type}</Badge>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Date</span>
                <span className="font-medium">
                  {DateTime.fromISO(data.startDate).toLocaleString(
                    DateTime.DATE_MED
                  )}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="text-sm">
                  {DateTime.fromISO(data.createdAt).toLocaleString(
                    DateTime.DATE_MED
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Time Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Time Tracking</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-center py-4">
                <div className="text-3xl font-bold">
                  {String(Math.floor(data.timeTracked / 60)).padStart(2, "0")}:
                  {String(data.timeTracked % 60).padStart(2, "0")}
                </div>
                <p className="text-sm text-muted-foreground">
                  Total time logged
                </p>
              </div>

              <Button className="w-full">
                <Timer className="h-4 w-4 mr-2" />
                Log Time
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
