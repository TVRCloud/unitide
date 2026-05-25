import { useSession } from "next-auth/react";
import {
  changePassword,
  createUser,
  editProfile,
  editUser,
  fetchPreferences,
  fetchSingleUser,
  fetchUsers,
  TUserPreferences,
  updatePreferences,
} from "@/lib/api-client";
import { TUpdateUserSchema } from "@/schemas/user";
import { apiClient } from "@/utils/axios";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export function useAuth() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isSessionLoading = status === "loading";

  const { data, isLoading: queryLoading, isError, error, refetch } = useQuery({
    queryKey: ["me"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await apiClient.get("/api/me");
      return res.data;
    },
  });

  const isLoading = isSessionLoading || (isAuthenticated && queryLoading);

  return { user: data ?? null, isLoading, isError, error, refetch };
}

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

export const useInfiniteUsers = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["all-users", search],
    queryFn: ({ pageParam = 0 }) =>
      fetchUsers({
        skip: pageParam,
        search,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 20 ? undefined : allPages.length * 20,
  });
};

export const useViewUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchSingleUser(id),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
  });
};

export const useEditUser = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedData: TUpdateUserSchema) => editUser(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });
};

export const usePreferences = () => {
  return useQuery<TUserPreferences>({
    queryKey: ["preferences"],
    queryFn: fetchPreferences,
  });
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePreferences,
    onSuccess: (data) => {
      queryClient.setQueryData(["preferences"], data);
    },
  });
};
