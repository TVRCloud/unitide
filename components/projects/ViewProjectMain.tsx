/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Archive,
  ChevronRight,
  Copy,
  Edit,
  FolderKanban,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useViewProject } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { getPriorityConfig, getStatusConfig } from "@/utils/project";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DateTime } from "luxon";
import { Separator } from "../ui/separator";
import CreateTask from "../tasks/CreateTask";
import { useState } from "react";
import { SignedAvatar } from "../ui/signed-avatar";

const milestones = [
  { name: "Project Kickoff", date: "2025-10-01", status: "completed" },
  { name: "Design Phase Complete", date: "2025-10-15", status: "completed" },
  { name: "MVP Development", date: "2025-11-15", status: "in-progress" },
  { name: "Beta Testing", date: "2025-12-01", status: "pending" },
  { name: "Production Launch", date: "2025-12-31", status: "pending" },
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

const ViewProjectMain = () => {
  const [open, setOpen] = useState(false);
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useViewProject(params.id);

  if (isLoading) {
    return <div>Loading Project Data...</div>;
  }

  const statusConfig = getStatusConfig(data.status);
  const priorityConfig = getPriorityConfig(data.priority);
  const allMembers =
    data.teams?.flatMap((team: any) =>
      team.members.map((member: any) => ({
        ...member,
        teamName: team.name,
      }))
    ) || [];

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
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
                )}
                style={{
                  backgroundColor: `${data.color}20`,
                  border: `2px solid ${data.color}`,
                }}
              >
                <FolderKanban
                  className="h-8 w-8"
                  style={{ color: data.color }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-1">
                {data.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={(statusConfig.variant as any) ?? "secondary"}
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
                  {priorityConfig.label} Priority
                </Badge>
              </div>
            </motion.div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <CreateTask projectId={data._id} open={open} setOpen={setOpen} />

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
      </motion.div>
      <div className="px-4 sm:px-6 -mt-8 mb-2">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {[
            { label: "Completed", value: 10, isPercent: true },
            { label: "Days Left", value: 12 },
            { label: "Teams", value: data.teams?.length || 0 },
            { label: "Members", value: data.members?.length || 0 },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="text-center p-2">
                  <div
                    className="text-2xl font-bold"
                    style={idx === 0 ? { color: data.color } : undefined}
                  >
                    {stat.value}
                    {stat.isPercent && "%"}
                  </div>

                  <div className="text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {data.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Overall Completion
                      </span>
                      <span className="font-semibold">{10}%</span>
                    </div>
                    <Progress value={10} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      {/* <span>{formatDate(data.startDate)}</span> */}
                      {/* <span>{formatDate(data.endDate)}</span> */}
                    </div>
                  </CardContent>
                </Card>

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
                      {data.teams.map((team: any) => (
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
                                {team.members.length || 0} members
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
                      {allMembers.map((member: any, i: number) => (
                        <motion.div
                          key={member._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <SignedAvatar
                              src={member.avatar}
                              name={member.name}
                              avatarClassName="h-10 w-10"
                            />

                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {member.role} • {member.teamName}
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
                                <DropdownMenuItem>Change Role</DropdownMenuItem>
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
                              {DateTime.fromISO(milestone.date).toLocaleString(
                                DateTime.DATE_MED
                              )}
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
                            <AvatarFallback className="text-xs bg-linear-to-br from-primary to-secondary text-primary-foreground">
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

        {/* right */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Manager</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <SignedAvatar
                    src={data.manager.avatar}
                    name={data.manager.name}
                    avatarClassName="h-12 w-12"
                  />
                  <div>
                    <p className="font-semibold">{data.manager.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.manager.email}
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={statusConfig.variant as any}>
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
                    {/* {formatDate(data.startDate)} */}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="font-medium">
                    {/* {formatDate(data.endDate)} */}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {DateTime.fromISO(data.createdAt).toFormat("dd LLL yy")}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="text-sm">
                    {DateTime.fromISO(data.updatedAt).toFormat("dd LLL yy")}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Project ID</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {data._id.slice(-8)}
                  </code>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectMain;
