import {
  createTask,
  editTask,
  fetchSingleTask,
  fetchTasks,
  fetchTaskStats,
} from "@/lib/api-client";
import { TaskBasicDetails, TTask } from "@/types/task";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
    },
  });
};

export const useInfiniteTasks = (
  search: string,
  limit = 10,
  filters?: {
    status?: string;
    priority?: string;
    projectId?: string;
    teamId?: string;
    sortBy?: string;
    order?: "asc" | "desc";
  }
) => {
  return useInfiniteQuery({
    queryKey: ["all-tasks", search, limit, filters],
    queryFn: ({ pageParam = 0 }) =>
      fetchTasks({
        skip: pageParam,
        limit,
        search,
        ...filters,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < limit ? undefined : allPages.length * limit,
  });
};

export const useViewTask = (id: string) => {
  return useQuery<TTask>({
    queryKey: ["task", id],
    queryFn: () => fetchSingleTask(id),
  });
};

export const useEditTask = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedData: TaskBasicDetails) => editTask(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });
};

export const useViewTaskStats = () => {
  return useQuery({
    queryKey: ["task-stats"],
    queryFn: () => fetchTaskStats(),
  });
};
