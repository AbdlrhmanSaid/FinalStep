import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, status, userId }) => {
      if (!["open", "finished"].includes(status)) {
        throw new Error("Invalid status value");
      }

      const res = await axios.put(
        `/api/projects/${projectId}`,
        { status },
        {
          headers: {
            userId: userId,
          },
        },
      );

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });
};
