import { useState, useEffect } from "react";
import axios from "axios";
import {
  Edit,
  Plus,
  Trash,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ListTodo,
  ArrowRight,
  Filter,
  Users,
  Settings,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditSectionMembersDialog from "./EditSectionMembersDialog";

export default function ProjectTasks({
  data,
  content,
  isRTL,
  isLeader,
  isMember,
  isFinished,
  tasks,
  filteredTasks,
  deleteTask,
  modal,
  taskStatusContent,
  taskFilter,
  setTaskFilter,
  dateLocale,
  getMySubmissionStatus,
  userId,
  sectionsData,
}) {
  const [activeSectionId, setActiveSectionId] = useState("all");
  const [availableSections, setAvailableSections] = useState([]);

  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [isEditMembersModalOpen, setIsEditMembersModalOpen] = useState(false);

  useEffect(() => {
    let secs = sectionsData || [];
    if (!isLeader) {
      secs = secs.filter(
        (s) =>
          s.members?.length === 0 || s.members?.some((m) => m._id === userId),
      );
    }
    setAvailableSections(secs);
    if (secs.length > 0 && activeSectionId === "all" && data?.hasSections) {
      setActiveSectionId(secs[0]._id);
    }
  }, [sectionsData, isLeader, userId, data?.hasSections]);

  let tasksToDisplay = filteredTasks || [];
  if (data?.hasSections && activeSectionId !== "all") {
    tasksToDisplay = tasksToDisplay.filter((t) => {
      const inAssignments = t.sectionAssignments?.some(
        (sa) => sa.sectionId === activeSectionId || sa.sectionId?._id === activeSectionId
      );
      const inLegacy = t.sectionId?._id === activeSectionId || t.sectionId === activeSectionId;
      return inAssignments || (!t.sectionAssignments?.length && inLegacy);
    });
  }

  const handleCreateSection = async () => {
    if (!newSectionTitle.trim()) return;
    setIsCreatingSection(true);
    try {
      await axios.post("/api/sections", {
        title: newSectionTitle,
        projectId: data._id,
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(isRTL ? "فشل إنشاء القسم" : "Failed to create section");
    } finally {
      setIsCreatingSection(false);
      setIsSectionModalOpen(false);
      setNewSectionTitle("");
    }
  };

  if (!isLeader && !isMember) return null;

  const priorityConfig = {
    low: {
      border: "border-blue-500/20",
      line: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    medium: {
      border: "border-amber-500/20",
      line: "bg-amber-500",
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
    },
    high: {
      border: "border-rose-500/20",
      line: "bg-rose-500",
      text: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/10",
    },
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
      bg = "bg-green-50 dark:bg-green-500/10";
      text = "text-green-700 dark:text-green-400";
      icon = <CheckCircle2 className="w-3 h-3" />;
      label = isRTL ? `منتهي • ${fmtD}` : `Done • ${fmtD}`;
    } else if (overdue) {
      bg = "bg-rose-50 dark:bg-rose-500/10";
      text = "text-rose-700 dark:text-rose-400";
      icon = <AlertCircle className="w-3 h-3" />;
      label = isRTL ? `متأخر • ${fmtD}` : `Overdue • ${fmtD}`;
    } else {
      bg = "bg-gray-100 dark:bg-gray-800";
      text = "text-gray-600 dark:text-gray-400";
      icon = <Calendar className="w-3 h-3" />;
      label = fmtD;
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${bg} ${text}`}
      >
        {icon}
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Filter / Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/40 rounded-2xl">
            <ListTodo className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
              {content.tasks}
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              {tasksToDisplay?.length || 0}{" "}
              {isRTL ? "مهام مرتبطة" : "Linked Tasks"}
            </p>
          </div>
        </div>

        <div className="md:flex items-center gap-3">
          {/* Segmented Filter */}
          <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-2xl border border-gray-100 dark:border-gray-700 mb-2 md:mb-0">
            {["all", "current", "completed", "end"].map((f) => (
              <button
                key={f}
                onClick={() => setTaskFilter(f)}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  taskFilter === f
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {f === "all"
                  ? isRTL
                    ? "الكل"
                    : "All"
                  : f === "current"
                    ? isRTL
                      ? "الحالي"
                      : "Live"
                    : f === "completed"
                      ? isRTL
                        ? "المكتمل"
                        : "Done"
                      : isRTL
                        ? "المتوقف"
                        : "Archived"}
              </button>
            ))}
          </div>

          {isLeader && !isFinished && (
            <Link href={`/dashboard/projects/${data._id}/addtask`}>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-500/20">
                <Plus className="w-4 h-4" />
                {content.addTask}
              </button>
            </Link>
          )}
        </div>
      </div>

      {data?.hasSections && (isLeader || availableSections.length > 0) && (
        <div className="flex bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-x-auto gap-2 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <button
            onClick={() => setActiveSectionId("all")}
            className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
              activeSectionId === "all"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900"
            }`}
          >
            {isRTL ? "الكل" : "All Sections"}
          </button>
          {availableSections.map((sec) => (
            <button
              key={sec._id}
              onClick={() => setActiveSectionId(sec._id)}
              className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                activeSectionId === sec._id
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900"
              }`}
            >
              {sec.title}
            </button>
          ))}
          {isLeader && activeSectionId && activeSectionId !== "all" && availableSections.length > 0 && (
              <button 
                onClick={() => setIsEditMembersModalOpen(true)}
                className="px-4 py-2.5 text-sm font-bold rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 border border-dashed border-emerald-200 dark:border-emerald-900 transition-all flex items-center gap-1 whitespace-nowrap ml-1 mr-1"
                title={isRTL ? "خيارات القسم" : "Section Options"}
              >
                  <Settings className="w-4 h-4" />
                  {isRTL ? "خيارات القسم" : "Options"}
              </button>
          )}
          {isLeader && (
            <Dialog
              open={isSectionModalOpen}
              onOpenChange={setIsSectionModalOpen}
            >
              <DialogTrigger asChild>
                <button className="px-4 py-2.5 text-sm font-bold rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-dashed border-blue-200 dark:border-blue-900 transition-all flex items-center gap-1 whitespace-nowrap">
                  <Plus className="w-4 h-4" />
                  {isRTL ? "قسم" : "Section"}
                </button>
              </DialogTrigger>
              <DialogContent
                className="max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold dark:text-white">
                    {isRTL ? "إنشاء قسم جديد" : "Create New Section"}
                  </DialogTitle>
                  <DialogDescription className="text-gray-500">
                    {isRTL
                      ? "اكتب اسماً للقسم الجديد لتنظيم مهام المشروع."
                      : "Enter a name for the new section to organize your project tasks."}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="sectionName"
                      className="font-semibold text-gray-900 dark:text-white"
                    >
                      {isRTL ? "اسم القسم" : "Section Name"}
                    </Label>
                    <Input
                      id="sectionName"
                      placeholder={
                        isRTL
                          ? "مثال: تطوير الواجهات..."
                          : "e.g., Frontend Development..."
                      }
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      className="h-12 bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-200 dark:border-gray-700 focus-visible:ring-blue-500 rounded-xl"
                      autoFocus
                    />
                  </div>
                </div>
                <DialogFooter className="gap-1">
                  <Button
                    variant="outline"
                    onClick={() => setIsSectionModalOpen(false)}
                    className="rounded-xl h-11 border-gray-200 dark:border-gray-700 dark:text-white"
                  >
                    {isRTL ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button
                    disabled={!newSectionTitle.trim() || isCreatingSection}
                    onClick={handleCreateSection}
                    className="rounded-xl h-11 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isCreatingSection ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isRTL ? (
                      "إنشاء"
                    ) : (
                      "Create"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}

      <div className="space-y-4">
        {!tasks || !sectionsData ? (
          <div className="flex justify-center py-20">
            <Loading />
          </div>
        ) : tasksToDisplay?.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {tasksToDisplay.map((task) => {
              const displayStatus = isLeader
                ? task.status
                : getMySubmissionStatus(task);
              const p = priorityConfig[task.priority || "medium"];

              return (
                <div
                  key={task._id}
                  className="group relative bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-blue-500/30 transition-all duration-300"
                >
                  {/* Priority indicator line */}

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-base font-black text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">
                          {task.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            displayStatus === "completed"
                              ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                              : displayStatus === "submitted"
                                ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                                : "bg-gray-50 text-gray-500 border-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-700"
                          }`}
                        >
                          {taskStatusContent[
                            displayStatus === "in-progress"
                              ? "inProgress"
                              : displayStatus
                          ] || displayStatus}
                        </span>

                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${p.bg} ${p.text}`}
                        >
                          {task.priority || "medium"}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl line-clamp-2">
                        {task.description ||
                          (isRTL
                            ? "لا يوجد وصف تفصيلي."
                            : "No detailed description.")}
                      </p>

                      <div className="flex flex-wrap items-center gap-6">
                        <TaskDueBadge
                          dueDate={task.dueDate}
                          status={displayStatus}
                        />

                        {task.assignedTo?.length > 0 && (
                          <div className="flex -space-x-1.5 rtl:space-x-reverse">
                            {task.assignedTo.map((u, i) => (
                              <div
                                key={u._id || i}
                                className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-900 border-2 border-white dark:border-gray-800 flex items-center justify-center overflow-hidden"
                                title={u.name}
                              >
                                {u.image ? (
                                  <img
                                    src={u.image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-[8px] font-black text-gray-400">
                                    {u.name?.charAt(0)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/task/${task._id}`}
                        className="flex-1 lg:flex-none"
                      >
                        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 rounded-2xl text-xs font-black transition-all group-hover:border-blue-500/30">
                          {isRTL ? "استعراض" : "Explore"}
                          <ArrowRight
                            className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`}
                          />
                        </button>
                      </Link>

                      {isLeader && !isFinished && (
                        <div className="flex gap-1.5">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`/dashboard/task/${task._id}/edit`}>
                                  <button className="p-2.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{content.edit}</p>
                              </TooltipContent>
                            </Tooltip>

                            <AlertDialog>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <button className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all">
                                      <Trash className="w-4 h-4" />
                                    </button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{content.delete}</p>
                                </TooltipContent>
                              </Tooltip>
                              <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="font-black">
                                    {modal.confirmTitle}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-500">
                                    {modal.alertTitle}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-xl font-bold">
                                    {modal.cancel}
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteTask(task._id)}
                                    className="bg-rose-600 hover:bg-rose-700 rounded-xl font-bold"
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
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-20 rounded-[40px] border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center justify-center gap-4">
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-[30px]">
              <ListTodo className="w-12 h-12 text-gray-300" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                {availableSections.length === 0 && isLeader && data?.hasSections
                  ? isRTL
                    ? "قم بإنشاء قسمك الأول للبدء"
                    : "Create your first section to start"
                  : isRTL
                    ? "لا يوجد مهام حالية"
                    : "No Tasks Found"}
              </h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                {availableSections.length === 0 && isLeader && data?.hasSections
                  ? isRTL
                    ? "انقر على زر '+ قسم' لبناء هيكل المشروع الخاص بك."
                    : "Click the '+ Section' button to start building your project structure."
                  : isRTL
                    ? "هذا المشروع لا يحتوي على مهام تتبع هذا التصنيف حالياً."
                    : "This project doesn't have any tasks matching this filter right now."}
              </p>
            </div>
          </div>
        )}
      </div>

      {isLeader && (
        <EditSectionMembersDialog
          isOpen={isEditMembersModalOpen}
          onOpenChange={setIsEditMembersModalOpen}
          section={availableSections.find((s) => s._id === activeSectionId)}
          project={data}
          isRTL={isRTL}
        />
      )}
    </div>
  );
}
