"use client";
import TaskForm from "./TaskForm";
import { useAddTask } from "../../../../../hooks/tasks/useAddTask";
import { useAppContext } from "../../../../../contexts/AppContext";
import { translations } from "../../../../../lib/translations";

export default function CreateTaskPage() {
  const { mutate, isPending } = useAddTask();
  const { language, isRTL } = useAppContext();
  const content = translations[language].dashboard.addTask;

  return (
    <div className="p-6 dark:bg-gray-900">
      <h1 className="text-2xl font-semibold mb-4 mx-auto text-center dark:text-white">
        {content.title || "Create New Task"}
      </h1>
      <TaskForm
        onSubmit={mutate}
        isPending={isPending}
        content={content}
        isRTL={isRTL}
      />
    </div>
  );
}
