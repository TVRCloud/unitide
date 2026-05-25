import {
  createProject,
  deleteProject,
  fetchProjects,
  fetchSingleProject,
} from "@/lib/api-client";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";


export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-projects"] });
    },
  });
};

export const useInfiniteProjects = (search: string, status?: string) => {
  return useInfiniteQuery({
    queryKey: ["all-projects", search, status],
    queryFn: ({ pageParam = 0 }) =>
      fetchProjects({
        skip: pageParam,
        search,
        status,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 20 ? undefined : allPages.length * 20,
  });
};

export const useViewProject = (id: string) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchSingleProject(id),
  });
};

export const useDeleteProject = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-projects"] });
    },
  });
};
