"use client";

import { Loader } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import { translations } from "../lib/translations";

export default function Loading() {
  const { language } = useAppContext();
  const content = translations[language].loading;

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <Loader className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
          {content}...
        </p>
      </div>
    </div>
  );
}
