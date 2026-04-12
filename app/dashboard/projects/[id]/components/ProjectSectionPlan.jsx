"use client";

import { useProjectTodos } from "@/hooks/projects/useProjectTodos";
import { LayoutGrid, ClipboardList, CheckCircle2, Clock, AlertCircle, Flag, Zap, Users } from "lucide-react";
import Loading from "@/components/Loading";

const STATUS_CFG = {
  todo:  { label: { ar: "قادم", en: "Future" },  color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800" },
  doing: { label: { ar: "نشط", en: "In Progress" }, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
  done:  { label: { ar: "مكتمل", en: "Completed" }, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
};

const TYPES = {
  target:    { label: { ar: "هدف",    en: "Target" },    bg: "bg-blue-50 dark:bg-blue-900/40",    color: "text-blue-600",   icon: Zap },
  task:      { label: { ar: "مهمة",   en: "Task" },      bg: "bg-violet-50 dark:bg-violet-900/40",  color: "text-violet-600", icon: ClipboardList },
  milestone: { label: { ar: "مرحلة",  en: "Milestone" }, bg: "bg-amber-50 dark:bg-amber-900/40",   color: "text-amber-600",  icon: Flag },
  meeting:   { label: { ar: "اجتماع", en: "Meeting" },   bg: "bg-rose-50 dark:bg-rose-900/40",    color: "text-rose-600",   icon: Users },
};

export default function ProjectSectionPlan({ projectId, sections, userId, isRTL, isLeader, hasSections }) {
  const { data: todos = [], isLoading } = useProjectTodos(projectId);

  // Determine sections to show
  let mySections = [];
  let sectionTodos = [];

  if (hasSections !== false) {
    mySections = isLeader 
      ? (sections || []) 
      : (sections?.filter(s => 
          s.members?.some(m => (m._id || m).toString() === userId?.toString())
        ) || []);
    const mySectionIds = mySections.map(s => s._id.toString());
    sectionTodos = todos.filter(t => t.sectionId && mySectionIds.includes(t.sectionId.toString()));
  } else {
    // Project has no sections, mock one for the entire project
    mySections = [{ _id: 'project_plan', title: isRTL ? "المشروع بأكمله" : "The Entire Project" }];
    sectionTodos = todos;
  }

  if (isLoading) return <div className="p-10 flex justify-center"><Loading /></div>;

  if (mySections.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-12 rounded-[40px] border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center justify-center gap-4">
        <div className="p-6 bg-rose-50 dark:bg-rose-900/30 rounded-[30px]">
          <AlertCircle className="w-12 h-12 text-rose-500" />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white">
            {isRTL ? "لست منضماً لأي قسم" : "Not Joined to Any Section"}
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
            {isRTL 
              ? "يجب أن تكون عضواً في قسم واحد على الأقل لرؤية خطة العمل الخاصة بك." 
              : "You must be a member of at least one section to see your work plan."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {mySections.map(section => {
        const myTodos = hasSections === false 
          ? sectionTodos 
          : sectionTodos.filter(t => t.sectionId.toString() === section._id.toString());
        
        const doneCount = myTodos.filter(t => t.status === "done").length;
        const total = myTodos.length;
        const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

        return (
          <div key={section._id} className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="p-6 bg-linear-to-r from-violet-600/5 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 dark:border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <LayoutGrid className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    {isRTL ? `خطة قسم: ${section.title}` : `${section.title} Plan`}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[10px] font-black uppercase tracking-widest text-violet-600 dark:text-violet-400">
                        {total} {isRTL ? "مهمة مخططة" : "Planned Targets"}
                     </span>
                     <span className="w-1 h-1 rounded-full bg-gray-300" />
                     <span className="text-[10px] font-bold text-gray-400">
                        {pct}% {isRTL ? "إنجاز" : "Progress"}
                     </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="w-32 h-2 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-600 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                 </div>
                 <span className="text-xs font-black text-violet-600">{pct}%</span>
              </div>
            </div>

            <div className="p-6">
              {myTodos.length === 0 ? (
                <div className="py-10 text-center">
                  <ClipboardList className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-400">
                    {isRTL ? "لا توجد أهداف مجدولة لهذا القسم بعد." : "No scheduled targets for this section yet."}
                  </p>
                </div>
              ) : (
                <div className="relative space-y-4">
                  {/* Timeline vertical line */}
                  <div className="absolute top-2 bottom-2 inset-s-[11px] w-0.5 bg-gray-50 dark:bg-gray-700/50" />
                  
                  {myTodos.map((todo) => {
                    const cfg = STATUS_CFG[todo.status] || STATUS_CFG.todo;
                    const typeCfg = TYPES[todo.type || "target"] || TYPES.target;
                    const TypeIcon = typeCfg.icon;

                    return (
                      <div key={todo._id} className="relative flex items-start gap-4 ps-8 group">
                         <div className={`absolute inset-s-0 top-1.5 w-6 h-6 rounded-lg ${cfg.bg} border-2 border-white dark:border-gray-800 flex items-center justify-center transition-transform group-hover:scale-110 z-10`}>
                            {todo.status === "done" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className={`w-3.5 h-3.5 ${cfg.color}`} />}
                         </div>
                         
                         <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between gap-4 group">
                               <div className="flex flex-col">
                                 <p className={`text-sm font-black transition-colors ${todo.status === "done" ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
                                    {todo.text}
                                 </p>
                                 <div className="flex items-center gap-1.5 mt-1">
                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[8px] font-black uppercase border border-current/10 ${typeCfg.bg} ${typeCfg.color}`}>
                                       <TypeIcon className="w-2 h-2" />
                                       {isRTL ? typeCfg.label.ar : typeCfg.label.en}
                                    </span>
                                 </div>
                               </div>
                               <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${cfg.bg} ${cfg.color} shrink-0`}>
                                  {isRTL ? cfg.label.ar : cfg.label.en}
                                </span>
                            </div>
                         </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
