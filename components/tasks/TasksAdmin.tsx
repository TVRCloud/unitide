"use client";
import { useViewTaskStats } from "@/hooks/useTask";
import { Button } from "../ui/button";
import { HeaderSection } from "../ui/header-section";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { StatsCard } from "../ui/stats-card";
import { AlertTriangle, CheckCircle2, ListTodo } from "lucide-react";
import { Play } from "next/font/google";

const TasksAdmin = () => {
  const router = useRouter();
  const { data, isLoading } = useViewTaskStats();

  if (isLoading) {
    return <div>Loading Task Data...</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <HeaderSection
        title="Tasks"
        subtitle="Overview of all tasks and team performance"
        actions={
          <div>
            <Button
              variant="secondary"
              onClick={() => {
                router.push("/tasks/all");
              }}
            >
              View all
            </Button>
          </div>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          title={"Total Tasks"}
          value={data?.totalTasks}
          icon={ListTodo}
          index={0}
        />

        {/* {[
          { l: "Total Tasks", v: 196, i: ListTodo },
          { l: "In Progress", v: 32, i: Play },
          { l: "Completed", v: 89, i: CheckCircle2 },
          { l: "Blocked", v: 12, i: AlertTriangle },
        ].map((s, i) => (
         
        ))} */}
      </motion.div>
    </div>
  );
};

export default TasksAdmin;
