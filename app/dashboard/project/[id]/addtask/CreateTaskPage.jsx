"use client";

import { useState } from "react";
import { useAppContext } from "../../../../../contexts/AppContext";
import { translations } from "../../../../../lib/translations";
import { useGetProject } from "../../../../../hooks/projects/useGetProjects";
import { useCreateTask } from "../../../../../hooks/tasks/useTasks";
import { useParams, useRouter } from "next/navigation";
import CheckUserRole from "../../../../../lib/actions/checkUserRole";
import Loading from "../../../../../components/Loading";

import { Input } from "../../../../../@/components/ui/input";
import { Button } from "../../../../../@/components/ui/button";
import { Label } from "../../../../../@/components/ui/label";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../../@/components/ui/command";
import { Badge } from "../../../../../@/components/ui/badge";
import { Textarea } from "../../../../../@/components/ui/textarea";
import toast from "react-hot-toast";

export default function CreateTaskPage() {
  const { id: projectId } = useParams();
  const { data: project, isLoading } = useGetProject(projectId);
  const { mutate: createTask, isPending } = useCreateTask();
  const { language, isRTL, userId } = useAppContext();
  const router = useRouter();

  const content = translations[language].dashboard.addTask;

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: [],
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAssign = (userId) => {
    if (!form.assignedTo.includes(userId)) {
      setForm((prev) => ({
        ...prev,
        assignedTo: [...prev.assignedTo, userId],
      }));
    }
  };

  const handleRemoveAssigned = (userId) => {
    setForm((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.filter((id) => id !== userId),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createTask(
      {
        ...form,
        projectId,
        createdBy: userId,
      },
      {
        onSuccess: () => {
          toast.success(content.successMessage);
          router.push(`/dashboard/project/${projectId}`);
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message ||
              "حدث خطأ أثناء إنشاء المهمة. حاول مرة أخرى."
          );
        },
      }
    );
  };

  if (isLoading || !project) return <Loading />;

  const allUsers = [...project.coLeaders, ...project.members];

  const teamMembers = Array.from(
    new Map(allUsers.map((user) => [user._id, user])).values()
  );

  return (
    <CheckUserRole>
      <div className="p-4 md:p-8 bgMain min-h-screen transition-colors overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold dar dark:text-white bg-clip-text text-transparent">
              {content.title}
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-gray-50 dark:bg-gray-800 shadow-md border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-2xl  border "
          >
            {/* Task Title */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{content.taskTitle}</Label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder={content.taskTitlePlaceholder}
                className="mt-1 h-11"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {content.taskDescription}
              </Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder={content.taskDescriptionPlaceholder}
                className="mt-1 min-h-[120px]"
              />
            </div>

            {/* Priority */}
            <div className="w-full">
              <label className="text-sm font-medium block mb-2">
                {content.taskPriority}
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low" className="text-blue-500">
                  {" "}
                  {content.priorityLow}
                </option>
                <option value="medium" className="text-yellow-500">
                  {" "}
                  {content.priorityMedium}
                </option>
                <option value="high" className="text-red-500">
                  {content.priorityHigh}
                </option>
              </select>
            </div>

            {/* Assign Members */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{content.assignTo}</Label>
              <Command className="border rounded-lg overflow-hidden dark:bg-gray-800 mt-1">
                <CommandInput
                  placeholder={content.searchMember}
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
                        <p className="font-medium">
                          {user.name !== "null null"
                            ? user.name
                            : user.email.split("@")[0].replace(/[0-9]/g, "")}
                        </p>
                        {user.name && (
                          <p className="text-xs text-gray-500">{user.email}</p>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>

              {/* Selected members */}
              {form.assignedTo.length > 0 && (
                <div className="space-y-2 mt-4">
                  <Label className="text-sm font-medium">
                    {content.selectedMembers}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {form.assignedTo.map((uid) => {
                      const user = teamMembers.find((u) => u._id === uid);
                      return (
                        <Badge
                          key={uid}
                          onClick={() => handleRemoveAssigned(uid)}
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white px-3 py-1.5 rounded-full flex items-center gap-2"
                        >
                          <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs">
                            {user?.email?.charAt(0).toUpperCase()}
                          </div>
                          {user.name !== "null null"
                            ? user.name
                            : user.email.split("@")[0].replace(/[0-9]/g, "")}
                          <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            ×
                          </span>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4 m-auto">
              <Button
                type="submit"
                disabled={isPending}
                className="h-11 px-6 rounded-lg shadow-md transition-all"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    {content.creating}
                  </span>
                ) : (
                  content.create
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </CheckUserRole>
  );
}
