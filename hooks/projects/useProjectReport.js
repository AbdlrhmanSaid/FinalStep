import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useProjectReport = (projectId) => {
  return useQuery({
    queryKey: ["project-report", projectId],
    queryFn: async () => {
      const res = await axios.get(`/api/projects/${projectId}/report`);
      return res.data;
    },
    enabled: !!projectId,
  });
};
