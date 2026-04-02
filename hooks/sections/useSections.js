import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const getSections = async (projectId) => {
  if (!projectId) return [];
  const res = await axios.get(`/api/sections?projectId=${projectId}`);
  return res.data;
};

export const updateSection = async ({ sectionId, data }) => {
  const res = await axios.put(`/api/sections/${sectionId}`, data);
  return res.data;
};

export const useGetSections = (projectId) => {
  return useQuery({
    queryKey: ["sections", projectId],
    queryFn: () => getSections(projectId),
    enabled: !!projectId,
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSection,
    onSuccess: (_, variables) => {
      // We don't have projectId perfectly here without passing it, but typically we want to invalidate sections.
      // Easiest is to invalidate all "sections" queries, or pass projectId down in variables.
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
};
