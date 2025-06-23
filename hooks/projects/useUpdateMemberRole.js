import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, userId, action }) => {
      const res = await axios.put(
        `/api/projects/${projectId}/update-member-role`,
        {
          userId,
          action,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["project"]);
    },
  });
};
