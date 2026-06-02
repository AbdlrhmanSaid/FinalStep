"use client";

import { useParams, useRouter } from "next/navigation";
import { Users, ArrowUp, ArrowLeft } from "lucide-react";

import { useGetProject } from "@/hooks/projects/useGetProjects";
import { useGetSections } from "@/hooks/sections/useGetSections";
import { useDeleteMember } from "@/hooks/projects/useDeleteMember";
import { useUpdateMemberRole } from "@/hooks/projects/useUpdateMemberRole";
import { useAppContext } from "@/contexts/AppContext";
import Loading from "@/components/Loading";
import CheckUserRole from "@/lib/actions/checkUserRole";

import InviteMemberSection from "./components/InviteMemberSection";
import CurrentTeamSection from "./components/CurrentTeamSection";

export default function UpdateTeam() {
  const { id } = useParams();
  const router = useRouter();
  const { data: project, isLoading: loadingProject, error } = useGetProject(id);
  const { data: sections } = useGetSections(id);
  const { userId, isRTL, email: sender } = useAppContext();

  const { mutate: deleteMember } = useDeleteMember();
  const { mutate: updateMemberRole } = useUpdateMemberRole();

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

  if (loadingProject) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  if (!project) return null;

  return (
    <CheckUserRole projectId={id}>
      <div
        className="min-h-screen bg-linear-to-br   dark:text-white p-3.5 sm:p-4 md:p-8 transition-all duration-300"
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

          <InviteMemberSection
            projectId={id}
            projectTitle={project.title}
            sender={sender}
            isRTL={isRTL}
            userId={userId}
          />

          <CurrentTeamSection
            project={project}
            isRTL={isRTL}
            sections={sections}
            onPromote={handlePromote}
            onDemote={handleDemote}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </CheckUserRole>
  );
}
