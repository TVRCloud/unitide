import {
  LucideIcon,
  Circle,
  Play,
  Eye,
  CheckCircle2,
  Pause,
  XCircle,
  Bookmark,
  Lightbulb,
  ListTodo,
  Bug,
} from "lucide-react";

export const statusMap: Record<
  string,
  { icon: LucideIcon; color: string; label: string }
> = {
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

export const priorityMap: Record<string, string> = {
  urgent: "text-red-500 bg-red-500/10",
  high: "text-orange-500 bg-orange-500/10",
  medium: "text-yellow-500 bg-yellow-500/10",
  low: "text-green-500 bg-green-500/10",
};

export const typeMap: Record<string, { icon: LucideIcon; color: string }> = {
  task: { icon: ListTodo, color: "text-blue-500" },
  bug: { icon: Bug, color: "text-red-500" },
  story: { icon: Bookmark, color: "text-purple-500" },
  feature: { icon: Lightbulb, color: "text-yellow-500" },
};
