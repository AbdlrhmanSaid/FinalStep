"use client";
import ProjectForm from "./ProjectForm";
import { useAddProject } from "@/hooks/projects/useAddProject";
import { useAppContext } from "@/contexts/AppContext";
import { translations } from "@/lib/translations";

export default function CreateProjectPage() {
  const { mutate: addProject, isPending } = useAddProject();
  const { language, isRTL } = useAppContext();
  const content = translations[language].dashboard.addProject;

  const onSubmit = (formData) => {
    return new Promise((resolve, reject) => {
      addProject(formData, {
        onSuccess: (createdProject) => {
          resolve(createdProject);
        },
        onError: (err) => reject(err),
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 transition-colors flex items-start justify-center">
      <div className="w-full max-w-2xl mt-4 md:mt-10">
        <ProjectForm
          onSubmit={onSubmit}
          isPending={isPending}
          content={content}
          isRTL={isRTL}
        />
      </div>
    </div>
  );
}
