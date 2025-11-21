import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  Flag,
  FolderKanban,
  Zap,
} from "lucide-react";

export const getStatusConfig = (status: string) => {
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

export const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case "urgent":
      return {
        icon: AlertTriangle,
        color: "text-red-500 bg-red-500/10 border-red-500/30",
        label: "Urgent",
      };
    case "high":
      return {
        icon: Flag,
        color: "text-orange-500 bg-orange-500/10 border-orange-500/30",
        label: "High",
      };
    case "medium":
      return {
        icon: Flag,
        color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
        label: "Medium",
      };
    case "low":
      return {
        icon: Flag,
        color: "text-green-500 bg-green-500/10 border-green-500/30",
        label: "Low",
      };
    default:
      return {
        icon: Flag,
        color: "text-gray-500 bg-gray-500/10 border-gray-500/30",
        label: priority,
      };
  }
};
