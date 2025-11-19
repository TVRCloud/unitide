// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import { useParams, useRouter } from "next/navigation";
// import { useViewAlert } from "@/hooks/useNotifications";
// import {
//   Bell,
//   ArrowLeft,
//   Radio,
//   ListTodo,
//   Briefcase,
//   Users,
//   AlertCircle,
//   Shield,
//   MessageSquare,
//   User,
//   Activity,
//   Clock,
//   Calendar,
//   Check,
//   CheckCircle,
//   Eye,
//   Trash2,
//   Share2,
//   Bookmark,
//   MoreVertical,
//   Loader2,
//   AlertTriangle,
// } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// const ViewNotificationMain = () => {
//   const params = useParams<{ id: string }>();
//   const router = useRouter();
//   const { data, isLoading } = useViewAlert(params.id);

//   const getNotificationIcon = (type: string) => {
//     const icons = {
//       BROADCAST: Radio,
//       TASK: ListTodo,
//       PROJECT: Briefcase,
//       TEAM: Users,
//       DEADLINE: AlertCircle,
//       SECURITY: Shield,
//       COMMENT: MessageSquare,
//       USER: User,
//       ACTIVITY: Activity,
//     };
//     return icons[type] || Bell;
//   };

//   const getNotificationColor = (type: string) => {
//     const colors = {
//       BROADCAST: "from-purple-500 to-purple-600",
//       TASK: "from-blue-500 to-blue-600",
//       PROJECT: "from-green-500 to-green-600",
//       TEAM: "from-orange-500 to-orange-600",
//       DEADLINE: "from-red-500 to-red-600",
//       SECURITY: "from-yellow-500 to-yellow-600",
//       COMMENT: "from-pink-500 to-pink-600",
//       USER: "from-cyan-500 to-cyan-600",
//       ACTIVITY: "from-indigo-500 to-indigo-600",
//     };
//     return colors[type] || "from-slate-500 to-slate-600";
//   };

//   const getAudienceBadge = (audienceType: string) => {
//     const badges = {
//       ALL: { label: "Everyone", variant: "default" as const },
//       ROLE: { label: "Role-based", variant: "secondary" as const },
//       SPECIFIC: { label: "Direct", variant: "outline" as const },
//     };
//     return (
//       badges[audienceType] || {
//         label: audienceType,
//         variant: "outline" as const,
//       }
//     );
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     });
//   };

//   const formatRelativeTime = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 1) return "Just now";
//     if (diffMins < 60) return `${diffMins} min ago`;
//     if (diffHours < 24)
//       return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
//     if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

//     return formatDate(dateString);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
//           <p className="text-muted-foreground">Loading notification...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
//           <p className="text-lg font-medium mb-2">Notification not found</p>
//           <p className="text-sm text-muted-foreground mb-4">
//             The notification you're looking for doesn't exist or has been
//             deleted.
//           </p>
//           <Button onClick={() => router.push("/notifications")}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Notifications
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const NotificationIcon = getNotificationIcon(data.type);
//   const audienceBadge = getAudienceBadge(data.audienceType);

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="border-b bg-gradient-to-r from-background via-primary/5 to-background">
//         <div className="max-w-5xl mx-auto px-6 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => router.push("/notifications")}
//               >
//                 <ArrowLeft className="w-4 h-4" />
//               </Button>
//               <div>
//                 <h1 className="text-2xl font-bold">Notification Details</h1>
//                 <p className="text-sm text-muted-foreground">
//                   {formatRelativeTime(data.createdAt)}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <Button variant="outline" size="sm">
//                 <Share2 className="w-4 h-4 mr-2" />
//                 Share
//               </Button>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" size="icon">
//                     <MoreVertical className="w-4 h-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem>
//                     <Bookmark className="w-4 h-4 mr-2" />
//                     Bookmark
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Eye className="w-4 h-4 mr-2" />
//                     Mark as {data.read ? "Unread" : "Read"}
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem className="text-destructive">
//                     <Trash2 className="w-4 h-4 mr-2" />
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
//         {/* Status Alert */}
//         {data.read && data.readInfo && data.readInfo.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             <Alert>
//               <CheckCircle className="h-4 w-4" />
//               <AlertTitle>You've read this notification</AlertTitle>
//               <AlertDescription>
//                 Read on {formatDate(data.readInfo[0].readAt)}
//               </AlertDescription>
//             </Alert>
//           </motion.div>
//         )}

//         {/* Main Content Card */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//         >
//           <Card className="overflow-hidden">
//             {/* Header Section */}
//             <div className="relative">
//               <div
//                 className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${getNotificationColor(
//                   data.type
//                 )} opacity-10`}
//               />
//               <CardHeader className="relative pb-8">
//                 <div className="flex items-start gap-4">
//                   <div
//                     className={`p-4 rounded-2xl bg-gradient-to-br ${getNotificationColor(
//                       data.type
//                     )} flex-shrink-0 shadow-lg`}
//                   >
//                     <NotificationIcon className="w-8 h-8 text-white" />
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between gap-4 mb-3">
//                       <div>
//                         <CardTitle className="text-2xl mb-2">
//                           {data.title}
//                         </CardTitle>
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <Badge
//                             variant={audienceBadge.variant}
//                             className="text-xs"
//                           >
//                             {audienceBadge.label}
//                           </Badge>
//                           <Badge
//                             variant="outline"
//                             className="text-xs capitalize"
//                           >
//                             {data.type.toLowerCase()}
//                           </Badge>
//                           {data.read && (
//                             <Badge variant="secondary" className="text-xs">
//                               <Check className="w-3 h-3 mr-1" />
//                               Read
//                             </Badge>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardHeader>
//             </div>

