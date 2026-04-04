"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useGetUserById } from "../../../../hooks/users/useGetUsers";
import { useUpdateCurrentUser } from "../../../../hooks/users/useUpdateCurrentUser";
import { useAppContext } from "../../../../contexts/AppContext";
import { translations } from "../../../../lib/translations";
import Loading from "@/components/Loading";

import { Button } from "../../../../components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Crown,
  Users,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  ShieldCheck,
  FolderOpen,
  FolderCheck,
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  Lock,
  Github,
  Linkedin,
  Facebook,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function displayName(user) {
  if (user?.name && user.name !== "null null") return user.name;
  return user?.email?.split("@")[0].replace(/[0-9]/g, "") || "Unknown";
}

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function TaskStatusBadge({ status, t }) {
  const map = {
    open: {
      label: t.taskStatusOpen,
      icon: Clock,
      cls: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    },
    submitted: {
      label: t.taskStatusSubmitted,
      icon: Send,
      cls: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300",
    },
    completed: {
      label: t.taskStatusCompleted,
      icon: CheckCircle,
      cls: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
    },
    rejected: {
      label: t.taskStatusRejected,
      icon: XCircle,
      cls: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
    },
    ended: {
      label: t.taskStatusEnded || "Ended",
      icon: XCircle,
      cls: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
    },
  };
  const statusKey = status === "ended" ? "ended" : status;
  const { label, icon: Icon, cls } = map[statusKey] ?? map.open;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function PriorityDot({ priority }) {
  const colors = {
    low: "bg-green-400",
    medium: "bg-yellow-400",
    high: "bg-red-500",
  };
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${colors[priority] ?? "bg-gray-400"}`}
    />
  );
}

// ─── Links Display (public profile) ───────────────────────────────────────────
function LinksRow({ links, t }) {
  const { linkedin, github, facebook, custom } = links || {};
  const hasLinks = linkedin || github || facebook || custom?.some((c) => c.url);
  if (!hasLinks) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider me-1">
        {t.links}:
      </p>
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
        >
          <Linkedin className="w-3.5 h-3.5" />
          LinkedIn
        </a>
      )}
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Github className="w-3.5 h-3.5" />
          GitHub
        </a>
      )}
      {facebook && (
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors"
        >
          <Facebook className="w-3.5 h-3.5" />
          Facebook
        </a>
      )}
      {custom?.map(
        (c, i) =>
          c.url && (
            <a
              key={i}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/40 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {c.label || `Link ${i + 1}`}
            </a>
          ),
      )}
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab({ user, userId, t, isRTL }) {
  const [editNameMode, setEditNameMode] = useState(false);
  const [editTitleMode, setEditTitleMode] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [newTitle, setNewTitle] = useState(user.title || "");

  const { mutate: updateUser, isPending } = useUpdateCurrentUser(userId);

  const save = (data, onDone) => {
    updateUser(data, {
      onSuccess: () => {
        toast.success(t.updateSuccess);
        onDone?.();
      },
      onError: () => toast.error(t.updateError),
    });
  };

  const togglePrivacy = (field) => {
    const current = user.privacy?.[field] ?? true;
    save({ privacy: { ...user.privacy, [field]: !current } }, null);
  };

  return (
    <div className="space-y-5">
      {/* Name */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          {t.nameLabel}
        </p>
        {editNameMode ? (
          <div className="space-y-2">
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={isPending}
                onClick={() =>
                  save({ name: newName }, () => setEditNameMode(false))
                }
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isPending ? t.savingText : t.saveButton}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setNewName(user.name);
                  setEditNameMode(false);
                }}
              >
                {t.cancelButton}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-gray-900 dark:text-white">{user.name}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditNameMode(true)}
              className="text-gray-500 hover:text-blue-600"
            >
              {t.editButton}
            </Button>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          {t.titleLabel}
        </p>
        {editTitleMode ? (
          <div className="space-y-2">
            <input
              autoFocus
              type="text"
              maxLength={60}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={t.titlePlaceholder}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
            />
            <p className="text-xs text-gray-400">{t.titleHint}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={isPending}
                onClick={() =>
                  save({ title: newTitle.trim() }, () =>
                    setEditTitleMode(false),
                  )
                }
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isPending ? t.savingText : t.saveButton}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setNewTitle(user.title || "");
                  setEditTitleMode(false);
                }}
              >
                {t.cancelButton}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span
              className={
                newTitle
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-400 italic"
              }
            >
              {newTitle || t.titlePlaceholder}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditTitleMode(true)}
              className="text-gray-500 hover:text-purple-600"
            >
              {t.editButton}
            </Button>
          </div>
        )}
      </div>

      {/* Social Links */}
      <LinksSettingsSection
        user={user}
        userId={userId}
        t={t}
        isPending={isPending}
        onSave={(data) => save(data, null)}
      />

      {/* Privacy */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {t.privacyTitle}
        </p>
        <PrivacyToggle
          label={t.showProjects}
          checked={user.privacy?.showProjects ?? true}
          onChange={() => togglePrivacy("showProjects")}
          isPending={isPending}
          isRTL={isRTL}
        />
        <PrivacyToggle
          label={t.showTasks}
          checked={user.privacy?.showTasks ?? true}
          onChange={() => togglePrivacy("showTasks")}
          isPending={isPending}
          isRTL={isRTL}
        />
      </div>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab({ user, t, isRTL, isOwner }) {
  const showProjects = user.privacy?.showProjects !== false;
  const showTasks = user.privacy?.showTasks !== false;

  return (
    <div className="space-y-5">
      {/* Completed Tasks */}
      {showTasks && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            {t.completedTasks}
          </h2>

          {user.completedTasks?.length > 0 ? (
            <div className="space-y-2">
              {user.completedTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-800 dark:text-white truncate">
                        {task.title}
                      </p>
                      {task.projectId?.title && (
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-400 truncate">
                            {task.projectId.title}
                          </p>
                          {task.projectId.public === false && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                              Private
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <PriorityDot priority={task.priority} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">
              {t.noCompletedTasks}
            </p>
          )}
        </div>
      )}

      {/* Projects Leading */}
      <ProjectsSection
        title={t.projectsLeading}
        icon={<Crown className="w-5 h-5 text-yellow-500" />}
        projects={user.projectsLeading}
        show={showProjects}
        privateMsg={t.privateProjects}
        emptyMsg={t.noProjectsLeading}
        statusOpen={t.statusOpen}
        statusFinished={t.statusFinished}
        viewProject={t.viewProject}
        isOwner={isOwner}
      />

      {/* Projects Member */}
      <ProjectsSection
        title={t.projectsMember}
        icon={<Users className="w-5 h-5 text-blue-500" />}
        projects={user.projectsMember}
        show={showProjects}
        privateMsg={t.privateProjects}
        emptyMsg={t.noProjectsMember}
        statusOpen={t.statusOpen}
        statusFinished={t.statusFinished}
        viewProject={t.viewProject}
        isOwner={isOwner}
      />

      {/* Recent Tasks */}
      {showTasks && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-500" />
            {t.recentTasks}
          </h2>

          {user.recentTasks?.length > 0 ? (
            <div className="space-y-2">
              {user.recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <PriorityDot priority={task.priority} />
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-800 dark:text-white truncate">
                        {task.title}
                      </p>
                      {task.projectId?.title && (
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-400 truncate">
                            {task.projectId.title}
                          </p>
                          {task.projectId.public === false && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                              Private
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <TaskStatusBadge status={task.status} t={t} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">
              {t.noTasks}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ProjectsSection({
  title,
  icon,
  projects,
  show,
  privateMsg,
  emptyMsg,
  statusOpen,
  statusFinished,
  viewProject,
  isOwner,
}) {
  if (!show) {
    return null;
  }

  const calculateProgress = (project) => {
    if (!project.tasks || project.tasks.length === 0)
      return { progress: 0, count: 0 };
    const total = project.tasks.length;
    const completed = project.tasks.filter(
      (task) =>
        task.status === "completed" ||
        task.status === "approved" ||
        task.status === "finished",
    ).length;
    return {
      progress: Math.round((completed / total) * 100),
      count: total,
    };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
      <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {projects?.length > 0 ? (
        <div className="space-y-4">
          {projects.map((proj) => {
            const { progress, count } = calculateProgress(proj);
            return (
              <div
                key={proj._id}
                className="md:flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                  {proj.status === "finished" ? (
                    <FolderCheck className="w-5 h-5 text-green-500 shrink-0" />
                  ) : (
                    <FolderOpen className="w-5 h-5 text-blue-500 shrink-0" />
                  )}
                  <div className="min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                    <div className="md:flex items-center gap-2 min-w-0 flex-1">
                      <p className="font-medium text-sm text-gray-800 dark:text-white truncate">
                        {proj.title}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                          proj.status === "finished"
                            ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                            : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                        }`}
                      >
                        {proj.status === "finished"
                          ? statusFinished
                          : statusOpen}
                      </span>
                      {proj.public === false && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shrink-0">
                          Private
                        </span>
                      )}
                    </div>

                    {/* Numbers and Percentages */}
                    {count > 0 && (
                      <div className="flex items-center gap-2 sm:border-s border-gray-300 dark:border-gray-600 sm:ps-3 shrink-0 mt-1 sm:mt-0">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {count} {isRTL ? "مهام" : "tasks"}
                        </span>
                        <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden shrink-0">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              progress === 100 ? "bg-green-500" : "bg-blue-500"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-8">
                          {progress}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {proj.public === false && !isOwner ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="text-gray-400 dark:text-gray-500 cursor-not-allowed shrink-0"
                  >
                    {viewProject}
                  </Button>
                ) : (
                  <Link href={`/dashboard/projects/${proj._id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 shrink-0"
                    >
                      {viewProject}
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4">{emptyMsg}</p>
      )}
    </div>
  );
}

function PrivatePlaceholder({ msg }) {
  return (
    <div className="flex flex-col items-center gap-2 py-6 text-gray-400">
      <Lock className="w-8 h-8 opacity-40" />
      <p className="text-sm text-center">{msg}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const UserProfilePage = ({ isDark, userId: overrideId }) => {
  const { id: paramId } = useParams();
  const id = overrideId || paramId;
  const router = useRouter();
  const { language, isRTL, userId: currentUserId } = useAppContext();
  const dateLocale = language === "ar" ? ar : enUS;
  const t = translations[language].dashboard.publicProfile;
  const ts = translations[language].dashboard.userProfile;

  const {
    data: user,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetUserById(id, currentUserId);
  const isOwner =
    currentUserId && user && currentUserId.toString() === user._id?.toString();
  const name = user ? displayName(user) : "";
  const userInitials = name ? initials(name) : "?";
  const isAdmin = user?.role === "admin";

  const joinDate = user?.createdAt
    ? format(new Date(user.createdAt), "MMMM yyyy", { locale: dateLocale })
    : null;

  if (isLoading) return <UserProfileSkeleton isDarkMode={isDark} />;

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 flex flex-col items-center justify-center gap-6 p-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <User className="w-12 h-12 text-gray-400" />
        </div>
        <p className="text-xl font-semibold text-gray-600 dark:text-gray-300">
          {t.notFound}
        </p>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          {isRTL ? (
            <ArrowRight className="w-4 h-4" />
          ) : (
            <ArrowLeft className="w-4 h-4" />
          )}
          {t.backButton}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-4 md:p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back and Refresh */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white -ml-2"
          >
            {isRTL ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <ArrowLeft className="w-4 h-4" />
            )}
            {t.backButton}
          </Button>

          <Button
            variant="ghost"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
            title={isRTL ? "تحديث" : "Refresh"}
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin text-blue-500" : ""}`}
            />
            <span className="sr-only sm:not-sr-only text-sm">
              {isRTL ? "تحديث" : "Refresh"}
            </span>
          </Button>
        </div>

        {/* Hero Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Cover */}
          <div className="h-28 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600" />

          <div className="px-5 pb-5">
            {/* Avatar row */}
            <div className="-mt-12 mb-3 flex items-end justify-between flex-wrap gap-2">
              {/* Avatar */}
              <div className="relative w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden shrink-0 bg-linear-to-br from-blue-400 to-indigo-600">
                {user.imageUrl ? (
                  <Image
                    src={user?.imageUrl}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 96px, 96px"
                    priority
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                    {userInitials}
                  </span>
                )}
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap pb-1">
                {isAdmin && (
                  <span className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300">
                    <ShieldCheck className="w-4 h-4" />
                    {t.roleAdmin}
                  </span>
                )}
                {user.title ? (
                  <span className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                    <Briefcase className="w-4 h-4" />
                    {user.title}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 italic">
                    <Briefcase className="w-4 h-4" />
                    {t.noTitle}
                  </span>
                )}
              </div>
            </div>

            {/* Name + info */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {name}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 shrink-0" />
                {user.email}
              </span>
              {joinDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 shrink-0" />
                  {t.memberSince} {joinDate}
                </span>
              )}
            </div>

            {/* Social Links row */}
            <LinksRow links={user.links} t={t} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative items-start">
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">
                {t.projectsLeading ? (isRTL ? "الاحصائيات" : "Stats") : "Stats"}
              </h2>
              <div className="flex flex-col gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600 p-4 flex flex-col items-center gap-1 shadow-sm">
                  <Crown className="w-6 h-6 text-yellow-500 mb-1" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {user.projectsLeading?.length ?? 0}
                  </span>
                  <span className="text-xs text-center text-gray-500 dark:text-gray-400">
                    {t.projectsLeading}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600 p-4 flex flex-col items-center gap-1 shadow-sm">
                  <Users className="w-6 h-6 text-blue-500 mb-1" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {user.projectsMember?.length ?? 0}
                  </span>
                  <span className="text-xs text-center text-gray-500 dark:text-gray-400">
                    {t.projectsMember}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Content */}
            <ProfileTab user={user} t={t} isRTL={isRTL} isOwner={isOwner} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

function UserProfileSkeleton({ isDarkMode }) {
  return (
    <div className="min-h-screen bgMain p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <Skeleton className="h-28 w-full" />
          <div className="px-5 pb-5">
            <div className="-mt-12 mb-3 flex items-end justify-between flex-wrap gap-2">
              <Skeleton className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shrink-0" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24 rounded-lg" />
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative items-start">
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-2 flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-xl" />
              <Skeleton className="h-10 flex-1 rounded-xl" />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
