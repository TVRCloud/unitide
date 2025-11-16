import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Bell, Check, Clock, Settings, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  useNotificationStore,
  useNotificationStream,
} from "@/store/useNotificationStore";
import { useNotificationAlerts } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import {
  getNotificationColor,
  getNotificationIcon,
} from "@/utils/notification";

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

type AudienceType = "ALL" | "ROLE" | "SPECIFIC";

const getAudienceBadge = (
  type: AudienceType
): { label: string; variant: BadgeVariant } => {
  const badges: Record<AudienceType, { label: string; variant: BadgeVariant }> =
    {
      ALL: { label: "Everyone", variant: "default" },
      ROLE: { label: "Role-based", variant: "secondary" },
      SPECIFIC: { label: "Direct", variant: "outline" },
    };
  return badges[type];
};

const NavNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useNotificationStore((s) => s.notifications);
  const unread = notifications.filter((n) => !n.read).length;
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const clearAll = useNotificationStore((s) => s.clearAll);
  const router = useRouter();

  useNotificationAlerts();
  useNotificationStream();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10">
          <Bell className="h-4 w-4" />
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold",
              unread === 0 && "hidden"
            )}
          >
            {unread > 9 ? "9+" : unread}
          </motion.span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end">
        <div className="p-2 py-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-primary/10">
                <Bell className="h-3.5 w-3.5 text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">
                Notifications
              </h4>
              {unread > 0 && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20"
                >
                  {unread} new
                </Badge>
              )}
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Notification Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Bell className="w-4 h-4 mr-2" />
                    Preferences
                  </DropdownMenuItem>

                  {notifications.length > 0 && (
                    <DropdownMenuItem
                      onClick={() => clearAll()}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear all
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="py-2">
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mb-1">No notifications</p>
                <p className="text-xs text-muted-foreground">
                  You&apos;re all caught up!
                </p>
              </motion.div>
            ) : (
              notifications.map((notification, idx) => {
                // const NotificationIcon = getNotificationIcon(notification.type);
                const audienceBadge = getAudienceBadge(
                  //   notification.audienceType
                  "ALL"
                );
                const NotificationIcon = getNotificationIcon("COMMENT");
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.03 }}
                    layout
                    className={`group relative p-4 rounded-lg mb-2 transition-colors cursor-pointer ${
                      notification.read
                        ? "hover:bg-muted"
                        : "bg-primary/5 hover:bg-primary/10 border-l-2 border-l-primary/50"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-lg bg-linear-to-br ${getNotificationColor(
                          //   notification.type
                          "COMMENT"
                        )} shrink-0`}
                      >
                        <NotificationIcon className="w-4 h-4 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold">
                              {notification.title}
                            </h4>
                            <Badge
                              variant={audienceBadge.variant}
                              className="text-[10px] h-5"
                            >
                              {audienceBadge.label}
                            </Badge>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                          {notification.body}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {/* <Badge
                              variant="outline"
                              className="text-[10px] h-5 capitalize"
                            >
                              {notification.type.toLowerCase()}
                            </Badge> */}
                            <Separator orientation="vertical" className="h-3" />
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {DateTime.fromISO(
                                notification.createdAt
                              ).toRelative()}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            {/* <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification._id);
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator className="opacity-50" />
            <div>
              <Button
                variant="ghost"
                className="w-full text-xs h-8 hover:bg-accent/80 text-muted-foreground hover:text-foreground font-medium"
                onClick={() => {
                  setIsOpen(false);
                  router.push("/notifications");
                }}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavNotification;
