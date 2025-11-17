import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Calendar,
  ClipboardList,
  MessageSquare,
  BarChart3,
  Settings,
  UserCog,
  Tags,
  Bell,
  Briefcase,
  FileSpreadsheet,
  ScrollText,
  Fingerprint,
} from "lucide-react";

export const menuList = [
  {
    groupLabel: "",
    menus: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    groupLabel: "Tasks",
    menus: [
      {
        href: "/tasks",
        label: "All Tasks",
        icon: ClipboardList,
      },
      {
        href: "",
        label: "Projects",
        icon: FolderKanban,
        submenus: [
          { href: "/projects", label: "All Projects" },
          { href: "/projects/active", label: "Active Projects" },
          { href: "/projects/completed", label: "Completed Projects" },
        ],
      },
      {
        href: "/calendar",
        label: "Calendar View",
        icon: Calendar,
      },
      {
        href: "/tags",
        label: "Tags & Labels",
        icon: Tags,
      },
    ],
  },
  {
    groupLabel: "Teams",
    menus: [
      {
        href: "/teams",
        label: "All Teams",
        icon: Users,
      },
      {
        href: "/members",
        label: "Members",
        icon: UserCog,
      },
    ],
  },
  {
    groupLabel: "Communication",
    menus: [
      {
        href: "/chat",
        label: "Chat",
        icon: MessageSquare,
      },
      {
        href: "/notifications",
        label: "Notifications",
        icon: Bell,
      },
    ],
  },
  {
    groupLabel: "Reports",
    menus: [
      {
        href: "/reports",
        label: "Overview",
        icon: BarChart3,
      },
      {
        href: "/reports/timesheet",
        label: "Timesheet",
        icon: FileSpreadsheet,
      },
    ],
  },
  {
    groupLabel: "Settings",
    menus: [
      {
        href: "/settings/workspace",
        label: "Workspace Settings",
        icon: Briefcase,
      },
      {
        href: "/settings/app",
        label: "App Settings",
        icon: Settings,
      },
      {
        href: "/settings/logs",
        label: "Logs",
        icon: ScrollText,
      },
      {
        href: "/settings/session",
        label: "Session",
        icon: Fingerprint,
      },
    ],
  },
];
