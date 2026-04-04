"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  Plus,
  Layers,
  LoaderCircle,
  Check,
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
import SectionCard from "./components/SectionCard";

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
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    if (!project || !userId) return;
    const uid = userId.toString();
    const lead =
      project.leaderId?._id === uid ||
      project.coLeaders?.some((u) => u._id === uid);
    setIsLeader(lead);
    if (!lead && project) router.push(`/dashboard/projects/${id}`);
  }, [project, userId, id, router]);

  const allMembers = [
    ...(project?.coLeaders ?? []),
    ...(project?.members ?? []),
  ].reduce(
    (acc, m) => (acc.find((x) => x._id === m._id) ? acc : [...acc, m]),
    [],
  );

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

  const handleDelete = (section) => {
    deleteSection(section._id, {
      onSuccess: () => {
        toast.success(isRTL ? "تم الحذف" : "Deleted");
        refetch();
      },
      onError: () => toast.error(isRTL ? "فشل الحذف" : "Delete failed"),
    });
  };

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
      className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20"
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
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isRTL
            ? "كل قسم يمثّل مجموعة عمل داخل المشروع. يمكنك تحديد الأعضاء المرتبطين بكل قسم وإدارة الإعدادات الخاصة به."
            : "Each section represents a work group inside the project. Assign members to sections and manage each section's settings."}
        </p>

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
                sections={sections}
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
