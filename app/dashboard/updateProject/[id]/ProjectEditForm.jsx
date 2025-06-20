"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "../../../../@/components/ui/input";
import { Label } from "../../../../@/components/ui/label";
import { Switch } from "../../../../components/ui/switch";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";

export default function ProjectEditForm({
  project,
  onSubmit, // يجب أن تكون async function ترجع Promise
  isPending,
  content,
  isRTL,
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publicProject, setPublicProject] = useState(false);
  const [invites, setInvites] = useState([""]);
  const [errors, setErrors] = useState({ invites: [] });

  useEffect(() => {
    if (project) {
      setTitle(project.title || "");
      setDescription(project.description || "");
      setPublicProject(project.public || false);
      setInvites(
        project.inviteRequests?.map(({ email }) => email).filter(Boolean) || [
          "",
        ]
      );
    }
  }, [project]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const updateArrayValue = (array, setArray, index, value) => {
    const updated = [...array];
    updated[index] = value;
    setArray(updated);
    setErrors((prev) => ({
      ...prev,
      invites: prev.invites.map((err, i) => (i === index ? "" : err)),
    }));
  };

  const addField = (setArray) => {
    setArray((prev) => [...prev, ""]);
    setErrors((prev) => ({
      ...prev,
      invites: [...prev.invites, ""],
    }));
  };

  const removeField = (array, setArray, index) =>
    setArray(array.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inviteErrors = invites.map((email) =>
      email && !validateEmail(email) ? "Invalid email" : ""
    );

    if (inviteErrors.some(Boolean)) {
      setErrors({ invites: inviteErrors });
      return;
    }

    const formData = {
      title,
      description,
      public: publicProject,
      inviteRequests: invites.filter(Boolean).map((email) => ({ email })),
    };

    try {
      await toast.promise(
        onSubmit(formData), // onSubmit لازم تكون async function
        {
          loading: "Updating project...",
          success: "Project updated successfully!",
          error: "Failed to update project.",
        }
      );

      // Reset form and redirect
      setTitle("");
      setDescription("");
      setPublicProject(false);
      setInvites([""]);
      setErrors({ invites: [] });

      router.push("/dashboard");
    } catch (err) {
      // لا حاجة للتوست هنا لأن toast.promise تعرض الخطأ
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl mx-auto dark:text-white h-screen"
    >
      <div>
        <Label htmlFor="title" className="mb-3">
          {content.titleInput}
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description" className="mb-3">
          {content.describe}
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="public" className="mb-3">
          {content.isPublic}
        </Label>
        <Switch
          id="public"
          checked={publicProject}
          onCheckedChange={setPublicProject}
          className={`${isRTL && "flex-row-reverse"}`}
        />
      </div>

      <div>
        <Label className="mb-3">{content.inviteRequests}</Label>
        {invites.map((email, index) => (
          <div key={index} className="flex items-center gap-2 mt-2">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) =>
                  updateArrayValue(invites, setInvites, index, e.target.value)
                }
              />
              {errors.invites[index] && (
                <p className="text-red-500 text-sm">{errors.invites[index]}</p>
              )}
            </div>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={() => removeField(invites, setInvites, index)}
              aria-label="Remove email"
            >
              <Trash size={16} />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={() => addField(setInvites)}
        >
          <Plus size={16} className="ms-1" /> {content.addinvite}
        </Button>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? content.pindingProject : content.createProject}
      </Button>
    </form>
  );
}
