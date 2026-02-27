import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useUpdateMemberTitle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, userId, title }) => {
      const res = await axios.put(
        `/api/projects/${projectId}/update-member-title`,
        {
          userId,
          title,
        },
      );
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(data.message || "Member title updated successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.error || "Failed to update member title",
      );
    },
  });
};
