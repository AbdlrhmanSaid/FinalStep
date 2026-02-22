"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useGetUserById } from "../../../../hooks/users/useGetUsers";
import { useUpdateCurrentUser } from "../../../../hooks/users/useUpdateCurrentUser";
import { useAppContext } from "../../../../contexts/AppContext";
import { translations } from "../../../../lib/translations";
import Loading from "../../../../components/Loading";
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
  Settings,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  Lock,
  Link2,
  Github,
  Linkedin,
  Facebook,
  ExternalLink,
  Plus,
  Trash2,
  Save,
} from "lucide-react";

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
  };
  const { label, icon: Icon, cls } = map[status] ?? map.open;
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

function PrivacyToggle({ label, checked, onChange, isPending, isRTL }) {
  return (
    <label
      className={`flex items-center justify-between gap-4 cursor-pointer group `}
    >
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={isPending}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none ${
          checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
        } ${isPending ? "opacity-50 cursor-not-allowed" : ""} ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}

// ─── Links Section in Settings ────────────────────────────────────────────────
function LinksSettingsSection({ user, userId, t, isPending, onSave }) {
  const [linkedin, setLinkedin] = useState(user.links?.linkedin || "");
  const [github, setGithub] = useState(user.links?.github || "");
  const [facebook, setFacebook] = useState(user.links?.facebook || "");
  const [custom, setCustom] = useState(
    user.links?.custom?.length
      ? user.links.custom.map((c) => ({
          label: c.label || "",
          url: c.url || "",
        }))
      : [],
  );

  const addCustom = () => {
    if (custom.length < 3) setCustom([...custom, { label: "", url: "" }]);
  };

  const removeCustom = (i) => setCustom(custom.filter((_, idx) => idx !== i));

  const updateCustom = (i, field, val) => {
    const updated = [...custom];
    updated[i] = { ...updated[i], [field]: val };
    setCustom(updated);
  };

  const handleSave = () => {
    onSave({
      links: {
        linkedin: linkedin.trim(),
        github: github.trim(),
        facebook: facebook.trim(),
        custom: custom
          .filter((c) => c.url.trim())
          .map((c) => ({ label: c.label.trim(), url: c.url.trim() })),
      },
    });
  };

  const inputCls =
    "w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
          {t.linksTitle}
        </p>
        <p className="text-xs text-gray-400">{t.linksHint}</p>
      </div>

      {/* LinkedIn */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
          <Linkedin className="w-4 h-4 text-blue-700" />
          {t.linkedinLabel}
        </label>
        <input
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder={t.linkedinPlaceholder}
          className={inputCls}
        />
      </div>

      {/* GitHub */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
          <Github className="w-4 h-4 text-gray-800 dark:text-white" />
          {t.githubLabel}
        </label>
        <input
          type="url"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          placeholder={t.githubPlaceholder}
          className={inputCls}
        />
      </div>

      {/* Facebook */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
          <Facebook className="w-4 h-4 text-blue-600" />
          {t.facebookLabel}
        </label>
        <input
          type="url"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
          placeholder={t.facebookPlaceholder}
          className={inputCls}
        />
      </div>

      {/* Custom Links */}
      {custom.map((c, i) => (
        <div
          key={i}
          className="space-y-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-indigo-500" />
              {t.customLabel} {i + 1}
            </p>
            <button
              type="button"
              onClick={() => removeCustom(i)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            value={c.label}
            onChange={(e) => updateCustom(i, "label", e.target.value)}
            placeholder={t.customLabelPlaceholder}
            maxLength={40}
            className={inputCls}
          />
          <input
            type="url"
            value={c.url}
            onChange={(e) => updateCustom(i, "url", e.target.value)}
            placeholder={t.customUrlPlaceholder}
            className={inputCls}
          />
        </div>
      ))}

      {custom.length < 3 && (
        <button
          type="button"
          onClick={addCustom}
          className="flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          {t.addCustomLink}
        </button>
      )}

      <Button
        disabled={isPending}
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        {isPending ? t.savingText : t.saveLinks}
      </Button>
    </div>
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
function ProfileTab({ user, t, isRTL }) {
  const showProjects = user.privacy?.showProjects !== false;
  const showTasks = user.privacy?.showTasks !== false;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center gap-1 shadow-sm">
          <Crown className="w-5 h-5 text-yellow-500" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.projectsLeading?.length ?? 0}
          </span>
          <span className="text-xs text-center text-gray-500 dark:text-gray-400">
            {t.projectsLeading}
          </span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center gap-1 shadow-sm">
          <Users className="w-5 h-5 text-blue-500" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.projectsMember?.length ?? 0}
          </span>
          <span className="text-xs text-center text-gray-500 dark:text-gray-400">
            {t.projectsMember}
          </span>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          {t.completedTasks}
        </h2>

        {!showTasks ? (
          <PrivatePlaceholder msg={t.privateTasks} />
        ) : user.completedTasks?.length > 0 ? (
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
                      <p className="text-xs text-gray-400 truncate">
                        {task.projectId.title}
                      </p>
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
      />

      {/* Recent Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-indigo-500" />
          {t.recentTasks}
        </h2>

        {!showTasks ? (
          <PrivatePlaceholder msg={t.privateTasks} />
        ) : user.recentTasks?.length > 0 ? (
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
                      <p className="text-xs text-gray-400 truncate">
                        {task.projectId.title}
                      </p>
                    )}
                  </div>
                </div>
                <TaskStatusBadge status={task.status} t={t} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">{t.noTasks}</p>
        )}
      </div>
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
}) {
  if (!show) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <PrivatePlaceholder msg={privateMsg} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
      <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {projects?.length > 0 ? (
        <div className="space-y-2">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 min-w-0">
                {proj.status === "finished" ? (
                  <FolderCheck className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <FolderOpen className="w-4 h-4 text-blue-500 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="font-medium text-sm text-gray-800 dark:text-white truncate">
                    {proj.title}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      proj.status === "finished"
                        ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                        : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    {proj.status === "finished" ? statusFinished : statusOpen}
                  </span>
                </div>
              </div>
              <Link href={`/dashboard/projects/${proj._id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 shrink-0"
                >
                  {viewProject}
                </Button>
              </Link>
            </div>
          ))}
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

const UserProfilePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { language, isRTL, userId: currentUserId } = useAppContext();
  const dateLocale = language === "ar" ? ar : enUS;
  const t = translations[language].dashboard.publicProfile;
  const ts = translations[language].dashboard.userProfile;
  const [activeTab, setActiveTab] = useState("profile");

  const { data: user, isLoading, isError } = useGetUserById(id, currentUserId);
  const isOwner =
    currentUserId && user && currentUserId.toString() === user._id?.toString();
  const name = user ? displayName(user) : "";
  const userInitials = name ? initials(name) : "?";
  const isAdmin = user?.role === "admin";

  console.log(user);

  const joinDate = user?.createdAt
    ? format(new Date(user.createdAt), "MMMM yyyy", { locale: dateLocale })
    : null;

  if (isLoading) return <Loading />;

  if (isError || !user) {
    return (
      <div className="min-h-screen bgMain flex flex-col items-center justify-center gap-6 p-6">
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
    <div className="min-h-screen bgMain p-4 md:p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Back */}
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

        {/* Hero Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Cover */}
          <div className="h-28 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

          <div className="px-5 pb-5">
            {/* Avatar row */}
            <div className="-mt-12 mb-3 flex items-end justify-between flex-wrap gap-2">
              {/* Avatar */}
              <div className="relative w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden shrink-0 bg-gradient-to-br from-blue-400 to-indigo-600">
                {user.imageUrl ? (
                  <Image
                    src={user?.imageUrl}
                    alt={name}
                    fill
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
                  <span className="flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 italic">
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

        {/* Tabs — owner sees Settings tab */}
        {isOwner && (
          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 gap-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <Eye className="w-4 h-4" />
              {ts.tabProfile}
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === "settings"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <Settings className="w-4 h-4" />
              {ts.tabSettings}
            </button>
          </div>
        )}

        {/* Content */}
        {activeTab === "settings" && isOwner ? (
          <SettingsTab
            user={user}
            userId={currentUserId}
            t={ts}
            isRTL={isRTL}
          />
        ) : (
          <ProfileTab user={user} t={t} isRTL={isRTL} />
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
