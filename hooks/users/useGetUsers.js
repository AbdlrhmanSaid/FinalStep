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

// Fetches a user profile — passes viewerId so API can show all projects to owner
const fetchUserProfile = async (id, viewerId) => {
  const res = await axios.get(`/api/users/${id}`, {
    headers: viewerId ? { "x-viewer-id": viewerId } : {},
  });
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

export const useGetUserById = (id, viewerId) => {
  return useQuery({
    queryKey: ["userProfile", id, viewerId],
    queryFn: () => fetchUserProfile(id, viewerId),
    enabled: !!id,
  });
};
