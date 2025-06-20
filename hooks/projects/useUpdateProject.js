import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const updateProject = async ({ id, data, userId }) => {
  const res = await axios.put(`/api/projects/${id}`, data, {
    headers: {
      userId,
    },
  });
  return res.data;
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
    onError: (error) => {
      console.error("Failed to update project:", error);
    },
  });
};
