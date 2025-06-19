"use client";

import { useState } from "react";
import { Input } from "../../../@/components/ui/input";
import { Label } from "../../../@/components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { useAppContext } from "../../../contexts/AppContext";
import toast from "react-hot-toast";

export default function ProjectForm({ onSubmit, isPending, content, isRTL }) {
  const { userId } = useAppContext();

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
      return;
    }

    const formData = {
      title,
      description,
      public: publicProject,
      leaderId: userId,
      inviteRequests: invites.filter(Boolean).map((email) => ({ email })),
    };

    toast.promise(
      new Promise((resolve, reject) => {
        onSubmit(formData, {
          onSuccess: () => {
            // تفريغ الحقول
            setTitle("");
            setDescription("");
            setPublicProject(false);
            setInvites([""]);
            setErrors({ invites: [] });
            resolve();
          },
          onError: () => reject(),
        });
      }),
      {
        loading: "Creating project...",
        success: "Project created successfully!",
        error: "Failed to create project.",
      }
    );
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

  const addField = (setArray) => setArray((prev) => [...prev, ""]);
  const removeField = (array, setArray, index) =>
    setArray(array.filter((_, i) => i !== index));

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl mx-auto dark:text-white h-screen"
    >
      {/* title */}
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

      {/* description */}
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

      {/* public switch */}
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

      {/* invites */}
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
