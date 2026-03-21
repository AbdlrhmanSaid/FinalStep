"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Globe, FolderPlus } from "lucide-react";
import { useAppContext } from "../../../contexts/AppContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import DatePicker from "../../../components/ui/DatePicker";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ProjectForm({ onSubmit, isPending, content, isRTL }) {
  const { userId } = useAppContext();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publicProject, setPublicProject] = useState(false);
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      description,
      public: publicProject,
      deadline: deadline || null,
      leaderId: userId,
    };

    try {
      await toast.promise(onSubmit(formData), {
        loading: isRTL ? "جاري إنشاء المشروع..." : "Creating project...",
        success: isRTL
          ? "تم إنشاء المشروع بنجاح!"
          : "Project created successfully!",
        error: (err) =>
          err.message ||
          (isRTL ? "فشل إنشاء المشروع" : "Failed to create project"),
      });

      // Reset form after successful submission
      setTitle("");
      setDescription("");
      setPublicProject(false);
      setDeadline("");

      router.push("/dashboard/projects");
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  return (
    <Card
      className="max-w-2xl mx-auto border-gray-200 dark:border-gray-800 dark:bg-gray-900 shadow-md transition-colors"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <CardHeader className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800 mb-6 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <FolderPlus className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-xl md:text-2xl font-bold dark:text-white">
              {content.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              {isRTL
                ? "قم بإنشاء مشروعك الجديد وابدأ بخطواتك الأولى."
                : "Create your new project and start your first step."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 pb-4">
          {/* Project Title */}
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
              placeholder={content.titlePlaceholder}
              className="h-12 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm transition-all focus-visible:ring-blue-500"
            />
          </div>

          {/* Project Description */}
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
              placeholder={content.descriptionPlaceholder}
              className="resize-none bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm transition-all focus-visible:ring-blue-500"
              rows={5}
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
                disablePast={true}
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

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mt-8">
            <Button
              type="submit"
              className="w-full h-12 text-md font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {content.pindingProject}
                </span>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
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
