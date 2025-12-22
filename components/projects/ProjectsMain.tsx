"use client";

import ProjectUser from "./ProjectUser";
import ProjectAdmin from "./ProjectAdmin";
import { RoleGuard } from "../RoleGuard";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteProjects } from "@/hooks/useProjects";
import { Project } from "@/types/project";

const ProjectsMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteProjects(searchTerm);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredProjects: Project[] = data?.pages.flat() || [];

  return (
    <>
      <RoleGuard roles={["lead", "member"]}>
        <ProjectUser
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isLoading={isLoading}
          filteredProjects={filteredProjects}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          ref={ref}
        />
      </RoleGuard>
      <RoleGuard roles={["admin", "manager"]}>
        <ProjectAdmin
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isLoading={isLoading}
          filteredProjects={filteredProjects}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          ref={ref}
        />
      </RoleGuard>
    </>
  );
};

export default ProjectsMain;
