"use client";

import { useState, useEffect } from "react";
import {
  redirect,
  useParams,
  useSearchParams,
  useRouter,
} from "next/navigation";
import { toast } from "react-hot-toast";
import {
  useGetProject,
  useDeleteProject,
} from "../../../../hooks/projects/useGetProjects";
import { useAppContext } from "../../../../contexts/AppContext";
import { translations } from "../../../../lib/translations";
import Loading from "../../../../components/Loading";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Edit,
  Trash,
  User,
  Crown,
  CheckCircle,
  Plus,
  Eye,
  ClipboardPlus,
  Settings,
  Clock,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { format, isBefore, isToday, differenceInDays } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import Link from "next/link";
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
import { useLeaveProject } from "../../../../hooks/invitations/useLeaveProject";
import { useUpdateProjectStatus } from "../../../../hooks/projects/useUpdateProjectStatus";
import { useGetTasks, useDeleteTask } from "../../../../hooks/tasks/useTasks";
import {
  useJoinProject,
  useRespondJoinProject,
} from "../../../../hooks/projects/useJoinProject";
import { useUpdateMemberTitle } from "../../../../hooks/projects/useUpdateMemberTitle";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetProject(id);
  const { data: tasks, refetch } = useGetTasks();
  const { mutate: deleteTask } = useDeleteTask();

  const { language, userId, isRTL } = useAppContext();
  const router = useRouter();
  const dateLocale = language === "ar" ? ar : enUS;
  const content = translations[language].dashboard.projectDetail;
  const taskStatusContent = translations[language].dashboard.taskDetails.status;
  const modal = translations[language].dashboard.deleteModal;
  const { mutate: deleteProject } = useDeleteProject();
  const { mutate: leaveProject } = useLeaveProject();
  const { mutate: updateStatus } = useUpdateProjectStatus();

  const [isLeader, setIsLeader] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isRandomUser, setIsRandomUser] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [joinRequestsOpen, setJoinRequestsOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [tasksOpen, setTasksOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState("all");

  const searchParams = useSearchParams();
  const isInvite = searchParams.get("invite") === "true";

  const { mutate: joinProject, isLoading: isJoining } = useJoinProject();
  const { mutate: respondJoin, isLoading: isResponding } =
    useRespondJoinProject();
  const { mutate: updateMemberTitle } = useUpdateMemberTitle();

  const handleTitleEdit = (e, targetUserId, currentTitle) => {
    e.preventDefault();
    const newTitle = window.prompt(
      isRTL ? "أدخل اللقب الجديد:" : "Enter new title:",
      currentTitle,
    );
    if (newTitle !== null) {
      updateMemberTitle({
        projectId: data._id,
        userId: targetUserId,
        title: newTitle,
      });
    }
  };

  const hasRequestedJoin = data?.joinRequests?.some(
    (req) => req.userId?._id === userId?.toString() && req.status === "pending",
  );

  useEffect(() => {
    if (!data || !userId) return;

    const uid = userId.toString();
    if (
      data.leaderId?._id === uid ||
      data.coLeaders?.some((u) => u._id === uid)
    ) {
      setIsLeader(true);
    } else if (data.members?.some((u) => u._id === uid)) {
      setIsMember(true);
    } else {
      setIsRandomUser(true);
      if (!data.public && !isInvite) redirect("/dashboard/projects");
    }
  }, [data, userId, isInvite]);

  if (isLoading || !data) return <Loading />;
  if (error)
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white text-center p-10 transition-colors">
        Error: {error.message}
      </div>
    );

  const handleEdit = () => redirect(`/dashboard/updateProject/${data._id}`);
  const handleReport = () => redirect(`/dashboard/report/${data._id}`);

  const handleDelete = () => {
    deleteProject({ id: data._id, userId });
    redirect("/dashboard/projects");
  };

  const handleLeave = () => {
    leaveProject({ projectId: data._id, userId });
    redirect("/dashboard/projects");
  };

  const toggleStatus = () => {
    const newStatus = data.status === "open" ? "finished" : "open";
    updateStatus(
      { projectId: data._id, userId, status: newStatus },
      {
        onSuccess: () => {
          router.push("/dashboard/projects");
        },
      },
    );
  };

  const isFinished = data.status === "finished";

  const handleJoinProject = () => {
    joinProject({
      projectId: data._id,
      userId: userId.toString(),
      invite: isInvite,
    });
  };

  const pendingJoinRequests =
    data?.joinRequests?.filter((req) => req.status === "pending") || [];

  // ── helper: render a dueDate badge for a task ──────────────────────────────
  const TaskDueBadge = ({ dueDate, status }) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const overdue =
      isBefore(due, new Date()) && !isToday(due) && status !== "completed";
    const daysLeft = differenceInDays(due, new Date());
    const urgent = !overdue && daysLeft <= 3;
    const fmtD = format(due, "d MMM yyyy", { locale: dateLocale });

    let bg, text, icon, label;
    if (overdue) {
      bg = "bg-red-100 dark:bg-red-900/40";
      text = "text-red-700 dark:text-red-300";
      icon = <AlertCircle className="w-3 h-3 shrink-0" />;
      label = isRTL ? `متأخر • ${fmtD}` : `Overdue • ${fmtD}`;
    } else if (urgent) {
      bg = "bg-orange-100 dark:bg-orange-900/30";
      text = "text-orange-700 dark:text-orange-300";
      icon = <Clock className="w-3 h-3 shrink-0 animate-pulse" />;
      label = isRTL
        ? `${daysLeft === 0 ? "اليوم" : `${daysLeft} أيام`} • ${fmtD}`
        : `${daysLeft === 0 ? "Today" : `${daysLeft}d left`} • ${fmtD}`;
    } else {
      bg = "bg-slate-100 dark:bg-slate-700/50";
      text = "text-slate-600 dark:text-slate-300";
      icon = <Calendar className="w-3 h-3 shrink-0" />;
      label = fmtD;
    }

    return (
      <span
        className={`mt-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${bg} ${text}`}
      >
        {icon}
        {isRTL ? "الموعد النهائي: " : "Due: "}
        {label}
      </span>
    );
  };

  const filteredTasks = tasks?.filter((task) => {
    // 1. Basic permission filtering
    const hasPermission = isLeader
      ? task?.projectId?._id === data?._id
      : task?.projectId?._id === data?._id &&
        task.assignedTo?.some((user) => user._id === userId);

    if (!hasPermission) return false;

    // 2. Tab filtering
    if (taskFilter === "current") {
      return (
        task.status !== "completed" &&
        task.status !== "finished" &&
        task.status !== "rejected"
      );
    }
    if (taskFilter === "completed") {
      return task.status === "completed" || task.status === "finished";
    }
    return true; // "all"
  });

  return (
    <div className="min-h-screen bgMain transition-colors p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Project Header Card */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
          <CardHeader className=" border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                <CardTitle className="text-[14px] md:text-[24px]  font-bold text-gray-800 dark:text-white">
                  {data.title}
                </CardTitle>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={data.public ? "default" : "secondary"}
                  className={`text-sm ${
                    data.public
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {data.public ? content.public : content.private}
                </Badge>
                <Badge
                  variant="secondary"
                  className={`text-sm ${
                    isFinished
                      ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  }`}
                >
                  {isFinished ? content.statusFinished : content.statusOpen}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Details Section */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
          <button
            type="button"
            onClick={() => setDetailsOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ClipboardPlus className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-800 dark:text-white truncate">
                {isRTL ? "التفاصيل" : "Details"}
              </span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${detailsOpen ? "rotate-180" : ""}`}
            />
          </button>
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              detailsOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-4 md:p-6 space-y-6 border-t border-gray-100 dark:border-gray-700">
              {/* Description Section */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Edit className="w-5 h-5 text-gray-500" />
                  {content.description}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  {data.description || content.noDescription}
                </p>
              </div>

              {/* Project Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Leader Info */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {content.leaderName}:{" "}
                      <Link
                        href={`/dashboard/user/${data.leaderId?._id}`}
                        className="font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                      >
                        {data.leaderId?.name || "Unknown"}
                      </Link>
                    </span>
                  </div>
                </div>

                {/* Creation Date */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {content.created}:{" "}
                      <strong className="text-gray-800 dark:text-white">
                        {format(new Date(data.createdAt), "PPP", {
                          locale: dateLocale,
                        })}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Deadline */}
                {data.deadline && (
                  <div
                    className={`p-4 rounded-md ${
                      new Date(data.deadline) < new Date() &&
                      data.status !== "finished"
                        ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                        : "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar
                        className={`w-5 h-5 ${
                          new Date(data.deadline) < new Date() &&
                          data.status !== "finished"
                            ? "text-red-500"
                            : "text-orange-500"
                        }`}
                      />
                      <span
                        className={
                          new Date(data.deadline) < new Date() &&
                          data.status !== "finished"
                            ? "text-red-700 dark:text-red-300"
                            : "text-orange-700 dark:text-orange-300"
                        }
                      >
                        {content.deadline}:{" "}
                        <strong>
                          {format(new Date(data.deadline), "PPP", {
                            locale: dateLocale,
                          })}
                        </strong>
                        {new Date(data.deadline) < new Date() &&
                          data.status !== "finished" && (
                            <span className="ml-2 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">
                              {content.deadlinePassed}
                            </span>
                          )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Team Section – collapsible */}
        {(() => {
          const coLeaderIds = new Set((data.coLeaders || []).map((u) => u._id));
          const uniqueMembers = (data.members || []).filter(
            (u) => !coLeaderIds.has(u._id),
          );
          const allMembers = [
            ...(data.coLeaders || []).map((u) => ({
              ...u,
              _role: "coLeader",
            })),
            ...uniqueMembers.map((u) => ({ ...u, _role: "member" })),
          ];
          const totalCount = allMembers.length + 1;

          return (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Toggle header */}
              <button
                type="button"
                onClick={() => setTeamOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {content.team}
                  </span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                    {totalCount}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${teamOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Animated members panel */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  teamOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-4 space-y-2 bg-white dark:bg-gray-800">
                  {/* Leader */}
                  <Link
                    href={`/dashboard/user/${data.leaderId?._id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shrink-0 shadow-sm">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {data.leaderId?.name &&
                        data.leaderId.name !== "null null"
                          ? data.leaderId.name
                          : data.leaderId?.email
                              ?.split("@")[0]
                              .replace(/[0-9]/g, "") || "Unknown"}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                          {data.customRoles?.[data.leaderId?._id] ||
                            content.leaderName}
                        </p>
                        {isLeader && (
                          <button
                            onClick={(e) =>
                              handleTitleEdit(
                                e,
                                data.leaderId?._id,
                                data.customRoles?.[data.leaderId?._id] ||
                                  content.leaderName,
                              )
                            }
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Divider if there are more */}
                  {allMembers.length > 0 && (
                    <div className="border-t border-gray-100 dark:border-gray-700" />
                  )}

                  {/* Co-leaders & Members */}
                  {allMembers.map((member) => (
                    <Link
                      key={member._id}
                      href={`/dashboard/user/${member._id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                          member._role === "coLeader"
                            ? "bg-gradient-to-br from-purple-400 to-indigo-500"
                            : "bg-gradient-to-br from-blue-400 to-cyan-500"
                        }`}
                      >
                        <span className="text-white text-sm font-bold">
                          {(member.name && member.name !== "null null"
                            ? member.name
                            : member.email
                                ?.split("@")[0]
                                .replace(/[0-9]/g, "") || "?"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {member.name && member.name !== "null null"
                            ? member.name
                            : member.email?.split("@")[0].replace(/[0-9]/g, "")}
                        </p>
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-xs font-medium ${
                              member._role === "coLeader"
                                ? "text-purple-600 dark:text-purple-400"
                                : "text-blue-600 dark:text-blue-400"
                            }`}
                          >
                            {data.customRoles?.[member._id] ||
                              (member._role === "coLeader"
                                ? content.coLeaders
                                : isRTL
                                  ? "عضو"
                                  : "Member")}
                          </p>
                          {isLeader && (
                            <button
                              onClick={(e) =>
                                handleTitleEdit(
                                  e,
                                  member._id,
                                  data.customRoles?.[member._id] || "",
                                )
                              }
                              className="text-gray-400 hover:text-blue-500 transition-colors"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}

                  {allMembers.length === 0 && (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                      {content.noMembers}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Join Requests Section */}
        {isLeader && pendingJoinRequests.length > 0 && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-blue-500">
            <button
              type="button"
              onClick={() => setJoinRequestsOpen((prev) => !prev)}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                  {content.joinRequests}
                </span>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {pendingJoinRequests.length}
                </Badge>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${joinRequestsOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                joinRequestsOpen
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-4 space-y-4 border-t border-gray-100 dark:border-gray-700">
                {pendingJoinRequests.map((req) => (
                  <div
                    key={req._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {req.userId?.name && req.userId.name !== "null null"
                            ? req.userId.name
                            : req.userId?.email
                                ?.split("@")[0]
                                .replace(/[0-9]/g, "") || "Unknown User"}
                        </p>
                        <Link
                          href={`/dashboard/user/${req.userId?._id}`}
                          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {content.viewProfile}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isResponding}
                        onClick={() =>
                          respondJoin({
                            projectId: data._id,
                            joinId: req._id,
                            action: "accept",
                            userId: userId.toString(),
                          })
                        }
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />{" "}
                        {content.acceptJoin}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isResponding}
                        onClick={() =>
                          respondJoin({
                            projectId: data._id,
                            joinId: req._id,
                            action: "reject",
                            userId: userId.toString(),
                          })
                        }
                      >
                        <Trash className="w-4 h-4 mr-1" /> {content.rejectJoin}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tasks Section */}
        {(isLeader || isMember) && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-cyan-500">
            <button
              type="button"
              onClick={() => setTasksOpen((prev) => !prev)}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Edit className="w-5 h-5 text-cyan-500" />
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                  {content.tasks}
                </span>
                <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                  {filteredTasks ? filteredTasks.length : 0}
                </Badge>
              </div>

              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  tasksOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                tasksOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-4 space-y-4 border-t border-gray-100 dark:border-gray-700">
                {/* Task Tabs */}
                {tasks && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant={taskFilter === "all" ? "default" : "outline"}
                      onClick={() => setTaskFilter("all")}
                      size="sm"
                    >
                      {isRTL ? "الكل" : "All"}
                    </Button>

                    <Button
                      variant={taskFilter === "current" ? "default" : "outline"}
                      onClick={() => setTaskFilter("current")}
                      size="sm"
                    >
                      {isRTL ? "الحالي" : "Current"}
                    </Button>

                    <Button
                      variant={
                        taskFilter === "completed" ? "default" : "outline"
                      }
                      onClick={() => setTaskFilter("completed")}
                      size="sm"
                    >
                      {isRTL ? "المنتهي" : "Completed"}
                    </Button>
                  </div>
                )}

                {/* Add Task Button */}
                {isLeader && !isFinished && (
                  <Link href={`/dashboard/projects/${data._id}/addtask`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 w-full sm:w-auto mt-2 md:mt-0">
                      <Plus className="w-4 h-4" />
                      <span className="truncate">{content.addTask}</span>
                    </Button>
                  </Link>
                )}

                {/* Tasks List */}
                <div className="mt-4">
                  {!tasks ? (
                    <div className="text-center py-8">
                      <Loading />
                    </div>
                  ) : filteredTasks?.length > 0 ? (
                    <div className="space-y-4">
                      {filteredTasks.map((task) => (
                        <div
                          key={task._id}
                          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-row items-center justify-between gap-2 mb-1 w-full overflow-hidden">
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white truncate shrink">
                                  {task.title}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] px-2 py-0.5 whitespace-nowrap font-medium shrink-0 ${
                                    task.status === "completed"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
                                      : task.status === "rejected"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
                                        : task.status === "submitted"
                                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                  }`}
                                >
                                  {taskStatusContent[
                                    task.status === "in-progress"
                                      ? "inProgress"
                                      : task.status
                                  ] || task.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 break-words">
                                {task.description ||
                                  (isRTL ? "لا يوجد وصف." : "No description.")}
                              </p>
                              {/* Task Due Date Badge */}
                              <TaskDueBadge
                                dueDate={task.dueDate}
                                status={task.status}
                              />
                            </div>

                            {!isFinished && (
                              <div className="flex flex-wrap gap-2 justify-end">
                                <Link href={`/dashboard/task/${task._id}`}>
                                  <Button
                                    variant="outline"
                                    className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                  >
                                    <Eye className="w-4 h-4" />
                                    {content.view}
                                  </Button>
                                </Link>
                                {isLeader && (
                                  <>
                                    <Link
                                      href={`/dashboard/task/${task._id}/edit`}
                                    >
                                      <Button
                                        variant="outline"
                                        className="flex items-center gap-2 text-yellow-600 border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
                                      >
                                        <Edit className="w-4 h-4" />
                                        {content.edit}
                                      </Button>
                                    </Link>

                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="destructive"
                                          className="flex items-center gap-2"
                                        >
                                          <Trash className="w-4 h-4" />
                                          {content.delete}
                                        </Button>
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
                                              refetch();
                                            }}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            {modal.confirm}
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-6 rounded-lg text-center">
                      <p className="text-gray-600 dark:text-gray-300">
                        {content.noTasks}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Section */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm mt-6">
          <button
            type="button"
            onClick={() => setActionsOpen((prev) => !prev)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="text-lg font-bold text-gray-800 dark:text-white truncate">
                {isRTL ? "إجراءات المشروع" : "Project Actions"}
              </span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${actionsOpen ? "rotate-180" : ""}`}
            />
          </button>
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              actionsOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-4 md:p-6 flex flex-col gap-6 border-t border-gray-100 dark:border-gray-700">
              {/* Leader Primary Actions */}
              {isLeader && !isFinished && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Edit className="w-4 h-4 shrink-0" />
                    <span className="truncate">{content.edit}</span>
                  </Button>
                  <Button
                    onClick={handleReport}
                    className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-all text-white"
                  >
                    <ClipboardPlus className="w-4 h-4 shrink-0" />
                    <span className="truncate">{content.report}</span>
                  </Button>
                  <Button
                    onClick={() =>
                      redirect(`/dashboard/team-report/${data._id}`)
                    }
                    className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2 shadow-sm transition-all text-white"
                  >
                    <Users className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {content.teamReport ||
                        (isRTL ? "تقرير الفريق" : "Team Report")}
                    </span>
                  </Button>
                  {!data.public && (
                    <Button
                      variant="outline"
                      className="border-indigo-600 text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 dark:border-indigo-500 shadow-sm transition-all flex items-center gap-2"
                      onClick={() => {
                        const inviteLink = `${window.location.origin}/dashboard/projects/${data._id}?invite=true`;
                        navigator.clipboard.writeText(inviteLink);
                        toast.success(
                          content.inviteLinkCopied ||
                            (isRTL
                              ? "تم نسخ رابط الدعوة!"
                              : "Invite link copied!"),
                        );
                      }}
                    >
                      <ClipboardPlus className="w-4 h-4 shrink-0" />
                      <span className="truncate">
                        {content.copyInviteLink ||
                          (isRTL ? "نسخ رابط الدعوة" : "Copy Invite Link")}
                      </span>
                    </Button>
                  )}
                </div>
              )}

              {/* Status and Danger Zone */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                {isLeader && (
                  <Button
                    className={`flex items-center gap-2 shadow-sm transition-all ${
                      isFinished
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-orange-600 hover:bg-orange-700 text-white"
                    }`}
                    onClick={toggleStatus}
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {isFinished
                        ? content.reopenProject
                        : content.finishProject}
                    </span>
                  </Button>
                )}

                {/* Delete button visible even when project is finished */}
                {isLeader && isFinished && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="flex items-center gap-2 shadow-sm transition-all ml-auto rtl:mr-auto rtl:ml-0"
                      >
                        <Trash className="w-4 h-4 shrink-0" />
                        <span className="truncate">{content.delete}</span>
                      </Button>
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
                        <AlertDialogCancel>{modal.cancel}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {modal.confirm}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {isLeader && !isFinished && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="flex items-center gap-2 shadow-sm transition-all ml-auto rtl:mr-auto rtl:ml-0"
                      >
                        <Trash className="w-4 h-4 shrink-0" />
                        <span className="truncate">{content.delete}</span>
                      </Button>
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
                        <AlertDialogCancel>{modal.cancel}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {modal.confirm}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {/* Leave Project Button */}
                {isMember && !isFinished && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2 shadow-sm transition-all ml-auto rtl:mr-auto rtl:ml-0"
                      >
                        {content.leave}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-800 dark:text-white">
                          {content.leaveConfirmTitle}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                          {content.leaveConfirmDesc}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{modal.cancel}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleLeave}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {content.leaveConfirm}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {/* Join Project Button */}
                {isRandomUser && (data.public || isInvite) && !isFinished && (
                  <Button
                    onClick={handleJoinProject}
                    disabled={hasRequestedJoin || isJoining}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-all ml-auto rtl:mr-auto rtl:ml-0"
                  >
                    {hasRequestedJoin ? (
                      <Clock className="w-4 h-4 shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 shrink-0" />
                    )}
                    <span className="truncate">
                      {hasRequestedJoin
                        ? content.joinRequested
                        : content.joinProject}
                    </span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
