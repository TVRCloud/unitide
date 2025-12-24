import { createEvent, fetchEvents } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// export const useGetEvents = () => {
//   return useQuery({
//     queryKey: ["events"],
//     queryFn: () => fetchEvents({ skip: 0, search: "" }),
//   });
// };

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
