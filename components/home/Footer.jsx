import { GraduationCap } from "lucide-react";

export default function Footer({ t, isRTL }) {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 py-8 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              FinalStep
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 rtl:space-x-reverse text-sm text-gray-600 dark:text-gray-300">
            <span className="text-center md:text-left">
              © {new Date().getFullYear()} FinalStep. {t.rights}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
