"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  Calendar,
  Flag,
  Plus,
  Download,
  RefreshCw,
  CheckCircle2,
  Circle,
  AlertTriangle,
  XCircle,
  Pause,
  Play,
  Bug,
  Bookmark,
  Lightbulb,
  ListTodo,
  Eye,
  Edit,
  Trash2,
  Tag,
  Paperclip,
  MessageSquare,
  CheckSquare,
  ArrowLeft,
  FolderKanban,
  Timer,
  Copy,
  Share2,
  Star,
  StarOff,
  Send,
  FileText,
  User,
  Clock,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tasks = [
  {
    _id: "t1",
    title: "Implement user authentication flow",
    description:
      "Create login, register, and password reset functionality with JWT tokens.",
    project: { name: "E-Commerce Platform", color: "#f97316" },
    assignedTo: [
      { name: "Amegh T S", avatar: "AT" },
      { name: "Sarah Johnson", avatar: "SJ" },
    ],
    createdBy: { name: "Amegh T S", avatar: "AT" },
    status: "in-progress",
    priority: "high",
    type: "feature",
    tags: ["auth", "security"],
    dueDate: "2025-11-15",
    startDate: "2025-11-01",
    attachments: [{ name: "auth-flow.pdf", size: 245000 }],
    checklists: [
      { _id: "c1", title: "Setup JWT", completed: true },
      { _id: "c2", title: "Login endpoint", completed: true },
      { _id: "c3", title: "Register endpoint", completed: false },
    ],
    timeTracked: 480,
    comments: [{}, {}, {}],
    createdAt: "2025-11-01T10:00:00Z",
    updatedAt: "2025-11-10T14:30:00Z",
  },
  {
    _id: "t2",
    title: "Fix payment gateway timeout",
    description: "Users experiencing timeout errors during checkout.",
    project: { name: "E-Commerce Platform", color: "#f97316" },
    assignedTo: [{ name: "Michael Chen", avatar: "MC" }],
    createdBy: { name: "Sarah Johnson", avatar: "SJ" },
    status: "blocked",
    priority: "urgent",
    type: "bug",
    tags: ["payment", "critical"],
    dueDate: "2025-11-10",
    checklists: [],
    timeTracked: 120,
    attachments: [],
    comments: [{}],
    createdAt: "2025-11-08T09:00:00Z",
  },
  {
    _id: "t3",
    title: "Design product catalog UI",
    description:
      "Create wireframes and high-fidelity designs for the product listing.",
    project: { name: "Mobile App Redesign", color: "#8b5cf6" },
    assignedTo: [{ name: "Emma Wilson", avatar: "EW" }],
    createdBy: { name: "Emma Wilson", avatar: "EW" },
    status: "review",
    priority: "medium",
    type: "task",
    tags: ["design", "ui/ux"],
    dueDate: "2025-11-20",
    checklists: [
      { _id: "c1", title: "Wireframes", completed: true },
      { _id: "c2", title: "Mockups", completed: true },
    ],
    timeTracked: 960,
    attachments: [{ name: "design.fig" }],
    comments: [{}, {}, {}],
    createdAt: "2025-11-05T11:00:00Z",
  },
  {
    _id: "t4",
    title: "Write API documentation",
    description: "Document all REST API endpoints with examples.",
    project: { name: "E-Commerce Platform", color: "#f97316" },
    assignedTo: [{ name: "James Martinez", avatar: "JM" }],
    createdBy: { name: "Amegh T S", avatar: "AT" },
    status: "todo",
    priority: "low",
    type: "task",
    tags: ["docs"],
    dueDate: "2025-11-30",
    checklists: [],
    timeTracked: 0,
    attachments: [],
    comments: [],
    createdAt: "2025-11-10T08:00:00Z",
  },
  {
    _id: "t5",
    title: "User dashboard story",
    description: "As a user, I want to see my order history and settings.",
    project: { name: "E-Commerce Platform", color: "#f97316" },
    assignedTo: [{ name: "Sarah Johnson", avatar: "SJ" }],
    createdBy: { name: "Amegh T S", avatar: "AT" },
    status: "completed",
    priority: "medium",
    type: "story",
    tags: ["ux"],
    dueDate: "2025-11-08",
    completedAt: "2025-11-07T16:00:00Z",
    checklists: [
      { _id: "c1", title: "Order history", completed: true },
      { _id: "c2", title: "Settings", completed: true },
    ],
    timeTracked: 1440,
    attachments: [],
    comments: [{}, {}],
    createdAt: "2025-10-25T10:00:00Z",
  },
];

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";
const formatTime = (m) =>
  m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;

