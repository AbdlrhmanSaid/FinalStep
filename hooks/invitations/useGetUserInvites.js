import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetUserInvites = (email) => {
  return useQuery({
    queryKey: ["user-invites", email],
    queryFn: async () => {
      const res = await axios.get(`/api/invite/user/${email}`);
      return res.data;
    },
    enabled: !!email,
  });
};
