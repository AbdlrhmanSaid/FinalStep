"use client";
import ProjectForm from "./ProjectForm";
import { useAddProject } from "@/hooks/projects/useAddProject";
import { useAppContext } from "@/contexts/AppContext";
import { translations } from "@/lib/translations";
import toast from "react-hot-toast";

export default function CreateProjectPage() {
  const { mutate: addProject, isPending } = useAddProject();
  const { language, isRTL, email: sender } = useAppContext();
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
    <div className="p-6 bgMain min-h-screen h-full">
      <h1 className="text-2xl font-semibold mb-4 mx-auto text-center dark:text-white">
        {content.title}
      </h1>
      <ProjectForm
        onSubmit={onSubmit}
        isPending={isPending}
        content={content}
        isRTL={isRTL}
      />
    </div>
  );
}
