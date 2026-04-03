"use client";

import { useState } from "react";
import {
  Users,
  LayoutGrid,
  UserPlus,
  UserCheck,
  UserMinus,
  Clock,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";

export default function ProjectSectionsTab({
  projectId,
  isLeader,
  isRTL,
  userId,
  sections,
  isLoading,
}) {
  const queryClient = useQueryClient();
  const [loadingAction, setLoadingAction] = useState(null);

  const handleAction = async (sectionId, action, targetUserId = null) => {
    setLoadingAction(`${sectionId}-${action}-${targetUserId || "self"}`);
    try {
      await axios.post(
        `/api/projects/${projectId}/sections/${sectionId}/actions`,
        {
          action,
          targetUserId,
        },
        {
          headers: { userId: userId?.toString() },
        },
      );
      toast.success(
        isRTL ? "تمت العملية بنجاح" : "Action completed successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["sections", projectId] });
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          (isRTL ? "فشلت العملية" : "Action failed"),
      );
    } finally {
      setLoadingAction(null);
    }
  };

  if (isLoading)
    return (
      <div className="py-10 flex justify-center">
        <Loading />
      </div>
    );

  if (!sections || sections.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-12 rounded-[40px] border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center justify-center gap-4">
        <div className="p-6 bg-violet-50 dark:bg-violet-900/30 rounded-[30px]">
          <LayoutGrid className="w-12 h-12 text-violet-500" />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white">
            {isRTL ? "لا توجد أقسام حالياً" : "No Sections Found"}
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
            {isRTL
              ? "لم يتم تقسيم هذا المشروع إلى مجموعات عمل بعد."
              : "This project hasn't been divided into work groups yet."}
          </p>
        </div>
      </div>
    );
  }

  const mySections = sections.filter((s) =>
    s.members?.some((m) => (m._id || m).toString() === userId?.toString()),
  );

  return (
    <div className="space-y-6">
      {mySections.length > 0 && !isLeader && (
        <div className="bg-linear-to-r from-violet-600 to-indigo-600 p-6 rounded-[32px] text-white shadow-xl shadow-violet-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl transition-transform group-hover:scale-110" />
          <div className="relative flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black leading-tight">
                {isRTL ? "أنت عضو في هذا المشروع" : "You are a team member"}
              </h3>
              <p className="text-white/80 text-sm font-bold mt-1 max-w-md">
                {isRTL
                  ? `أنت حالياً منضم إلى: ${mySections
                      .map((s) => s.title)
                      .join(" ، ")}. يمكنك متابعة مهامك وخطة عملك من خلال التبويبات المخصصة.`
                  : `You are currently in: ${mySections
                      .map((s) => s.title)
                      .join(", ")}. Follow your targets in the dedicated plan tab.`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-violet-50 dark:bg-violet-900/40 rounded-2xl">
            <LayoutGrid className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
              {isRTL ? "أقسام المشروع" : "Project Sections"}
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              {sections.length} {isRTL ? "أقسام مفعلة" : "Active Sections"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => {
          const sectionMembers = section.members || [];
          const sectionRequests = section.joinRequests || [];

          const isMember = sectionMembers.some(
            (m) => (m._id || m).toString() === userId?.toString(),
          );
          const isPending = sectionRequests.some(
            (r) => (r._id || r).toString() === userId?.toString(),
          );
          const memberCount = sectionMembers.length;
          const pendingCount = sectionRequests.length;

          return (
            <div
              key={section._id}
              className={`group relative bg-white dark:bg-gray-800 p-6 rounded-[32px] border transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5 ${
                isMember
                  ? "border-violet-500/30"
                  : "border-gray-100 dark:border-gray-800"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isMember
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-500/40 scale-110"
                        : "bg-gray-50 dark:bg-gray-900 text-gray-400"
                    }`}
                  >
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-black transition-colors ${isMember ? 'text-violet-600' : 'text-gray-900 dark:text-white group-hover:text-violet-600'}`}>
                      {section.title}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {memberCount} {isRTL ? "أعضاء" : "Members"}
                    </p>
                  </div>
                </div>

                {isMember && (
                  <Badge className="bg-violet-600 text-white border-none px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">
                    {isRTL ? "قسمك الحالي" : "Your Section"}
                  </Badge>
                )}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6 line-clamp-2 min-h-[32px]">
                {section.description ||
                  (isRTL
                    ? "لا يوجد وصف متوفر لهذا القسم."
                    : "No description available for this section.")}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700/50">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {(section.members || []).slice(0, 4).map((m, i) => (
                    <div
                      key={m._id || i}
                      className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden"
                    >
                      {m.image ? (
                        <img
                          src={m.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400">
                          {m.name?.charAt(0)}
                        </span>
                      )}
                    </div>
                  ))}
                  {memberCount > 4 && (
                    <div className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                      <span className="text-[9px] font-black text-gray-400">
                        +{memberCount - 4}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {!isMember && !isPending && !isLeader && (
                    <Button
                      size="sm"
                      onClick={() => handleAction(section._id, "join")}
                      disabled={!!loadingAction}
                      className="h-9 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-violet-500/20"
                    >
                      {loadingAction === `${section._id}-join-self` ? (
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <UserPlus className="w-3.5 h-3.5" />
                      )}
                      {isRTL ? "انضمام" : "Join"}
                    </Button>
                  )}

                  {isPending && (
                    <Button
                      size="sm"
                      disabled
                      className="h-9 px-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[11px] font-black uppercase tracking-widest gap-2 border border-amber-100 dark:border-amber-900/30"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {isRTL ? "قيد المراجعة" : "Pending"}
                    </Button>
                  )}

                  {isMember && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(section._id, "leave")}
                      disabled={!!loadingAction}
                      className="h-9 px-4 rounded-xl border-gray-200 dark:border-gray-700 text-[11px] font-black uppercase tracking-widest gap-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
                    >
                      {loadingAction === `${section._id}-leave-self` ? (
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <UserMinus className="w-3.5 h-3.5" />
                      )}
                      {isRTL ? "مغادرة" : "Leave"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Admin Area for this section */}
              {isLeader && pendingCount > 0 && (
                <div className="mt-4 pt-4 border-t border-dashed border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-tighter">
                      {isRTL ? "طلبات معلقة" : "Pending Approvals"} (
                      {pendingCount})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {sectionRequests.map((req) => (
                      <div
                        key={req._id || req}
                        className="flex items-center justify-between p-2 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100/50 dark:border-gray-800/50"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-white dark:bg-gray-800">
                            {req.image ? (
                              <img
                                src={req.image}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">
                                {req.name?.charAt(0) || "?"}
                              </div>
                            )}
                          </div>
                          <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 truncate max-w-[80px]">
                            {req.name || (isRTL ? "مستخدم" : "User")}
                          </p>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            disabled={!!loadingAction}
                            onClick={() =>
                              handleAction(
                                section._id,
                                "approve",
                                req._id || req,
                              )
                            }
                            className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                          >
                            <UserCheck className="w-3 h-3" />
                          </button>
                          <button
                            disabled={!!loadingAction}
                            onClick={() =>
                              handleAction(
                                section._id,
                                "reject",
                                req._id || req,
                              )
                            }
                            className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
