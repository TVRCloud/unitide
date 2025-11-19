"use client";
import { useViewAlert } from "@/hooks/useNotifications";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Bell, Users, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ViewNotificationMain = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = useViewAlert(params.id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          />
          <p className="text-muted-foreground">Loading notification...</p>
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Bell className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Notification Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The notification you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAudienceDisplay = () => {
    if (data.audienceType === "ALL") {
      return "All Users";
    } else if (data.roles && data.roles.length > 0) {
      return `Roles: ${data.roles.join(", ")}`;
    } else if (data.users && data.users.length > 0) {
      return `${data.users.length} Specific User(s)`;
    }
    return "Unknown";
  };

  const getTypeVariant = () => {
    switch (data.type) {
      case "BROADCAST":
        return "default";
      case "ALERT":
        return "destructive";
      case "INFO":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div>
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge
                      variant={getTypeVariant()}
                      className="text-xs font-semibold"
                    >
                      {data.type}
                    </Badge>
                    {data.read && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className="flex items-center gap-1 text-secondary text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Read</span>
                      </motion.div>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{data.title}</CardTitle>
                </div>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <div
                    className={`p-3 rounded-full ${
                      data.read ? "bg-muted" : "bg-primary/10"
                    }`}
                  >
                    <Bell
                      className={`w-6 h-6 ${
                        data.read ? "text-muted-foreground" : "text-primary"
                      }`}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(data.createdAt)}</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>{getAudienceDisplay()}</span>
                </motion.div>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Message
                </h3>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {data.body}
                </p>
              </motion.div>
            </CardContent>

            <Separator />

            <CardFooter className="bg-muted/30 flex-col items-start gap-4 pt-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Details
              </h3>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm w-full"
              >
                <div className="space-y-1">
                  <span className="text-muted-foreground">Notification ID</span>
                  <p className="text-foreground font-mono text-xs break-all bg-background/50 p-2 rounded-md">
                    {data._id}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Last Updated</span>
                  <p className="text-foreground">
                    {formatDate(data.updatedAt)}
                  </p>
                </div>
                {data.readInfo && data.readInfo.length > 0 && (
                  <div className="md:col-span-2 space-y-1">
                    <span className="text-muted-foreground">Read By</span>
                    <p className="text-foreground">
                      {data.readInfo.length} user(s)
                    </p>
                  </div>
                )}
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewNotificationMain;
