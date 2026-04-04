"use client";

import { Users, Crown, ArrowDown, ArrowUp, UserMinus, Shield } from "lucide-react";
import ConfirmDeleteDialog from "@/components/dashboard/ConfirmDeleteDialog";

export default function CurrentTeamSection({
  project,
  isRTL,
  sections,
  onPromote,
  onDemote,
  onDelete,
}) {
  const renderMember = (user, isCoLeader) => (
    <div
      key={user._id}
      className={`group flex items-center justify-between gap-2.5 sm:gap-3 bg-gray-50 dark:bg-gray-800/40 p-3 sm:p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/50 transition-all hover:bg-white dark:hover:bg-gray-800 w-full min-w-0 ${
        isCoLeader ? "hover:border-amber-400/50" : "hover:border-blue-400/50"
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full p-0.5 shadow-sm shrink-0 bg-linear-to-br ${
            isCoLeader ? "from-amber-400 to-amber-600" : "from-blue-400 to-blue-600"
          }`}
        >
          <div
            className={`w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden font-black uppercase text-[10px] sm:text-xs ${
              isCoLeader ? "text-amber-600" : "text-blue-600"
            }`}
          >
            {user.image ? (
              <img src={user.image} className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0)
            )}
          </div>
        </div>
        <div className={`min-w-0 flex-1 ${isRTL ? "text-right" : "text-left"}`}>
          <span className="block text-xs sm:text-sm font-black text-gray-900 dark:text-white truncate">
            {user.name !== "null null" ? user.name : user.email.split("@")[0]}
          </span>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate max-w-[120px] sm:max-w-xs">
              {user.email}
            </span>
            {sections && (() => {
              const userSections = sections.filter(s => s.members?.some(m => (m._id || m) === user._id));
              if (userSections.length > 0) {
                return (
                  <div className="flex flex-wrap gap-1">
                    {userSections.map(s => (
                      <span key={s._id} className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                        {s.title}
                      </span>
                    ))}
                  </div>
                );
              } else {
                return (
                  <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {isRTL ? "بدون قسم" : "No Section"}
                  </span>
                );
              }
            })()}
          </div>
        </div>
      </div>

      <div className="flex gap-1 sm:gap-1.5 shrink-0 ml-auto">
        <button
          onClick={() => (isCoLeader ? onDemote(user._id) : onPromote(user._id))}
          className={`p-1.5 sm:p-2 rounded-xl transition-all shadow-xs shrink-0 ${
            isCoLeader
              ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white"
              : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white"
          }`}
          title={isCoLeader ? (isRTL ? "تنزيل" : "Demote") : (isRTL ? "ترقية" : "Promote")}
        >
          {isCoLeader ? (
            <ArrowDown size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ) : (
            <ArrowUp size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </button>
        <ConfirmDeleteDialog
          trigger={
            <button className="p-1.5 sm:p-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xs shrink-0">
              <UserMinus size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          }
          title={isRTL ? "إزالة العضو؟" : "Remove Member?"}
          description={
            isRTL
              ? `هل أنت متأكد من إزالة "${user.name}" من فريق العمل؟`
              : `Are you sure you want to remove "${user.name}" from the team?`
          }
          onConfirm={() => onDelete(user._id)}
          cancelText={isRTL ? "إلغاء" : "Cancel"}
          confirmText={isRTL ? "إزالة" : "Remove"}
        />
      </div>
    </div>
  );

  return (
    <section className="bg-white dark:bg-gray-800/50 p-4 sm:p-5 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-blue-500/5 overflow-hidden w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
          <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-lg font-black text-gray-900 dark:text-white">
          {isRTL ? "فريق العمل الحالي" : "Current Team Members"}
        </h2>
      </div>

      <div className="space-y-10 overflow-auto">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-4 h-4 text-amber-500" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500">
              {isRTL ? "مساعدو القائد" : "Co-Leaders"}
            </h3>
          </div>
          {project.coLeaders?.length > 0 ? (
            <div className="grid gap-3">
              {project.coLeaders.map((u) => renderMember(u, true))}
            </div>
          ) : (
            <div className="text-center py-8 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-700/50">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                {isRTL ? "لا يوجد مساعدين" : "No co-leaders assigned"}
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-blue-500" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">
              {isRTL ? "الأعضاء" : "Members"}
            </h3>
          </div>
          {project.members?.length > 0 &&
          project.members.some(
            (m) => !project.coLeaders?.some((cl) => cl._id === m._id),
          ) ? (
            <div className="grid gap-3">
              {project.members
                .filter((m) => !project.coLeaders?.some((cl) => cl._id === m._id))
                .map((u) => renderMember(u, false))}
            </div>
          ) : (
            <div className="text-center py-8 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-700/50">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                {isRTL ? "لا يوجد أعضاء عاديين" : "No regular members"}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
