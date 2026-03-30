import { Users, RefreshCw, Calendar, Target, Clock, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function ProjectHeader({
  data,
  content,
  isRTL,
  isFinished,
  handleRefresh,
  isRefetching,
}) {
  const router = useRouter();
  const tasks = data.tasks || [];
  const completedTasks = tasks.filter(t => t.status === 'completed' || t.status === 'finished').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="relative">
      {/* Back Button & Actions row */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
        >
          <div className="p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group-hover:border-gray-300 dark:group-hover:border-gray-600 shadow-sm">
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </div>
          {isRTL ? "العودة للمشاريع" : "Back to projects"}
        </button>

        <button
          onClick={handleRefresh}
          disabled={isRefetching}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all text-gray-700 dark:text-gray-200"
        >
          <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin text-blue-500" : ""}`} />
          {isRTL ? "تحديث البيانات" : "Sync Data"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
              data.public 
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20" 
                : "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-100 dark:border-gray-700"
            }`}>
              {data.public ? content.public : content.private}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isFinished
                ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20"
                : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20"
            }`}>
              {isFinished ? content.statusFinished : content.statusOpen}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight max-w-3xl">
            {data.title}
          </h1>
        </div>

        {/* Quick Stats Grid */}
        <div className="flex items-center gap-10 bg-white dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-500/5">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
              {isRTL ? "إجمالي المهام" : "Total Tasks"}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-gray-900 dark:text-white">{tasks.length}</span>
              <span className="text-xs text-gray-400 font-bold">{isRTL ? "مهمة" : "Task"}</span>
            </div>
          </div>

          <div className="w-[1px] h-10 bg-gray-100 dark:bg-gray-800" />

          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
              {isRTL ? "التقدم الحالي" : "Current Progress"}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-500">{progress}%</span>
              <div className="w-12 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-1000 ease-out" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
