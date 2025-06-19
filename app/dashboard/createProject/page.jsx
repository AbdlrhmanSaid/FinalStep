"use client";
import ProjectForm from "./ProjectForm";
import { useAddProject } from "../../../hooks/projects/useAddProject";
import { useAppContext } from "../../../contexts/AppContext";
import { translations } from "../../../lib/translations";

export default function CreateProjectPage() {
  const { mutate, isPending } = useAddProject();
  const { language, isRTL } = useAppContext();
  const content = translations[language].dashboard.addProject;

  return (
    <div className="p-6 dark:bg-gray-900">
      <h1 className="text-2xl font-semibold mb-4 mx-auto text-center dark:text-white">
        {content.title}
      </h1>
      <ProjectForm
        onSubmit={mutate}
        isPending={isPending}
        content={content}
        isRTL={isRTL}
      />
    </div>
  );
}
