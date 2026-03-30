import {
  CheckCircle2,
  Users,
  User,
  Clock,
  Layout,
  Calendar,
  AlertCircle,
  Activity,
  ArrowUpRight,
  MoreVertical,
  CheckSquare,
} from "lucide-react";
import { format, isBefore, isToday, differenceInDays } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export default function ProjectCard({
  project,
  content,
  isRTL,
  className = "",
  viewMode = "grid",
}) {
  const status = project.status || (project.public ? "active" : "pending");
  const dateLocale = isRTL ? ar : enUS;

  // ─── Theme Colors based on ID ──────────────────────────────────────────────
  const getProjectTheme = (id) => {
    const themes = [
      { bg: "from-blue-500 to-indigo-600", light: "bg-blue-50 dark:bg-blue-900/20", color: "text-blue-600 dark:text-blue-400" },
      { bg: "from-emerald-500 to-teal-600", light: "bg-emerald-50 dark:bg-emerald-900/20", color: "text-emerald-600 dark:text-emerald-400" },
      { bg: "from-purple-500 to-violet-600", light: "bg-purple-50 dark:bg-purple-900/20", color: "text-purple-600 dark:text-purple-400" },
      { bg: "from-rose-500 to-pink-600", light: "bg-rose-50 dark:bg-rose-900/20", color: "text-rose-600 dark:text-rose-400" },
      { bg: "from-amber-500 to-orange-600", light: "bg-amber-50 dark:bg-amber-900/20", color: "text-amber-600 dark:text-amber-400" },
    ];
    return themes[parseInt(id?.slice(-1), 16) % themes.length] || themes[0];
  };

  const theme = getProjectTheme(project._id);

  // ─── Stats ─────────────────────────────────────────────────────────────────
  const tasks = project.tasks || [];
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Deduplicate members to avoid duplicate key errors
  const allMembers = [project.leaderId, ...(project.coLeaders || []), ...(project.members || [])].filter(Boolean);
  const members = Array.from(new Map(allMembers.map(m => [m._id?.toString(), m])).values());

  // ─── Dates ─────────────────────────────────────────────────────────────────
  const deadlineDate = project.deadline ? new Date(project.deadline) : null;
  const isOverdue = deadlineDate && isBefore(deadlineDate, new Date()) && !isToday(deadlineDate) && status !== "finished";
  const fmtDate = (d) => d ? format(d, "MMM d", { locale: dateLocale }) : null;

  // ─── STATUS COMPONENT ──────────────────────────────────────────────────────
  const StatusDot = ({ status }) => {
    const config = {
      active: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]",
      finished: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]",
      pending: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
    };
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config[status] || config.pending}`} />
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {status === 'active' ? (isRTL ? "نشط" : "Active") : 
           status === 'finished' ? (isRTL ? "مكتمل" : "Done") : 
           (isRTL ? "خاص" : "Private")}
        </span>
      </div>
    );
  };

  // ─── LIST VIEW ─────────────────────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <div className={`group relative bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-xl hover:shadow-gray-500/5 transition-all duration-300 ${className}`}>
        <div className="flex items-center gap-6">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.bg} flex items-center justify-center text-white shadow-lg shadow-gray-500/10`}>
            <Layout className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
              {project.title}
            </h3>
            <div className="flex items-center gap-4 mt-1">
              <StatusDot status={status} />
              <span className="text-xs text-gray-400 font-medium">
                {isRTL ? "المهام" : "Tasks"}: {completedTasks}/{totalTasks}
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <div className="flex -space-x-2 rtl:space-x-reverse h-6">
              {members.slice(0, 3).map((m, i) => (
                <div key={m._id || i} className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center overflow-hidden">
                  {m.image ? <img src={m.image} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] font-bold text-gray-400">{m.name?.charAt(0)}</span>}
                </div>
              ))}
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isOverdue ? 'bg-red-50 text-red-600' : 'bg-gray-50 dark:bg-gray-800 text-gray-500'}`}>
              <Calendar className="w-3 h-3" />
              <span className="text-[10px] font-bold">{deadlineDate ? fmtDate(deadlineDate) : "—"}</span>
            </div>
          </div>

          <div className="p-2 text-gray-300 group-hover:text-blue-500 transition-colors">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  }

  // ─── GRID VIEW ─────────────────────────────────────────────────────────────
  return (
    <div className={`group relative bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-2xl hover:shadow-gray-500/10 transition-all duration-500 ${className} overflow-hidden`}>
      {/* Accent Background */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${theme.bg} opacity-[0.03] rounded-full blur-3xl group-hover:opacity-10 transition-opacity`} />
      
      {/* Header identity stripe */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.bg} opacity-20 group-hover:opacity-100 transition-opacity`} />

      <div className="flex justify-between items-start mb-6 pt-2">
        <div className={`p-2.5 rounded-2xl ${theme.light} ${theme.color} transition-colors`}>
          <Layout className="w-6 h-6" />
        </div>
        <div className="flex flex-col items-end gap-2">
           <StatusDot status={status} />
           {isOverdue && (
             <span className="flex items-center gap-1 text-[9px] font-black uppercase text-red-500 bg-red-50 px-2 py-0.5 rounded-full animate-bounce">
               <AlertCircle className="w-3 h-3" />
               {isRTL ? "انتهى الوقت" : "Overdue"}
             </span>
           )}
        </div>
      </div>

      <div className="mb-6 h-20">
        <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {project.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {project.description || (isRTL ? "لا يوجد وصف حالياً." : "No description provided.")}
        </p>
      </div>

      {/* Progress & Stats */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gray-400">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">{isRTL ? "الإنجاز" : "Progress"}</span>
          </div>
          <span className="text-[11px] font-black text-gray-900 dark:text-white">{progress}%</span>
        </div>
        
        {/* Segmented Progress bar */}
        <div className="flex gap-1 h-1.5 w-full">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 rounded-full transition-all duration-700 delay-[${i*100}ms] ${
                progress >= (i + 1) * 20 
                  ? (progress === 100 ? 'bg-green-500' : 'bg-blue-600') 
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-gray-50 dark:border-gray-800">
        {/* Compact Team */}
        <div className="flex -space-x-2 rtl:space-x-reverse">
          {members.slice(0, 4).map((m, i) => (
            <div key={m._id || i} className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
              {m.image ? <img src={m.image} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] font-bold text-gray-400">{m.name?.charAt(0)}</span>}
            </div>
          ))}
          {members.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-gray-50 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[9px] font-black text-gray-400">
              +{members.length - 4}
            </div>
          )}
        </div>

        {/* Date / Action */}
        <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-tight">
          <Calendar className="w-3 h-3" />
          {deadlineDate ? fmtDate(deadlineDate) : "—"}
        </div>
      </div>

      {/* Floating Action Hint */}
      <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <div className={`p-2 rounded-xl bg-gradient-to-br ${theme.bg} text-white shadow-lg shadow-gray-500/20`}>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
