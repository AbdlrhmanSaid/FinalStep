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
          onSuccess: async () => {
            try {
              const receivers =
                formData.inviteRequests?.map((i) => i.email).filter(Boolean) ||
                [];

              if (receivers.length > 0) {
                const response = await fetch("/api/send-invites", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    sender,
                    receivers,
                    projectName: formData.title,
                  }),
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.error || "Failed to send invites");
                }

                const result = await response.json();
                if (result.failed && result.failed.length > 0) {
                  console.warn("Some invites failed to send:", result.failed);
                }
              }
              resolve();
            } catch (err) {
              console.error("Error sending invites:", err);
              // You might want to show a toast notification here
              reject(err);
            }
          },
          onError: (err) => reject(err),
        }
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
}
