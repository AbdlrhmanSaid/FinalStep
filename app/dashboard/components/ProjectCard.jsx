import {
  CheckCircle,
  Users,
  User,
  Flag,
  Clock,
  GanttChartSquare,
  Calendar,
  AlertCircle,
  CheckSquare,
} from "lucide-react";
import { format, isBefore, isToday, differenceInDays } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export default function ProjectCard({
  project,
  content,
  isRTL,
  members,
  className = "",
  viewMode = "grid",
}) {
  const status = project.status || (project.public ? "active" : "pending");
  const dateLocale = isRTL ? ar : enUS;

  // ─── Status helpers ────────────────────────────────────────────────────────
  const getStatusColor = (s) => {
    switch (s) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200";
      case "completed":
      case "finished":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200";
    }
  };

  const getStatusIcon = (s) => {
    switch (s) {
      case "active":
        return <CheckCircle className="w-3.5 h-3.5" />;
      case "completed":
      case "finished":
        return <CheckSquare className="w-3.5 h-3.5" />;
      case "pending":
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const getStatusLabel = (s) => {
    const labels = content?.projectCard?.status;
    if (labels?.[s]) return labels[s];
    if (s === "finished") return isRTL ? "منتهي" : "Finished";
    return s;
  };

  // ─── Progress ──────────────────────────────────────────────────────────────
  const calculateProgress = () => {
    if (!project.tasks || !Array.isArray(project.tasks)) return 0;
    const done = project.tasks.filter((t) => t.status === "completed").length;
    return project.tasks.length > 0
      ? Math.round((done / project.tasks.length) * 100)
      : 0;
  };

  const progress = project.progress ?? calculateProgress();

  // ─── Dates ─────────────────────────────────────────────────────────────────
  const createdDate = project.createdAt ? new Date(project.createdAt) : null;
  const deadlineDate = project.deadline ? new Date(project.deadline) : null;

  const isOverdue =
    deadlineDate &&
    isBefore(deadlineDate, new Date()) &&
    !isToday(deadlineDate) &&
    status !== "finished" &&
    status !== "completed";

  const daysLeft = deadlineDate
    ? differenceInDays(deadlineDate, new Date())
    : null;

  const fmtDate = (d) =>
    d ? format(d, "d MMM yyyy", { locale: dateLocale }) : null;

  // ─── Sub-components ────────────────────────────────────────────────────────
  const DeadlineBadge = () => {
    if (!deadlineDate) return null;

    let bgClass, textClass, icon, label;

    if (isOverdue) {
      bgClass = "bg-red-100 dark:bg-red-900/40";
      textClass = "text-red-700 dark:text-red-300";
      icon = <AlertCircle className="w-3.5 h-3.5 shrink-0" />;
      label = isRTL
        ? `متأخر • ${fmtDate(deadlineDate)}`
        : `Overdue • ${fmtDate(deadlineDate)}`;
    } else if (daysLeft !== null && daysLeft <= 3) {
      bgClass = "bg-orange-100 dark:bg-orange-900/30";
      textClass = "text-orange-700 dark:text-orange-300";
      icon = <Clock className="w-3.5 h-3.5 shrink-0 animate-pulse" />;
      label = isRTL
        ? `${daysLeft === 0 ? "اليوم" : `${daysLeft} أيام`} • ${fmtDate(deadlineDate)}`
        : `${daysLeft === 0 ? "Today" : `${daysLeft}d left`} • ${fmtDate(deadlineDate)}`;
    } else {
      bgClass = "bg-slate-100 dark:bg-slate-700/50";
      textClass = "text-slate-600 dark:text-slate-300";
      icon = <Calendar className="w-3.5 h-3.5 shrink-0" />;
      label = fmtDate(deadlineDate);
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${bgClass} ${textClass}`}
      >
        {icon}
        {label}
      </span>
    );
  };

  // ─── LIST VIEW ─────────────────────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <div
        className={`w-full p-4 rounded-xl transition-colors duration-200 ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/60 p-3 rounded-xl flex-shrink-0">
            <GanttChartSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Title + Status */}
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                {project.title}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${getStatusColor(status)}`}
              >
                {getStatusIcon(status)}
                {getStatusLabel(status)}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1 mb-2">
              {project.description || content.projectCard.noDescription}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>
                  {members} {content.projectCard.members}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>
                  {project.tasks ?? 0} {content.projectCard.tasks}
                </span>
              </div>
              {project.leader && (
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>{project.leader}</span>
                </div>
              )}
              {createdDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{fmtDate(createdDate)}</span>
                </div>
              )}
              {deadlineDate && <DeadlineBadge />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── GRID VIEW ─────────────────────────────────────────────────────────────
  return (
    <div
      className={`flex flex-col p-5 rounded-2xl transition-all duration-300 ${className} ${
        isOverdue ? "border-red-300 dark:border-red-700" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="bg-blue-100 dark:bg-blue-900/60 p-3 rounded-xl">
          <GanttChartSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(status)}`}
        >
          {getStatusIcon(status)}
          {getStatusLabel(status)}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
          {project.title}
        </h3>

        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 flex-1">
          {project.description || content.projectCard.noDescription}
        </p>

        {/* Deadline badge */}
        {deadlineDate && (
          <div className="mt-1">
            <DeadlineBadge />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
        {/* Stats row */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {members}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              {project.tasks ?? 0}
            </span>
          </div>

          {/* Created date */}
          {createdDate && (
            <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
              <Calendar className="w-3 h-3" />
              {fmtDate(createdDate)}
            </span>
          )}
        </div>

        {/* Leader */}
        {project.leader && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{project.leader}</span>
          </div>
        )}

        {/* Progress bar */}
        {progress > 0 && (
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{isRTL ? "التقدم" : "Progress"}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progress >= 100
                    ? "bg-green-500"
                    : progress >= 60
                      ? "bg-blue-500"
                      : "bg-orange-400"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
