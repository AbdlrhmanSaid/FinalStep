import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useJoinProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, userId, invite }) => {
      const response = await axios.post(
        `/api/projects/${projectId}/join`,
        { invite },
        { headers: { userId } },
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["project", variables.projectId]);
      toast.success("Join request sent successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to send join request");
    },
  });
};

export const useRespondJoinProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, joinId, action, userId }) => {
      const response = await axios.put(
        `/api/projects/${projectId}/join/${joinId}`,
        {
          action,
        },
        { headers: { userId } },
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["project", variables.projectId]);
      toast.success(`Join request ${variables.action}ed successfully`);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || "Failed to process join request",
      );
    },
  });
};
