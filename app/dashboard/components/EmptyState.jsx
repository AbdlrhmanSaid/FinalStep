import { FolderOpen } from "lucide-react";

export default function EmptyState({ content, isRTL }) {
  return (
    <div className={`text-center py-12 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
        <FolderOpen className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h3
        className={`text-lg font-medium text-gray-900 dark:text-white mb-2 ${
          isRTL ? "rtl:text-right" : ""
        }`}
      >
        {content.emptyState.title}
      </h3>
      <p
        className={`text-gray-600 dark:text-gray-300 mb-6 ${
          isRTL ? "rtl:text-right" : ""
        }`}
      >
        {content.emptyState.description}
      </p>
      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
        {content.emptyState.action}
      </button>
    </div>
  );
}
