import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useLeaveProject() {
  return useMutation({
    mutationFn: async ({ projectId, userId }) => {
      const response = await axios.put(`/api/projects/leave/${projectId}`, {
        userId,
      });
      return response.data;
    },
  });
}
