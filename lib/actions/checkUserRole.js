"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetProject } from "../../hooks/projects/useGetProjects";
import { useAppContext } from "../../contexts/AppContext";
import Loading from "../../components/Loading";

export default function CheckUserRole({ children, projectId: propProjectId }) {
  const params = useParams();
  const router = useRouter();
  const { userId } = useAppContext();

  const projectId = propProjectId || params.id;
  const { data: project, isLoading } = useGetProject(projectId);

  const [checkedRole, setCheckedRole] = useState(false);

  useEffect(() => {
    if (!isLoading && project && userId) {
      const isLeader = project.leaderId?._id === userId;
      const isCoLeader = project.coLeaders?.some((u) => u._id === userId);

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
