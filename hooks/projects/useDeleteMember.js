import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, userId }) => {
      const res = await axios.put(
        `/api/projects/${projectId}/update-member-role`,
        {
          userId,
          action: "remove-member",
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["project"]);
    },
  });
};
