"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import ProjectEditForm from "../[id]/edit/ProjectEditForm";
import { useAppContext } from "@/contexts/AppContext";
import { translations } from "@/lib/translations";
import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 transition-colors flex flex-col items-center justify-start gap-6">
      {/* AI Assistant Banner */}
      <div className="w-full max-w-4xl bg-linear-to-r from-violet-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            {isRTL ? "أنشئ مشروعك بذكاء مع Steppi" : "Create Project Smartly with Steppi"}
          </h3>
          <p className="text-sm text-indigo-100">
            {isRTL
              ? "وفر وقتك! دع المساعد الذكي يسألك بعض الأسئلة ويبني لك المشروع والأقسام والمهام تلقائياً."
              : "Save time! Let the AI assistant ask you a few questions and build your project, sections, and tasks automatically."}
          </p>
        </div>
        <Link
          href="/dashboard/projects/create/ai"
          className="shrink-0 bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {isRTL ? "الإنشاء بالذكاء الاصطناعي" : "Create with AI"}
        </Link>
      </div>

      <div className="w-full flex items-start justify-center">
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
    </div>
  );
}
