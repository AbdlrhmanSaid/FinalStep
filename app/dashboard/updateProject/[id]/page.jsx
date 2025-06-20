"use client";

import { useParams } from "next/navigation";
import { useUpdateProject } from "../../../../hooks/projects/useUpdateProject";
import ProjectEditForm from "./ProjectEditForm";
import Loading from "../../../../components/Loading";
import CheckUserRole from "../../../../lib/actions/checkUserRole";
import { useAppContext } from "../../../../contexts/AppContext";
import { useGetProject } from "../../../../hooks/projects/useGetProjects";

const Page = () => {
  const { id } = useParams();
  const { data: project, isLoading, error } = useGetProject(id);
  const { userId } = useAppContext();
  const { mutate: updateProject, isPending } = useUpdateProject();

  const onSubmit = (formData) => {
    return new Promise((resolve, reject) => {
      updateProject(
        { id, data: formData, userId },
        {
          onSuccess: () => resolve(),
          onError: (err) => reject(err),
        }
      );
    });
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  if (!project) return null;

  return (
    <CheckUserRole>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white p-6 transition-colors duration-200">
        <ProjectEditForm
          project={project}
          onSubmit={onSubmit}
          isPending={isPending}
          isRTL={true}
          content={{
            titleInput: "عنوان المشروع",
            describe: "وصف المشروع",
            isPublic: "مشروع عام؟",
            inviteRequests: "دعوات الأعضاء",
            addinvite: "إضافة دعوة",
            pindingProject: "جارٍ التعديل...",
            createProject: "تعديل المشروع",
          }}
        />
      </div>
    </CheckUserRole>
  );
};

export default Page;
