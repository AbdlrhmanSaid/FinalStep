"use client";

import { useParams, redirect } from "next/navigation"; // 👈 أضف redirect هنا
import { useUpdateProject } from "../../../../hooks/projects/useUpdateProject";
import ProjectEditForm from "./ProjectEditForm";
import Loading from "../../../../components/Loading";
import CheckUserRole from "../../../../lib/actions/checkUserRole";
import { useAppContext } from "../../../../contexts/AppContext";
import { useGetProject } from "../../../../hooks/projects/useGetProjects";
import { translations } from "../../../../lib/translations";

const updateProjectPage = () => {
  const { id } = useParams();
  const { data: project, isLoading, error } = useGetProject(id);
  const { userId, language, isRTL } = useAppContext();
  const { mutate: updateProject, isPending } = useUpdateProject();

  const content = translations[language].dashboard.updateProject;

  const onSubmit = (formData) => {
    return new Promise((resolve, reject) => {
      updateProject(
        { id, data: formData, userId },
        {
          onSuccess: () => resolve(),
          onError: (err) => reject(err),
        }
      );
    });
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  if (!project) return null;

  if (project.status === "finished") {
    redirect("/dashboard/project");
  }

  return (
    <CheckUserRole>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white p-6 transition-colors duration-200">
        <ProjectEditForm
          project={project}
          onSubmit={onSubmit}
          isPending={isPending}
          isRTL={isRTL}
          content={content}
        />
      </div>
    </CheckUserRole>
  );
};

export default updateProjectPage;
