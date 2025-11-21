import {
  createProject,
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

export const useInfiniteProjects = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["all-projects", search],
    queryFn: ({ pageParam = 0 }) =>
      fetchProjects({
        skip: pageParam,
        search,
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
