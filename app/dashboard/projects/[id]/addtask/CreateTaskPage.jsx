"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { translations } from "@/lib/translations";
import { useGetProject } from "@/hooks/projects/useGetProjects";
import { useCreateTask } from "@/hooks/tasks/useTasks";
import { useGetSections } from "@/hooks/sections/useGetSections";
import { useParams, useRouter } from "next/navigation";
import CheckUserRole from "@/lib/actions/checkUserRole";
import Loading from "@/components/Loading";
import DatePicker from "@/components/ui/DatePicker";
import toast from "react-hot-toast";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  ListTodo,
  Plus,
  Trash2,
  X,
  Check,
  ChevronDown,
  Link2,
  AlignLeft,
  Calendar,
  Tag,
  Users,
  Clock,
} from "lucide-react";

/* ─── tiny helpers ────────────────────────────── */
const displayName = (u) =>
  u?.name && u.name !== "null null" ? u.name : u?.email?.split("@")[0] ?? "?";
const initials = (u) => displayName(u).charAt(0).toUpperCase();

/* ─── Field wrapper ───────────────────────────── */
function Field({ label, hint, icon: Icon, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <label className="text-sm font-bold text-gray-700 dark:text-gray-200">
          {label}
        </label>
        {hint && <span className="text-xs text-gray-400 font-medium">({hint})</span>}
      </div>
      {children}
    </div>
  );
}

