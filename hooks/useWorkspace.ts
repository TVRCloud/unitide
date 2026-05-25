import { deleteTaskTag, fetchTaskTags, fetchTimelogs, fetchWorkspace, renameTaskTag, updateWorkspace } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTaskTags = () =>
  useQuery<{ tag: string; count: number }[]>({
    queryKey: ["task-tags"],
    queryFn: fetchTaskTags,
  });

export const useRenameTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ from, to }: { from: string; to: string }) =>
      renameTaskTag(from, to),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["task-tags"] }),
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tag: string) => deleteTaskTag(tag),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["task-tags"] }),
  });
};

export const useTimelogs = (
  dateFrom?: string,
  dateTo?: string,
  userId?: string
) =>
  useQuery({
    queryKey: ["timelogs", dateFrom, dateTo, userId],
    queryFn: () => fetchTimelogs({ dateFrom, dateTo, userId }),
  });

export const useWorkspace = () =>
  useQuery({
    queryKey: ["workspace"],
    queryFn: fetchWorkspace,
  });

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateWorkspace,
    onSuccess: (data) => {
      queryClient.setQueryData(["workspace"], data);
    },
  });
};
