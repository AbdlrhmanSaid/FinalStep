"use client";
import ProjectForm from "./ProjectForm";
import { useAddProject } from "../../../hooks/projects/useAddProject";
import { useAppContext } from "../../../contexts/AppContext";
import { translations } from "../../../lib/translations";
import toast from "react-hot-toast";

export default function CreateProjectPage() {
  const { mutate: addProject, isPending } = useAddProject();
  const { language, isRTL, email: sender } = useAppContext();
  const content = translations[language].dashboard.addProject;

  const onSubmit = (formData) => {
    return new Promise((resolve, reject) => {
      addProject(formData, {
        onSuccess: async (createdProject) => {
          try {
            const receivers =
              formData.inviteRequests?.map((i) => i.email).filter(Boolean) ||
              [];

            if (receivers.length === 0) {
              return resolve(createdProject);
            }

            const response = await fetch("/api/send-invites", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sender: sender,
                receivers,
                projectName: formData.title,
              }),
            });

            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.error || "Failed to send invites");
            }

            if (result.failed?.length > 0) {
              console.warn("Failed invites:", result.failed);
              toast.error(`Failed to send ${result.failed.length} invites`);
            }

            resolve(createdProject);
          } catch (err) {
            console.error("Invite sending error:", err);
            // استمر حتى لو فشل إرسال الإيميلات
            resolve(createdProject);
          }
        },
        onError: (err) => reject(err),
      });
    });
  };

  return (
    <div className="p-6 bgMain min-h-screen h-full">
      <h1 className="text-2xl font-semibold mb-4 mx-auto text-center dark:text-white">
        {content.title}
      </h1>
      <ProjectForm
        onSubmit={onSubmit}
        isPending={isPending}
        content={content}
        isRTL={isRTL}
      />
    </div>
  );
}
