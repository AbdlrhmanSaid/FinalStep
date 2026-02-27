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
import { translations } from "../../../../../lib/translations";
import DatePicker from "../../../../../components/ui/DatePicker";

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
  });

  const content = translations[language].dashboard.editTask;

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
        assignedTo: task.assignedTo || [],
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTask(
      {
        taskId: id,
        userId,
        data: {
          ...form,
          dueDate: form.dueDate || null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Task updated successfully");
          router.push(`/dashboard/projects/${task.projectId._id}`);
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message ||
              "An error occurred while updating the task.",
          );
        },
      },
    );
  };

  if (isLoading) return <Loading />;
  if (isError || !task)
    return <div className="p-8 text-center text-red-500">Task not found.</div>;

  return (
    <CheckUserRole projectId={task.projectId._id}>
      <div className="p-4 md:p-8 bg-white dark:bg-gray-900 dark:text-white min-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">{content.head}</h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-gray-50 dark:bg-gray-800 shadow-md border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl border"
          >
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

            <div className="w-full">
              <Label className="text-sm font-medium block mb-2">
                {content.priority}
              </Label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
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

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isUpdating}
                className="h-11 px-6 rounded-lg shadow-md"
              >
                {isUpdating ? "Updating..." : "Update Task"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </CheckUserRole>
  );
}