//             <Separator />

//             {/* Body Content */}
//             <CardContent className="pt-6">
//               <div className="space-y-6">
//                 {/* Message Body */}
//                 <div>
//                   <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
//                     Message
//                   </h3>
//                   <div className="prose prose-sm max-w-none">
//                     <p className="text-base leading-relaxed whitespace-pre-wrap">
//                       {data.body}
//                     </p>
//                   </div>
//                 </div>

//                 <Separator />

//                 {/* Metadata Grid */}
//                 <div>
//                   <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
//                     Details
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-4">
//                       <div className="flex items-start gap-3">
//                         <div className="p-2 rounded-lg bg-muted">
//                           <Bell className="w-4 h-4 text-muted-foreground" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-muted-foreground mb-1">
//                             Notification Type
//                           </p>
//                           <p className="text-sm font-medium capitalize">
//                             {data.type.toLowerCase()}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-3">
//                         <div className="p-2 rounded-lg bg-muted">
//                           <Users className="w-4 h-4 text-muted-foreground" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-muted-foreground mb-1">
//                             Audience Type
//                           </p>
//                           <p className="text-sm font-medium">
//                             {audienceBadge.label}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-3">
//                         <div className="p-2 rounded-lg bg-muted">
//                           <Calendar className="w-4 h-4 text-muted-foreground" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-muted-foreground mb-1">
//                             Created At
//                           </p>
//                           <p className="text-sm font-medium">
//                             {formatDate(data.createdAt)}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <div className="flex items-start gap-3">
//                         <div className="p-2 rounded-lg bg-muted">
//                           <Clock className="w-4 h-4 text-muted-foreground" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-muted-foreground mb-1">
//                             Last Updated
//                           </p>
//                           <p className="text-sm font-medium">
//                             {formatDate(data.updatedAt)}
//                           </p>
//                         </div>
//                       </div>

//                       {data.readInfo && data.readInfo.length > 0 && (
//                         <div className="flex items-start gap-3">
//                           <div className="p-2 rounded-lg bg-muted">
//                             <Eye className="w-4 h-4 text-muted-foreground" />
//                           </div>
//                           <div>
//                             <p className="text-xs text-muted-foreground mb-1">
//                               Read At
//                             </p>
//                             <p className="text-sm font-medium">
//                               {formatDate(data.readInfo[0].readAt)}
//                             </p>
//                           </div>
//                         </div>
//                       )}

//                       <div className="flex items-start gap-3">
//                         <div className="p-2 rounded-lg bg-muted">
//                           <Shield className="w-4 h-4 text-muted-foreground" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-muted-foreground mb-1">
//                             Notification ID
//                           </p>
//                           <p className="text-xs font-mono break-all">
//                             {data._id}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Roles & Users Info */}
//                 {(data.roles.length > 0 || data.users.length > 0) && (
//                   <>
//                     <Separator />
//                     <div>
//                       <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
//                         Target Audience
//                       </h3>
//                       <div className="space-y-4">
//                         {data.roles.length > 0 && (
//                           <div>
//                             <p className="text-xs text-muted-foreground mb-2">
//                               Roles
//                             </p>
//                             <div className="flex flex-wrap gap-2">
//                               {data.roles.map((role, idx) => (
//                                 <Badge
//                                   key={idx}
//                                   variant="secondary"
//                                   className="capitalize"
//                                 >
//                                   {role}
//                                 </Badge>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                         {data.users.length > 0 && (
//                           <div>
//                             <p className="text-xs text-muted-foreground mb-2">
//                               Specific Users ({data.users.length})
//                             </p>
//                             <div className="flex flex-wrap gap-2">
//                               {data.users.map((userId, idx) => (
//                                 <Badge
//                                   key={idx}
//                                   variant="outline"
//                                   className="font-mono text-xs"
//                                 >
//                                   {userId}
//                                 </Badge>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Read Info Card */}
//         {data.readInfo && data.readInfo.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//           >
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Read Information</CardTitle>
//                 <CardDescription>
//                   Details about when this notification was read
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {data.readInfo.map((info, idx) => (
//                     <div
//                       key={info._id}
//                       className="p-4 rounded-lg border bg-card"
//                     >
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <p className="text-xs text-muted-foreground mb-1">
//                             User ID
//                           </p>
//                           <p className="text-sm font-mono">{info.userId}</p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-muted-foreground mb-1">
//                             Read At
//                           </p>
//                           <p className="text-sm">{formatDate(info.readAt)}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         )}

//         {/* Actions Footer */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="flex items-center justify-between pt-4"
//         >
//           <Button
//             variant="outline"
//             onClick={() => router.push("/notifications")}
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to All Notifications
//           </Button>
//           <div className="flex items-center gap-2">
//             <Button variant="outline">
//               <Share2 className="w-4 h-4 mr-2" />
//               Share
//             </Button>
//             <Button variant="destructive">
//               <Trash2 className="w-4 h-4 mr-2" />
//               Delete
//             </Button>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default ViewNotificationMain;

import React from "react";

const Test3 = () => {
  return <div>Test3</div>;
};

export default Test3;
