"use client";
import {
  Shield,
  Search,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle,
  XCircle,
  Globe,
  Wifi,
  MoreVertical,
  LogOut,
  Clock,
  Calendar,
} from "lucide-react";
import { HeaderSection } from "../ui/header-section";
import { AnimatePresence, motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Separator } from "../ui/separator";
import { useInfiniteSessions, useTerminateSession } from "@/hooks/useSession";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { DateTime } from "luxon";
import { toast } from "sonner";

type Session = {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  userAgent: string;
  isActive: boolean;
  ip: string;
  createdAt: string;
  expiresAt: string;
};

const parseUserAgent = (ua: string) => {
  const isMobile = /Mobile|Android|iPhone/i.test(ua);
  const isTablet = /iPad|Tablet/i.test(ua);
  const isChrome = /Chrome/i.test(ua);
  const isFirefox = /Firefox/i.test(ua);
  const isSafari = /Safari/i.test(ua) && !/Chrome/i.test(ua);
  const isWindows = /Windows/i.test(ua);
  const isMac = /Macintosh|Mac OS X/i.test(ua);
  const isLinux = /Linux/i.test(ua);
  const isIOS = /iPhone|iPad/i.test(ua);

  let device = "Desktop";
  let deviceIcon = Monitor;
  let browser = "Unknown";
  let os = "Unknown";

  if (isMobile) {
    device = "Mobile";
    deviceIcon = Smartphone;
  } else if (isTablet) {
    device = "Tablet";
    deviceIcon = Tablet;
  }

  if (isChrome) browser = "Chrome";
  else if (isFirefox) browser = "Firefox";
  else if (isSafari) browser = "Safari";

  if (isWindows) os = "Windows";
  else if (isMac) os = "macOS";
  else if (isLinux) os = "Linux";
  else if (isIOS) os = "iOS";

  return { device, deviceIcon, browser, os };
};

const getTimeRemaining = (expiresAt: string) => {
  const now = DateTime.now();
  const expiry = DateTime.fromISO(expiresAt);

  if (expiry <= now) return "Expired";

  const diff = expiry.diff(now, ["hours", "minutes"]).toObject();
  const hours = Math.floor(diff.hours || 0);
  const minutes = Math.floor(diff.minutes || 0);

  if (hours === 0 && minutes === 0) return "Expiring soon";
  if (hours === 0) return `${minutes}m remaining`;
  return `${hours}h ${minutes}m remaining`;
};

const SessionMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [terminatingId, setTerminatingId] = useState<string | null>(null);
  const { ref, inView } = useInView();
  const terminate = useTerminateSession();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    refetch,
  } = useInfiniteSessions(searchTerm);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sessions: Session[] = data?.pages.flat() || [];

  const handleTerminate = (id: string) => {
    terminate.mutate(id, {
      onSuccess: () => {
        toast.success("Session terminated");
        setTerminatingId(null);
      },
      onError: () => {
        toast.error("Failed to terminate session");
        setTerminatingId(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <HeaderSection
        title="Sessions Management"
        subtitle="View and manage all user authentication sessions"
        icon={<Shield />}
        actions={
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw
              className={`${isLoading && "animate-spin"} w-4 h-4 mr-2`}
            />
            Refresh
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle>Sessions</CardTitle>
              <CardDescription>
                View and manage all user authentication sessions
              </CardDescription>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <Separator />

          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : sessions.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No sessions found
              </p>
            ) : (
              <AnimatePresence>
                {sessions.map((session, i) => {
                  const {
                    device,
                    deviceIcon: DeviceIcon,
                    browser,
                    os,
                  } = parseUserAgent(session.userAgent);

                  return (
                    <motion.div
                      key={session._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.03 }}
                      layout
                    >
                      <div className="p-2 rounded-xl border bg-card hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-linear-to-br from-primary/20 to-secondary/20 shrink-0">
                            <DeviceIcon className="w-6 h-6 text-primary" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold">
                                    {session.user.name}
                                  </h3>
                                  <Badge
                                    variant={
                                      session.isActive ? "default" : "secondary"
                                    }
                                  >
                                    {session.isActive ? (
                                      <>
                                        <CheckCircle className="w-3 h-3 mr-1" />{" "}
                                        Active
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="w-3 h-3 mr-1" />{" "}
                                        Inactive
                                      </>
                                    )}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {session.user.email}
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <DeviceIcon className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      {device} ({os})
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      {browser}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Wifi className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground font-mono text-xs">
                                      {session.ip}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {session.isActive && (
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() =>
                                        setTerminatingId(session._id)
                                      }
                                    >
                                      <LogOut className="w-4 h-4 mr-2" />
                                      Terminate Session
                                    </DropdownMenuItem>
                                  )}
                                  {!session.isActive && (
                                    <DropdownMenuItem disabled>
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Already terminated
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <Separator className="my-3" />

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Logged in{" "}
                                  {DateTime.fromISO(
                                    session.createdAt
                                  ).toRelative()}
                                </span>
                                <Separator
                                  orientation="vertical"
                                  className="h-4"
                                />
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {getTimeRemaining(session.expiresAt)}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {os}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}

            <div className="flex justify-center" ref={ref}>
              <span className="p-4 text-center text-muted-foreground text-xs">
                {isFetchingNextPage
                  ? "Loading more..."
                  : hasNextPage
                  ? "Scroll to load more"
                  : "No more session"}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Terminate confirmation dialog */}
      <AlertDialog
        open={!!terminatingId}
        onOpenChange={(open) => !open && setTerminatingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately invalidate the session token. The user will
              be signed out on their next request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => terminatingId && handleTerminate(terminatingId)}
              disabled={terminate.isPending}
            >
              {terminate.isPending ? "Terminating…" : "Terminate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SessionMain;
