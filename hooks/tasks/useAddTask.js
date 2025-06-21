"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const addTask = async (data) => {
  const res = await axios.post("/api/tasks", data);
  return res.data;
};

export const useAddTask = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks"]);

      options.onSuccess?.(data);
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
};
