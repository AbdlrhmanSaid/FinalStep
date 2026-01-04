"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { useAppContext } from "../../../contexts/AppContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProjectForm({ onSubmit, isPending, content, isRTL }) {
  const { userId } = useAppContext();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publicProject, setPublicProject] = useState(false);
  const [invites, setInvites] = useState([""]);
  const [errors, setErrors] = useState({ invites: [] });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inviteErrors = invites.map((email) =>
      email && !validateEmail(email) ? "Invalid email" : ""
    );

    if (inviteErrors.some(Boolean)) {
      setErrors({ invites: inviteErrors });
      toast.error("Please fix the email errors before submitting");
      return;
    }

    const formData = {
      title,
      description,
      public: publicProject,
      leaderId: userId,
      inviteRequests: invites.filter(Boolean).map((email) => ({ email })),
    };

    try {
      await toast.promise(onSubmit(formData), {
        loading: "Creating project and sending invites...",
        success: "Project created successfully!",
        error: (err) => err.message || "Failed to create project",
      });

      // Reset form after successful submission
      setTitle("");
      setDescription("");
      setPublicProject(false);
      setInvites([""]);
      setErrors({ invites: [] });

      router.push("/dashboard/projects");
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  const updateArrayValue = (array, setArray, index, value) => {
    const updated = [...array];
    updated[index] = value;
    setArray(updated);
    setErrors((prev) => ({
      ...prev,
      invites: prev.invites.map((err, i) => (i === index ? "" : err)),
    }));
  };

  const addField = () => {
    if (invites[invites.length - 1] === "") {
      toast.error("Please fill the current email field first");
      return;
    }
    setInvites((prev) => [...prev, ""]);
    setErrors((prev) => ({
      ...prev,
      invites: [...prev.invites, ""],
    }));
  };

  const removeField = (index) => {
    if (invites.length <= 1) {
      setInvites([""]);
      setErrors({ invites: [""] });
      return;
    }
    setInvites(invites.filter((_, i) => i !== index));
    setErrors((prev) => ({
      ...prev,
      invites: prev.invites.filter((_, i) => i !== index),
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl mx-auto dark:text-white pb-10"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Project Title */}
      <div>
        <Label htmlFor="title" className="mb-2 block">
          {content.titleInput}
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder={content.titlePlaceholder}
          className="dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      {/* Project Description */}
      <div>
        <Label htmlFor="description" className="mb-2 block">
          {content.describe}
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={content.descriptionPlaceholder}
          className="dark:bg-gray-800 dark:border-gray-700"
          rows={4}
        />
      </div>

      {/* Public Project Switch */}
      <div
        className={`flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-800 $`}
      >
        <Label htmlFor="public" className="text-sm font-medium">
          {content.isPublic}
        </Label>
        <Switch
          id="public"
          checked={publicProject}
          onCheckedChange={setPublicProject}
          className={`${isRTL ? "ml-2 flex-row-reverse" : "mr-2"}`}
        />
      </div>

      {/* Email Invitations */}
      <div className="space-y-3">
        <Label className="block">{content.inviteRequests}</Label>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {content.inviteDescription}
        </p>

        {invites.map((email, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) =>
                  updateArrayValue(invites, setInvites, index, e.target.value)
                }
                className="dark:bg-gray-800 dark:border-gray-700"
              />
              {errors.invites[index] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.invites[index]}
                </p>
              )}
            </div>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={() => removeField(index)}
              aria-label="Remove email"
              className="shrink-0"
            >
              <Trash size={16} />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addField}
          className="mt-2"
        >
          <Plus size={16} className={isRTL ? "ml-2" : "mr-2"} />
          {content.addinvite}
        </Button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full mt-6"
        disabled={isPending}
        size="lg"
      >
        {isPending ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {content.pindingProject}
          </span>
        ) : (
          content.createProject
        )}
      </Button>
    </form>
  );
}
