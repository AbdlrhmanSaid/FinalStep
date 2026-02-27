"use client";

import { useAppContext } from "../contexts/AppContext";
import { translations } from "../lib/translations";
import { Loader2 } from "lucide-react";

export default function Loading() {
  const { language, isDark } = useAppContext();
  const content = translations[language]?.loading || "Loading...";
  const isRTL = language === "ar";
  const subtitle =
    translations[language]?.loadingSubtitle || "Preparing your experience...";

  return (
    <div
      className={`min-h-[calc(100vh-200px)] w-full flex flex-col items-center justify-center rounded-xl my-4 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Simple spinning loader */}
        <Loader2
          className={`w-12 h-12 animate-spin ${isDark ? "text-blue-400" : "text-blue-600"}`}
        />

        {/* Clean text */}
        <div className="text-center space-y-2">
          <h2
            className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}
          >
            {content}
          </h2>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
