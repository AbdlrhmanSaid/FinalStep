"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, Globe, Layers } from "lucide-react";
import DatePicker from "@/components/ui/DatePicker";

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
  const [hasSections, setHasSections] = useState(true);
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (project) {
      setTitle(project.title || "");
      setDescription(project.description || "");
      setPublicProject(project.public || false);
      setHasSections(project.hasSections !== false);
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
      hasSections,
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
    <div
      className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="bg-gray-50/50 dark:bg-gray-800/50 p-6 md:p-8 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {content.createProject}
            </h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
              {isRTL
                ? "قم بتعديل الإعدادات الأساسية الخاصة بالمشروع."
                : "Modify the basic settings for your project."}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-bold text-gray-900 dark:text-white"
            >
              {content.titleInput} <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-12 bg-white dark:bg-gray-900 dark:text-white border-gray-200 dark:border-gray-700 rounded-xl focus-visible:ring-indigo-500 font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-bold text-gray-900 dark:text-white"
            >
              {content.describe}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none min-h-[120px] bg-white dark:text-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl focus-visible:ring-indigo-500 font-medium p-4"
              rows={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <Label
                htmlFor="deadline"
                className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2"
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
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {content.deadlineHint}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center justify-center space-y-4 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 h-full min-h-[140px]">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${publicProject ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-gray-200 dark:bg-gray-800 text-gray-500"}`}
              >
                <Globe className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-3">
                <Label
                  htmlFor="public"
                  className="text-sm font-bold text-gray-900 dark:text-white cursor-pointer"
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

            <div className="flex flex-col items-center justify-center space-y-4 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 h-full min-h-[140px]">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${hasSections ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600" : "bg-gray-200 dark:bg-gray-800 text-gray-500"}`}
              >
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-3">
                <Label
                  htmlFor="hasSections"
                  className="text-sm font-bold text-gray-900 dark:text-white cursor-pointer"
                >
                  {isRTL ? "تفعيل نظام الأقسام (Sections)" : "Enable Sections"}
                </Label>
                <Switch
                  id="hasSections"
                  checked={hasSections}
                  onCheckedChange={setHasSections}
                  className={`${isRTL && "flex-row-reverse"}`}
                />
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm text-base"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {content.pindingProject}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  {content.createProject}{" "}
                  {/* Should be "Update Project" but reusing key from before */}
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
