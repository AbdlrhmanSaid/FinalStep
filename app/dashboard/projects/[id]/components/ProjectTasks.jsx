import { useState } from "react";
import {
  Edit,
  ChevronDown,
  Plus,
  Eye,
  Trash,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  ListTodo,
  User,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Loading from "@/components/Loading";
import { isBefore, isToday, differenceInDays, format } from "date-fns";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProjectTasks({
  data,
  content,
  isRTL,
  isLeader,
  isMember,
  isFinished,
  tasks,
  filteredTasks,
  refetchTasks,
  deleteTask,
  modal,
  taskStatusContent,
  taskFilter,
  setTaskFilter,
  dateLocale,
  getMySubmissionStatus,
}) {
  const [tasksOpen, setTasksOpen] = useState(true);

  if (!isLeader && !isMember) {
    return null;
  }

  const priorityColors = {
    low: "bg-blue-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  };

  const priorityBorderColors = {
    low: "border-l-blue-500",
    medium: "border-l-yellow-500",
    high: "border-l-red-500",
  };

  const TaskDueBadge = ({ dueDate, status }) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const overdue =
      isBefore(due, new Date()) && !isToday(due) && status !== "completed";
    const daysLeft = differenceInDays(due, new Date());
    const urgent =
      !overdue && daysLeft >= 0 && daysLeft <= 3 && status !== "completed";
    const fmtD = format(due, "d MMM yyyy", { locale: dateLocale });

    let bg, text, icon, label;
    if (status === "completed" || status === "finished") {
      bg = "bg-green-50 dark:bg-green-900/20";
      text = "text-green-700 dark:text-green-300";
      icon = <CheckCircle className="w-3.5 h-3.5 shrink-0" />;
      label = isRTL ? `منتهي • ${fmtD}` : `Ended • ${fmtD}`;
    } else if (overdue) {
      bg = "bg-red-50 dark:bg-red-900/20";
      text = "text-red-700 dark:text-red-300";
      icon = <AlertCircle className="w-3.5 h-3.5 shrink-0" />;
      label = isRTL ? `متأخر • ${fmtD}` : `Overdue • ${fmtD}`;
    } else if (urgent) {
      bg = "bg-orange-50 dark:bg-orange-900/20";
      text = "text-orange-700 dark:text-orange-300";
      icon = <Clock className="w-3.5 h-3.5 shrink-0 animate-pulse" />;
      label = isRTL
        ? `${daysLeft === 0 ? "اليوم" : `${daysLeft} أيام`} • ${fmtD}`
        : `${daysLeft === 0 ? "Today" : `${daysLeft}d left`} • ${fmtD}`;
    } else {
      bg = "bg-gray-100 dark:bg-gray-800";
      text = "text-gray-600 dark:text-gray-300";
      icon = <Calendar className="w-3.5 h-3.5 shrink-0" />;
      label = fmtD;
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md ${bg} ${text}`}
      >
        {icon}
        {label}
      </span>
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm border-t-4 border-t-cyan-500">
      <button
        type="button"
        onClick={() => setTasksOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ListTodo className="w-5 h-5 text-cyan-500" />
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            {content.tasks}
          </span>
          <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
            {filteredTasks ? filteredTasks.length : 0}
          </Badge>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${tasksOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          tasksOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 md:p-6 space-y-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {tasks && (
              <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg w-full sm:w-auto">
                <Button
                  variant={taskFilter === "all" ? "default" : "ghost"}
                  onClick={() => setTaskFilter("all")}
                  size="sm"
                  className={`flex-1 sm:flex-none ${taskFilter === "all" ? "shadow-sm" : ""}`}
                >
                  {isRTL ? "الكل" : "All"}
                </Button>
                <Button
                  variant={taskFilter === "current" ? "default" : "ghost"}
                  onClick={() => setTaskFilter("current")}
                  size="sm"
                  className={`flex-1 sm:flex-none ${taskFilter === "current" ? "shadow-sm" : ""}`}
                >
                  {isRTL ? "الحالي" : "Current"}
                </Button>
                <Button
                  variant={taskFilter === "completed" ? "default" : "ghost"}
                  onClick={() => setTaskFilter("completed")}
                  size="sm"
                  className={`flex-1 sm:flex-none ${taskFilter === "completed" ? "shadow-sm" : ""}`}
                >
                  {isRTL ? "المكتمل" : "Completed"}
                </Button>
                <Button
                  variant={taskFilter === "end" ? "default" : "ghost"}
                  onClick={() => setTaskFilter("end")}
                  size="sm"
                  className={`flex-1 sm:flex-none ${taskFilter === "end" ? "shadow-sm" : ""}`}
                >
                  {isRTL ? "المنتهي" : "End"}
                </Button>
              </div>
            )}

            {isLeader && !isFinished && (
              <Link
                href={`/dashboard/projects/${data._id}/addtask`}
                className="w-full sm:w-auto"
              >
                <Button className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm">
                  <Plus className="w-4 h-4 shrink-0" />
                  <span className="truncate">{content.addTask}</span>
                </Button>
              </Link>
            )}
          </div>

          <div>
            {!tasks ? (
              <div className="text-center py-12">
                <Loading />
              </div>
            ) : filteredTasks?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredTasks.map((task) => {
                  const displayStatus = isLeader
                    ? task.status
                    : getMySubmissionStatus(task);
                  const isShared = (task.assignedTo || []).length > 1;
                  const acceptedCount =
                    isLeader && isShared
                      ? (task.memberSubmissions || []).filter(
                          (s) => s.status === "completed",
                        ).length
                      : null;

                  const priorityLevel = task.priority || "medium";
                  const pColor = priorityColors[priorityLevel];
                  const pBorder = priorityBorderColors[priorityLevel];

                  return (
                    <div
                      key={task._id}
                      className={`group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border-l-4 ${pBorder}`}
                    >
                      <div className="p-4 md:p-5">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          {/* Left Column: Info */}
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                {task.title}
                              </h4>

                              <Badge
                                variant="outline"
                                className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                                  displayStatus === "completed"
                                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                    : displayStatus === "rejected"
                                      ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                                      : displayStatus === "submitted"
                                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                                        : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                }`}
                              >
                                {taskStatusContent[
                                  displayStatus === "in-progress"
                                    ? "inProgress"
                                    : displayStatus
                                ] || displayStatus}
                              </Badge>

                              {isLeader &&
                                isShared &&
                                acceptedCount !== null && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] rounded-full px-2"
                                  >
                                    {acceptedCount} /{" "}
                                    {(task.assignedTo || []).length}
                                  </Badge>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                              {task.description ||
                                (isRTL
                                  ? "لا يوجد وصف لهذه المهمة."
                                  : "No description provided.")}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-1">
                              {/* Avatars / Assigned Names */}
                              {task.assignedTo?.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
                                    {isRTL ? "المكلفين:" : "Assigned:"}
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {task.assignedTo.map((user, idx) => {
                                      const displayName =
                                        user.name && user.name !== "null null"
                                          ? user.name
                                          : user.email
                                              ?.split("@")[0]
                                              .replace(/[0-9]/g, "") || "?";
                                      return (
                                        <Badge
                                          key={user._id || idx}
                                          variant="secondary"
                                          className="text-[11px] px-2.5 py-0.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/60 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow-sm transition-colors rounded-md"
                                        >
                                          {displayName}
                                        </Badge>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              <TaskDueBadge
                                dueDate={task.dueDate}
                                status={displayStatus}
                              />
                            </div>
                          </div>

                          {/* Right Column: Actions */}
                          <div className="flex lg:flex-col justify-end lg:items-end gap-2 mt-2 lg:mt-0 shrink-0">
                            <Link
                              href={`/dashboard/task/${task._id}`}
                              className="w-full sm:w-auto"
                            >
                              <Button
                                size="sm"
                                className="w-full sm:w-auto bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 shadow-none border-0"
                              >
                                {isRTL ? "التفاصيل" : "View"}
                                <ArrowRight
                                  className={`w-4 h-4 ${isRTL ? "mr-1.5 rotate-180" : "ml-1.5"}`}
                                />
                              </Button>
                            </Link>

                            {isLeader && !isFinished && (
                              <div className="flex gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Link
                                        href={`/dashboard/task/${task._id}/edit`}
                                      >
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-9 w-9 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
                                        >
                                          <Edit className="w-4 h-4" />
                                        </Button>
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{content.edit}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-9 w-9 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                                          >
                                            <Trash className="w-4 h-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{content.delete}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle className="text-gray-800 dark:text-white">
                                          {modal.confirmTitle}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                                          {modal.alertTitle}
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          {modal.cancel}
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => {
                                            deleteTask(task._id);
                                            refetchTasks();
                                          }}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          {modal.confirm}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </TooltipProvider>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700 p-12 rounded-xl text-center flex flex-col items-center justify-center gap-3">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <ListTodo className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {content.noTasks}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
