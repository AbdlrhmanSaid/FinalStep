"use client";

import { GraduationCap, Code } from "lucide-react";
import Link from "next/link";
import { useAppContext } from "../../../contexts/AppContext";

export default function DashboardFooter() {
  const { isRTL } = useAppContext();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg shadow-sm">
              <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-bold text-gray-800 dark:text-gray-100 tracking-tight">
              FinalStep
            </span>
          </div>

          <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 gap-1.5 group">
            <span className="group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
              {isRTL ? "تم التطوير بواسطة" : "Developed by"}
            </span>
            <Link
              href="https://asportfolio-mu.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 dark:text-gray-100 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {"<AS/>"}
            </Link>
          </div>

          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            © {year} FinalStep.{" "}
            {isRTL ? "جميع الحقوق محفوظة" : "All rights reserved."}
          </div>
        </div>
      </div>
    </footer>
  );
}
