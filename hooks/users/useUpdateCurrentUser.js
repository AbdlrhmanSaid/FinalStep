import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      // Invalidate ALL user-related queries to ensure fresh data everywhere
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
