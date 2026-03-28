"use client";

import { AlertTriangle, FileQuestion } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { translations } from "@/lib/translations";

export default function ErrorState({ type = "general", customMessage, refreshAction }) {
  const context = useAppContext();
  const language = context?.language || "en";
  const isRTL = context?.isRTL || false;
  
  const t = translations[language]?.errors || translations.en.errors;
  const router = useRouter();

  let icon = <AlertTriangle className="w-12 h-12 text-red-500 flex-shrink-0" />;
  let title = t.general.title;
  let description = customMessage || t.general.description;
  let isNotFound = false;

  if (type === "notFound") {
    icon = <FileQuestion className="w-12 h-12 text-blue-500 flex-shrink-0" />;
    title = t.notFound.title;
    description = customMessage || t.notFound.description;
    isNotFound = true;
  } else if (type === "projectNotFound") {
    icon = <FileQuestion className="w-12 h-12 text-blue-500 flex-shrink-0" />;
    title = t.notFound.titleProject;
    description = customMessage || t.notFound.descriptionProject;
    isNotFound = true;
  } else if (type === "taskNotFound") {
    icon = <FileQuestion className="w-12 h-12 text-blue-500 flex-shrink-0" />;
    title = t.notFound.titleTask;
    description = customMessage || t.notFound.descriptionTask;
    isNotFound = true;
  }

  return (
    <div className={`min-h-[50vh] flex flex-col items-center justify-center py-16 px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className={`flex flex-col items-center max-w-md text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors`}>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100 dark:border-gray-800">
          {icon}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          {isNotFound ? (
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors inline-block w-full sm:w-auto"
            >
              {t.notFound.backToDashboard}
            </Link>
          ) : (
            <>
              {refreshAction && (
                <button
                  onClick={refreshAction}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
                >
                  {t.general.tryAgain}
                </button>
              )}
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium px-6 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
              >
                {t.notFound.backToDashboard}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
