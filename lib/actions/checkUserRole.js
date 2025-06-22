"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetProject } from "../../hooks/projects/useGetProjects";
import { useAppContext } from "../../contexts/AppContext";
import Loading from "../../components/Loading";

export default function CheckUserRole({ children }) {
  const { id } = useParams();
  const { data: project, isLoading } = useGetProject(id);
  const { userId } = useAppContext();
  const router = useRouter();

  const [checkedRole, setCheckedRole] = useState(false);

  useEffect(() => {
    if (!isLoading && project && userId) {
      const isLeader = project.leaderId?._id === userId;
      const isCoLeader = project.coLeaders?.some((user) => user._id === userId);

      if (!isLeader && !isCoLeader) {
        router.push("/dashboard");
      } else {
        setCheckedRole(true);
      }
    }
  }, [isLoading, project, userId, router]);

  if (isLoading || !project || !checkedRole) return <Loading />;

  return <>{children}</>;
}
