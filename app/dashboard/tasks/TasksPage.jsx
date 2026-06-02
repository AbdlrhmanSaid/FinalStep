"use client";

import { useAppContext } from "../../../contexts/AppContext";
import { useGetTasks, useUpdateTask } from "../../../hooks/tasks/useTasks";
import { translations } from "../../../lib/translations";
import Loading from "../../../components/Loading";
import {
  ArrowRight,
  Search,
  RefreshCw,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ListTodo,
} from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { format, isBefore, isToday, differenceInDays } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Button } from "@/components/ui/button";

const TasksClient = () => {
  const { userId, language, isRTL } = useAppContext();
  const dateLocale = language === "ar" ? ar : enUS;
  const { data: tasks, isLoading, refetch, isFetching } = useGetTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("myTasks");
  const content = translations[language].dashboard.tasks;

  const filteredAndSortedTasks = useMemo(() => {
    if (!tasks || !userId) return [];

    let myTasks = tasks.filter((task) => {
      if (activeTab === "myTasks") {
        return task.assignedTo?.some((u) => (u._id || u).toString() === userId);
      } else {
        const isLeader =
          task.projectId?.leaderId?.toString() === userId ||
          task.projectId?.coLeaders?.some(
            (id) => (id._id || id).toString() === userId,
          );
        return isLeader && task.status === "submitted";
      }
    });

    if (searchQuery.trim()) {
      myTasks = myTasks.filter(
        (task) =>
          task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return myTasks.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }, [tasks, userId, searchQuery, activeTab]);

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen  p-4 md:p-6 lg:p-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 shrink-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-center shadow-sm">
              <ListTodo className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {content.pageTitle}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                {isRTL
                  ? "قم بإدارة وتتبع جميع مهامك اليومية بسهولة"
                  : "Manage and track all your daily tasks easily"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {filteredAndSortedTasks.length > 0 && (
              <span className="h-10 px-4 rounded-xl flex items-center text-sm font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 shadow-sm flex-1 md:flex-none justify-center">
                {filteredAndSortedTasks.length} {isRTL ? "مهام" : "Tasks"}
              </span>
            )}
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              variant="outline"
              className="h-10 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm flex-1 md:flex-none justify-center"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 ${isFetching ? "animate-spin" : ""}`}
              />
              {isRTL ? "تحديث" : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Filters and Tabs */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700 h-12 w-full">
            <button
              onClick={() => setActiveTab("myTasks")}
              className={`flex-1 flex justify-center items-center rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === "myTasks"
                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {content.tabMyTasks || "My Tasks"}
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={`flex-1 flex justify-center items-center gap-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === "review"
                  ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {content.tabReviewTasks || "Pending Reviews"}
              {(() => {
                if (!tasks) return null;
                const pendingCount = tasks.filter((task) => {
                  const isLeader =
                    task.projectId?.leaderId?.toString() === userId ||
                    task.projectId?.coLeaders?.some(
                      (id) => id.toString() === userId,
                    );
                  return isLeader && task.status === "submitted";
                }).length;
                if (pendingCount > 0) {
                  return (
                    <span className="min-w-[20px] h-[20px] px-1.5 flex items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-black">
                      {pendingCount}
                    </span>
                  );
                }
                return null;
              })()}
            </button>
          </div>

          <div className="relative h-12 w-full lg:w-96 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={content.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full pl-11 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Content */}
        {filteredAndSortedTasks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm p-16 text-center mt-6">
            <div className="mx-auto w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-700">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {searchQuery
                ? content.noResults
                : activeTab === "review"
                  ? isRTL
                    ? "لا توجد مراجعات"
                    : "No Pending Reviews"
                  : content.emptyTitle}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto font-medium">
              {searchQuery
                ? content.tryDifferentSearch
                : activeTab === "review"
                  ? isRTL
                    ? "أنت في السليم! لا توجد مهام تنتظر مراجعتك حالياً."
                    : "You're all caught up! No tasks need your review."
                  : content.emptyDescription}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 mt-6">
            {filteredAndSortedTasks.map((task) => (
              <Link
                href={`/dashboard/task/${task._id}`}
                key={task._id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="block sm:flex items-center gap-3 mb-1.5">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {task.title}
                    </h2>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">
                      {task.projectId?.title || "Unknown Project"}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-1 mb-3">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Deadline Badge */}
                    {task.dueDate &&
                      (() => {
                        const due = new Date(task.dueDate);
                        const isOverdue =
                          isBefore(due, new Date()) &&
                          !isToday(due) &&
                          task.status !== "completed";
                        const daysLeft = differenceInDays(due, new Date());
                        const isUrgent =
                          !isOverdue &&
                          daysLeft >= 0 &&
                          daysLeft <= 3 &&
                          task.status !== "completed";
                        const fmtDate = format(due, "d MMM yyyy", {
                          locale: dateLocale,
                        });

                        let border, text, Icon, label;
                        if (
                          task.status === "completed" ||
                          task.status === "finished"
                        ) {
                          border =
                            "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-500/10";
                          text = "text-emerald-700 dark:text-emerald-400";
                          Icon = CheckCircle2;
                          label = isRTL
                            ? `مكتملة • ${fmtDate}`
                            : `Completed • ${fmtDate}`;
                        } else if (task.status === "ended" || isOverdue) {
                          border =
                            "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-500/10";
                          text = "text-rose-700 dark:text-rose-400";
                          Icon = XCircle;
                          label = isRTL
                            ? `منتهية/متأخرة • ${fmtDate}`
                            : `Overdue • ${fmtDate}`;
                        } else if (isUrgent) {
                          border =
                            "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-500/10";
                          text = "text-orange-700 dark:text-orange-400";
                          Icon = Clock;
                          label = isRTL
                            ? `${daysLeft === 0 ? "اليوم" : `${daysLeft} أيام`} • ${fmtDate}`
                            : `${daysLeft === 0 ? "Today" : `${daysLeft}d left`} • ${fmtDate}`;
                        } else {
                          border =
                            "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800";
                          text = "text-gray-600 dark:text-gray-300";
                          Icon = Calendar;
                          label = fmtDate;
                        }

                        return (
                          <span
                            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${border} ${text}`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                          </span>
                        );
                      })()}

                    {/* Assigned Teammates */}
                    {task.assignedTo?.length > 1 && (
                      <div className="flex items-center gap-1.5 ml-2 rtl:ml-0 rtl:mr-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {isRTL ? "الفريق" : "Team"}
                        </span>
                        <div className="flex -space-x-1.5 rtl:space-x-reverse">
                          {task.assignedTo.map((user, idx) => {
                            if ((user._id || user) === userId) return null;
                            const name =
                              user.name && user.name !== "null null"
                                ? user.name
                                : user.email?.split("@")[0] || "?";
                            return (
                              <div
                                key={user._id || idx}
                                className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[9px] font-black text-blue-600 dark:text-blue-400"
                                title={name}
                              >
                                {name.charAt(0).toUpperCase()}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex sm:items-center">
                  <Button
                    variant="ghost"
                    className="hidden sm:flex items-center gap-2 text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 rounded-xl transition-all font-bold"
                  >
                    {content.view}
                    <ArrowRight
                      className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                    />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksClient;
