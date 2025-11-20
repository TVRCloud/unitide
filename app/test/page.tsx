"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Download,
  RefreshCw,
  Trash2,
  LogOut,
  Eye,
  MoreVertical,
  Activity,
  Calendar,
  Wifi,
  Settings,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// Mock session data
const sessions = [
  {
    _id: "690d1a1b2c3d4e5f6g7h8i9j",
    user: {
      _id: "69022b085eebc48c2fc312ef",
      name: "Amegh T S",
      email: "amegh2002@gmail.com",
      avatar: null,
    },
    jti: "jwt_abc123xyz789",
    ip: "192.168.1.100",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    isActive: true,
    loggedInAt: "2025-11-07T08:30:00.000Z",
    expiresAt: "2025-12-07T08:30:00.000Z",
    createdAt: "2025-11-07T08:30:00.000Z",
    updatedAt: "2025-11-07T08:30:00.000Z",
  },
  {
    _id: "690d1a1b2c3d4e5f6g7h8i9k",
    user: {
      _id: "69022b085eebc48c2fc312ef",
      name: "Amegh T S",
      email: "amegh2002@gmail.com",
      avatar: null,
    },
    jti: "jwt_def456uvw012",
    ip: "192.168.1.101",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    isActive: true,
    loggedInAt: "2025-11-06T14:20:00.000Z",
    expiresAt: "2025-12-06T14:20:00.000Z",
    createdAt: "2025-11-06T14:20:00.000Z",
    updatedAt: "2025-11-06T14:20:00.000Z",
  },
  {
    _id: "690d1a1b2c3d4e5f6g7h8i9l",
    user: {
      _id: "690c7b02d514d0141bcb5d9e",
      name: "Jithin Kumar",
      email: "jithin@gmail.com",
      avatar: null,
    },
    jti: "jwt_ghi789rst345",
    ip: "10.0.0.50",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    isActive: true,
    loggedInAt: "2025-11-07T10:15:00.000Z",
    expiresAt: "2025-12-07T10:15:00.000Z",
    createdAt: "2025-11-07T10:15:00.000Z",
    updatedAt: "2025-11-07T10:15:00.000Z",
  },
  {
    _id: "690d1a1b2c3d4e5f6g7h8i9m",
    user: {
      _id: "690c46954ff6e77ed5990b2f",
      name: "Admin User",
      email: "admin@company.com",
      avatar: null,
    },
    jti: "jwt_jkl012mno678",
    ip: "172.16.0.10",
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    isActive: false,
    loggedInAt: "2025-11-05T09:00:00.000Z",
    expiresAt: "2025-12-05T09:00:00.000Z",
    createdAt: "2025-11-05T09:00:00.000Z",
    updatedAt: "2025-11-06T18:30:00.000Z",
  },
  {
    _id: "690d1a1b2c3d4e5f6g7h8i9n",
    user: {
      _id: "690c7b02d514d0141bcb5d9e",
      name: "Jithin Kumar",
      email: "jithin@gmail.com",
      avatar: null,
    },
    jti: "jwt_pqr345stu901",
    ip: "192.168.1.105",
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    isActive: true,
    loggedInAt: "2025-11-06T16:45:00.000Z",
    expiresAt: "2025-12-06T16:45:00.000Z",
    createdAt: "2025-11-06T16:45:00.000Z",
    updatedAt: "2025-11-06T16:45:00.000Z",
  },
  {
    _id: "690d1a1b2c3d4e5f6g7h8i9o",
    user: {
      _id: "69022b085eebc48c2fc312ef",
      name: "Amegh T S",
      email: "amegh2002@gmail.com",
      avatar: null,
    },
    jti: "jwt_vwx678yza234",
    ip: "203.0.113.45",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
    isActive: false,
    loggedInAt: "2025-11-04T11:30:00.000Z",
    expiresAt: "2025-12-04T11:30:00.000Z",
    createdAt: "2025-11-04T11:30:00.000Z",
    updatedAt: "2025-11-05T15:20:00.000Z",
  },
];

const SessionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  // const [selectedSession, setSelectedSession] = useState(null); // Unused state

  const parseUserAgent = (ua: string) => {
    const isMobile = /Mobile|Android|iPhone/i.test(ua);
    const isTablet = /iPad|Tablet/i.test(ua);
    const isWindows = /Windows/i.test(ua);
    const isMac = /Macintosh|Mac OS X/i.test(ua);
    const isLinux = /Linux/i.test(ua);
    const isIOS = /iPhone|iPad/i.test(ua);

    let device = "Desktop";
    let deviceIcon = Monitor;
    let os = "Unknown";

    if (isMobile) {
      device = "Mobile";
      deviceIcon = Smartphone;
    } else if (isTablet) {
      device = "Tablet";
      deviceIcon = Tablet;
    }

    if (isWindows) os = "Windows";
    else if (isMac) os = "macOS";
    else if (isLinux) os = "Linux";
    else if (isIOS) os = "iOS";

    return { device, deviceIcon, os };
  };

  const getLocationFromIP = (ip: string) => {
    // Mock location based on IP range
    if (ip.startsWith("192.168") || ip.startsWith("10."))
      return "Local Network";
    if (ip.startsWith("172.16")) return "Private Network";
    if (ip.startsWith("203.")) return "Mumbai, India";
    return "Unknown Location";
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.ip.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && session.isActive) ||
      (statusFilter === "inactive" && !session.isActive);

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: sessions.length,
    active: sessions.filter((s) => s.isActive).length,
    inactive: sessions.filter((s) => !s.isActive).length,
  };

  const deviceBreakdown = {
    desktop: sessions.filter(
      (s) => parseUserAgent(s.userAgent).device === "Desktop"
    ).length,
    mobile: sessions.filter(
      (s) => parseUserAgent(s.userAgent).device === "Mobile"
    ).length,
    tablet: sessions.filter(
      (s) => parseUserAgent(s.userAgent).device === "Tablet"
    ).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-linear-to-r from-background via-primary/5 to-background">
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-linear-to-br from-primary/20 to-secondary/20">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Active Sessions</h1>
                <p className="text-muted-foreground">
                  Monitor and manage user authentication sessions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
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
                  <DropdownMenuLabel>Session Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Clock className="w-4 h-4 mr-2" />
                    Session Duration
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="w-4 h-4 mr-2" />
                    Security Rules
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Sessions
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Sessions",
              value: stats.total,
              icon: Activity,
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "Active",
              value: stats.active,
              icon: CheckCircle,
              color: "from-green-500 to-green-600",
            },
            {
              label: "Inactive",
              value: stats.inactive,
              icon: XCircle,
              color: "from-gray-500 to-gray-600",
            },
            {
              label: "Expiring Soon",
              value: "0",
              icon: AlertTriangle,
              color: "from-orange-500 to-orange-600",
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
                  className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-br ${stat.color} opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500`}
                />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Distribution</CardTitle>
              <CardDescription>Sessions by device type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Desktop",
                  value: deviceBreakdown.desktop,
                  icon: Monitor,
                  color: "from-blue-500 to-blue-600",
                },
                {
                  label: "Mobile",
                  value: deviceBreakdown.mobile,
                  icon: Smartphone,
                  color: "from-green-500 to-green-600",
                },
                {
                  label: "Tablet",
                  value: deviceBreakdown.tablet,
                  icon: Tablet,
                  color: "from-purple-500 to-purple-600",
                },
              ].map((device, idx) => (
                <motion.div
                  key={device.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-lg bg-linear-to-br ${device.color}`}
                      >
                        <device.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-sm">
                        {device.label}
                      </span>
                    </div>
                    <Badge variant="secondary">{device.value}</Badge>
                  </div>
                  <Progress
                    value={(device.value / stats.total) * 100}
                    className="h-2"
                  />
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Filter Sessions</CardTitle>
              <CardDescription>
                Search and filter active sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by user, email, or IP..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sessions</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(searchQuery || statusFilter !== "all") && (
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm text-muted-foreground">
                    Active filters:
                  </span>
                  {searchQuery && (
                    <Badge variant="secondary">
                      Search: {searchQuery}
                      <button
                        onClick={() => setSearchQuery("")}
                        className="ml-2"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {statusFilter !== "all" && (
                    <Badge variant="secondary">
                      Status: {statusFilter}
                      <button
                        onClick={() => setStatusFilter("all")}
                        className="ml-2"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Session Details</CardTitle>
                <CardDescription>
                  Showing {filteredSessions.length} of {sessions.length}{" "}
                  sessions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredSessions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      No sessions found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters or search query
                    </p>
                  </motion.div>
                ) : (
                  filteredSessions.map((session, idx) => {
                    const {
                      device,
                      deviceIcon: DeviceIcon,

                      os,
                    } = parseUserAgent(session.userAgent);
                    const location = getLocationFromIP(session.ip);

                    return (
                      <motion.div
                        key={session._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.02 }}
                        layout
                      >
                        <Dialog key={`dialog-${session._id}`}>
                          <div className="p-5 rounded-xl border bg-card hover:shadow-md transition-shadow group">
                            <div className="flex items-start gap-4">
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
                                          session.isActive
                                            ? "default"
                                            : "secondary"
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
                                          {device}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground"></span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground truncate">
                                          {location}
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
                                      <DropdownMenuLabel>
                                        Actions
                                      </DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DialogTrigger asChild>
                                        <DropdownMenuItem>
                                          <Eye className="w-4 h-4 mr-2" />
                                          View Details
                                        </DropdownMenuItem>
                                      </DialogTrigger>
                                      <DropdownMenuItem className="text-destructive">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Terminate Session
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                <Separator className="my-3" />

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      Logged in
                                    </span>
                                    <Separator
                                      orientation="vertical"
                                      className="h-4"
                                    />
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                    </span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {os}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Session Details
                              </DialogTitle>
                              <DialogDescription>
                                Complete information about this user session
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 mt-4">
                              <div>
                                <Label className="text-xs text-muted-foreground mb-3 block">
                                  User Information
                                </Label>
                                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                                  <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-linear-to-br from-primary to-secondary text-primary-foreground">
                                      {session.user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold">
                                      {session.user.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {session.user.email}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <Separator />

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Session ID
                                  </Label>
                                  <p className="text-sm font-mono mt-1 break-all">
                                    {session.jti}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Status
                                  </Label>
                                  <div className="mt-1">
                                    <Badge
                                      variant={
                                        session.isActive
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {session.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    IP Address
                                  </Label>
                                  <p className="text-sm font-mono mt-1">
                                    {session.ip}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Location
                                  </Label>
                                  <p className="text-sm mt-1">{location}</p>
                                </div>
                              </div>

                              <Separator />

                              <div>
                                <Label className="text-xs text-muted-foreground mb-3 block">
                                  Device Information
                                </Label>
                                <div className="grid grid-cols-3 gap-3">
                                  <div className="p-3 rounded-lg bg-muted text-center">
                                    <DeviceIcon className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Device
                                    </p>
                                    <p className="text-sm font-medium">
                                      {device}
                                    </p>
                                  </div>
                                  <div className="p-3 rounded-lg bg-muted text-center">
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Browser
                                    </p>
                                    <p className="text-sm font-medium"></p>
                                  </div>
                                  <div className="p-3 rounded-lg bg-muted text-center">
                                    <Globe className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground mb-1">
                                      OS
                                    </p>
                                    <p className="text-sm font-medium">{os}</p>
                                  </div>
                                </div>
                              </div>

                              <Separator />

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Logged In At
                                  </Label>
                                  <p className="text-sm mt-1">
                                    {new Date(
                                      session.loggedInAt
                                    ).toLocaleString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                    })}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Expires At
                                  </Label>
                                  <p className="text-sm mt-1">
                                    {new Date(session.expiresAt).toLocaleString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                      }
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Created At
                                  </Label>
                                  <p className="text-sm mt-1">
                                    {new Date(session.createdAt).toLocaleString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                      }
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Last Updated
                                  </Label>
                                  <p className="text-sm mt-1">
                                    {new Date(session.updatedAt).toLocaleString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>

                              <Separator />

                              <div>
                                <Label className="text-xs text-muted-foreground mb-2 block">
                                  User Agent String
                                </Label>
                                <div className="p-3 rounded-lg bg-muted">
                                  <p className="text-xs font-mono break-all text-muted-foreground">
                                    {session.userAgent}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <DialogFooter className="gap-2">
                              <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Export Session
                              </Button>
                              <Button variant="destructive">
                                <LogOut className="w-4 h-4 mr-2" />
                                Terminate Session
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Login Activity</CardTitle>
              <CardDescription>Latest authentication events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessions.slice(0, 5).map((session, idx) => {
                const { deviceIcon: DeviceIcon } = parseUserAgent(
                  session.userAgent
                );
                return (
                  <motion.div
                    key={session._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-linear-to-br from-primary to-secondary text-primary-foreground text-xs">
                        {session.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {session.user.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <DeviceIcon className="w-3 h-3" />
                      </div>
                    </div>
                    <Badge
                      variant={session.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {session.isActive ? "Active" : "Ended"}
                    </Badge>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
              <CardDescription>
                Best practices for session management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  title: "Monitor Active Sessions",
                  description:
                    "Regularly review active sessions for suspicious activity",
                  icon: Eye,
                  color: "from-blue-500 to-blue-600",
                },
                {
                  title: "Set Expiration Policy",
                  description: "Configure appropriate session timeout periods",
                  icon: Clock,
                  color: "from-green-500 to-green-600",
                },
                {
                  title: "Location Verification",
                  description: "Enable alerts for logins from new locations",
                  icon: MapPin,
                  color: "from-purple-500 to-purple-600",
                },
                {
                  title: "Terminate Suspicious Sessions",
                  description:
                    "Immediately end sessions from unrecognized devices",
                  icon: AlertTriangle,
                  color: "from-red-500 to-red-600",
                },
              ].map((tip, idx) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                >
                  <div
                    className={`p-2 rounded-lg bg-linear-to-br ${tip.color} shrink-0`}
                  >
                    <tip.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">{tip.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {tip.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SessionsPage;
