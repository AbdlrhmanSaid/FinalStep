"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import ProjectEditForm from "../[id]/edit/ProjectEditForm";
import { useAppContext } from "@/contexts/AppContext";
import { translations } from "@/lib/translations";
import { useState } from "react";
export default function CreateProjectPage() {
  const router = useRouter();
  const { language, isRTL, userId } = useAppContext();
  const [isPending, setIsPending] = useState(false);

  const content = translations[language].dashboard.updateProject; // Using similar keys

  const onSubmit = async (formData) => {
    setIsPending(true);
    try {
      const response = await axios.post(
        "/api/projects",
        {
          ...formData,
          leaderId: userId,
        },
        {
          headers: { userId },
        },
      );
      return response.data;
    } catch (err) {
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 transition-colors flex items-start justify-center">
      <ProjectEditForm
        project={{}}
        onSubmit={onSubmit}
        isPending={isPending}
        isRTL={isRTL}
        content={{
          ...content,
          createProject: isRTL ? "إنشاء مشروع جديد" : "Create New Project",
        }}
      />
    </div>
  );
}
