"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  Plus,
  Trash2,
  Users,
  Edit3,
  Check,
  X,
  Layers,
  LoaderCircle,
  UserPlus,
  UserMinus,
  ChevronDown,
  ChevronUp,
  Star,
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
import ProjectPageHeader from "../components/ProjectPageHeader";

/* ─── helpers ──────────────────────────── */
const dName = (u) =>
  u?.name && u.name !== "null null" ? u.name : (u?.email?.split("@")[0] ?? "?");
const initial = (u) => dName(u).charAt(0).toUpperCase();

/* ─── Member Avatar ─────────────────────── */
function Avatar({ user, size = "sm", selected = false }) {
  const s = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${s} rounded-full flex items-center justify-center font-black shrink-0 border-2 transition-all ${
        selected
          ? "border-violet-400 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
          : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
      }`}
    >
      {user?.image ? (
        <img
          src={user.image}
          alt=""
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        initial(user)
      )}
    </div>
  );
}

/* ─── Member Picker Sheet ────────────────
   inline expandable — no modal/panel needed */
function MemberPicker({
  section,
  allMembers,
  isRTL,
  onSave,
  isSaving,
  onClose,
}) {
  const currentIds =
    section.members?.map((m) => (typeof m === "object" ? m._id : m)) ?? [];
  const [selected, setSelected] = useState(currentIds);

  const toggle = (id) =>
    setSelected((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  return (
    <div className="mt-3 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
      {/* Bulk row */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
          {selected.length}/{allMembers.length} {isRTL ? "محدد" : "selected"}
        </p>
        <div className="flex gap-3 text-xs font-bold">
          <button
            onClick={() => setSelected(allMembers.map((m) => m._id))}
            className="flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:underline"
          >
            <UserPlus className="w-3 h-3" />
            {isRTL ? "الكل" : "All"}
          </button>
          <button
            onClick={() => setSelected([])}
            className="flex items-center gap-1 text-rose-500 dark:text-rose-400 hover:underline"
          >
            <UserMinus className="w-3 h-3" />
            {isRTL ? "إلغاء" : "None"}
          </button>
        </div>
      </div>

      {/* Members grid */}
      {allMembers.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">
          {isRTL ? "لا يوجد أعضاء في الفريق" : "No team members"}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {allMembers.map((member) => {
            const sel = selected.includes(member._id);
            return (
              <button
                key={member._id}
                type="button"
                onClick={() => toggle(member._id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-start transition-all ${
                  sel
                    ? "border-violet-400 bg-violet-50 dark:bg-violet-900/20"
                    : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-gray-900"
                }`}
              >
                <Avatar user={member} size="sm" selected={sel} />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-bold truncate leading-none ${sel ? "text-violet-900 dark:text-violet-100" : "text-gray-800 dark:text-gray-200"}`}
                  >
                    {dName(member)}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                    {member.email}
                  </p>
                </div>
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    sel
                      ? "border-violet-500 bg-violet-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {sel && (
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          {isRTL ? "إلغاء" : "Cancel"}
        </button>
        <button
          type="button"
          onClick={() => onSave(selected)}
          disabled={isSaving}
          className="flex-1 h-10 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-sm font-black text-white transition-all flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {isRTL ? "حفظ" : "Save"}
        </button>
      </div>
    </div>
  );
}

/* ─── Section Card ──────────────────────── */
function SectionCard({
  section,
  allMembers,
  isRTL,
  onRename,
  onDelete,
  onSaveMembers,
  isDeleting,
  isSavingMembers,
}) {
  const [expanded, setExpanded] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(section.title);
  const [descVal, setDescVal] = useState(section.description || "");

  const resolvedMembers = (section.members ?? [])
    .map((m) =>
      typeof m === "object" ? m : allMembers.find((u) => u._id === m),
    )
    .filter(Boolean);

  const handleRenameSubmit = () => {
    if (!renameVal.trim()) return;
    onRename(renameVal.trim(), descVal.trim());
    setRenaming(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all">
      {/* ── Card header ── */}
      <div className="flex items-center gap-3 p-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5 text-violet-500" />
        </div>

        {/* Title / Rename */}
        <div className="flex-1 min-w-0">
          {renaming ? (
            <div className="space-y-3 p-1">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                  {isRTL ? "اسم القسم" : "Section Name"}
                </label>
                <input
                  autoFocus
                  value={renameVal}
                  onChange={(e) => setRenameVal(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-violet-100 dark:border-violet-800 bg-gray-50 dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                  {isRTL ? "الوصف" : "Description"}
                </label>
                <textarea
                  value={descVal}
                  onChange={(e) => setDescVal(e.target.value)}
                  className="w-full h-20 px-3 py-2 rounded-xl border border-violet-100 dark:border-violet-800 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  placeholder={isRTL ? "وصف القسم..." : "Section description..."}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRenameSubmit}
                  className="flex-1 h-10 flex items-center justify-center gap-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all text-xs font-black"
                >
                  <Check className="w-4 h-4" />
                  {isRTL ? "حفظ التعديلات" : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setRenaming(false);
                    setRenameVal(section.title);
                    setDescVal(section.description || "");
                  }}
                  className="h-10 px-4 flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-bold text-xs"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-gray-900 dark:text-white">
                  {section.title}
                </h3>
                {section.isDefault && (
                  <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full border border-amber-100 dark:border-amber-900/50">
                    <Star className="w-2.5 h-2.5" />
                    {isRTL ? "افتراضي" : "Default"}
                  </span>
                )}
              </div>
              {section.description && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                  {section.description}
                </p>
              )}
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                {resolvedMembers.length > 0
                  ? isRTL
                    ? `${resolvedMembers.length} عضو مرتبط`
                    : `${resolvedMembers.length} member${resolvedMembers.length !== 1 ? "s" : ""} assigned`
                  : isRTL
                    ? "لا يوجد أعضاء مرتبطون"
                    : "No members assigned"}
              </p>
            </div>
          )}
        </div>

        {/* Actions — always visible */}
        {!renaming && (
          <div className="flex items-center gap-1 shrink-0">
            {!section.isDefault && (
              <button
                onClick={() => setRenaming(true)}
                title={isRTL ? "تعديل اسم القسم" : "Rename section"}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {!section.isDefault && (
              <button
                onClick={onDelete}
                disabled={isDeleting}
                title={isRTL ? "حذف القسم" : "Delete section"}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all disabled:opacity-40"
              >
                {isDeleting ? (
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            )}
            <button
              onClick={() => setExpanded((p) => !p)}
              title={isRTL ? "إدارة الأعضاء" : "Manage members"}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all font-medium ${
                expanded
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-300 dark:shadow-violet-900"
                  : "text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30"
              }`}
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <Users className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* ── Members preview strip (collapsed) ── */}
      {!expanded && resolvedMembers.length > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full flex items-center gap-2 px-4 pb-3.5 hover:opacity-80 transition-opacity group"
        >
          <div className="flex -space-x-1.5 rtl:space-x-reverse">
            {resolvedMembers.slice(0, 5).map((m) => (
              <div
                key={m._id}
                className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 bg-violet-100 dark:bg-violet-800 flex items-center justify-center text-[9px] font-black text-violet-700 dark:text-violet-200"
              >
                {m.image ? (
                  <img
                    src={m.image}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  initial(m)
                )}
              </div>
            ))}
            {resolvedMembers.length > 5 && (
              <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[9px] font-black text-gray-500">
                +{resolvedMembers.length - 5}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold group-hover:text-violet-500 transition-colors">
            {isRTL ? "تعديل الأعضاء" : "Edit members"}
          </span>
        </button>
      )}

      {/* ── Empty members CTA (collapsed) ── */}
      <button
        onClick={() => setExpanded(true)}
        className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-violet-500 dark:text-violet-400 pb-3.5 hover:text-violet-700 transition-colors"
      >
        <UserPlus className="w-3.5 h-3.5" />
        {isRTL ? "إضافة أعضاء للقسم" : "Add members to this section"}
      </button>

      {/* ── Member Picker (expanded) ── */}
      {expanded && (
        <div className="px-4 pb-4">
          <MemberPicker
            section={section}
            allMembers={allMembers}
            isRTL={isRTL}
            onSave={(ids) => {
              setExpanded(false);
              onSaveMembers(ids);
            }}
            isSaving={isSavingMembers}
            onClose={() => setExpanded(false)}
          />
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function SectionsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { userId, isRTL } = useAppContext();

  const { data: project, isLoading: isLoadingProject } = useGetProject(id);
  const {
    data: sections,
    isLoading: isLoadingSections,
    refetch,
  } = useGetSections(id);
  const { mutate: updateSection } = useUpdateSection();
  const { mutate: deleteSection, isPending: isDeleting } = useDeleteSection();

  const [isLeader, setIsLeader] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [savingId, setSavingId] = useState(null); // sections currently saving members

  useEffect(() => {
    if (!project || !userId) return;
    const uid = userId.toString();
    const lead =
      project.leaderId?._id === uid ||
      project.coLeaders?.some((u) => u._id === uid);
    setIsLeader(lead);
    if (!lead) router.push(`/dashboard/projects/${id}`);
  }, [project, userId, id, router]);

  const allMembers = [
    ...(project?.coLeaders ?? []),
    ...(project?.members ?? []),
  ].reduce(
    (acc, m) => (acc.find((x) => x._id === m._id) ? acc : [...acc, m]),
    [],
  );

  /* Create */
  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setIsCreating(true);
    try {
      await axios.post("/api/sections", {
        title: newTitle.trim(),
        description: newDescription.trim(),
        projectId: id,
      });
      toast.success(isRTL ? "تم إنشاء القسم" : "Section created!");
      setNewTitle("");
      setNewDescription("");
      setShowCreate(false);
      refetch();
    } catch {
      toast.error(isRTL ? "فشل الإنشاء" : "Failed to create");
    } finally {
      setIsCreating(false);
    }
  };

  /* Rename & Update Description */
  const handleRename = (sectionId, title, description) => {
    updateSection(
      { sectionId, data: { title, description } },
      {
        onSuccess: () => {
          toast.success(isRTL ? "تم التحديث" : "Updated!");
          refetch();
        },
        onError: () => toast.error(isRTL ? "فشل التحديث" : "Update failed"),
      },
    );
  };

  /* Delete */
  const handleDelete = (section) => {
    if (section.isDefault) {
      toast.error(
        isRTL
          ? "لا يمكن حذف القسم الافتراضي"
          : "Cannot delete the default section",
      );
      return;
    }
    if (
      !confirm(isRTL ? `حذف "${section.title}"؟` : `Delete "${section.title}"?`)
    )
      return;
    deleteSection(section._id, {
      onSuccess: () => {
        toast.success(isRTL ? "تم الحذف" : "Deleted");
        refetch();
      },
      onError: () => toast.error(isRTL ? "فشل الحذف" : "Delete failed"),
    });
  };

  /* Save members */
  const handleSaveMembers = (sectionId, memberIds) => {
    setSavingId(sectionId);
    updateSection(
      { sectionId, data: { members: memberIds } },
      {
        onSuccess: () => {
          toast.success(isRTL ? "تم حفظ الأعضاء" : "Members saved!");
          refetch();
        },
        onError: () => toast.error(isRTL ? "فشل الحفظ" : "Save failed"),
        onSettled: () => setSavingId(null),
      },
    );
  };

  if (isLoadingProject || isLoadingSections) return <Loading />;
  if (!project) return null;

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <ProjectPageHeader
        projectId={id}
        projectTitle={project.title}
        icon={Layers}
        iconBg="bg-linear-to-br from-violet-500 to-indigo-600"
        label={isRTL ? "إدارة الأقسام" : "Sections"}
        isRTL={isRTL}
        action={
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-violet-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isRTL ? "قسم جديد" : "New Section"}
            </span>
          </button>
        }
      />

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-4">
        {/* Explainer */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isRTL
            ? "كل قسم يمثّل مجموعة عمل داخل المشروع. يمكنك تحديد الأعضاء المرتبطين بكل قسم وإدارة الإعدادات الخاصة به."
            : "Each section represents a work group inside the project. Assign members to sections and manage each section's settings."}
        </p>

        {/* Create input */}
        {showCreate && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-violet-100 dark:border-violet-800/50 p-6 shadow-xl shadow-violet-500/5 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-xl text-violet-600 dark:text-violet-400">
                <Plus className="w-4 h-4" />
              </div>
              <h3 className="font-black text-gray-900 dark:text-white">
                {isRTL ? "إضافة قسم جديد" : "Add New Section"}
              </h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                  {isRTL ? "اسم القسم" : "Section Name"}
                </label>
                <input
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={
                    isRTL
                      ? "مثال: تطوير الواجهات..."
                      : "e.g. Frontend Development..."
                  }
                  className="w-full h-12 px-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-gray-300 dark:placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                  {isRTL ? "الوصف" : "Description"}
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder={
                    isRTL
                      ? "ما هي تخصصات هذا الفريق؟"
                      : "What are this team's specialties?"
                  }
                  className="w-full h-24 px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCreate}
                disabled={!newTitle.trim() || isCreating}
                className="flex-1 h-12 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 transition-all active:scale-95"
              >
                {isCreating ? (
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                {isRTL ? "تأكيد الإنشاء" : "Confirm Creation"}
              </button>
              <button
                onClick={() => {
                  setShowCreate(false);
                  setNewTitle("");
                  setNewDescription("");
                }}
                className="h-12 px-6 flex items-center justify-center rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-bold text-sm"
              >
                {isRTL ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        )}

        {/* Sections list */}
        {!sections || sections.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-7 h-7 text-violet-400" />
            </div>
            <h3 className="text-base font-black text-gray-800 dark:text-white mb-1">
              {isRTL ? "لا توجد أقسام بعد" : "No sections yet"}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {isRTL
                ? "أنشئ أول قسم لتنظيم فريقك."
                : "Create your first section to organise your team."}
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-all"
            >
              <Plus className="w-4 h-4" />
              {isRTL ? "قسم جديد" : "New Section"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((section) => (
              <SectionCard
                key={section._id}
                section={section}
                allMembers={allMembers}
                isRTL={isRTL}
                onRename={(title, description) => handleRename(section._id, title, description)}
                onDelete={() => handleDelete(section)}
                onSaveMembers={(ids) => handleSaveMembers(section._id, ids)}
                isDeleting={isDeleting}
                isSavingMembers={savingId === section._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