const statusMap = {
  todo: { icon: Circle, color: "text-gray-500 bg-gray-500/10", label: "To Do" },
  "in-progress": {
    icon: Play,
    color: "text-blue-500 bg-blue-500/10",
    label: "In Progress",
  },
  review: {
    icon: Eye,
    color: "text-purple-500 bg-purple-500/10",
    label: "Review",
  },
  completed: {
    icon: CheckCircle2,
    color: "text-green-500 bg-green-500/10",
    label: "Completed",
  },
  blocked: {
    icon: Pause,
    color: "text-red-500 bg-red-500/10",
    label: "Blocked",
  },
  cancelled: {
    icon: XCircle,
    color: "text-gray-400 bg-gray-400/10",
    label: "Cancelled",
  },
};

const priorityMap = {
  urgent: "text-red-500 bg-red-500/10",
  high: "text-orange-500 bg-orange-500/10",
  medium: "text-yellow-500 bg-yellow-500/10",
  low: "text-green-500 bg-green-500/10",
};

const typeMap = {
  task: { icon: ListTodo, color: "text-blue-500" },
  bug: { icon: Bug, color: "text-red-500" },
  story: { icon: Bookmark, color: "text-purple-500" },
  feature: { icon: Lightbulb, color: "text-yellow-500" },
};

