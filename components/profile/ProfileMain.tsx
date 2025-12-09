"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CheckCircle, Calendar, Key } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { useAuth } from "@/hooks/useUser";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import { DateTime } from "luxon";
import { useSignedImage } from "@/hooks/useSignedImage";

const ProfileMain = () => {
  const { user, isLoading, refetch } = useAuth();
  const { data: url } = useSignedImage(user?.avatar);

  if (isLoading) return <div>Loading Profile...</div>;
  if (!user) return <div>Could not load profile data.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-2 space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="flex flex-col items-center pt-6">
            <div className="relative mb-4">
              <Avatar className="w-28 h-28 border-4 border-primary/50 shadow-xl">
                <AvatarImage src={url || ""} />
                <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
                  {user.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {user.isActive && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <h2 className="text-xl font-semibold mb-1 text-center">
              {user.name}
            </h2>
            <p className="text-sm text-muted-foreground mb-3 text-center">
              {user.email}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <Badge variant="default" className="capitalize">
                Role: {user.role}
              </Badge>
              <Badge variant={user.isActive ? "secondary" : "destructive"}>
                Status: {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <Separator className="my-4 w-full" />

            <div className="w-full space-y-3 text-sm">
              <h3 className="text-md font-semibold text-foreground">
                Account Metadata
              </h3>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Key className="w-4 h-4" /> User ID:
                </span>
                <span className="font-mono text-xs">{user._id.slice(-8)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" /> Created At:
                </span>
                <span className="font-medium text-foreground">
                  {DateTime.fromISO(user.createdAt).toLocaleString(
                    DateTime.DATE_MED
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" /> Last Updated:
                </span>
                <span className="font-medium text-foreground">
                  {DateTime.fromISO(user.updatedAt).toRelative()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          <EditProfile user={{ ...user, avatar: url }} refetch={refetch} />

          <ChangePassword />
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileMain;
