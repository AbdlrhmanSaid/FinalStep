"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const addProject = async (data) => {
  const res = await axios.post("/api/projects/add", data);
  return res.data;
};

export const useAddProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
};
