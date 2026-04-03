import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function ProjectPageHeader({
  projectId,
  projectTitle,
  icon: Icon,
  iconBg = "bg-gray-800 dark:bg-gray-700",
  label,
  title,
  isRTL,
  action,
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4 mt-2">
        {/* Left: back + icon + breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="shrink-0 p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            aria-label={isRTL ? "رجوع" : "Back"}
          >
            {isRTL ? (
              <ArrowRight className="w-5 h-5" />
            ) : (
              <ArrowLeft className="w-5 h-5" />
            )}
          </Link>

          <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 shrink-0" />

          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div
                className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${iconBg}`}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="min-w-0">
              {label && (
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 leading-none">
                  {label}
                </p>
              )}
              <p className="text-sm font-black text-gray-900 dark:text-white leading-tight truncate max-w-[160px] md:max-w-xs">
                {projectTitle || title}
              </p>
              {projectTitle && title && (
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 truncate max-w-[160px] md:max-w-xs">
                  {title}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: action slot */}
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