const TasksList = ({ onSelect }) => {
  const [search, setSearch] = useState("");
  const [fStatus, setFStatus] = useState("all");
  const [fPriority, setFPriority] = useState("all");

  const filtered = tasks.filter((t) => {
    const ms = t.title.toLowerCase().includes(search.toLowerCase());
    const mst = fStatus === "all" || t.status === fStatus;
    const mp = fPriority === "all" || t.priority === fPriority;
    return ms && mst && mp;
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage all tasks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        {[
          { l: "Total", v: tasks.length, i: ListTodo },
          {
            l: "In Progress",
            v: tasks.filter((t) => t.status === "in-progress").length,
            i: Play,
          },
          {
            l: "Completed",
            v: tasks.filter((t) => t.status === "completed").length,
            i: CheckCircle2,
          },
          {
            l: "Blocked",
            v: tasks.filter((t) => t.status === "blocked").length,
            i: AlertTriangle,
          },
        ].map((s, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{s.l}</CardTitle>
              <s.i className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.v}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>Click to view details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={fStatus} onValueChange={setFStatus}>
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
              <Select value={fPriority} onValueChange={setFPriority}>
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
          </div>
          <Separator />
          <div className="space-y-2">
            {filtered.map((t, i) => {
              const st = statusMap[t.status];
              const ty = typeMap[t.type];
              return (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => onSelect(t)}
                  className="group p-4 rounded-lg border hover:border-primary/50 hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${ty.color}`}>
                      <ty.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium truncate">{t.title}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <FolderKanban
                              className="h-3 w-3"
                              style={{ color: t.project.color }}
                            />
                            <span style={{ color: t.project.color }}>
                              {t.project.name}
                            </span>
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
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
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge
                          variant="outline"
                          className={`gap-1 ${st.color}`}
                        >
                          <st.icon className="h-3 w-3" />
                          {st.label}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`gap-1 ${priorityMap[t.priority]}`}
                        >
                          <Flag className="h-3 w-3" />
                          {t.priority}
                        </Badge>
                        {t.dueDate && (
                          <Badge variant="outline" className="gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(t.dueDate)}
                          </Badge>
                        )}
                        {t.checklists.length > 0 && (
                          <Badge variant="outline" className="gap-1">
                            <CheckSquare className="h-3 w-3" />
                            {t.checklists.filter((c) => c.completed).length}/
                            {t.checklists.length}
                          </Badge>
                        )}
                        {t.attachments.length > 0 && (
                          <Badge variant="outline">
                            <Paperclip className="h-3 w-3" />
                          </Badge>
                        )}
                        {t.comments.length > 0 && (
                          <Badge variant="outline" className="gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {t.comments.length}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex -space-x-2">
                          {t.assignedTo.slice(0, 3).map((u, j) => (
                            <Avatar
                              key={j}
                              className="h-7 w-7 border-2 border-background"
                            >
                              <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                                {u.avatar}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        {t.timeTracked > 0 && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            {formatTime(t.timeTracked)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TaskDetail = ({ task: t, onBack }) => {
  const [starred, setStarred] = useState(false);
  const st = statusMap[t.status];
  const ty = typeMap[t.type];
  const progress =
    t.checklists.length > 0
      ? Math.round(
          (t.checklists.filter((c) => c.completed).length /
            t.checklists.length) *
            100
        )
      : 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setStarred(!starred)}
          >
            {starred ? (
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
            ) : (
              <StarOff className="h-5 w-5" />
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
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
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-muted ${ty.color}`}>
                    <ty.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline" className={st.color}>
                        <st.icon className="h-3 w-3 mr-1" />
                        {st.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={priorityMap[t.priority]}
                      >
                        <Flag className="h-3 w-3 mr-1" />
                        {t.priority}
                      </Badge>
                      <Badge variant="outline">{t.type}</Badge>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{t.title}</h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <FolderKanban
                        className="h-4 w-4"
                        style={{ color: t.project.color }}
                      />
                      <span style={{ color: t.project.color }}>
                        {t.project.name}
                      </span>
                      <span>•</span>Created {formatDate(t.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t.description || "No description"}
                  </p>
                </CardContent>
              </Card>
              {t.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {t.tags.map((tag, i) => (
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

            <TabsContent value="checklist" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Checklist</CardTitle>
                    <CardDescription>{progress}% complete</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Progress value={progress} className="h-2 mb-4" />
                  {t.checklists.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No items
                    </p>
                  ) : (
                    t.checklists.map((c) => (
                      <div
                        key={c._id}
                        className="flex items-center gap-3 p-2 rounded hover:bg-muted/50"
                      >
                        <Checkbox checked={c.completed} />
                        <span
                          className={
                            c.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }
                        >
                          {c.title}
                        </span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

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
                  {t.attachments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No files
                    </p>
                  ) : (
                    t.attachments.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg border mb-2"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{f.name}</span>
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

            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      u: "Sarah Johnson",
                      a: "SJ",
                      act: "updated status to In Progress",
                      t: "2 hours ago",
                    },
                    {
                      u: "Amegh T S",
                      a: "AT",
                      act: "created this task",
                      t: "1 day ago",
                    },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                          {a.a}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{a.u}</span>{" "}
                          <span className="text-muted-foreground">{a.act}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{a.t}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {t.assignedTo.map((u, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                      {u.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{u.name}</span>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Assignee
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className={st.color}>
                  {st.label}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Priority</span>
                <Badge variant="outline" className={priorityMap[t.priority]}>
                  {t.priority}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="outline">{t.type}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date</span>
                <span className="font-medium">{formatDate(t.dueDate)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Tracked</span>
                <span className="font-medium">{formatTime(t.timeTracked)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="text-sm">{formatDate(t.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-3xl font-bold">
                  {formatTime(t.timeTracked)}
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
};

export default function TasksMain() {
  const [selectedTask, setSelectedTask] = useState(null);
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {selectedTask ? (
          <TaskDetail
            task={selectedTask}
            onBack={() => setSelectedTask(null)}
          />
        ) : (
          <TasksList onSelect={setSelectedTask} />
        )}
      </div>
    </div>
  );
}
