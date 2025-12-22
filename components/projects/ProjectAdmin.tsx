/* eslint-disable @typescript-eslint/no-explicit-any */
import { Project } from "@/types/project";

type Props = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isLoading?: boolean;
  filteredProjects: Project[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  ref: any;
};

const ProjectAdmin = ({
  searchTerm,
  setSearchTerm,
  isLoading,
  filteredProjects,
  isFetchingNextPage,
  hasNextPage,
  ref,
}: Props) => {
  return <div>ProjectAdmin</div>;
};

export default ProjectAdmin;
