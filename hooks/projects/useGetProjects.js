"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProjects = async () => {
  const res = await axios.get("/api/projects");
  return res.data;
};

const useGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
};

export default useGetProjects;
