"use client";
import { useAppContext } from "@/contexts/AppContext";
import {
  Briefcase,
  CheckCircle2,
  Mail,
  ListChecks,
  X,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  LayoutGrid,
  ChevronRight,
  Users,
} from "lucide-react";
import { translations } from "@/lib/translations";
import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useSession } from "next-auth/react";

const getStatusName = (status, isRTL) => {
  const map = {
    pending: isRTL ? "قيد الانتظار" : "Pending",
    inProgress: isRTL ? "قيد التنفيذ" : "In Progress",
    "in-progress": isRTL ? "قيد التنفيذ" : "In Progress",
    submitted: isRTL ? "تم التسليم" : "Submitted",
    completed: isRTL ? "مكتمل" : "Completed",
    rejected: isRTL ? "مرفوض" : "Rejected",
  };
  return map[status] || status;
};

const getStatusColor = (status) => {
  const map = {
    completed:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    rejected:
      "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-800",
    submitted:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    inProgress:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    "in-progress":
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    pending:
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
  };
  return map[status] || map.pending;
};

export default function WelcomePage() {
  const { email, language, isRTL } = useAppContext();
  const dateLocale = language === "ar" ? ar : enUS;
  const content = translations[language].dashboard;
  const { data, isLoading, isError, refetch, isFetching } = useDashboard();
  const { data: session, status } = useSession();

  const handleInviteRespond = async (inviteId, action) => {
    try {
      const promise = axios.put(`/api/invite/respond`, { inviteId, action });
      toast.promise(promise, {
        loading: isRTL ? "جاري الرد..." : "Responding...",
        success:
          action === "accepted"
            ? content.invitations.acceptSuccess
            : content.invitations.rejectSuccess,
        error: content.invitations.respondError,
      });
      await promise;
      await refetch();
    } catch (err) {
      console.error("Failed to respond:", err);
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-rose-500 font-medium">
        Error loading dashboard data. Please refresh.
      </div>
    );

  const projectsPercentage =
    data?.projectsCount > 0
      ? Math.round((data?.finishedProjectsCount / data?.projectsCount) * 100)
      : 0;
  const tasksPercentage =
    data?.tasksCount > 0
      ? Math.round((data?.finishedTasksCount / data?.tasksCount) * 100)
      : 0;
  const totalCompleted =
    (data?.finishedProjectsCount || 0) + (data?.finishedTasksCount || 0);
  const totalWorkload = Math.max(
    (data?.projectsCount || 0) + (data?.tasksCount || 0),
    1,
  );
  const completionRate = Math.round((totalCompleted / totalWorkload) * 100);

  const ut = content.stats || {};

  return (
    <div className="min-h-screen   p-4 md:p-6 lg:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header / Top Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-600/10 dark:bg-blue-500/10">
                <LayoutGrid className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              </div>
              {isRTL ? "لوحة القيادة" : "Dashboard"}
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="w-full sm:w-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            {content.update}
          </Button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Welcome Banner (Spans 8 columns on large) */}
          <div className="md:col-span-12 lg:col-span-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[200px] shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-100 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />

            <div className="relative z-10 max-w-lg">
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2 w-full md:whitespace-nowrap ">
                {isRTL ? "مرحباً بعودتك،" : "Welcome back,"}{" "}
                <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 ">
                  {session?.user?.name}
                </span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mb-6 font-medium leading-relaxed">
                {isRTL
                  ? "قمنا بتجميع أهم تحديثات مشاريعك ومهامك المطلوبة منك اليوم لتسهيل عملك."
                  : "We've compiled your most important project updates and tasks for today."}
              </p>
              <Link href="/dashboard/how-it-works">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 px-8 h-12 font-black">
                  {content.welcome.subtitle}
                  <ChevronRight className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 rtl:rotate-180 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Overall Performance (Spans 4 columns) */}
          <div className="md:col-span-12 lg:col-span-4 bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative shadow-2xl shadow-blue-900/30 overflow-hidden flex flex-col justify-between min-h-[200px]">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 border-24 border-white/10 rounded-full" />
            <div className="absolute top-10 right-10 w-2 h-2 bg-white/40 rounded-full animate-ping" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded-lg bg-white/20">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/80 font-black text-xs uppercase tracking-widest leading-none">
                  {isRTL ? "معدل الإنجاز العام" : "Overall Progress"}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-6xl font-black tracking-tighter leading-none">
                  {completionRate}
                </span>
                <span className="text-2xl text-white/60 font-bold">%</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-wider">
                  {isRTL ? "مشاريعك:" : "Projects:"} {data?.projectsCount || 0}
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-wider">
                  {isRTL ? "مهامك:" : "Tasks:"} {data?.tasksCount || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {/* Total Projects */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">
                  {content.stats.projects}
                </h3>
                <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                  {data?.projectsCount || 0}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/50 flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-500">
                  {projectsPercentage}%
                </span>
                <div className="h-1 flex-1 mx-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-1000"
                    style={{ width: `${projectsPercentage}%` }}
                  />
                </div>
              </div>
              <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 -translate-x-2 translate-y-2">
                <Briefcase className="w-16 h-16 text-gray-900 dark:text-white" />
              </div>
            </div>

            {/* Total Tasks */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                  <ListChecks className="w-5 h-5" />
                </div>
                <h3 className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">
                  {content.stats.tasks}
                </h3>
                <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                  {data?.tasksCount || 0}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/50 flex items-center justify-between">
                <span className="text-[10px] font-black text-indigo-500">
                  {tasksPercentage}%
                </span>
                <div className="h-1 flex-1 mx-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-1000"
                    style={{ width: `${tasksPercentage}%` }}
                  />
                </div>
              </div>
              <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 -translate-x-2 translate-y-2">
                <ListChecks className="w-16 h-16 text-gray-900 dark:text-white" />
              </div>
            </div>

            {/* Managed Projects - FOR LEADERS */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">
                  {isRTL ? "مشاريع أديرها" : "Managed Projects"}
                </h3>
                <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                  {data?.managedProjectsCount || 0}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/50 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-orange-500" />
                <span className="text-[9px] font-black text-orange-500 uppercase tracking-tight">
                  {isRTL ? "صلاحيات كاملة" : "Leader Role"}
                </span>
              </div>
              <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 -translate-x-2 translate-y-2">
                <TrendingUp className="w-16 h-16 text-gray-900 dark:text-white" />
              </div>
            </div>

            {/* Join Requests - CRITICAL FOR LEADERS */}
            {data?.managedProjectsCount > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group overflow-hidden relative ring-2 ring-transparent hover:ring-rose-500/10">
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 group-hover:scale-110 transition-transform relative">
                    <Users className="w-5 h-5" />
                    {data?.pendingJoinRequestsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse" />
                    )}
                  </div>
                  <h3 className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">
                    {isRTL ? "طلبات انضمام" : "Join Requests"}
                  </h3>
                  <p
                    className={`text-2xl font-black leading-none ${data?.pendingJoinRequestsCount > 0 ? "text-rose-600 dark:text-rose-400" : "text-gray-900 dark:text-white"}`}
                  >
                    {data?.pendingJoinRequestsCount || 0}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/50">
                  <Link
                    href="/dashboard/projects"
                    className="flex items-center justify-between text-[10px] font-black text-rose-500 uppercase tracking-wider hover:underline"
                  >
                    {isRTL ? "المراجعة" : "Review"}
                    <ArrowRight
                      className={`w-3 h-3 ${isRTL ? "rotate-180" : ""}`}
                    />
                  </Link>
                </div>
                <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 -translate-x-2 translate-y-2">
                  <Users className="w-16 h-16 text-gray-900 dark:text-white" />
                </div>
              </div>
            )}

            {/* Pending Invites */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">
                  {content.stats.pendingInvites}
                </h3>
                <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                  {data?.pendingInvitesCount || 0}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/50">
                <Link
                  href="/dashboard/invitations"
                  className="flex items-center justify-between text-[10px] font-black text-amber-500 uppercase tracking-wider hover:underline"
                >
                  {isRTL ? "عرض الكل" : "View All"}
                  <ArrowRight
                    className={`w-3 h-3 ${isRTL ? "rotate-180" : ""}`}
                  />
                </Link>
              </div>
              <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 -translate-x-2 translate-y-2">
                <Mail className="w-16 h-16 text-gray-900 dark:text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Due Tasks & Active Work */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main List: Urgent & Recent Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-rose-500" />
                  {isRTL ? "مطلوبة قريباً" : "Due Soon"}
                </h3>
              </div>
              <div className="p-2">
                {data?.upcomingTasks?.length > 0 ? (
                  <div className="space-y-1">
                    {data.upcomingTasks.map((task) => (
                      <div
                        key={task._id}
                        className="flex items-center justify-between p-4 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center justify-center w-12 h-12 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-xl border border-rose-100 dark:border-rose-900/50">
                            <span className="text-[10px] font-bold uppercase">
                              {format(new Date(task.dueDate), "MMM", {
                                locale: dateLocale,
                              })}
                            </span>
                            <span className="text-lg font-black leading-none">
                              {format(new Date(task.dueDate), "d")}
                            </span>
                          </div>
                          <div>
                            <Link
                              href={`/dashboard/task/${task._id}`}
                              className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {task.title}
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {task.projectId?.title || "Unknown Project"}
                            </p>
                          </div>
                        </div>
                        <Link href={`/dashboard/task/${task._id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 group-hover:text-blue-500 rounded-xl"
                          >
                            <ArrowRight
                              className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                            />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm font-medium">
                      {isRTL
                        ? "رائع! لا يوجد مهام مستعجلة."
                        : "Awesome! No urgent tasks."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Task Status Overview */}
            {data?.taskStatusBreakdown &&
              Object.values(data.taskStatusBreakdown).some((v) => v > 0) && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    {isRTL ? "حالة سير العمل" : "Workflow Status"}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(data.taskStatusBreakdown).map(
                      ([status, count]) => {
                        if (count === 0) return null;
                        return (
                          <div
                            key={status}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${getStatusColor(status)}`}
                          >
                            <span className="text-lg font-black leading-none">
                              {count}
                            </span>
                            <span className="text-sm font-medium capitalize">
                              {getStatusName(status, isRTL)}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Active Projects */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  {isRTL ? "المشاريع النشطة" : "Active Projects"}
                </h3>
              </div>
              <div className="p-2">
                {data?.activeProjects?.length > 0 ? (
                  <div className="space-y-1">
                    {data.activeProjects.map((proj) => (
                      <Link
                        key={proj._id}
                        href={`/dashboard/projects/${proj._id}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <LayoutGrid className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                          {proj.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-sm text-gray-500">
                      {isRTL ? "لا يوجد مشاريع نشطة" : "No active projects"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Pending Invites */}
            {data?.recentInvites?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-500" />
                    {content.invitations.recent}
                  </h3>
                  <span className="bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 text-xs font-bold px-2 py-0.5 rounded-full">
                    {data.pendingInvitesCount}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {data.recentInvites.map((invite) => (
                    <div
                      key={invite._id}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50"
                    >
                      <p className="text-xs text-gray-500 mb-1">
                        {isRTL ? "دعوة من مشروع" : "Invite from"}
                      </p>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 truncate">
                        {invite.projectId?.title}
                      </h4>
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            handleInviteRespond(invite._id, "accepted")
                          }
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs rounded-lg"
                        >
                          {content.invitations.Accept}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleInviteRespond(invite._id, "rejected")
                          }
                          className="flex-1 h-8 text-xs rounded-lg text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <X className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                          {content.invitations.Reject}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
