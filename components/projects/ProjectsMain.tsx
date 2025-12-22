"use client";

import ProjectUser from "./ProjectUser";
import ProjectAdmin from "./ProjectAdmin";
import { RoleGuard } from "../RoleGuard";

const ProjectsMain = () => {
  return (
    <>
      <RoleGuard roles={["lead", "member"]}>
        <ProjectUser />
      </RoleGuard>
      <RoleGuard roles={["admin", "manager"]}>
        <ProjectAdmin />
      </RoleGuard>
    </>
  );
};

export default ProjectsMain;
