import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export const useGetTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/tasks");
        return res.data;
      } catch (error) {
        toast.error("Failed to fetch tasks");
        throw error;
      }
    },
  });
};

export const useGetTask = (id) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/tasks/${id}`);
        return res.data;
      } catch (error) {
        toast.error("Failed to fetch task details");
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData) => {
      try {
        const res = await axios.post("/api/tasks", taskData);
        return res.data;
      } catch (error) {
        toast.error("Failed to create task");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, data, userId }) => {
      try {
        const headers = userId ? { userId } : {};
        const res = await axios.put(`/api/tasks/${taskId}`, data, { headers });
        return res.data;
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to update task");
        throw error;
      }
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries(["task", taskId]);
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axios.delete(`/api/tasks/${id}`);
        toast.success("Task deleted successfully");
        return res.data;
      } catch (error) {
        toast.error("Failed to delete task");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};
