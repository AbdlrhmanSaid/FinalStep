"use client";

import { useProjectTodos } from "@/hooks/projects/useProjectTodos";
import { useGetSections } from "@/hooks/sections/useGetSections";
import Link from "next/link";
import { ClipboardList, CheckCircle2, Clock, Zap, ArrowRight, ArrowLeft, LayoutGrid } from "lucide-react";

const STATUS_CFG = {
  todo:  { label: { ar: "مستقبلي", en: "To Do" },  dot: "bg-slate-400",   bar: "bg-slate-300 dark:bg-slate-700" },
  doing: { label: { ar: "نشط",     en: "Active" },  dot: "bg-amber-400",   bar: "bg-amber-400" },
  done:  { label: { ar: "مكتمل",   en: "Done" },    dot: "bg-emerald-500", bar: "bg-emerald-500" },
};

export default function ProjectRoadmapWidget({ projectId, isRTL, isWrapped = false }) {
  const { data: todos = [], isLoading: loadingTodos } = useProjectTodos(projectId);
  const { data: sections = [], isLoading: loadingSections } = useGetSections(projectId);

  if (loadingTodos || loadingSections || (todos.length === 0)) return null;

  const total     = todos.length;
  const doneCount = todos.filter(t => t.status === "done").length;
  const pct       = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const activeCount = todos.filter(t => t.status === "doing").length;

  const Content = (
    <>
      {/* Progress bar */}
      <div className={`${isWrapped ? '' : 'px-5 pb-3'}`}>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex gap-0.5">
          {doneCount  > 0 && <div className="bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${(doneCount / total) * 100}%` }} />}
          {activeCount > 0 && <div className="bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${(activeCount / total) * 100}%` }} />}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          {Object.entries(STATUS_CFG).map(([k, cfg]) => {
            const count = todos.filter(t => t.status === k).length;
            if (count === 0) return null;
            return (
              <div key={k} className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                  {count} {isRTL ? cfg.label.ar : cfg.label.en}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent items — show up to 4 */}
      <div className={`${isWrapped ? 'mt-4 pt-4' : 'border-t'} border-gray-50 dark:border-gray-700/50 divide-y divide-gray-50 dark:divide-gray-700/30`}>
        {todos.slice(0, 4).map(todo => {
          const cfg = STATUS_CFG[todo.status] || STATUS_CFG.todo;
          return (
            <div key={todo._id} className={`flex items-center gap-3 py-2.5 ${isWrapped ? '' : 'px-5'}`}>
              <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold truncate ${
                  todo.status === "done"
                    ? "line-through text-gray-300 dark:text-gray-600"
                    : "text-gray-700 dark:text-gray-200"
                }`}>
                  {todo.text}
                </p>
                {todo.sectionId && (
                  <div className="flex items-center gap-1 mt-0.5 opacity-60">
                    <LayoutGrid className="w-2.5 h-2.5 text-violet-500" />
                    <span className="text-[9px] font-bold text-violet-600 dark:text-violet-400 truncate">
                      {sections.find(s => (s._id || s) === todo.sectionId)?.title || "..."}
                    </span>
                  </div>
                )}
              </div>
              <span className={`shrink-0 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                todo.status === "done"  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                todo.status === "doing" ? "bg-amber-50  text-amber-600  dark:bg-amber-900/30  dark:text-amber-400"  :
                                          "bg-gray-100  text-gray-400   dark:bg-gray-700       dark:text-gray-500"
              }`}>
                {isRTL ? cfg.label.ar : cfg.label.en}
              </span>
            </div>
          );
        })}
        {todos.length > 4 && (
          <div className="py-2 text-center">
            <Link href={`/dashboard/projects/${projectId}/todos`} className="text-[11px] font-bold text-gray-400 hover:text-teal-500 transition-colors">
              +{todos.length - 4} {isRTL ? "عناصر أخرى" : "more items"}
            </Link>
          </div>
        )}
      </div>
      {isWrapped && (
         <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/50">
            <Link
                href={`/dashboard/projects/${projectId}/todos`}
                className="flex items-center justify-between text-[11px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest hover:underline"
            >
                {isRTL ? "عرض خطة العمل كاملة" : "View Full Roadmap"}
                {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
         </div>
      )}
    </>
  );

  if (isWrapped) return Content;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-linear-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm">
            <ClipboardList className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 leading-none">
              {isRTL ? "خطة العمل" : "Roadmap"}
            </p>
            <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">
              {pct}% {isRTL ? "مكتمل" : "complete"}
            </p>
          </div>
        </div>
        <Link
          href={`/dashboard/projects/${projectId}/todos`}
          className="flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline"
        >
          {isRTL ? "عرض الكل" : "View all"}
          {isRTL ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
        </Link>
      </div>
      {Content}
    </div>
  );
}
