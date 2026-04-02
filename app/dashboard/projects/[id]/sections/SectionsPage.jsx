"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Users,
  Edit3,
  Check,
  X,
  LayoutGrid,
  ChevronRight,
  UserPlus,
  UserMinus,
  Layers,
  Shield,
  LoaderCircle,
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useGetProject } from "@/hooks/projects/useGetProjects";
import {
  useGetSections,
  useUpdateSection,
  useDeleteSection,
} from "@/hooks/sections/useGetSections";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";

export default function SectionsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { language, userId, isRTL } = useAppContext();

  const { data: project, isLoading: isLoadingProject } = useGetProject(id);
  const {
    data: sections,
    isLoading: isLoadingSections,
    refetch: refetchSections,
  } = useGetSections(id);
  const { mutate: updateSection } = useUpdateSection();
  const { mutate: deleteSection, isPending: isDeleting } = useDeleteSection();

  const [isLeader, setIsLeader] = useState(false);

  // Create section state
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateInput, setShowCreateInput] = useState(false);

  // Rename state
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  // Members panel state
  const [activeSectionForMembers, setActiveSectionForMembers] = useState(null);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [isSavingMembers, setIsSavingMembers] = useState(false);

  useEffect(() => {
    if (!project || !userId) return;
    const uid = userId.toString();
    const isLead =
      project.leaderId?._id === uid ||
      project.coLeaders?.some((u) => u._id === uid);
    setIsLeader(isLead);
    if (!isLead) router.push(`/dashboard/projects/${id}`);
  }, [project, userId, id, router]);

  const allTeamMembers = [
    ...(project?.coLeaders || []),
    ...(project?.members || []),
  ].reduce((acc, m) => {
    if (!acc.find((x) => x._id === m._id)) acc.push(m);
    return acc;
  }, []);

  const handleCreateSection = async () => {
    if (!newSectionTitle.trim()) return;
    setIsCreating(true);
    try {
      await axios.post("/api/sections", {
        title: newSectionTitle.trim(),
        projectId: id,
      });
      toast.success(isRTL ? "تم إنشاء القسم بنجاح" : "Section created!");
      setNewSectionTitle("");
      setShowCreateInput(false);
      refetchSections();
    } catch {
      toast.error(isRTL ? "فشل إنشاء القسم" : "Failed to create section");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRenameSection = async (sectionId) => {
    if (!renameValue.trim()) return;
    setIsRenaming(true);
    updateSection(
      { sectionId, data: { title: renameValue.trim() } },
      {
        onSuccess: () => {
          toast.success(isRTL ? "تم تعديل الاسم" : "Renamed!");
          setRenamingId(null);
          setRenameValue("");
        },
        onError: () => toast.error(isRTL ? "فشل التعديل" : "Failed to rename"),
        onSettled: () => setIsRenaming(false),
      },
    );
  };

  const handleDeleteSection = (section) => {
    if (section.isDefault) {
      toast.error(
        isRTL
          ? "لا يمكن حذف القسم الافتراضي"
          : "Cannot delete the default section",
      );
      return;
    }
    if (
      !confirm(
        isRTL
          ? `هل أنت متأكد من حذف "${section.title}"؟ ستُفكَّك ارتباطاته بالمهام.`
          : `Delete "${section.title}"? It will be unlinked from all tasks.`,
      )
    )
      return;
    deleteSection(section._id, {
      onSuccess: () => {
        toast.success(isRTL ? "تم حذف القسم" : "Section deleted");
        if (activeSectionForMembers?._id === section._id)
          setActiveSectionForMembers(null);
        refetchSections();
      },
      onError: () => toast.error(isRTL ? "فشل الحذف" : "Delete failed"),
    });
  };

  const openMembersPanel = (section) => {
    setActiveSectionForMembers(section);
    const currentMemberIds =
      section.members?.map((m) => (typeof m === "object" ? m._id : m)) || [];
    setPendingMembers(currentMemberIds);
  };

  const toggleMember = (memberId) => {
    setPendingMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const handleSaveMembers = () => {
    if (!activeSectionForMembers) return;
    setIsSavingMembers(true);
    updateSection(
      {
        sectionId: activeSectionForMembers._id,
        data: { members: pendingMembers },
      },
      {
        onSuccess: () => {
          toast.success(isRTL ? "تم حفظ الأعضاء" : "Members saved!");
          refetchSections();
          setActiveSectionForMembers(null);
        },
        onError: () => toast.error(isRTL ? "فشل الحفظ" : "Save failed"),
        onSettled: () => setIsSavingMembers(false),
      },
    );
  };

  if (isLoadingProject || isLoadingSections) return <Loading />;
  if (!project) return null;

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ── Top bar ── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800  z-20">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/projects/${id}`}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {isRTL ? (
                <ArrowRight className="w-5 h-5" />
              ) : (
                <ArrowLeft className="w-5 h-5" />
              )}
            </Link>
            <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest leading-none">
                  {isRTL ? "إدارة الأقسام" : "Sections"}
                </p>
                <p className="text-sm font-black text-gray-900 dark:text-white leading-tight truncate max-w-[160px] md:max-w-xs">
                  {project.title}
                </p>
              </div>
            </div>
          </div>

          {/* Create button */}
          <button
            onClick={() => {
              setShowCreateInput(true);
              setActiveSectionForMembers(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-violet-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isRTL ? "قسم جديد" : "New Section"}
            </span>
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: <Layers className="w-5 h-5 text-violet-500" />,
              label: isRTL ? "إجمالي الأقسام" : "Total Sections",
              value: sections?.length || 0,
              bg: "bg-violet-50 dark:bg-violet-900/20",
            },
            {
              icon: <Users className="w-5 h-5 text-blue-500" />,
              label: isRTL ? "أعضاء الفريق" : "Team Members",
              value: allTeamMembers.length,
              bg: "bg-blue-50 dark:bg-blue-900/20",
            },
            {
              icon: <Shield className="w-5 h-5 text-emerald-500" />,
              label: isRTL ? "الأقسام غير الافتراضية" : "Custom Sections",
              value: sections?.filter((s) => !s.isDefault)?.length || 0,
              bg: "bg-emerald-50 dark:bg-emerald-900/20",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`${stat.bg} rounded-2xl p-4 flex items-center gap-3 border border-white/50 dark:border-gray-800`}
            >
              <div className="shrink-0">{stat.icon}</div>
              <div>
                <p className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                  {stat.value}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight leading-tight">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Create section input */}
        {showCreateInput && (
          <div className="mb-6 bg-white dark:bg-gray-900 rounded-2xl border border-violet-200 dark:border-violet-800/50 p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-sm font-black text-gray-700 dark:text-gray-300 mb-3">
              {isRTL ? "اسم القسم الجديد" : "New section name"}
            </p>
            <div className="flex gap-2">
              <input
                autoFocus
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateSection();
                  if (e.key === "Escape") {
                    setShowCreateInput(false);
                    setNewSectionTitle("");
                  }
                }}
                placeholder={
                  isRTL
                    ? "مثال: تطوير الواجهات..."
                    : "e.g. Frontend Development..."
                }
                className="flex-1 h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-gray-300 dark:placeholder:text-gray-600"
              />
              <button
                onClick={handleCreateSection}
                disabled={!newSectionTitle.trim() || isCreating}
                className="h-11 px-5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
              >
                {isCreating ? (
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {isRTL ? "إنشاء" : "Create"}
              </button>
              <button
                onClick={() => {
                  setShowCreateInput(false);
                  setNewSectionTitle("");
                }}
                className="h-11 w-11 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sections list */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 px-1 mb-2">
              {isRTL ? "قائمة الأقسام" : "All Sections"}
            </p>

            {!sections || sections.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-10 text-center">
                <LayoutGrid className="w-10 h-10 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-400">
                  {isRTL ? "لا توجد أقسام بعد" : "No sections yet"}
                </p>
              </div>
            ) : (
              sections.map((section) => {
                const isActive = activeSectionForMembers?._id === section._id;
                const isRenaming_this = renamingId === section._id;
                const memberCount = section.members?.length || 0;

                return (
                  <div
                    key={section._id}
                    className={`group bg-white dark:bg-gray-900 rounded-2xl border transition-all duration-200 ${
                      isActive
                        ? "border-violet-400 dark:border-violet-600 shadow-md shadow-violet-500/10"
                        : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                    }`}
                  >
                    <div className="p-4">
                      {isRenaming_this ? (
                        <div className="flex gap-2">
                          <input
                            autoFocus
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                handleRenameSection(section._id);
                              if (e.key === "Escape") setRenamingId(null);
                            }}
                            className="flex-1 h-9 px-3 rounded-lg border border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/20 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                          />
                          <button
                            onClick={() => handleRenameSection(section._id)}
                            disabled={isRenaming}
                            className="w-9 h-9 flex items-center justify-center bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all disabled:opacity-50"
                          >
                            {isRenaming ? (
                              <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => setRenamingId(null)}
                            className="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full shrink-0 ${isActive ? "bg-violet-500" : "bg-gray-300 dark:bg-gray-600"}`}
                              />
                              <span className="text-sm font-black text-gray-900 dark:text-white truncate">
                                {section.title}
                              </span>
                              {section.isDefault && (
                                <span className="shrink-0 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full border border-amber-100 dark:border-amber-900/50">
                                  {isRTL ? "افتراضي" : "Default"}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-0.5 ms-4">
                              {memberCount > 0
                                ? isRTL
                                  ? `${memberCount} عضو مرتبط`
                                  : `${memberCount} member${memberCount !== 1 ? "s" : ""}`
                                : isRTL
                                  ? "لا يوجد أعضاء مخصصون"
                                  : "No members assigned"}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            {!section.isDefault && (
                              <button
                                onClick={() => {
                                  setRenamingId(section._id);
                                  setRenameValue(section.title);
                                  setActiveSectionForMembers(null);
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
                                title={isRTL ? "تعديل الاسم" : "Rename"}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => openMembersPanel(section)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${isActive ? "text-violet-600 bg-violet-50 dark:bg-violet-900/30" : "text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20"}`}
                              title={isRTL ? "إدارة الأعضاء" : "Manage Members"}
                            >
                              <Users className="w-3.5 h-3.5" />
                            </button>
                            {!section.isDefault && (
                              <button
                                onClick={() => handleDeleteSection(section)}
                                disabled={isDeleting}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all disabled:opacity-40"
                                title={isRTL ? "حذف القسم" : "Delete Section"}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Members chips */}
                    {!isRenaming_this && section.members?.length > 0 && (
                      <div className="px-4 pb-3 flex flex-wrap gap-1.5 border-t border-gray-50 dark:border-gray-800 pt-3">
                        {section.members.slice(0, 4).map((m) => {
                          const member =
                            typeof m === "object"
                              ? m
                              : allTeamMembers.find((u) => u._id === m);
                          if (!member) return null;
                          const displayName =
                            member.name && member.name !== "null null"
                              ? member.name
                              : member.email?.split("@")[0];
                          return (
                            <span
                              key={member._id}
                              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full"
                            >
                              <span className="w-3.5 h-3.5 rounded-full bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-300 flex items-center justify-center text-[8px] font-black">
                                {displayName?.charAt(0)?.toUpperCase()}
                              </span>
                              {displayName}
                            </span>
                          );
                        })}
                        {section.members.length > 4 && (
                          <span className="text-[10px] font-bold text-gray-400 px-2 py-0.5">
                            +{section.members.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Manage members CTA if none assigned */}
                    {!isRenaming_this && section.members?.length === 0 && (
                      <button
                        onClick={() => openMembersPanel(section)}
                        className="w-full text-[10px] font-bold text-violet-500 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 flex items-center justify-center gap-1 py-2 border-t border-gray-50 dark:border-gray-800 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 rounded-b-2xl transition-all"
                      >
                        <UserPlus className="w-3 h-3" />
                        {isRTL ? "إضافة أعضاء" : "Add Members"}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Members panel */}
          <div className="lg:col-span-3">
            {!activeSectionForMembers ? (
              <div className="h-full min-h-[300px] bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-3 p-10">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                  <Users className="w-7 h-7 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500 text-center">
                  {isRTL
                    ? "اختر قسماً لإدارة أعضائه"
                    : "Select a section to manage its members"}
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-violet-200 dark:border-violet-800/50 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-linear-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border-b border-violet-100 dark:border-violet-800/50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-violet-400 dark:text-violet-500">
                      {isRTL ? "أعضاء القسم" : "Section Members"}
                    </p>
                    <h3 className="text-base font-black text-gray-900 dark:text-white mt-0.5">
                      {activeSectionForMembers.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSectionForMembers(null)}
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white dark:hover:bg-gray-800 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Bulk actions */}
                <div className="px-6 py-3 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    {pendingMembers.length} / {allTeamMembers.length}{" "}
                    {isRTL ? "محدد" : "selected"}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setPendingMembers(allTeamMembers.map((u) => u._id))
                      }
                      className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      {isRTL ? "تحديد الكل" : "Select All"}
                    </button>
                    <span className="text-gray-200 dark:text-gray-700">|</span>
                    <button
                      onClick={() => setPendingMembers([])}
                      className="text-xs font-bold text-rose-500 dark:text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                      {isRTL ? "إلغاء الكل" : "Clear All"}
                    </button>
                  </div>
                </div>

                {/* Members list */}
                <div className="divide-y divide-gray-50 dark:divide-gray-800/50 max-h-[420px] overflow-y-auto">
                  {allTeamMembers.length === 0 ? (
                    <div className="p-10 text-center">
                      <p className="text-sm text-gray-400">
                        {isRTL ? "لا يوجد أعضاء في الفريق" : "No team members"}
                      </p>
                    </div>
                  ) : (
                    allTeamMembers.map((member) => {
                      const isSelected = pendingMembers.includes(member._id);
                      const displayName =
                        member.name && member.name !== "null null"
                          ? member.name
                          : member.email?.split("@")[0];
                      const isCoLeader = project.coLeaders?.some(
                        (cl) => cl._id === member._id,
                      );
                      const initials =
                        displayName?.charAt(0)?.toUpperCase() || "?";

                      return (
                        <button
                          key={member._id}
                          onClick={() => toggleMember(member._id)}
                          className={`w-full flex items-center gap-4 px-6 py-3.5 text-start transition-all ${
                            isSelected
                              ? "bg-violet-50 dark:bg-violet-900/10"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                        >
                          {/* Avatar */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all shrink-0 ${
                              isSelected
                                ? "border-violet-400 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                                : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {member.image ? (
                              <img
                                src={member.image}
                                alt=""
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              initials
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-black truncate ${isSelected ? "text-violet-900 dark:text-violet-100" : "text-gray-900 dark:text-white"}`}
                            >
                              {displayName}
                            </p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                              {member.email}
                            </p>
                          </div>

                          {/* Role badge */}
                          {isCoLeader && (
                            <span className="shrink-0 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full border border-purple-100 dark:border-purple-900/50">
                              {isRTL ? "مساعد" : "Co-Lead"}
                            </span>
                          )}

                          {/* Checkbox */}
                          <div
                            className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all ${
                              isSelected
                                ? "border-violet-500 bg-violet-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            {isSelected && (
                              <Check
                                className="w-3 h-3 text-white"
                                strokeWidth={3}
                              />
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                  <button
                    onClick={() => setActiveSectionForMembers(null)}
                    className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    {isRTL ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    onClick={handleSaveMembers}
                    disabled={isSavingMembers}
                    className="flex-1 h-11 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-sm font-black text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-violet-500/20"
                  >
                    {isSavingMembers ? (
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {isRTL ? "حفظ الأعضاء" : "Save Members"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
