"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CollapsibleSidebarSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  isRTL = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm transition-all duration-300 ${className}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={`p-2 rounded-xl transition-colors ${isOpen ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}
          <h3
            className={`font-black text-lg transition-colors ${isOpen ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
          >
            {title}
          </h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-0" : "-rotate-90 rtl:rotate-90"}`}
        />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-6 pb-6 pt-2 border-t border-gray-50 dark:border-gray-700/50">
          {children}
        </div>
      </div>
    </div>
  );
}
