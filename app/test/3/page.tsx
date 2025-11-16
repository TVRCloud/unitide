/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
// import { useInfiniteAlerts } from "@/hooks/useNotifications"; // Uncomment for real API
import {
  Bell,
  Search,
  Filter,
  Radio,
  ListTodo,
  Briefcase,
  Users,
  AlertCircle,
  Shield,
  MessageSquare,
  User,
  Activity,
  Clock,
  Check,
  CheckCheck,
  Trash2,
  Eye,
  Download,
  Settings,
  Loader2,
  Inbox,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NotificationsMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [audienceTypeFilter, setAudienceTypeFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { ref, inView } = useInView();

  // Dummy data for preview
  const dummyNotifications = [
    {
      _id: "6918e74bfec5ac7253c6b498",
      type: "BROADCAST",
      title: "System Update - New Features Released",
      body: "We've just released several new features including improved task management, real-time collaboration tools, and enhanced security measures. Check out the changelog to learn more about what's new!",
      audienceType: "ALL",
      roles: [],
      users: [],
      createdAt: "2025-11-15T20:49:15.046Z",
      updatedAt: "2025-11-15T20:49:15.046Z",
      readInfo: [
        {
          _id: "6918e81003613265ebaa5cf8",
          userId: "690c46954ff6e77ed5990b2f",
          notificationId: "6918e74bfec5ac7253c6b498",
          readAt: "2025-11-15T20:52:32.010Z",
          createdAt: "2025-11-15T20:52:32.011Z",
          updatedAt: "2025-11-15T20:52:32.011Z",
        },
      ],
      read: true,
    },
    {
      _id: "6918e74bfec5ac7253c6b499",
      type: "TASK",
      title: "New Task Assigned: API Integration",
      body: "You have been assigned to 'Implement user authentication API'. This is a high-priority task. Please review the requirements in the project documentation and update your progress daily.",
      audienceType: "SPECIFIC",
      roles: [],
      users: ["690c46954ff6e77ed5990b2f"],
      createdAt: "2025-11-15T18:30:00.000Z",
      updatedAt: "2025-11-15T18:30:00.000Z",
      readInfo: [],
      read: false,
    },
    {
      _id: "6918e74bfec5ac7253c6b500",
      type: "PROJECT",
      title: "Project Milestone Reached - 75% Complete",
      body: "Congratulations! The Mobile App Redesign project has reached 75% completion. The team has done an excellent job meeting deadlines. Final review meeting is scheduled for next week.",
      audienceType: "ROLE",
      roles: ["manager", "member"],
      users: [],
      createdAt: "2025-11-15T16:15:00.000Z",
      updatedAt: "2025-11-15T16:15:00.000Z",
      readInfo: [],
      read: false,
    },
    {
      _id: "6918e74bfec5ac7253c6b501",
      type: "DEADLINE",
      title: "⚠️ Urgent: Critical Task Due Tomorrow",
      body: "The task 'Fix critical security vulnerability in authentication module' is due tomorrow at 5:00 PM. This is blocking the production deployment. Please prioritize this work immediately.",
      audienceType: "SPECIFIC",
      roles: [],
      users: ["690c46954ff6e77ed5990b2f", "690c7b02d514d0141bcb5d9e"],
      createdAt: "2025-11-15T14:00:00.000Z",
      updatedAt: "2025-11-15T14:00:00.000Z",
      readInfo: [
        {
          _id: "6918e81003613265ebaa5cf9",
          userId: "690c46954ff6e77ed5990b2f",
          notificationId: "6918e74bfec5ac7253c6b501",
          readAt: "2025-11-15T14:30:00.000Z",
          createdAt: "2025-11-15T14:30:00.000Z",
          updatedAt: "2025-11-15T14:30:00.000Z",
        },
      ],
      read: true,
    },
    {
      _id: "6918e74bfec5ac7253c6b502",
      type: "TEAM",
      title: "Team Meeting Scheduled",
      body: "Weekly team sync meeting scheduled for Monday at 10:00 AM in Conference Room B. Please review the meeting agenda shared in the team channel and come prepared with your updates.",
      audienceType: "ROLE",
      roles: ["manager", "member"],
      users: [],
      createdAt: "2025-11-14T16:00:00.000Z",
      updatedAt: "2025-11-14T16:00:00.000Z",
      readInfo: [],
      read: false,
    },
    {
      _id: "6918e74bfec5ac7253c6b503",
      type: "SECURITY",
      title: "🔒 Security Alert: New Login Detected",
      body: "A new login was detected from Chrome on Windows in Mumbai, India at 12:30 PM. IP Address: 203.0.113.45. If this wasn't you, please change your password immediately and contact IT security.",
      audienceType: "SPECIFIC",
      roles: [],
      users: ["690c46954ff6e77ed5990b2f"],
      createdAt: "2025-11-14T12:30:00.000Z",
      updatedAt: "2025-11-14T12:30:00.000Z",
      readInfo: [
        {
          _id: "6918e81003613265ebaa5cfa",
          userId: "690c46954ff6e77ed5990b2f",
          notificationId: "6918e74bfec5ac7253c6b503",
          readAt: "2025-11-14T13:00:00.000Z",
          createdAt: "2025-11-14T13:00:00.000Z",
          updatedAt: "2025-11-14T13:00:00.000Z",
        },
      ],
      read: true,
    },
    {
      _id: "6918e74bfec5ac7253c6b504",
      type: "COMMENT",
      title: "New Comment on Your Task",
      body: "John Doe commented: 'Great progress on the authentication feature! I've reviewed the code and left some suggestions. Let's discuss the implementation in our 1-on-1 meeting tomorrow.'",
      audienceType: "SPECIFIC",
      roles: [],
      users: ["690c46954ff6e77ed5990b2f"],
      createdAt: "2025-11-13T15:45:00.000Z",
      updatedAt: "2025-11-13T15:45:00.000Z",
      readInfo: [],
      read: false,
    },
    {
      _id: "6918e74bfec5ac7253c6b505",
      type: "BROADCAST",
      title: "Scheduled Maintenance Notification",
      body: "System maintenance is scheduled for Sunday, November 17th from 2:00 AM to 4:00 AM EST. All services will be unavailable during this time. Please plan your work accordingly and save all progress before the maintenance window.",
      audienceType: "ALL",
      roles: [],
      users: [],
      createdAt: "2025-11-13T09:00:00.000Z",
      updatedAt: "2025-11-13T09:00:00.000Z",
      readInfo: [
        {
          _id: "6918e81003613265ebaa5cfb",
          userId: "690c46954ff6e77ed5990b2f",
          notificationId: "6918e74bfec5ac7253c6b505",
          readAt: "2025-11-13T10:00:00.000Z",
          createdAt: "2025-11-13T10:00:00.000Z",
          updatedAt: "2025-11-13T10:00:00.000Z",
        },
      ],
      read: true,
    },
  ];

  // Use dummy data
  const data = { pages: [dummyNotifications] };
  const isLoading = false;
  const isFetchingNextPage = false;
  const hasNextPage = false;

  const allNotifications = data?.pages?.flatMap((page) => page) || [];

  // Apply filters and sorting
  const filteredAndSortedNotifications = useMemo(() => {
    let filtered = allNotifications;

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(lowerSearch) ||
          n.body.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter((n) => n.type === typeFilter);
    }

    // Apply audience type filter
    if (audienceTypeFilter) {
      filtered = filtered.filter((n) => n.audienceType === audienceTypeFilter);
    }

    // Apply role filter (Show "ALL" messages + messages for the specific role)
    if (roleFilter) {
      filtered = filtered.filter(
        (n) =>
          n.audienceType === "ALL" ||
          (n.audienceType === "ROLE" && n.roles.includes(roleFilter))
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      const valA = new Date(a[sortField] || 0).getTime();
      const valB = new Date(b[sortField] || 0).getTime();

      if (sortOrder === "asc") {
        return valA - valB;
      } else {
        return valB - valA;
      }
    });

    return sorted;
  }, [
    allNotifications,
    searchTerm,
    typeFilter,
    audienceTypeFilter,
    roleFilter,
    sortField,
    sortOrder,
  ]);

  const getNotificationIcon = (type) => {
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

  const getNotificationColor = (type) => {
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

  const getAudienceBadge = (audienceType) => {
    const badges = {
      ALL: { label: "Everyone", variant: "default" },
      ROLE: { label: "Role-based", variant: "secondary" },
      SPECIFIC: { label: "Direct", variant: "outline" },
    };
    return badges[audienceType] || { label: audienceType, variant: "outline" };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = {
    total: allNotifications.length,
    unread: allNotifications.filter((n) => !n.read).length,
    read: allNotifications.filter((n) => n.read).length,
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      // fetchNextPage(); // Uncomment when using real API
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-background via-primary/5 to-background">
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Notifications</h1>
                <p className="text-muted-foreground">
                  Stay updated with all your important alerts and messages
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline">
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Notification Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Bell className="w-4 h-4 mr-2" />
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Filter className="w-4 h-4 mr-2" />
                    Filter Rules
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Total",
              value: stats.total,
              icon: Bell,
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "Unread",
              value: stats.unread,
              icon: Inbox,
              color: "from-orange-500 to-orange-600",
            },
            {
              label: "Read",
              value: stats.read,
              icon: CheckCheck,
              color: "from-green-500 to-green-600",
            },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <div
                  className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500`}
                />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-3xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Notifications</CardTitle>
            <CardDescription>
              Search and filter your notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                type
              </div>

              <div className="space-y-2">
                <Label htmlFor="audienceType">Audience</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort">Sort By</Label>
              </div>
            </div>

            {(searchTerm || typeFilter || audienceTypeFilter || roleFilter) && (
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                {searchTerm && (
                  <Badge variant="secondary">
                    Search: {searchTerm}
                    <button onClick={() => setSearchTerm("")} className="ml-2">
                      ×
                    </button>
                  </Badge>
                )}
                {typeFilter && (
                  <Badge variant="secondary">
                    Type: {typeFilter}
                    <button onClick={() => setTypeFilter("")} className="ml-2">
                      ×
                    </button>
                  </Badge>
                )}
                {audienceTypeFilter && (
                  <Badge variant="secondary">
                    Audience: {audienceTypeFilter}
                    <button
                      onClick={() => setAudienceTypeFilter("")}
                      className="ml-2"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {roleFilter && (
                  <Badge variant="secondary">
                    Role: {roleFilter}
                    <button onClick={() => setRoleFilter("")} className="ml-2">
                      ×
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("");
                    setAudienceTypeFilter("");
                    setRoleFilter("");
                  }}
                >
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>
                  Showing {filteredAndSortedNotifications.length} of{" "}
                  {allNotifications.length} notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredAndSortedNotifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      No notifications found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters or search query
                    </p>
                  </motion.div>
                ) : (
                  filteredAndSortedNotifications.map((notification, idx) => {
                    const NotificationIcon = getNotificationIcon(
                      notification.type
                    );
                    const audienceBadge = getAudienceBadge(
                      notification.audienceType
                    );

                    return (
                      <motion.div
                        key={notification._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.02 }}
                        layout
                        className={`p-5 rounded-xl border transition-all cursor-pointer group ${
                          notification.read
                            ? "bg-card hover:bg-accent"
                            : "bg-primary/5 hover:bg-primary/10 border-primary/20"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-br ${getNotificationColor(
                              notification.type
                            )} flex-shrink-0 group-hover:scale-110 transition-transform`}
                          >
                            <NotificationIcon className="w-5 h-5 text-white" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-lg font-semibold">
                                  {notification.title}
                                </h3>
                                <Badge
                                  variant={audienceBadge.variant}
                                  className="text-xs"
                                >
                                  {audienceBadge.label}
                                </Badge>
                                {!notification.read && (
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                )}
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Check className="w-4 h-4 mr-2" />
                                    Mark as{" "}
                                    {notification.read ? "Unread" : "Read"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                              {notification.body}
                            </p>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {notification.type.toLowerCase()}
                              </Badge>
                              <Separator
                                orientation="vertical"
                                className="h-4"
                              />
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(notification.createdAt)}
                              </span>
                              {notification.readInfo &&
                                notification.readInfo.length > 0 && (
                                  <>
                                    <Separator
                                      orientation="vertical"
                                      className="h-4"
                                    />
                                    <span className="flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      Read{" "}
                                      {formatDate(
                                        notification.readInfo[0].readAt
                                      )}
                                    </span>
                                  </>
                                )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>

              {/* Infinite Scroll Trigger */}
              <div className="flex justify-center py-4" ref={ref}>
                <span className="text-center text-muted-foreground text-sm">
                  {isFetchingNextPage ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading more...</span>
                    </div>
                  ) : hasNextPage ? (
                    "Scroll to load more"
                  ) : allNotifications.length > 0 &&
                    filteredAndSortedNotifications.length > 0 ? ( // Only show if there are items
                    "No more notifications"
                  ) : null}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsMain;
