import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get("/api/tasks");
      return res.data;
    },
  });
};

export const useGetTask = (id) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const res = await axios.get(`/api/tasks/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData) => {
      const res = await axios.post("/api/tasks", taskData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axios.put(`/api/tasks/${id}`, data);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["task", id]);
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`/api/tasks/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};
