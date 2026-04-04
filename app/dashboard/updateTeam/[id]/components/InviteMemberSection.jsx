"use client";

import { useState } from "react";
import { UserPlus, Mail, Trash, Plus, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function InviteMemberSection({
  projectId,
  projectTitle,
  sender,
  isRTL,
  onInviteSent,
}) {
  const [invites, setInvites] = useState([""]);
  const [errors, setErrors] = useState({ invites: [] });
  const [isSending, setIsSending] = useState(false);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender,
          receivers: validEmails,
          projectName: projectTitle,
        }),
      });

      if (!response.ok) throw new Error("Failed to send invites");

      await fetch(`/api/projects/${projectId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: validEmails }),
      });

      toast.success(
        isRTL ? "تم إرسال الدعوات بنجاح" : "Invites sent successfully",
      );
      setInvites([""]);
      if (onInviteSent) onInviteSent();
    } catch (err) {
      toast.error(isRTL ? "فشل إرسال الدعوات" : "Failed to send invites");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800/50 p-4 sm:p-5 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-blue-500/5 relative overflow-hidden group w-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-900/40 rounded-xl">
            <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white">
            {isRTL ? "دعوة أعضاء جدد" : "Invite New Members"}
          </h2>
        </div>

        <div className="space-y-3">
          {invites.map((email, index) => (
            <div key={index} className="flex items-center gap-2 group/field">
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
                  onChange={(e) => updateArrayValue(index, e.target.value)}
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
              <Plus size={16} /> {isRTL ? "أضف حقل دعوة" : "Add Invitation Field"}
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
  );
}
