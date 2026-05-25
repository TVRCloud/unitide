import FilteredProjectsMain from "@/components/projects/FilteredProjectsMain";
import LayoutWrap from "@/components/layout-wrap";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Active Projects",
  description: "View all active projects",
};

const ActiveProjects = () => {
  return (
    <LayoutWrap>
      <FilteredProjectsMain status="active" />
    </LayoutWrap>
  );
};

export default ActiveProjects;
