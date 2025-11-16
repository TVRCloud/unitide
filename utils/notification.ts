import {
  ListTodo,
  Radio,
  AlertCircle,
  Briefcase,
  Users,
  Shield,
  MessageSquare,
  User,
  Activity,
  Bell,
} from "lucide-react";

type NotificationType =
  | "BROADCAST"
  | "TASK"
  | "PROJECT"
  | "TEAM"
  | "DEADLINE"
  | "SECURITY"
  | "COMMENT"
  | "USER"
  | "ACTIVITY";

type AudienceType = "ALL" | "ROLE" | "SPECIFIC";

export const getNotificationIcon = (type: NotificationType) => {
  const icons = {
    BROADCAST: Radio,
    TASK: ListTodo,
    PROJECT: Briefcase,
    TEAM: Users,
    DEADLINE: AlertCircle,
    SECURITY: Shield,
    COMMENT: MessageSquare,
    USER: User,
    ACTIVITY: Activity,
  };
  return icons[type] || Bell;
};

export const getNotificationColor = (type: NotificationType) => {
  const colors = {
    BROADCAST: "from-purple-500 to-purple-600",
    TASK: "from-blue-500 to-blue-600",
    PROJECT: "from-green-500 to-green-600",
    TEAM: "from-orange-500 to-orange-600",
    DEADLINE: "from-red-500 to-red-600",
    SECURITY: "from-yellow-500 to-yellow-600",
    COMMENT: "from-pink-500 to-pink-600",
    USER: "from-cyan-500 to-cyan-600",
    ACTIVITY: "from-indigo-500 to-indigo-600",
  };
  return colors[type] || "from-slate-500 to-slate-600";
};

export const getAudienceBadge = (type: AudienceType) => {
  const badges = {
    ALL: { label: "Everyone", variant: "default" },
    ROLE: { label: "Role-based", variant: "secondary" },
    SPECIFIC: { label: "Direct", variant: "outline" },
  };
  return badges[type] || { label: type, variant: "outline" };
};
