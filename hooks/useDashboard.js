import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchDashboardData = async () => {
  const res = await axios.get("/api/dashboard");
  return res.data;
};

export const useDashboard = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  };
};
