"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUsers = async () => {
  const res = await axios.get("/api/users");
  return res.data;
};
const fetchUser = async (id) => {
  const res = await axios.get(`/api/users/${id}`);
  return res.data;
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};
export const useGetUser = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
};
