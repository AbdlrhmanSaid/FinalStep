"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { translations } from "@/lib/translations";
import { useGetProject } from "@/hooks/projects/useGetProjects";
import { useCreateTask } from "@/hooks/tasks/useTasks";
import { useParams, useRouter } from "next/navigation";
import CheckUserRole from "@/lib/actions/checkUserRole";
import Loading from "@/components/Loading";
import DatePicker from "@/components/ui/DatePicker";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Plus, ListTodo } from "lucide-react";

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
    dueDate: "",
    referenceLink: "",
    assignedTo: [],
    submissionMethod: "both",
    submissionDescription: "",
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
        dueDate: form.dueDate || null,
        projectId,
        createdBy: userId,
      },
      {
        onSuccess: () => {
          toast.success(content.successMessage);
          router.push(`/dashboard/projects/${projectId}`);
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message ||
              (isRTL ? "حدث خطأ أثناء إنشاء المهمة." : "An error occurred."),
          );
        },
      },
    );
  };

  if (isLoading || !project) return <Loading />;

  const allUsers = [...project.coLeaders, ...project.members];
  const teamMembers = Array.from(
    new Map(allUsers.map((user) => [user._id, user])).values(),
  );

  return (
    <CheckUserRole>
      <div className="p-4 md:p-8 bgMain min-h-screen transition-colors overflow-hidden">
        <Card
          className="max-w-3xl mx-auto border-gray-200 dark:border-gray-800 shadow-md transition-colors dark:bg-gray-800"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <CardHeader className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800 mb-6 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                <ListTodo className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold dark:text-white">
                  {content.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 mt-1">
                  {isRTL
                    ? "قم بإنشاء وتعيين مهام جديدة لأعضاء الفريق."
                    : "Create and assign new tasks for the team members."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 pb-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[15px] font-semibold">
                  {content.taskTitle}
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder={content.taskTitlePlaceholder}
                  className="h-12 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-[15px] font-semibold"
                >
                  {content.taskDescription}
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder={content.taskDescriptionPlaceholder}
                  className="resize-none bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm focus-visible:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="priority"
                    className="text-[15px] font-semibold block"
                  >
                    {content.taskPriority}
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
                      {content.priorityLow}
                    </option>
                    <option
                      value="medium"
                      className="text-yellow-600 dark:text-yellow-400"
                    >
                      {content.priorityMedium}
                    </option>
                    <option
                      value="high"
                      className="text-red-600 dark:text-red-400"
                    >
                      {content.priorityHigh}
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
                    onChange={(val) => setForm({ ...form, dueDate: val })}
                    placeholder={
                      content.dueDatePlaceholder || "Pick a due date..."
                    }
                    disablePast={true}
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
              <div className="space-y-2 pt-2">
                <Label className="text-[15px] font-semibold">
                  {content.assignTo}
                </Label>
                <Command className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm dark:bg-gray-900 mt-1">
                  <CommandInput
                    placeholder={content.searchMember}
                    className="h-12 outline-none border-none ring-0 shadow-none focus-visible:ring-0 focus:outline-none"
                  />
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
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-3 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center text-sm font-bold shadow-sm">
                          {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white">
                            {user.name !== "null null" && user.name
                              ? user.name
                              : user.email?.split("@")[0].replace(/[0-9]/g, "")}
                          </p>
                          {user.name && user.name !== "null null" && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              {user.email}
                            </p>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>

                {form.assignedTo.length > 0 && (
                  <div className="space-y-2 mt-4 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <Label className="text-[14px] text-gray-600 dark:text-gray-300 font-medium">
                      {content.selectedMembers}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {form.assignedTo.map((uid) => {
                        const user = teamMembers.find((u) => u._id === uid);
                        return (
                          <Badge
                            key={uid}
                            onClick={() => handleRemoveAssigned(uid)}
                            variant="secondary"
                            className="cursor-pointer bg-white dark:bg-gray-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 border border-gray-200 dark:border-gray-600 px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all shadow-sm group"
                          >
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">
                              {user?.email?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <span className="font-medium">
                              {user?.name && user.name !== "null null"
                                ? user.name
                                : user?.email
                                    ?.split("@")[0]
                                    .replace(/[0-9]/g, "") || uid}
                            </span>
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

              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mt-8">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-12 text-md font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {content.creating}
                    </span>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      {content.create}
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
