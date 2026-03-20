import { useState } from "react";
import {
  ClipboardPlus,
  ChevronDown,
  Edit,
  Crown,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function ProjectDetailsSection({
  data,
  content,
  isRTL,
  dateLocale,
}) {
  const [detailsOpen, setDetailsOpen] = useState(true);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
      <button
        type="button"
        onClick={() => setDetailsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ClipboardPlus className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-gray-800 dark:text-white truncate">
            {isRTL ? "التفاصيل" : "Details"}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${detailsOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          detailsOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 md:p-6 space-y-6 border-t border-gray-100 dark:border-gray-700">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Edit className="w-5 h-5 text-gray-500" />
              {content.description}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              {data.description || content.noDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  {content.leaderName}:{" "}
                  <Link
                    href={`/dashboard/user/${data.leaderId?._id}`}
                    className="font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                  >
                    {data.leaderId?.name || "Unknown"}
                  </Link>
                </span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  {content.created}:{" "}
                  <strong className="text-gray-800 dark:text-white">
                    {format(new Date(data.createdAt), "PPP", {
                      locale: dateLocale,
                    })}
                  </strong>
                </span>
              </div>
            </div>

            {data.deadline && (
              <div
                className={`p-4 rounded-md ${
                  new Date(data.deadline) < new Date() &&
                  data.status !== "finished"
                    ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    : "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar
                    className={`w-5 h-5 ${
                      new Date(data.deadline) < new Date() &&
                      data.status !== "finished"
                        ? "text-red-500"
                        : "text-orange-500"
                    }`}
                  />
                  <span
                    className={
                      new Date(data.deadline) < new Date() &&
                      data.status !== "finished"
                        ? "text-red-700 dark:text-red-300"
                        : "text-orange-700 dark:text-orange-300"
                    }
                  >
                    {content.deadline}:{" "}
                    <strong>
                      {format(new Date(data.deadline), "PPP", {
                        locale: dateLocale,
                      })}
                    </strong>
                    {new Date(data.deadline) < new Date() &&
                      data.status !== "finished" && (
                        <span className="ml-2 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">
                          {content.deadlinePassed}
                        </span>
                      )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
