"use client";

import { useInfiniteAlerts } from "@/hooks/useNotifications";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { AnimatePresence, motion } from "framer-motion";
import { HeaderSection } from "../ui/header-section";
import { Button } from "../ui/button";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Eye,
  Inbox,
  MoreVertical,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { StatsCard } from "../ui/stats-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import {
  getNotificationColor,
  getNotificationIcon,
} from "@/utils/notification";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import AddNotification from "./AddNotification";
import { RoleGuard } from "../RoleGuard";

const NotificationsMain = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState<string>("");
  const [audience, setAudience] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteAlerts({
      search: searchTerm,
      type,
      audienceType: audience,
      role,
      sortField: "createdAt",
      sortOrder: "desc",
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredAlerts = data?.pages.flat() || [];

  return (
    <div className="flex flex-col gap-3">
      <HeaderSection
        title="Notifications"
        subtitle="View and manage all notifications"
        actions={
          <div>
            <Button variant="outline">
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>{" "}
            <RoleGuard roles={["admin", "manager"]}>
              <AddNotification />
            </RoleGuard>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total"
          value={0}
          isLoading={isLoading}
          icon={Bell}
          color="from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Unread"
          value={0}
          isLoading={isLoading}
          icon={Inbox}
          color="from-primary/60 to-primary"
        />

        <StatsCard
          title="Read"
          value={0}
          isLoading={isLoading}
          icon={CheckCheck}
          color="from-green-500 to-green-600"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  View and manage all notifications
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
                <div>
                  <Select onValueChange={setType} value={type}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All</SelectItem>
                      <SelectItem value="BROADCAST">Broadcast</SelectItem>
                      <SelectItem value="TASK">Task</SelectItem>
                      <SelectItem value="PROJECT">Project</SelectItem>
                      <SelectItem value="TEAM">Team</SelectItem>
                      <SelectItem value="DEADLINE">Deadline</SelectItem>
                      <SelectItem value="SECURITY">Security</SelectItem>
                      <SelectItem value="COMMENT">Comment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <RoleGuard roles={["admin", "manager"]}>
                  <div>
                    <Select onValueChange={setAudience} value={audience}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Everyone</SelectItem>
                        <SelectItem value="ROLE">Role</SelectItem>
                        <SelectItem value="SPECIFIC">Specific</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select onValueChange={setRole} value={role}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="guest">Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </RoleGuard>
              </div>
            </div>
            {(searchTerm || type || audience || role) && (
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                {searchTerm && (
                  <Badge variant="secondary">
                    Search: {searchTerm}
                    <span
                      onClick={() => setSearchTerm("")}
                      className="ml-2 hover:cursor-pointer"
                    >
                      <X size={20} />
                    </span>
                  </Badge>
                )}
                {type && (
                  <Badge variant="secondary">
                    Type: {type}
                    <span
                      onClick={() => setType("")}
                      className="ml-2 hover:cursor-pointer"
                    >
                      <X size={20} />
                    </span>
                  </Badge>
                )}
                {audience && (
                  <Badge variant="secondary">
                    Audience: {audience}
                    <span
                      onClick={() => setAudience("")}
                      className="ml-2 hover:cursor-pointer"
                    >
                      <X size={20} />
                    </span>
                  </Badge>
                )}
                {role && (
                  <Badge variant="secondary">
                    Role: {role}
                    <span
                      onClick={() => setRole("")}
                      className="ml-2 hover:cursor-pointer"
                    >
                      <X size={20} />
                    </span>
                  </Badge>
                )}
              </div>
            )}
          </CardHeader>
          <Separator />

          {isLoading ? (
            <CardContent>
              <div className="space-y-3">
                {Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton key={idx} className="h-12" />
                  ))}
              </div>
            </CardContent>
          ) : (
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredAlerts && filteredAlerts.length === 0 ? (
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
                    filteredAlerts.map((notification, idx) => {
                      const NotificationIcon = getNotificationIcon(
                        notification.type
                      );

                      return (
                        <motion.div
                          key={notification._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: idx * 0.02 }}
                          layout
                          className={`p-5 rounded-xl border transition-all group ${
                            notification.read
                              ? "bg-card hover:bg-accent"
                              : "bg-primary/5 hover:bg-primary/10 border-primary/20"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-3 rounded-xl bg-linear-to-br ${getNotificationColor(
                                notification.type
                              )} shrink-0 group-hover:scale-110 transition-transform`}
                            >
                              <NotificationIcon className="w-5 h-5 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="text-lg font-semibold text-ellipsis truncate">
                                    {notification.title}
                                  </h3>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {notification.audienceType}
                                  </Badge>
                                  {!notification.read && (
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                  )}
                                </div>

                                <div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:text-primary"
                                    onClick={() => {
                                      router.push(
                                        `/notifications/${notification._id}`
                                      );
                                    }}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreVertical className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>
                                        Actions
                                      </DropdownMenuLabel>
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
                                  {DateTime.fromISO(
                                    notification.createdAt
                                  ).toRelative()}
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
                                        {DateTime.fromISO(
                                          notification.readInfo[0].readAt
                                        ).toRelative()}
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
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>

      <div className="flex justify-center" ref={ref}>
        <span className="p-4 text-center text-muted-foreground text-xs">
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Scroll to load more"
            : "No more notifications"}
        </span>
      </div>
    </div>
  );
};

export default NotificationsMain;
