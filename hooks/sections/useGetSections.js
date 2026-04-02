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
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
};

export const deleteSection = async (sectionId) => {
  const res = await axios.delete(`/api/sections/${sectionId}`);
  return res.data;
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
};

