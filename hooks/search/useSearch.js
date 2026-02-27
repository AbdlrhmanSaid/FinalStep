"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSearchResults = async (query) => {
  if (!query) return { users: [], projects: [] };
  const res = await axios.get(`/api/search?query=${encodeURIComponent(query)}`);
  return res.data;
};

export const useSearch = (query) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearchResults(query),
    enabled: !!query && query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
