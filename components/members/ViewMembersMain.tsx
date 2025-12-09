"use client";

import { useViewUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Briefcase,
  CheckCircle,
  CheckSquare,
  ListTodo,
  Users,
  Link,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ProfileInformation from "./ProfileInfo";
import { useSignedImage } from "@/hooks/useSignedImage";

interface Team {
  _id: string;
  name: string;
  description: string;
}

const TeamItem = ({ team, index }: { team: Team; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 * index }}
    className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-card"
  >
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-semibold flex items-center gap-2">
        <Users className="w-4 h-4 text-primary" />
        {team.name}
      </h4>
      <Badge variant="secondary" className="text-xs">
        Team ID: {team._id.slice(-4)}
      </Badge>
    </div>
    <p className="text-sm text-muted-foreground mt-1">
      {team.description || "No description provided."}
    </p>
    <Button variant="link" size="sm" className="p-0 mt-2 h-auto text-xs">
      View Team <Link className="w-3 h-3 ml-1" />
    </Button>
  </motion.div>
);

interface Project {
  _id: string;
  name: string;
  description: string;
  createdBy: { name: string };
  teams: { name: string }[];
}

const ProjectItem = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 * index }}
    className="border rounded-lg p-4 bg-card shadow-sm"
  >
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-bold flex items-center gap-2 text-foreground">
        <Briefcase className="w-4 h-4 text-primary" />
        {project.name}
      </h4>
      <Badge variant="outline" className="text-xs">
        ID: {project._id.slice(-4)}
      </Badge>
    </div>
    <p className="text-sm text-muted-foreground mt-2">
      {project.description || "No description available."}
    </p>
    <div className="flex flex-wrap gap-2 mt-3 text-xs">
      <Badge variant="secondary">Creator: {project.createdBy.name}</Badge>
      <Badge variant="outline">
        Teams: {project.teams.map((t) => t.name).join(", ")}
      </Badge>
    </div>
    <Button variant="link" size="sm" className="p-0 mt-2 h-auto text-xs">
      View Project <Link className="w-3 h-3 ml-1" />
    </Button>
  </motion.div>
);

const ViewMembersMain = () => {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useViewUser(params.id);
  const { data: url } = useSignedImage(data?.avatar);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>User not found.</div>;

  return (
    <div className="flex flex-col gap-3">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-b pb-8 px-4 sm:px-6"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-background shadow-lg">
                <AvatarImage src={url || ""} />
                <AvatarFallback className="text-xl sm:text-2xl font-bold bg-linear-to-br from-primary to-secondary text-primary-foreground">
                  {data.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {data.isActive && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full border-4 border-background flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1 sm:mb-2">
                {data.name}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-3">
                {data.email}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="capitalize">
                  {data.role}
                </Badge>
                <Badge variant={data.isActive ? "default" : "destructive"}>
                  {data.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="px-4 sm:px-6 -mt-8 mb-2">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Teams", value: data.teams.length, icon: Users },
            { label: "Projects", value: data.projects.length, icon: Briefcase },
            { label: "Total Tasks", value: 0, icon: ListTodo },
            { label: "Completed", value: 0, icon: CheckSquare },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-2xl sm:text-3xl font-bold">
                      {stat.value ?? "-"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {stat.label ?? "-"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="pb-12 px-4 sm:px-6">
        <Tabs defaultValue="overview" className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TabsList className="flex flex-wrap justify-start gap-1 p-1 mb-4 h-auto border rounded-lg bg-muted/50">
              <TabsTrigger
                value="overview"
                className="flex-1 min-w-[100px] text-sm md:flex-auto"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="flex-1 min-w-[100px] text-sm md:flex-auto"
              >
                Projects ({data.projects.length})
              </TabsTrigger>
              <TabsTrigger
                value="teams"
                className="flex-1 min-w-[100px] text-sm md:flex-auto"
              >
                Teams ({data.teams.length})
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="flex-1 min-w-[100px] text-sm md:flex-auto"
              >
                Tasks
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="flex-1 min-w-[100px] text-sm md:flex-auto"
              >
                Activity
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="overview" className="space-y-6">
            <ProfileInformation data={data} />
          </TabsContent>

          <TabsContent value="projects">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                {data.projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.projects.map((project: Project, index: number) => (
                      <ProjectItem
                        key={project._id}
                        project={project}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground p-4 border rounded-md">
                    This user is not currently assigned to any projects.
                  </p>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="teams">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {data.teams.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {data.teams.map((team: Team, index: number) => (
                      <TeamItem key={team._id} team={team} index={index} />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground p-4 border rounded-md">
                  This user is not currently assigned to any teams.
                </p>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Tasks Overview</CardTitle>
              </CardHeader>
              <CardContent>
                Task listing and statistics will be displayed here...
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>User Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                Recent user activity and audit trails will be displayed here...
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ViewMembersMain;
