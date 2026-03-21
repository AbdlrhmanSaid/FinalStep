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
} from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { format, isBefore, isToday, differenceInDays } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const TasksClient = () => {
  const { userId, language, isRTL } = useAppContext();
  const dateLocale = language === "ar" ? ar : enUS;
  const { data: tasks, isLoading, refetch, isFetching } = useGetTasks();
  const { mutate: updateTask } = useUpdateTask();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("myTasks");
  const content = translations[language].dashboard.tasks;

  // ترتيب وفلترة المهام
  const filteredAndSortedTasks = useMemo(() => {
    if (!tasks || !userId) return [];

    // فلترة المهام الخاصة بالمستخدم أو المهام التي تحتاج مراجعة
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

    // البحث
    if (searchQuery.trim()) {
      myTasks = myTasks.filter(
        (task) =>
          task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // ترتيب من الأحدث للأقدم
    return myTasks.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }, [tasks, userId, searchQuery, activeTab]);

  const handleStatusChange = (taskId, newStatus) => {
    updateTask(
      {
        taskId,
        data: { status: newStatus },
      },
      {
        onSuccess: () => {
          toast.success(content.statusUpdated || "تم تحديث الحالة بنجاح");
          refetch();
        },
        onError: () => {
          toast.error("فشل في تحديث الحالة");
        },
      },
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bgMain h-screen ">
      <div className="max-w-4xl mx-auto h-screen">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold bg-clip-text  dark:text-white text-gray-800">
            {content.pageTitle}
          </h1>
          <div className="flex items-center gap-2">
            {filteredAndSortedTasks.length > 0 && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {filteredAndSortedTasks.length}{" "}
                {filteredAndSortedTasks.length === 1
                  ? content.task
                  : content.tasks}
              </span>
            )}
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-lg p-1 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("myTasks")}
            className={`flex-1 flex justify-center py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "myTasks"
                ? "bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {content.tabMyTasks || "My Tasks"}
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`flex-1 flex justify-center items-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "review"
                ? "bg-orange-50 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 shadow-sm"
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
                  <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold">
                    {pendingCount}
                  </span>
                );
              }
              return null;
            })()}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={content.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              {searchQuery
                ? content.noResults
                : activeTab === "review"
                  ? isRTL
                    ? "لا توجد مراجعات"
                    : "No Reviews Pending"
                  : content.emptyTitle}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {searchQuery
                ? content.tryDifferentSearch
                : activeTab === "review"
                  ? isRTL
                    ? "لا توجد مهام تنتظر مراجعتك حالياً."
                    : "There are no tasks pending your review right now."
                  : content.emptyDescription}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAndSortedTasks.map((task) => (
              <div
                key={task._id}
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800/50"
              >
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {task.title}
                        </h2>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-3 whitespace-pre-wrap break-words">
                        {task.description}
                      </p>

                      {/* Assigned members (for shared tasks) */}
                      {task.assignedTo?.length > 1 && (
                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold tracking-wide">
                            {isRTL ? "مع:" : "With:"}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {task.assignedTo.map((user, idx) => {
                              // Only show others
                              if ((user._id || user) === userId) return null;

                              const displayName =
                                user.name && user.name !== "null null"
                                  ? user.name
                                  : user.email
                                      ?.split("@")[0]
                                      .replace(/[0-9]/g, "") || "?";
                              return (
                                <span
                                  key={user._id || idx}
                                  className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                                >
                                  {displayName}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Deadline badge */}
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

                          let bg, text, icon, label;
                          if (
                            task.status === "completed" ||
                            task.status === "finished"
                          ) {
                            bg = "bg-green-100 dark:bg-green-900/40";
                            text = "text-green-700 dark:text-green-300";
                            icon = (
                              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                            );
                            label = isRTL
                              ? `مكتملة • ${fmtDate}`
                              : `Completed • ${fmtDate}`;
                          } else if (task.status === "ended" || isOverdue) {
                            bg = "bg-gray-200 dark:bg-gray-700";
                            text = "text-gray-700 dark:text-gray-300";
                            icon = <XCircle className="w-3.5 h-3.5 shrink-0" />;
                            label = isRTL
                              ? `منتهية • ${fmtDate}`
                              : `Ended • ${fmtDate}`;
                          } else if (isUrgent) {
                            bg = "bg-orange-100 dark:bg-orange-900/30";
                            text = "text-orange-700 dark:text-orange-300";
                            icon = (
                              <Clock className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                            );
                            label = isRTL
                              ? `${daysLeft === 0 ? "اليوم" : `${daysLeft} أيام`} • ${fmtDate}`
                              : `${daysLeft === 0 ? "Today" : `${daysLeft}d left`} • ${fmtDate}`;
                          } else {
                            bg = "bg-slate-100 dark:bg-slate-700/50";
                            text = "text-slate-600 dark:text-slate-300";
                            icon = (
                              <Calendar className="w-3.5 h-3.5 shrink-0" />
                            );
                            label = fmtDate;
                          }

                          return (
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${bg} ${text}`}
                            >
                              {icon}
                              {isRTL ? "الموعد النهائي: " : "Due: "}
                              {label}
                            </span>
                          );
                        })()}
                    </div>

                    <Link
                      href={`/dashboard/task/${task._id}`}
                      className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-medium transition-all shadow-sm hover:shadow-md"
                    >
                      <span>{content.view}</span>
                      <span>
                        <ArrowRight />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksClient;
