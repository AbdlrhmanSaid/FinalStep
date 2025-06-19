"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProjects = async () => {
  const res = await axios.get("/api/projects");
  return res.data;
};
const fetchProject = async (id) => {
  const res = await axios.get(`/api/projects/${id}`);
  return res.data;
};

export const useGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
};
export const useGetProject = (id) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id),
    enabled: !!id,
  });
};
