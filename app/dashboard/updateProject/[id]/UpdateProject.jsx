"use client";

import { useParams, redirect } from "next/navigation";
import { useUpdateProject } from "../../../../hooks/projects/useUpdateProject";
import ProjectEditForm from "./ProjectEditForm";
import Loading from "../../../../components/Loading";
import CheckUserRole from "../../../../lib/actions/checkUserRole";
import { useAppContext } from "../../../../contexts/AppContext";
import { useGetProject } from "../../../../hooks/projects/useGetProjects";
import { translations } from "../../../../lib/translations";

export default function UpdateProjectPage() {
  const { id } = useParams();
  const { data: project, isLoading, error } = useGetProject(id);
  const { userId, language, isRTL, email: sender } = useAppContext();
  const { mutate: updateProject, isPending } = useUpdateProject();

  const content = translations[language].dashboard.updateProject;

  const onSubmit = (formData) => {
    return new Promise((resolve, reject) => {
      updateProject(
        { id, data: formData, userId },
        {
          onSuccess: resolve,
          onError: reject,
        },
      );
    });
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  if (!project) return null;

  if (project.status === "finished") {
    redirect("/dashboard/projects");
  }

  return (
    <CheckUserRole>
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 transition-colors flex items-start justify-center">
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
}
