import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useUpdateCurrentUser = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedData) => {
      const res = await axios.put("/api/users/me", updatedData, {
        headers: { userId },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user-profile", userId]);
    },
  });
};
