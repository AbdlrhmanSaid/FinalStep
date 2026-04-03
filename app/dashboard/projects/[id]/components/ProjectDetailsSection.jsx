import {
  ClipboardPlus,
  Crown,
  Calendar,
  Info,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function ProjectDetailsSection({
  data,
  content,
  isRTL,
  dateLocale,
  isWrapped = false,
}) {
  const isOverdue = data.deadline && new Date(data.deadline) < new Date() && data.status !== "finished";

  const Content = (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-2">
          {isRTL ? "عن المشروع" : "Description"}
        </span>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/50">
          {data.description || (isRTL ? "لا يوجد وصف لهذا المشروع." : "No description provided.")}
        </p>
      </div>

      {/* Metadatas */}
      <div className="grid grid-cols-1 gap-4">
        {/* Leader */}
        <div className="group flex items-center justify-between p-3 rounded-2xl border border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 hover:border-blue-500/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <Crown className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-tighter text-gray-400 font-bold">{content.leaderName}</span>
              <span className="text-xs font-bold text-gray-900 dark:text-white">{data.leaderId?.name || "Unknown"}</span>
            </div>
          </div>
          <Link href={`/dashboard/user/${data.leaderId?._id}`} className="p-1.5 rounded-lg text-gray-300 hover:text-blue-500 hover:bg-white dark:hover:bg-gray-700 transition-all">
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Created at */}
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-50 dark:border-gray-800">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-tighter text-gray-400 font-bold">{content.created}</span>
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              {format(new Date(data.createdAt), "d MMMM yyyy", { locale: dateLocale })}
            </span>
          </div>
        </div>

        {/* Deadline */}
        {data.deadline && (
          <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
            isOverdue 
              ? "bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/50" 
              : "bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/50"
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isOverdue ? "bg-rose-100 dark:bg-rose-900/30" : "bg-orange-100 dark:bg-orange-900/30"
            }`}>
              <Calendar className={`w-4 h-4 ${isOverdue ? "text-rose-600" : "text-orange-600"}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-[9px] uppercase tracking-tighter font-bold ${
                isOverdue ? "text-rose-400" : "text-orange-400"
              }`}>
                {content.deadline}
              </span>
              <span className={`text-xs font-bold ${
                isOverdue ? "text-rose-700 dark:text-rose-400" : "text-orange-700 dark:text-orange-400"
              }`}>
                {format(new Date(data.deadline), "d MMMM yyyy", { locale: dateLocale })}
                {isOverdue && (
                  <span className="ml-2 bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                    {content.deadlinePassed}
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isWrapped) return Content;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="font-black text-gray-900 dark:text-white text-lg">
          {isRTL ? "معلومات المشروع" : "Project Info"}
        </h3>
      </div>
      {Content}
    </div>
  );
}
