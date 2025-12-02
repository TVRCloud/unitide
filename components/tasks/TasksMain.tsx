"use client";

import { RoleGuard } from "../RoleGuard";
import TasksAdmin from "./TasksAdmin";
import TasksUser from "./TasksUser";

const TasksMain = () => {
  return (
    <>
      <RoleGuard roles={["lead", "member"]}>
        <TasksUser />
      </RoleGuard>
      <RoleGuard roles={["admin", "manager"]}>
        <TasksAdmin />
      </RoleGuard>
    </>
  );
};

export default TasksMain;
