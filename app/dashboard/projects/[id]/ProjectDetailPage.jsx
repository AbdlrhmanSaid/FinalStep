"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  redirect,
  useParams,
  useSearchParams,
  useRouter,
} from "next/navigation";
import { toast } from "react-hot-toast";

import {
  useGetProject,
  useDeleteProject,
} from "@/hooks/projects/useGetProjects";
import { useAppContext } from "@/contexts/AppContext";
import { translations } from "@/lib/translations";
import Loading from "@/components/Loading";
import ErrorState from "@/components/ErrorState";

import { useLeaveProject } from "@/hooks/invitations/useLeaveProject";
import { useUpdateProjectStatus } from "@/hooks/projects/useUpdateProjectStatus";
import { useGetTasks, useDeleteTask } from "@/hooks/tasks/useTasks";
import {
  useJoinProject,
  useRespondJoinProject,
} from "@/hooks/projects/useJoinProject";
import { useUpdateMemberTitle } from "@/hooks/projects/useUpdateMemberTitle";
import { useGetSections } from "@/hooks/sections/useGetSections";

import { ar, enUS } from "date-fns/locale";

import ProjectHeader from "./components/ProjectHeader";
import ProjectJoinBanner from "./components/ProjectJoinBanner";
import ProjectDetailsSection from "./components/ProjectDetailsSection";
import ProjectTeamSection from "./components/ProjectTeamSection";
import ProjectJoinRequests from "./components/ProjectJoinRequests";
import ProjectTasks from "./components/ProjectTasks";
import ProjectActions from "./components/ProjectActions";
import ProjectRoadmapWidget from "./components/ProjectRoadmapWidget";
import CollapsibleSidebarSection from "./components/CollapsibleSidebarSection";
import ProjectSectionsTab from "./components/ProjectSectionsTab";
import ProjectSectionPlan from "./components/ProjectSectionPlan";
import {
  Info,
  Users,
  GitPullRequest,
  ClipboardList,
  LayoutGrid,
  ShieldAlert,
  Zap
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const isInvite = searchParams.get("invite") === "true";
  const router = useRouter();

  const { language, userId, isRTL } = useAppContext();
  const dateLocale = language === "ar" ? ar : enUS;
  const content = translations[language].dashboard.projectDetail;
  const taskStatusContent = translations[language].dashboard.taskDetails.status;
  const modal = translations[language].dashboard.deleteModal;

  const {
    data,
    isLoading,
    error,
    refetch: refetchProject,
    isRefetching: isRefetchingProject,
  } = useGetProject(id);

  const {
    data: tasks,
    refetch: refetchTasks,
    isFetching: isRefetchingTasks,
  } = useGetTasks();

  const { data: sectionsData, isLoading: isLoadingSections } =
    useGetSections(id);

  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: deleteProject } = useDeleteProject();
  const { mutate: leaveProject } = useLeaveProject();
  const { mutate: updateStatus } = useUpdateProjectStatus();
  const { mutate: joinProject, isLoading: isJoining } = useJoinProject();
  const { mutate: respondJoin, isLoading: isResponding } =
    useRespondJoinProject();
  const { mutate: updateMemberTitle } = useUpdateMemberTitle();

  const [isLeader, setIsLeader] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isRandomUser, setIsRandomUser] = useState(false);
  const [taskFilter, setTaskFilter] = useState("all");

  const isRefetching =
    isRefetchingProject || isRefetchingTasks || isLoadingSections;

  const handleRefresh = useCallback(() => {
    refetchProject();
    if (refetchTasks) refetchTasks();
  }, [refetchProject, refetchTasks]);

  useEffect(() => {
    if (!data || !userId) return;

    const uid = userId.toString();

    setIsLeader(false);
    setIsMember(false);
    setIsRandomUser(false);

    if (
      data.leaderId?._id === uid ||
      data.coLeaders?.some((u) => u._id === uid)
    ) {
      setIsLeader(true);
    } else if (data.members?.some((u) => u._id === uid)) {
      setIsMember(true);
    } else {
      setIsRandomUser(true);
      if (!data.public && !isInvite) router.push("/dashboard/projects");
    }
  }, [data, userId, isInvite, router]);

  const handleJoinProject = useCallback(() => {
    joinProject({
      projectId: data._id,
      userId: userId.toString(),
      invite: isInvite,
    });
  }, [data, userId, isInvite, joinProject]);

  const hasRequestedJoin = useMemo(() => {
    return data?.joinRequests?.some(
      (req) =>
        req.userId?._id === userId?.toString() && req.status === "pending",
    );
  }, [data, userId]);

  const pendingJoinRequests = useMemo(() => {
    return data?.joinRequests?.filter((req) => req.status === "pending") || [];
  }, [data]);

  const isFinished = data?.status === "finished";

  const getMySubmissionStatus = useCallback(
    (task) => {
      if (!task.memberSubmissions || task.memberSubmissions.length === 0)
        return task.status;
      const mySub = task.memberSubmissions.find(
        (s) => (s.userId?._id || s.userId)?.toString() === userId?.toString(),
      );
      return mySub ? mySub.status : task.status;
    },
    [userId],
  );

  const filteredTasks = useMemo(() => {
    if (!tasks || !data) return [];

    return tasks.filter((task) => {
      const hasPermission = isLeader
        ? task?.projectId?._id === data?._id
        : task?.projectId?._id === data?._id &&
          task.assignedTo?.some((u) => u._id === userId);

      if (!hasPermission) return false;

      if (taskFilter === "current") {
        const effectiveStatus = isLeader
          ? task.status
          : getMySubmissionStatus(task);
        return (
          effectiveStatus !== "completed" &&
          effectiveStatus !== "finished" &&
          effectiveStatus !== "rejected" &&
          effectiveStatus !== "ended"
        );
      }
      if (taskFilter === "completed") {
        const effectiveStatus = isLeader
          ? task.status
          : getMySubmissionStatus(task);
        return (
          effectiveStatus === "completed" || effectiveStatus === "finished"
        );
      }
      if (taskFilter === "end") {
        const effectiveStatus = isLeader
          ? task.status
          : getMySubmissionStatus(task);
        return effectiveStatus === "ended";
      }

      return true; // "all"
    });
  }, [tasks, data, isLeader, userId, taskFilter, getMySubmissionStatus]);

  if (isLoading) return <Loading />;
  if (error) {
    const isNotFound =
      error.response?.status === 404 ||
      error.response?.data?.error === "Project not found";
    return (
      <ErrorState
        type={isNotFound ? "projectNotFound" : "general"}
        customMessage={isNotFound ? "" : error.message}
        refreshAction={refetchProject}
      />
    );
  }
  if (!data) return <ErrorState type="projectNotFound" />;

  const handleEdit = () => redirect(`/dashboard/updateProject/${data._id}`);
  const handleReport = () => redirect(`/dashboard/report/${data._id}`);

  const handleDelete = () => {
    deleteProject({ id: data._id, userId });
    redirect("/dashboard/projects");
  };

  const handleLeave = () => {
    leaveProject({ projectId: data._id, userId });
    redirect("/dashboard/projects");
  };

  const toggleStatus = () => {
    const newStatus = data.status === "open" ? "finished" : "open";
    updateStatus(
      { projectId: data._id, userId, status: newStatus },
      {
        onSuccess: () => {
          router.push("/dashboard/projects");
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-4 md:p-8 lg:p-12 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Dynamic Navigation/Breadcrumbs could be here */}

        <div className="flex flex-col gap-8">
          <ProjectHeader
            data={data}
            content={content}
            isRTL={isRTL}
            isFinished={isFinished}
            handleRefresh={handleRefresh}
            isRefetching={isRefetching}
          />

          <ProjectJoinBanner
            data={data}
            isRandomUser={isRandomUser}
            isInvite={isInvite}
            isFinished={isFinished}
            isRTL={isRTL}
            content={content}
            handleJoinProject={handleJoinProject}
            hasRequestedJoin={hasRequestedJoin}
            isJoining={isJoining}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Main Projects Content (Tasks & Sections) */}
            <div
              className={`${isLeader ? "lg:col-span-8" : "lg:col-span-9"} space-y-8`}
            >
              {!isRandomUser ? (
                <Tabs
                  defaultValue="tasks"
                  className="w-full space-y-6"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <div className="flex items-center justify-between">
                    <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-2xl border border-gray-100 dark:border-gray-800 h-12">
                      <TabsTrigger
                        value="tasks"
                        className="rounded-xl px-6 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 font-black text-xs uppercase tracking-widest gap-2"
                      >
                        <ClipboardList className="w-4 h-4" />
                        {isRTL ? "المهام" : "Tasks"}
                      </TabsTrigger>
                      <TabsTrigger
                        value="sections"
                        className="rounded-xl px-6 data-[state=active]:bg-violet-50 dark:data-[state=active]:bg-violet-900/30 data-[state=active]:text-violet-600 dark:data-[state=active]:text-violet-400 font-black text-xs uppercase tracking-widest gap-2"
                      >
                        <LayoutGrid className="w-4 h-4" />
                        {isRTL ? "الأقسام" : "Sections"}
                      </TabsTrigger>
                      <TabsTrigger
                        value="section_plan"
                        className="rounded-xl px-6 data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-900/30 data-[state=active]:text-teal-600 dark:data-[state=active]:text-teal-400 font-black text-xs uppercase tracking-widest gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        {isRTL ? "خطة القسم" : "Section Plan"}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="tasks" className="mt-0 outline-none">
                    <ProjectTasks
                      data={data}
                      content={content}
                      isRTL={isRTL}
                      isLeader={isLeader}
                      isMember={isMember}
                      isFinished={isFinished}
                      userId={userId?.toString()}
                      sectionsData={sectionsData}
                      tasks={tasks}
                      filteredTasks={filteredTasks}
                      refetchTasks={refetchTasks}
                      deleteTask={deleteTask}
                      modal={modal}
                      taskStatusContent={taskStatusContent}
                      taskFilter={taskFilter}
                      setTaskFilter={setTaskFilter}
                      dateLocale={dateLocale}
                      getMySubmissionStatus={getMySubmissionStatus}
                      isRandomUser={isRandomUser}
                      isInvite={isInvite}
                    />
                  </TabsContent>

                  <TabsContent value="sections" className="mt-0 outline-none">
                    <ProjectSectionsTab
                      projectId={id}
                      isLeader={isLeader}
                      isRTL={isRTL}
                      userId={userId}
                      sections={sectionsData}
                      isLoading={isLoadingSections}
                      projectMembers={[
                        ...(data.leaderId ? [data.leaderId] : []),
                        ...(data.coLeaders || []),
                        ...(data.members || []),
                      ]}
                    />
                  </TabsContent>

                  <TabsContent value="section_plan" className="mt-0 outline-none">
                    <ProjectSectionPlan
                      projectId={id}
                      sections={sectionsData}
                      userId={userId}
                      isRTL={isRTL}
                      isLeader={isLeader}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 text-center">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-full w-fit mx-auto mb-4">
                    <ShieldAlert className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">
                    {isRTL ? "محتوى خاص بالأعضاء" : "Members-Only Content"}
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    {isRTL 
                      ? "يجب أن تكون عضواً في الفريق لرؤية المهام والأقسام وخارطة الطريق." 
                      : "You must be a team member to view tasks, sections, and the roadmap."}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Sidebar — leaders see full sidebar, members see minimal */}
            <aside
              className={`${isLeader ? "lg:col-span-4" : "lg:col-span-3"} space-y-6`}
            >
              <CollapsibleSidebarSection
                title={isRTL ? "معلومات المشروع" : "Project Info"}
                icon={Info}
                isRTL={isRTL}
                defaultOpen={true}
              >
                <ProjectDetailsSection
                  data={data}
                  content={content}
                  isRTL={isRTL}
                  dateLocale={dateLocale}
                  isWrapped={true}
                />
              </CollapsibleSidebarSection>

              {/* Team section — leaders only */}
              {isLeader && (
                <CollapsibleSidebarSection
                  title={isRTL ? "أعضاء الفريق" : "Team Members"}
                  icon={Users}
                  isRTL={isRTL}
                  defaultOpen={true}
                >
                  <ProjectTeamSection
                    data={data}
                    content={content}
                    isRTL={isRTL}
                    isLeader={isLeader}
                    updateMemberTitle={updateMemberTitle}
                    isWrapped={true}
                  />
                </CollapsibleSidebarSection>
              )}

              {/* Join requests — leaders only */}
              {isLeader && pendingJoinRequests.length > 0 && (
                <CollapsibleSidebarSection
                  title={isRTL ? "طلبات الانضمام" : "Join Requests"}
                  icon={GitPullRequest}
                  isRTL={isRTL}
                  defaultOpen={true}
                >
                  <ProjectJoinRequests
                    data={data}
                    content={content}
                    isLeader={isLeader}
                    pendingJoinRequests={pendingJoinRequests}
                    isResponding={isResponding}
                    respondJoin={respondJoin}
                    userId={userId}
                    isWrapped={true}
                  />
                </CollapsibleSidebarSection>
              )}

              {/* Roadmap widget — visible to ALL members */}
              {!isRandomUser && (
                <CollapsibleSidebarSection
                  title={isRTL ? "خطة العمل" : "Roadmap"}
                  icon={ClipboardList}
                  isRTL={isRTL}
                  defaultOpen={true}
                >
                  <ProjectRoadmapWidget
                    projectId={id}
                    isRTL={isRTL}
                    isWrapped={true}
                  />
                </CollapsibleSidebarSection>
              )}

              <ProjectActions
                data={data}
                content={content}
                isRTL={isRTL}
                isLeader={isLeader}
                isMember={isMember}
                isFinished={isFinished}
                modal={modal}
                toggleStatus={toggleStatus}
                handleDelete={handleDelete}
                handleLeave={handleLeave}
                handleEdit={handleEdit}
                handleReport={handleReport}
                router={router}
              />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
