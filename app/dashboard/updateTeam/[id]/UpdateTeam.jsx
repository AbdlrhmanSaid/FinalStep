"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Plus, Trash, ArrowDown, ArrowUp, Send, Users } from "lucide-react";

import { useGetProject } from "../../../../hooks/projects/useGetProjects";
import { useDeleteMember } from "../../../../hooks/projects/useDeleteMember";
import { useUpdateMemberRole } from "../../../../hooks/projects/useUpdateMemberRole";
import { useAppContext } from "../../../../contexts/AppContext";
import Loading from "../../../../components/Loading";
import CheckUserRole from "../../../../lib/actions/checkUserRole";
import { translations } from "../../../../lib/translations";

export default function UpdateTeam() {
  const { id } = useParams();
  const router = useRouter();
  const { data: project, isLoading, error } = useGetProject(id);
  const { userId, language, isRTL, email: sender } = useAppContext();

  const content = translations[language].dashboard.updateProject;
  const common = translations[language].dashboard.projectDetail;

  const [invites, setInvites] = useState([""]);
  const [errors, setErrors] = useState({ invites: [] });
  const [isSending, setIsSending] = useState(false);

  const { mutate: deleteMember } = useDeleteMember();
  const { mutate: updateMemberRole } = useUpdateMemberRole();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const updateArrayValue = (index, value) => {
    const updated = [...invites];
    updated[index] = value;
    setInvites(updated);
    setErrors((prev) => ({
      ...prev,
      invites: prev.invites.map((err, i) => (i === index ? "" : err)),
    }));
  };

  const addField = () => {
    if (invites[invites.length - 1] === "") return;
    setInvites((prev) => [...prev, ""]);
    setErrors((prev) => ({
      ...prev,
      invites: [...prev.invites, ""],
    }));
  };

  const removeField = (index) => {
    if (invites.length <= 1) {
      setInvites([""]);
      return;
    }
    setInvites(invites.filter((_, i) => i !== index));
  };

  const handleSendInvites = async (e) => {
    e.preventDefault();
    const inviteErrors = invites.map((email) =>
      email && !validateEmail(email) ? "Invalid email" : "",
    );

    if (inviteErrors.some(Boolean)) {
      setErrors({ invites: inviteErrors });
      return;
    }

    const validEmails = invites.filter(Boolean);
    if (validEmails.length === 0) {
      toast.error(
        isRTL ? "أضف بريد إلكتروني واحد على الأقل" : "Add at least one email",
      );
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/send-invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender,
          receivers: validEmails,
          projectName: project.title,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send invites");
      }

      await fetch(`/api/projects/${id}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails: validEmails, userId }),
      }); // Ensure the backend also updates internal project invite requests!

      toast.success(
        isRTL ? "تم إرسال الدعوات بنجاح" : "Invites sent successfully",
      );
      setInvites([""]);
      router.push(`/dashboard/projects/${id}`);
    } catch (err) {
      toast.error(isRTL ? "فشل إرسال الدعوات" : "Failed to send invites");
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = (memberId) => {
    deleteMember({ projectId: project._id, userId: memberId });
  };

  const handlePromote = (memberId) => {
    updateMemberRole({
      projectId: project._id,
      userId: memberId,
      action: "promote",
    });
  };

  const handleDemote = (memberId) => {
    updateMemberRole({
      projectId: project._id,
      userId: memberId,
      action: "demote",
    });
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  if (!project) return null;

  return (
    <CheckUserRole>
      <div
        className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white p-6 transition-colors duration-200"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold">
              {isRTL ? "إدارة فريق العمل" : "Manage Team"} - {project.title}
            </h1>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              {content.inviteRequests}
            </h2>
            <div className="space-y-4">
              {invites.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => updateArrayValue(index, e.target.value)}
                      className="dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    />
                    {errors.invites[index] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.invites[index]}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => removeField(index)}
                    className="shrink-0"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addField}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} /> {content.addinvite}
                </Button>
                <Button
                  type="button"
                  onClick={handleSendInvites}
                  disabled={isSending || invites.filter(Boolean).length === 0}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white sm:ml-auto"
                >
                  <Send size={16} />{" "}
                  {isSending
                    ? isRTL
                      ? "جاري الإرسال..."
                      : "Sending..."
                    : isRTL
                      ? "إرسال الدعوات"
                      : "Send Invites"}
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">{content.teamwork}</h2>

            {/* Co-Leaders */}
            <div className="mb-8">
              <h3 className="mb-3 font-semibold text-yellow-500 flex items-center gap-2">
                {content.admins}
              </h3>
              {project.coLeaders?.length > 0 ? (
                <div className="space-y-3">
                  {project.coLeaders.map((user) => (
                    <div
                      key={user._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-600"
                    >
                      <span className="font-medium text-gray-800 dark:text-white">
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
                          className="flex items-center gap-2"
                        >
                          <ArrowDown size={14} /> {content.demotion}
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(user._id)}
                          className="flex items-center gap-2"
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-yellow-500/70 italic border border-dashed border-gray-300 dark:border-gray-700">
                  {content.noAdmins}
                </div>
              )}
            </div>

            {/* Members */}
            <div>
              <h3 className="mb-3 font-semibold text-blue-500 flex items-center gap-2">
                {content.members}
              </h3>
              {project.members?.length > 0 &&
              project.members.some(
                (member) =>
                  !project.coLeaders?.some(
                    (coLeader) => coLeader._id === member._id,
                  ),
              ) ? (
                <div className="space-y-3">
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
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-600"
                      >
                        <span className="font-medium text-gray-800 dark:text-white">
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
                            className="flex items-center gap-2"
                          >
                            <ArrowUp size={14} /> {content.promotion}
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(user._id)}
                            className="flex items-center gap-2"
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-blue-500/70 italic border border-dashed border-gray-300 dark:border-gray-700">
                  {content.noAMembers}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CheckUserRole>
  );
}
