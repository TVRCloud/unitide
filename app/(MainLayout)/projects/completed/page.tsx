import FilteredProjectsMain from "@/components/projects/FilteredProjectsMain";
import LayoutWrap from "@/components/layout-wrap";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Completed Projects",
  description: "View all completed projects",
};

const CompletedProjects = () => {
  return (
    <LayoutWrap>
      <FilteredProjectsMain status="completed" />
    </LayoutWrap>
  );
};

export default CompletedProjects;
