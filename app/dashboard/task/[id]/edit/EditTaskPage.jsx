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
    assignedTo: [], // array of user IDs
    submissionMethod: "both",
    submissionDescription: "",
  });

  const content = translations[language].dashboard.editTask;
  const addTaskContent = translations[language].dashboard.addTask;

  // Load project members for the assign dropdown
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
    return <div className="p-8 text-center text-red-500">Task not found.</div>;

  return (
    <CheckUserRole projectId={task.projectId._id || task.projectId}>
      <div className="p-4 md:p-8 bg-white dark:bg-gray-900 dark:text-white min-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">{content.head}</h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-gray-50 dark:bg-gray-800 shadow-md border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl border"
          >
            {/* Title */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{content.title}</Label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="mt-1 h-11"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {content.description}
              </Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                className="mt-1 min-h-[120px]"
              />
            </div>

            {/* Reference Link */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {isRTL ? "رابط مرجعي (اختياري)" : "Reference Link (Optional)"}
              </Label>
              <Input
                name="referenceLink"
                type="url"
                value={form.referenceLink}
                onChange={handleChange}
                placeholder="https://..."
                className="mt-1 h-11"
              />
            </div>

            {/* Priority */}
            <div className="w-full">
              <Label
                htmlFor="priority"
                className="text-sm font-medium block mb-2"
              >
                {content.priority}
              </Label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">{isRTL ? "منخفضة" : "Low"}</option>
                <option value="medium">{isRTL ? "متوسطة" : "Medium"}</option>
                <option value="high">{isRTL ? "مرتفعة" : "High"}</option>
              </select>
            </div>

            {/* Submission Method */}
            <div className="w-full">
              <Label
                htmlFor="submissionMethod"
                className="text-sm font-medium block mb-2"
              >
                {content.submissionMethod}
              </Label>
              <select
                id="submissionMethod"
                name="submissionMethod"
                value={form.submissionMethod}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="both">{content.methodBoth}</option>
                <option value="text">{content.methodText}</option>
                <option value="link">{content.methodLink}</option>
              </select>
            </div>

            {/* Submission Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {content.submissionDescriptionLabel}
              </Label>
              <Textarea
                name="submissionDescription"
                value={form.submissionDescription}
                onChange={handleChange}
                rows={3}
                placeholder={content.submissionDescriptionPlaceholder}
                className="mt-1 min-h-[80px]"
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium block">
                {content.dueDate}
              </Label>
              <DatePicker
                value={form.dueDate}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, dueDate: val }))
                }
                placeholder={content.dueDatePlaceholder || "Pick a due date..."}
                locale={isRTL ? "ar" : "en"}
              />
              {form.dueDate && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {content.dueDateHint}
                </p>
              )}
            </div>

            {/* Assign Members */}
            {teamMembers.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {addTaskContent.assignTo}
                </Label>
                <Command className="border rounded-lg overflow-hidden dark:bg-gray-800 mt-1">
                  <CommandInput
                    placeholder={addTaskContent.searchMember}
                    className="h-11"
                  />
                  <CommandList className="max-h-40 overflow-auto">
                    {teamMembers.map((user) => (
                      <CommandItem
                        key={user._id}
                        value={
                          user.name !== "null null"
                            ? user.name
                            : user.email.split("@")[0].replace(/[0-9]/g, "")
                        }
                        onSelect={() => handleAssign(user._id)}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium">
                          {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {user.name !== "null null"
                              ? user.name
                              : user.email.split("@")[0].replace(/[0-9]/g, "")}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        {form.assignedTo.includes(user._id) && (
                          <span className="ml-auto text-green-600 text-xs font-medium">
                            ✓ {isRTL ? "مضاف" : "Added"}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>

                {/* Selected members */}
                {form.assignedTo.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <Label className="text-sm font-medium">
                      {addTaskContent.selectedMembers}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {form.assignedTo.map((uid) => {
                        const user = teamMembers.find((u) => u._id === uid);
                        // If user not found in teamMembers (e.g. leader), try task.assignedTo
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
                            variant="outline"
                            className="cursor-pointer hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 dark:text-white px-3 py-1.5 rounded-full flex items-center gap-2 transition-colors"
                          >
                            <div className="w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-700 flex items-center justify-center text-xs">
                              {(typeof displayName === "string"
                                ? displayName
                                : String(displayName)
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            {displayName}
                            <span className="text-gray-400 hover:text-red-500">
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

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isUpdating}
                className="h-11 px-6 rounded-lg shadow-md"
              >
                {isUpdating
                  ? isRTL
                    ? "جاري التحديث..."
                    : "Updating..."
                  : isRTL
                    ? "تحديث المهمة"
                    : "Update Task"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </CheckUserRole>
  );
}
