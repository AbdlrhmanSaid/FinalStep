"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "../../../../components/ui/button";
import {
  Plus,
  Trash,
  ArrowDown,
  ArrowUp,
  Send,
  Users,
  ArrowLeft,
  Mail,
  Shield,
  UserPlus,
  UserMinus,
  Crown,
} from "lucide-react";

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
  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  if (!project) return null;

  return (
    <CheckUserRole projectId={id}>
      <div
        className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:text-white p-3.5 sm:p-4 md:p-8 transition-all duration-300"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm group"
              >
                {isRTL ? (
                  <ArrowUp className="w-5 h-5 -rotate-90 group-hover:translate-x-1 transition-transform" />
                ) : (
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                )}
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 shrink-0" />
                  <span className="truncate">
                    {isRTL ? "إدارة فريق العمل" : "Manage Team"}
                  </span>
                </h1>
                <p className="text-[10px] sm:text-sm font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider truncate max-w-[200px] sm:max-w-none">
                  {project.title}
                </p>
              </div>
            </div>
          </div>

          {/* Invitation Section */}
          <section className="bg-white dark:bg-gray-800/50 p-4 sm:p-5 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-blue-500/5 relative overflow-hidden group w-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/40 rounded-xl">
                  <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white">
                  {content.inviteRequests}
                </h2>
              </div>

              <div className="space-y-3">
                {invites.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 group/field"
                  >
                    <div className="flex-1 min-w-0 relative">
                      <div
                        className={`absolute inset-y-0 ${isRTL ? "right-3" : "left-3"} flex items-center pointer-events-none`}
                      >
                        <Mail className="w-4 h-4 text-gray-400" />
                      </div>
                      <Input
                        type="email"
                        placeholder="name@email.com"
                        value={email}
                        onChange={(e) =>
                          updateArrayValue(index, e.target.value)
                        }
                        className={`rounded-2xl ${isRTL ? "pr-10" : "pl-10"} border-gray-100 dark:border-gray-700 dark:bg-gray-900 font-bold transition-all h-11 focus:ring-2 focus:ring-blue-500/20 ${
                          errors.invites[index]
                            ? "border-red-500 ring-2 ring-red-500/10"
                            : ""
                        }`}
                      />
                      {errors.invites[index] && (
                        <p className="text-red-500 text-[10px] font-black mt-1 ml-1 uppercase tracking-tighter">
                          {errors.invites[index]}
                        </p>
                      )}
                    </div>
                    {invites.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeField(index)}
                        className="p-3 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors shrink-0 h-11 w-11 flex items-center justify-center"
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-2 border-t border-gray-100 dark:border-gray-700/50">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={addField}
                    className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 border-2 border-dashed border-blue-100 dark:border-blue-800/50 transition-all"
                  >
                    <Plus size={16} /> {content.addinvite}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSendInvites}
                    disabled={isSending || invites.filter(Boolean).length === 0}
                    className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all active:scale-95 disabled:grayscale"
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    {isSending
                      ? isRTL
                        ? "جارٍ الإرسال..."
                        : "Sending..."
                      : isRTL
                        ? "إرسال الدعوات"
                        : "Send Invites"}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Current Team Section */}
          <section className="bg-white dark:bg-gray-800/50 p-4 sm:p-5 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-blue-500/5 overflow-hidden w-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">
                {content.teamwork}
              </h2>
            </div>

            <div className="space-y-10 overflow-auto">
              {/* Co-Leaders */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500">
                    {content.admins}
                  </h3>
                </div>

                {project.coLeaders?.length > 0 ? (
                  <div className="grid gap-3">
                    {project.coLeaders.map((user) => (
                      <div
                        key={user._id}
                        className="group flex items-center justify-between gap-2.5 sm:gap-3 bg-gray-50 dark:bg-gray-800/40 p-3 sm:p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-amber-400/50 transition-all hover:bg-white dark:hover:bg-gray-800 w-full min-w-0"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-amber-400 to-amber-600 p-0.5 shadow-sm shrink-0">
                            <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden font-black text-amber-600 uppercase text-[10px] sm:text-xs">
                              {user.image ? (
                                <img
                                  src={user.image}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                user.name.charAt(0)
                              )}
                            </div>
                          </div>
                          <div
                            className={`min-w-0 flex-1 ${isRTL ? "text-right" : "text-left"}`}
                          >
                            <span className="block text-xs sm:text-sm font-black text-gray-900 dark:text-white truncate">
                              {user.name !== "null null"
                                ? user.name
                                : user.email.split("@")[0]}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate block">
                              {user.email}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-1 sm:gap-1.5 shrink-0 ml-auto">
                          <button
                            onClick={() => handleDemote(user._id)}
                            className="p-1.5 sm:p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white transition-all shadow-xs shrink-0"
                            title={content.demotion}
                          >
                            <ArrowDown
                              size={14}
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-1.5 sm:p-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xs shrink-0"
                          >
                            <UserMinus
                              size={14}
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-700/50">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      {content.noAdmins}
                    </p>
                  </div>
                )}
              </div>

              {/* Regular Members */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">
                    {content.members}
                  </h3>
                </div>

                {project.members?.length > 0 &&
                project.members.some(
                  (member) =>
                    !project.coLeaders?.some((co) => co._id === member._id),
                ) ? (
                  <div className="grid gap-3">
                    {project.members
                      .filter(
                        (m) =>
                          !project.coLeaders?.some((co) => co._id === m._id),
                      )
                      .map((user) => (
                        <div
                          key={user._id}
                          className="group flex items-center justify-between gap-2.5 sm:gap-3 bg-gray-50 dark:bg-gray-800/40 p-3 sm:p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-blue-400/50 transition-all hover:bg-white dark:hover:bg-gray-800 w-full min-w-0"
                        >
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 p-0.5 shadow-sm shrink-0">
                              <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden font-black text-blue-600 uppercase text-[10px] sm:text-xs">
                                {user.image ? (
                                  <img
                                    src={user.image}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  user.name.charAt(0)
                                )}
                              </div>
                            </div>
                            <div
                              className={`min-w-0 flex-1 ${isRTL ? "text-right" : "text-left"}`}
                            >
                              <span className="block text-xs sm:text-sm font-black text-gray-900 dark:text-white truncate">
                                {user.name !== "null null"
                                  ? user.name
                                  : user.email.split("@")[0]}
                              </span>
                              <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate block">
                                {user.email}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-1 sm:gap-1.5 shrink-0 ml-auto">
                            <button
                              onClick={() => handlePromote(user._id)}
                              className="p-1.5 sm:p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-xs shrink-0"
                              title={content.promotion}
                            >
                              <ArrowUp
                                size={14}
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                              />
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="p-1.5 sm:p-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xs shrink-0"
                            >
                              <UserMinus
                                size={14}
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-700/50">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      {content.noAMembers}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </CheckUserRole>
  );
}
