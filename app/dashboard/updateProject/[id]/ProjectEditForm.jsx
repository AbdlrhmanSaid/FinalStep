"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "../../../../components/ui/switch";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, ArrowDown, ArrowUp } from "lucide-react";
import DatePicker from "../../../../components/ui/DatePicker";

import { useDeleteMember } from "../../../../hooks/projects/useDeleteMember";
import { useUpdateMemberRole } from "../../../../hooks/projects/useUpdateMemberRole";

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
  const [invites, setInvites] = useState([""]);
  const [errors, setErrors] = useState({ invites: [] });

  const { mutate: deleteMember } = useDeleteMember();
  const { mutate: updateMemberRole } = useUpdateMemberRole();

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
      setInvites(
        project.inviteRequests?.map(({ email }) => email).filter(Boolean) || [
          "",
        ],
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
    if (invites[invites.length - 1] === "") return;
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
      email && !validateEmail(email) ? "Invalid email" : "",
    );

    if (inviteErrors.some(Boolean)) {
      setErrors({ invites: inviteErrors });
      return;
    }

    const formData = {
      title,
      description,
      public: publicProject,
      deadline: deadline || null,
      inviteRequests: invites.filter(Boolean).map((email) => ({ email })),
    };

    try {
      await toast.promise(onSubmit(formData), {
        loading: "Updating project...",
        success: "Project updated successfully!",
        error: "Failed to update project.",
      });

      setTitle("");
      setDescription("");
      setPublicProject(false);
      setDeadline("");
      setInvites([""]);
      setErrors({ invites: [] });

      router.push("/dashboard/projects");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (userId) => {
    deleteMember({ projectId: project._id, userId });
  };

  const handlePromote = (userId) => {
    updateMemberRole({ projectId: project._id, userId, action: "promote" });
  };

  const handleDemote = (userId) => {
    updateMemberRole({ projectId: project._id, userId, action: "demote" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto dark:text-white pb-10"
    >
      {/* Inputs */}
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

      {/* Project Deadline */}
      <div>
        <Label htmlFor="deadline" className="mb-3 block">
          {content.deadline}
        </Label>
        <DatePicker
          value={deadline}
          onChange={setDeadline}
          placeholder={content.deadlinePlaceholder || "Pick a deadline date..."}
          locale={isRTL ? "ar" : "en"}
        />
        {deadline && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {content.deadlineHint}
          </p>
        )}
      </div>

      {/* Invitations */}
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

      {/* ✅ Team Members Section */}
      <div className="mt-8 border-t pt-6 border-gray-300 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">{content.teamwork}</h3>

        {/* Co-Leaders */}
        {project.coLeaders?.length > 0 ? (
          <div className="mb-6">
            <p className="mb-2 font-semibold text-yellow-500">
              {content.admins}
            </p>
            {project.coLeaders.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-md mb-2"
              >
                <span>
                  {user.name !== "null null"
                    ? user.name
                    : user.email.split("@")[0].replace(/[0-9]/g, "")}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDemote(user._id)}
                  >
                    <ArrowDown size={16} /> {content.demotion}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user._id)}
                    aria-label="Remove member"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-yellow-400 italic mb-6">
            {content.noAdmins}
          </div>
        )}

        {/* Members */}
        {project.members?.length > 0 &&
        project.members.some(
          (member) =>
            !project.coLeaders?.some((coLeader) => coLeader._id === member._id),
        ) ? (
          <div>
            <p className="mb-2 font-semibold text-blue-500">
              {content.members}
            </p>
            {project.members
              .filter(
                (member) =>
                  !project.coLeaders?.some(
                    (coLeader) => coLeader._id === member._id,
                  ),
              )
              .map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-md mb-2"
                >
                  <span>
                    {user.name !== "null null"
                      ? user.name
                      : user.email.split("@")[0].replace(/[0-9]/g, "")}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePromote(user._id)}
                    >
                      <ArrowUp size={16} /> {content.promotion}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user._id)}
                      aria-label="Remove member"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center text-blue-400 italic">
            {content.noAMembers}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full mt-4" disabled={isPending}>
        {isPending ? content.pindingProject : content.createProject}
      </Button>
    </form>
  );
}
