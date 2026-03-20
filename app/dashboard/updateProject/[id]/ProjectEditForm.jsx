"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "../../../../components/ui/switch";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, FileText, Globe } from "lucide-react";
import DatePicker from "../../../../components/ui/DatePicker";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ProjectEditForm({
  project,
  onSubmit,
  isPending,
  content,
  isRTL,
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publicProject, setPublicProject] = useState(false);
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (project) {
      setTitle(project.title || "");
      setDescription(project.description || "");
      setPublicProject(project.public || false);
      setDeadline(
        project.deadline
          ? new Date(project.deadline).toISOString().split("T")[0]
          : "",
      );
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      description,
      public: publicProject,
      deadline: deadline || null,
    };

    try {
      await toast.promise(onSubmit(formData), {
        loading: isRTL ? "جاري التحديث..." : "Updating project...",
        success: isRTL ? "تم تحديث المشروع!" : "Project updated successfully!",
        error: isRTL ? "فشل التحديث" : "Failed to update problem.",
      });

      setTitle("");
      setDescription("");
      setPublicProject(false);
      setDeadline("");

      router.push(`/dashboard/projects/${project._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card
      className="max-w-2xl mx-auto border-gray-200 dark:border-gray-800 dark:bg-gray-800 shadow-md transition-colors"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <CardHeader className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800 mb-6 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-xl md:text-2xl font-bold dark:text-white">
              {content.createProject}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              {isRTL
                ? "قم بتعديل الإعدادات الأساسية الخاصة بالمشروع."
                : "Modify the basic settings for your project."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 pb-4">
          <div className="space-y-1">
            <Label
              htmlFor="title"
              className="text-[15px] font-semibold flex items-center gap-2 mb-2"
            >
              {content.titleInput}
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-12 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm transition-all focus-visible:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="description"
              className="text-[15px] font-semibold flex items-center gap-2 mb-2"
            >
              {content.describe}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="resize-none bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm transition-all focus-visible:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Project Deadline */}
            <div className="space-y-1 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <Label
                htmlFor="deadline"
                className="text-[15px] font-semibold block mb-3"
              >
                {content.deadline}
              </Label>
              <DatePicker
                value={deadline}
                onChange={setDeadline}
                placeholder={
                  content.deadlinePlaceholder || "Pick a deadline date..."
                }
                locale={isRTL ? "ar" : "en"}
              />
              {deadline && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                  {content.deadlineHint}
                </p>
              )}
            </div>

            {/* Public/Private Switch */}
            <div className="space-y-1 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col justify-center items-center h-full min-h-[120px]">
              <div className="flex flex-col items-center justify-center space-y-3 w-full">
                <Globe
                  className={`w-8 h-8 ${publicProject ? "text-green-500" : "text-gray-400"}`}
                />
                <div className="flex items-center gap-3">
                  <Label
                    htmlFor="public"
                    className="text-[15px] font-semibold cursor-pointer"
                  >
                    {content.isPublic}
                  </Label>
                  <Switch
                    id="public"
                    checked={publicProject}
                    onCheckedChange={setPublicProject}
                    className={`${isRTL && "flex-row-reverse"}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mt-8">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 text-md font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {content.pindingProject}
                </span>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {content.createProject}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