/* ─── Styled select ───────────────────────────── */
function StyledSelect({ children, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className="w-full h-11 px-4 pr-10 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all"
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

/* ─── Member chip ─────────────────────────────── */
function MemberChip({ user, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800">
      <span className="w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-700 flex items-center justify-center text-[9px] font-black uppercase">
        {initials(user)}
      </span>
      {displayName(user)}
      <button type="button" onClick={onRemove} className="hover:text-red-500 transition-colors ml-0.5">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

/* ─── Member picker ───────────────────────────── */
function MemberPicker({ members, selected, onToggle, onSelectAll, isRTL }) {
  const [search, setSearch] = useState("");
  const filtered = members.filter((u) =>
    displayName(u).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* search */}
      <div className="flex items-center gap-2 px-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
        <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isRTL ? "ابحث عن عضو..." : "Search member..."}
          className="flex-1 h-10 bg-transparent text-sm text-gray-700 dark:text-white placeholder:text-gray-400 focus:outline-none"
          dir={isRTL ? "rtl" : "ltr"}
        />
        {onSelectAll && (
          <button
            type="button"
            onClick={onSelectAll}
            className="text-[10px] font-black text-blue-600 dark:text-blue-400 hover:underline shrink-0 whitespace-nowrap"
          >
            {isRTL ? "الكل" : "All"}
          </button>
        )}
      </div>

      {/* list */}
      <div className="max-h-44 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
        {filtered.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-400">
            {isRTL ? "لا يوجد أعضاء" : "No members found"}
          </div>
        ) : (
          filtered.map((user) => {
            const isSelected = selected.includes(user._id);
            return (
              <button
                key={user._id}
                type="button"
                onClick={() => onToggle(user._id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                  {user.image ? (
                    <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    initials(user)
                  )}
                </div>
                <span className={`flex-1 text-sm font-semibold truncate ${
                  isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-800 dark:text-white"
                }`}>
                  {displayName(user)}
                </span>
                {isSelected && (
                  <Check className="w-4 h-4 text-blue-500 shrink-0" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function CreateTaskPage() {
  const { id: projectId } = useParams();
  const { data: project, isLoading } = useGetProject(projectId);
  const { data: sectionsData, isLoading: isLoadingSections } = useGetSections(projectId);
  const { mutate: createTask, isPending } = useCreateTask();
  const { language, isRTL, userId } = useAppContext();
  const router = useRouter();
  const content = translations[language].dashboard.addTask;

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    referenceLink: "",
    assignedTo: [],
    submissionMethod: "both",
    submissionDescription: "",
    allowLateSubmission: true,
    sectionAssignments: [{ sectionId: "", members: [] }],
  });

  if (isLoading || isLoadingSections || !project) return <Loading />;

  /* ─── Sections & team ─── */
  const isLeader =
    project.leaderId?._id === userId ||
    project.coLeaders?.some((u) => u._id === userId);

  let availableSections = sectionsData || [];
  if (!isLeader) {
    availableSections = availableSections.filter(
      (s) => s.members?.length === 0 || s.members?.some((m) => m._id === userId)
    );
  }

  const allUsers = [...(project.coLeaders ?? []), ...(project.members ?? [])];
  const teamMembers = Array.from(new Map(allUsers.map((u) => [u._id, u])).values());

  /* ─── Mutations ─── */
  const setField = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const toggleMember = (uid, sectionIndex = null) => {
    if (sectionIndex !== null) {
      setForm((p) => {
        const arr = [...p.sectionAssignments];
        arr[sectionIndex] = {
          ...arr[sectionIndex],
          members: arr[sectionIndex].members.includes(uid)
            ? arr[sectionIndex].members.filter((id) => id !== uid)
            : [...arr[sectionIndex].members, uid],
        };
        return { ...p, sectionAssignments: arr };
      });
    } else {
      setField(
        "assignedTo",
        form.assignedTo.includes(uid)
          ? form.assignedTo.filter((id) => id !== uid)
          : [...form.assignedTo, uid]
      );
    }
  };

  const addSection = () =>
    setField("sectionAssignments", [
      ...form.sectionAssignments,
      { sectionId: "", members: [] },
    ]);

  const addAllSections = () => {
    const used = form.sectionAssignments.map((a) => a.sectionId);
    const toAdd = availableSections.filter((s) => !used.includes(s._id));
    if (!toAdd.length) return;
    setField("sectionAssignments", [
      ...form.sectionAssignments.filter((a) => a.sectionId !== ""),
      ...toAdd.map((s) => ({ sectionId: s._id, members: [] })),
    ]);
  };

  const removeSection = (i) => {
    const arr = [...form.sectionAssignments];
    arr.splice(i, 1);
    setField("sectionAssignments", arr);
  };

  const updateSectionId = (i, val) => {
    const arr = [...form.sectionAssignments];
    arr[i] = { sectionId: val, members: [] };
    setField("sectionAssignments", arr);
  };

  const setSectionAllMembers = (i) => {
    const sec = availableSections.find(
      (s) => s._id === form.sectionAssignments[i].sectionId
    );
    const eligible =
      !sec || !sec.members?.length
        ? teamMembers
        : teamMembers.filter((tm) =>
            sec.members.some((m) =>
              String(typeof m === "object" ? m._id : m) === String(tm._id)
            )
          );
    const arr = [...form.sectionAssignments];
    arr[i] = { ...arr[i], members: eligible.map((u) => u._id) };
    setField("sectionAssignments", arr);
  };

  /* ─── Submit ─── */
  const handleSubmit = (e) => {
    e.preventDefault();
    let finalAssignments = [];

    if (project?.hasSections) {
      finalAssignments = form.sectionAssignments.filter((sa) => sa.sectionId);
      if (!finalAssignments.length) {
        toast.error(isRTL ? "اختر قسماً واحداً على الأقل" : "Select at least one section");
        return;
      }
      for (const sa of finalAssignments) {
        if (!sa.members?.length) {
          toast.error(isRTL ? "عيّن عضواً لكل قسم" : "Assign at least one member per section");
          return;
        }
      }
    } else {
      if (!form.assignedTo.length) {
        toast.error(isRTL ? "عيّن عضواً واحداً على الأقل" : "Assign at least one member");
        return;
      }
      if (availableSections.length > 0) {
        finalAssignments = [{ sectionId: availableSections[0]._id, members: form.assignedTo }];
      }
    }

    createTask(
      { ...form, sectionAssignments: finalAssignments, dueDate: form.dueDate || null, projectId, createdBy: userId },
      {
        onSuccess: () => {
          toast.success(content.successMessage);
          router.push(`/dashboard/projects/${projectId}`);
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || (isRTL ? "حدث خطأ" : "An error occurred")),
      }
    );
  };

  /* ─── Priority options ─── */
  const priorityOpts = [
    { value: "low",    label: content.priorityLow,    color: "text-blue-600"  },
    { value: "medium", label: content.priorityMedium, color: "text-amber-500" },
    { value: "high",   label: content.priorityHigh,   color: "text-rose-600"  },
  ];

  /* ══════════════════════════════════ RENDER ══════════════════════════════════ */
  return (
    <CheckUserRole>
      <div
        className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-2xl mx-auto space-y-6">

          {/* ── Back header ── */}
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/projects/${projectId}`}>
              <button className="p-2.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-all hover:shadow-sm">
                {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white">
                {content.title}
              </h1>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                {project.title}
              </p>
            </div>
          </div>

          {/* ── Form card ── */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 space-y-5 shadow-sm">
              <Field label={content.taskTitle} icon={ListTodo}>
                <input
                  name="title"
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  required
                  placeholder={content.taskTitlePlaceholder}
                  className="w-full h-11 px-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-semibold placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </Field>

              {/* Description */}
              <Field label={content.taskDescription} hint={isRTL ? "اختياري" : "Optional"} icon={AlignLeft}>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={3}
                  placeholder={content.taskDescriptionPlaceholder}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium resize-none placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </Field>
            </div>

            {/* Priority + Method */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{content.taskPriority}</span>
                </div>
                {/* Segmented priority picker */}
                <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  {priorityOpts.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setField("priority", opt.value)}
                      className={`flex-1 py-2 text-xs font-black transition-all ${
                        form.priority === opt.value
                          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                          : "bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{content.submissionMethod}</span>
                </div>
                <StyledSelect
                  value={form.submissionMethod}
                  onChange={(e) => setField("submissionMethod", e.target.value)}
                >
                  <option value="both">{content.methodBoth}</option>
                  <option value="text">{content.methodText}</option>
                  <option value="link">{content.methodLink}</option>
                </StyledSelect>
              </div>
            </div>

            {/* Due date + Reference link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{content.dueDate}</span>
                  <span className="text-xs text-gray-400 font-medium">({isRTL ? "اختياري" : "Optional"})</span>
                </div>
                <DatePicker
                  value={form.dueDate}
                  onChange={(val) => setField("dueDate", val)}
                  placeholder={content.dueDatePlaceholder || (isRTL ? "اختر تاريخاً..." : "Pick a date...")}
                  disablePast
                  locale={isRTL ? "ar" : "en"}
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    {isRTL ? "رابط مرجعي" : "Reference Link"}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">({isRTL ? "اختياري" : "Optional"})</span>
                </div>
                <input
                  name="referenceLink"
                  type="url"
                  value={form.referenceLink}
                  onChange={(e) => setField("referenceLink", e.target.value)}
                  placeholder="https://..."
                  className="w-full h-11 px-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Submission description */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm space-y-3">
              <Field label={content.submissionDescriptionLabel} hint={isRTL ? "ما المطلوب من الأعضاء تسليمه؟" : "What should members submit?"} icon={AlignLeft}>
                <textarea
                  name="submissionDescription"
                  value={form.submissionDescription}
                  onChange={(e) => setField("submissionDescription", e.target.value)}
                  rows={2}
                  placeholder={content.submissionDescriptionPlaceholder}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-medium resize-none placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </Field>
            </div>

            {/* ── Members / Sections ── */}
            {teamMembers.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm space-y-5">
                {project?.hasSections ? (
                  /* ── Sections mode ── */
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                          {isRTL ? "الأقسام والأعضاء" : "Sections & Members"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={addAllSections}
                          className="text-xs font-black text-violet-600 dark:text-violet-400 hover:underline"
                        >
                          {isRTL ? "كل الأقسام" : "All Sections"}
                        </button>
                        <button
                          type="button"
                          onClick={addSection}
                          className="flex items-center gap-1 text-xs font-black text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {isRTL ? "قسم" : "Section"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {form.sectionAssignments.map((assignment, idx) => {
                        const sec = availableSections.find((s) => s._id === assignment.sectionId);
                        const secMembers =
                          !sec || !sec.members?.length
                            ? teamMembers
                            : teamMembers.filter((tm) =>
                                sec.members.some(
                                  (m) => String(typeof m === "object" ? m._id : m) === String(tm._id)
                                )
                              );

                        return (
                          <div
                            key={idx}
                            className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 overflow-hidden"
                          >
                            {/* Section header */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                              <div className="flex-1">
                                <StyledSelect
                                  value={assignment.sectionId}
                                  onChange={(e) => updateSectionId(idx, e.target.value)}
                                >
                                  <option value="" disabled>
                                    {isRTL ? "اختر القسم..." : "Select section..."}
                                  </option>
                                  {availableSections.map((s) => (
                                    <option key={s._id} value={s._id}>
                                      {s.title}
                                    </option>
                                  ))}
                                </StyledSelect>
                              </div>
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => removeSection(idx)}
                                  className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            {/* Member picker for this section */}
                            {assignment.sectionId && (
                              <div className="p-4 space-y-3">
                                {secMembers.length === 0 ? (
                                  <p className="text-xs text-gray-400 text-center py-3">
                                    {isRTL
                                      ? "لا يوجد أعضاء في هذا القسم — أضفهم من صفحة إدارة الأقسام"
                                      : "No members in this section — add them from the Sections page"}
                                  </p>
                                ) : (
                                  <MemberPicker
                                    members={secMembers}
                                    selected={assignment.members}
                                    onToggle={(uid) => toggleMember(uid, idx)}
                                    onSelectAll={() => setSectionAllMembers(idx)}
                                    isRTL={isRTL}
                                  />
                                )}

                                {/* Selected chips */}
                                {assignment.members.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 pt-1">
                                    {assignment.members.map((uid) => {
                                      const u = teamMembers.find((u) => u._id === uid);
                                      return (
                                        <MemberChip
                                          key={uid}
                                          user={u}
                                          onRemove={() => toggleMember(uid, idx)}
                                        />
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  /* ── Simple assign mode ── */
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                          {content.assignTo}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setField("assignedTo", teamMembers.map((u) => u._id))}
                        className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {isRTL ? "اختيار الكل" : "Select All"}
                      </button>
                    </div>

                    <MemberPicker
                      members={teamMembers}
                      selected={form.assignedTo}
                      onToggle={(uid) => toggleMember(uid)}
                      isRTL={isRTL}
                    />

                    {/* Selected chips */}
                    {form.assignedTo.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {form.assignedTo.map((uid) => {
                          const u = teamMembers.find((u) => u._id === uid);
                          return (
                            <MemberChip key={uid} user={u} onRemove={() => toggleMember(uid)} />
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── Late submission toggle ── */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">
                    {isRTL ? "السماح بالتسليم المتأخر" : "Allow Late Submission"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {form.allowLateSubmission
                      ? isRTL ? "يُسمح بالتسليم بعد الـ deadline" : "Submissions allowed after deadline"
                      : isRTL ? "لا يُسمح بالتسليم بعد الـ deadline" : "Submissions blocked after deadline"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setField("allowLateSubmission", !form.allowLateSubmission)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
                  form.allowLateSubmission ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    form.allowLateSubmission
                      ? isRTL ? "-translate-x-6" : "translate-x-6"
                      : isRTL ? "-translate-x-1" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {content.creating}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {content.create}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </CheckUserRole>
  );
}
