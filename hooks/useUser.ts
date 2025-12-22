import {
  changePassword,
  createUser,
  editProfile,
  editUser,
  fetchSingleUser,
  fetchUsers,
} from "@/lib/api-client";
import { TUpdateUserSchema } from "@/schemas/user";
import { useUserStore } from "@/store/useUserStore";
import { apiClient } from "@/utils/axios";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export function useAuth() {
  const { user, setUser } = useUserStore();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["me"],
    enabled: !user,
    // retry: false,
    queryFn: async () => {
      const res = await apiClient.get("/api/me");
      setUser(res.data);
      return res.data;
    },
  });

  return { user: user ?? data, isLoading, isError, error, refetch };
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
