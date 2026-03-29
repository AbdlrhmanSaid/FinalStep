"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetTask, useUpdateTask } from "../../../../../hooks/tasks/useTasks";
import { useAppContext } from "../../../../../contexts/AppContext";
import Loading from "../../../../../components/Loading";
import CheckUserRole from "../../../../../lib/actions/checkUserRole";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { translations } from "../../../../../lib/translations";
import DatePicker from "../../../../../components/ui/DatePicker";
import { useGetProject } from "../../../../../hooks/projects/useGetProjects";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Edit, RefreshCw } from "lucide-react";

export default function EditTaskPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: task, isLoading, isError } = useGetTask(id);
  const { mutate: updateTask, isLoading: isUpdating } = useUpdateTask();
  const { userId, language, isRTL } = useAppContext();

  const [form, setForm] = useState({
    title: "",
    description: "",
    referenceLink: "",
    priority: "medium",
    dueDate: "",
    assignedTo: [],
    submissionMethod: "both",
    submissionDescription: "",
    allowLateSubmission: true,
  });

  const content = translations[language].dashboard.editTask;
  const addTaskContent = translations[language].dashboard.addTask;

  const projectId = task?.projectId?._id || task?.projectId;
  const { data: project } = useGetProject(projectId);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        referenceLink: task.referenceLink || "",
        priority: task.priority || "medium",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        assignedTo: (task.assignedTo || []).map((u) =>
          typeof u === "object" ? u._id : u,
        ),
        submissionMethod: task.submissionMethod || "both",
        submissionDescription: task.submissionDescription || "",
        allowLateSubmission: task.allowLateSubmission !== false, // default true
      });
    }
  }, [task]);

  const allUsers = project
    ? [...(project.coLeaders || []), ...(project.members || [])]
    : [];

  const teamMembers = Array.from(
    new Map(allUsers.map((user) => [user._id, user])).values(),
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssign = (uid) => {
    if (!form.assignedTo.includes(uid)) {
      setForm((prev) => ({ ...prev, assignedTo: [...prev.assignedTo, uid] }));
    }
  };

  const handleRemoveAssigned = (uid) => {
    setForm((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.filter((id) => id !== uid),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.assignedTo.length === 0) {
      toast.error(
        isRTL
          ? "يجب تعيين المهمة لعضو واحد على الأقل"
          : "At least one member must be assigned",
      );
      return;
    }

    updateTask(
      {
        taskId: id,
        userId,
        data: {
          title: form.title,
          description: form.description,
          referenceLink: form.referenceLink,
          priority: form.priority,
          dueDate: form.dueDate || null,
          assignedTo: form.assignedTo,
          submissionMethod: form.submissionMethod,
          submissionDescription: form.submissionDescription,
          allowLateSubmission: form.allowLateSubmission,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            isRTL ? "تم تحديث المهمة بنجاح" : "Task updated successfully",
          );
          router.push(
            `/dashboard/projects/${task.projectId._id || task.projectId}`,
          );
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message ||
              (isRTL
                ? "حدث خطأ أثناء التحديث"
                : "An error occurred while updating the task."),
          );
        },
      },
    );
  };

  if (isLoading) return <Loading />;
  if (isError || !task)
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Task not found.
      </div>
    );

  return (
    <CheckUserRole projectId={task.projectId._id || task.projectId}>
      <div className="p-4 md:p-8 bgMain min-h-screen transition-colors overflow-hidden">
        <Card
          className="max-w-3xl mx-auto border-gray-200 dark:border-gray-800 dark:bg-gray-800 shadow-md transition-colors"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <CardHeader className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800 mb-6 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 rounded-xl">
                <Edit className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold dark:text-white">
                  {content.head}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 mt-1">
                  {isRTL
                    ? "تعديل معلومات وتفاصيل المهمة الحالية وميزاتها."
                    : "Edit the current task details and properties."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 pb-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[15px] font-semibold">
                  {content.title}
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="h-12 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-[15px] font-semibold"
                >
                  {content.description}
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="resize-none bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm focus-visible:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="priority"
                    className="text-[15px] font-semibold block"
                  >
                    {content.priority}
                  </Label>
                  <select
                    id="priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full h-12 px-3 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option
                      value="low"
                      className="text-blue-600 dark:text-blue-400"
                    >
                      {isRTL ? "منخفضة" : "Low"}
                    </option>
                    <option
                      value="medium"
                      className="text-yellow-600 dark:text-yellow-400"
                    >
                      {isRTL ? "متوسطة" : "Medium"}
                    </option>
                    <option
                      value="high"
                      className="text-red-600 dark:text-red-400"
                    >
                      {isRTL ? "مرتفعة" : "High"}
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="submissionMethod"
                    className="text-[15px] font-semibold block"
                  >
                    {content.submissionMethod}
                  </Label>
                  <select
                    id="submissionMethod"
                    name="submissionMethod"
                    value={form.submissionMethod}
                    onChange={handleChange}
                    className="w-full h-12 px-3 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="both">{content.methodBoth}</option>
                    <option value="text">{content.methodText}</option>
                    <option value="link">{content.methodLink}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="submissionDescription"
                  className="text-[15px] font-semibold"
                >
                  {content.submissionDescriptionLabel}
                </Label>
                <Textarea
                  id="submissionDescription"
                  name="submissionDescription"
                  value={form.submissionDescription}
                  onChange={handleChange}
                  rows={2}
                  placeholder={content.submissionDescriptionPlaceholder}
                  className="resize-none bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm focus-visible:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <Label className="text-[15px] font-semibold block mb-2">
                    {content.dueDate}
                  </Label>
                  <DatePicker
                    value={form.dueDate}
                    onChange={(val) =>
                      setForm((prev) => ({ ...prev, dueDate: val }))
                    }
                    placeholder={
                      content.dueDatePlaceholder || "Pick a due date..."
                    }
                    disablePast={false}
                    locale={isRTL ? "ar" : "en"}
                  />
                  {form.dueDate && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {content.dueDateHint}
                    </p>
                  )}
                </div>

                <div className="space-y-2 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <Label
                    htmlFor="referenceLink"
                    className="text-[15px] font-semibold block mb-2"
                  >
                    {isRTL
                      ? "رابط مرجعي (اختياري)"
                      : "Reference Link (Optional)"}
                  </Label>
                  <Input
                    id="referenceLink"
                    name="referenceLink"
                    type="url"
                    value={form.referenceLink}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="h-11 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              {/* Assign Members */}
              {teamMembers.length > 0 && (
                <div className="space-y-2 pt-2">
                  <Label className="text-[15px] font-semibold">
                    {addTaskContent.assignTo}
                  </Label>
                  <Command className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm dark:bg-gray-900 mt-1" dir={isRTL ? "rtl" : "ltr"}>
                    <div className="relative">
                      <CommandInput
                        placeholder={addTaskContent.searchMember}
                        className={`h-12 outline-none border-none ring-0 shadow-none focus-visible:ring-0 focus:outline-none ${isRTL ? "pr-10" : "pl-10"}`}
                      />
                    </div>
                    <CommandList className="max-h-48 overflow-auto">
                      {teamMembers.map((user) => (
                        <CommandItem
                          key={user._id}
                          value={
                            user.name !== "null null" && user.name
                              ? user.name
                              : user.email?.split("@")[0].replace(/[0-9]/g, "")
                          }
                          onSelect={() => handleAssign(user._id)}
                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center justify-between gap-3 transition-colors min-w-0"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                              {user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 dark:text-white truncate">
                                {user.name !== "null null" && user.name
                                  ? user.name
                                  : user.email
                                      ?.split("@")[0]
                                      .replace(/[0-9]/g, "")}
                              </p>
                              {user.name && user.name !== "null null" && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
                                  {user.email}
                                </p>
                              )}
                            </div>
                          </div>
                          {form.assignedTo.includes(user._id) && (
                            <span className="shrink-0 text-green-600 dark:text-green-400 text-xs font-bold flex items-center gap-1">
                              ✓ {isRTL ? "مضاف" : "Added"}
                            </span>
                          )}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>

                  {/* Selected members */}
                  {form.assignedTo.length > 0 && (
                    <div className="space-y-2 mt-4 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                      <Label className="text-[14px] text-gray-600 dark:text-gray-300 font-medium">
                        {addTaskContent.selectedMembers}
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {form.assignedTo.map((uid) => {
                          const user = teamMembers.find((u) => u._id === uid);
                          const fallback = (task.assignedTo || []).find(
                            (u) => (u._id || u) === uid,
                          );
                          const displayUser = user || fallback;
                          const displayName = displayUser
                            ? typeof displayUser === "object"
                              ? displayUser.name &&
                                displayUser.name !== "null null"
                                ? displayUser.name
                                : displayUser.email?.split("@")[0] || uid
                              : uid
                            : uid;
                          return (
                            <Badge
                              key={uid}
                              onClick={() => handleRemoveAssigned(uid)}
                              variant="secondary"
                              className="cursor-pointer bg-white dark:bg-gray-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 border border-gray-200 dark:border-gray-600 px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all shadow-sm group"
                            >
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">
                                {(typeof displayName === "string"
                                  ? displayName
                                  : String(displayName)
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <span className="font-medium">{displayName}</span>
                              <span className="text-gray-400 group-hover:text-red-500 font-bold ml-1">
                                ×
                              </span>
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Late Submission Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-semibold text-gray-800 dark:text-white">
                    {isRTL ? "السماح بالتسليم المتأخر" : "Allow Late Submission"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {form.allowLateSubmission
                      ? isRTL
                        ? "الأعضاء يقدرون يسلموا بعد الـ deadline (يُحتسب متأخر)"
                        : "Members can submit after the deadline (marked as late)"
                      : isRTL
                        ? "لا يُسمح بالتسليم بعد انتهاء الـ deadline"
                        : "Submissions blocked after the deadline"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, allowLateSubmission: !prev.allowLateSubmission }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    form.allowLateSubmission ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      form.allowLateSubmission ? (isRTL ? "-translate-x-6" : "translate-x-6") : (isRTL ? "-translate-x-1" : "translate-x-1")
                    }`}
                  />
                </button>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mt-8">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full h-12 text-md font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isRTL ? "جاري التحديث..." : "Updating..."}
                    </span>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      {isRTL ? "تحديث المهمة" : "Update Task"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </CheckUserRole>
  );
}
