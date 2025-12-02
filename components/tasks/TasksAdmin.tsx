"use client";
import { useViewTaskStats } from "@/hooks/useTask";
import { Button } from "../ui/button";
import { HeaderSection } from "../ui/header-section";
import { useRouter } from "next/navigation";

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
    </div>
  );
};

export default TasksAdmin;
