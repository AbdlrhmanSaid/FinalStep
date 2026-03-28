"use client";

import { useState } from "react";
import { useUpdateCurrentUser } from "@/hooks/users/useUpdateCurrentUser";
import { useAppContext } from "@/contexts/AppContext";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Linkedin,
  Github,
  Facebook,
  Link2,
  Trash2,
  Plus,
  Save,
  Lock
} from "lucide-react";

function PrivacyToggle({ label, checked, onChange, isPending, isRTL }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer group">
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

function LinksSettingsSection({ user, t, isPending, onSave }) {
  const [linkedin, setLinkedin] = useState(user.links?.linkedin || "");
  const [github, setGithub] = useState(user.links?.github || "");
  const [facebook, setFacebook] = useState(user.links?.facebook || "");
  const [custom, setCustom] = useState(
    user.links?.custom?.length
      ? user.links.custom.map((c) => ({
          label: c.label || "",
          url: c.url || "",
        }))
      : []
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
          {t.linksTitle || "Social Links"}
        </p>
        <p className="text-xs text-gray-400">{t.linksHint || "Add your social links"}</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
          <Linkedin className="w-4 h-4 text-blue-700" />
          {t.linkedinLabel || "LinkedIn"}
        </label>
        <input
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder={t.linkedinPlaceholder || "https://linkedin.com/..."}
          className={inputCls}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
          <Github className="w-4 h-4 text-gray-800 dark:text-white" />
          {t.githubLabel || "GitHub"}
        </label>
        <input
          type="url"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          placeholder={t.githubPlaceholder || "https://github.com/..."}
          className={inputCls}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
          <Facebook className="w-4 h-4 text-blue-600" />
          {t.facebookLabel || "Facebook"}
        </label>
        <input
          type="url"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
          placeholder={t.facebookPlaceholder || "https://facebook.com/..."}
          className={inputCls}
        />
      </div>

      {custom.map((c, i) => (
        <div
          key={i}
          className="space-y-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-indigo-500" />
              {t.customLabel || "Custom Link"} {i + 1}
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
            placeholder={t.customLabelPlaceholder || "Label (e.g. Portfolio)"}
            maxLength={40}
            className={inputCls}
          />
          <input
            type="url"
            value={c.url}
            onChange={(e) => updateCustom(i, "url", e.target.value)}
            placeholder={t.customUrlPlaceholder || "https://..."}
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
          {t.addCustomLink || "Add Custom Link"}
        </button>
      )}

      <Button
        disabled={isPending}
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        {isPending ? (t.savingText || "Saving...") : (t.saveLinks || "Save Links")}
      </Button>
    </div>
  );
}

function PasswordSettingsSection({ user, t }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const isGoogleUser = !!user.googleId;
  const hasPassword = !!user.password; // Actually, `user.password` might be undefined in parsed JSON if we stripped it, but `getFullUserOrRedirect` gives us the lean obj which has it unless `lean` stripped it out. Wait, mongoose 'select' might hide it. We'll simply let them SET a password anyway if they want. If they already have one, they can UPDATE it.

  const handleSavePassword = async () => {
    if (password !== confirmPassword) {
      toast.error(t.passwordMismatch || "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error(t.passwordLengthError || "Password must be at least 6 characters");
      return;
    }

    setIsPending(true);
    try {
      const res = await fetch(`/api/users/${user._id}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) throw new Error("Failed");
      
      toast.success(t.passwordUpdateSuccess || "Password Updated Successfully");
      setPassword("");
      setConfirmPassword("");
    } catch {
      toast.error(t.passwordUpdateError || "Failed to update password");
    } finally {
      setIsPending(false);
    }
  };

  const inputCls =
    "w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-gray-500" />
          {t.passwordSettings || "Password Settings"}
        </h2>
        {isGoogleUser && !hasPassword ? (
          <p className="text-sm text-gray-500 mt-1">
            {t.googlePasswordHint || "You signed in with Google. Set a password if you want to also log in using your email and a password."}
          </p>
        ) : (
          <p className="text-sm text-gray-500 mt-1">
            {t.changePasswordHint || "Update your account login password."}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            {t.newPassword || "New Password"}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            {t.confirmPassword || "Confirm New Password"}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputCls}
            placeholder="••••••••"
          />
        </div>
      </div>

      <Button
        disabled={isPending || !password}
        onClick={handleSavePassword}
        className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 w-full"
      >
        {isPending ? (t.savingText || "Saving...") : (t.updatePassword || "Update Password")}
      </Button>
    </div>
  );
}

export default function SettingsPageClient({ serializedUser }) {
  const context = useAppContext();
  const language = context?.language || "en";
  const t = translations[language] || {};
  const isRTL = context?.isRTL;

  const user = JSON.parse(serializedUser);
  const userId = user._id;

  const [editNameMode, setEditNameMode] = useState(false);
  const [editTitleMode, setEditTitleMode] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [newTitle, setNewTitle] = useState(user.title || "");

  const { mutate: updateUser, isPending } = useUpdateCurrentUser(userId);

  const save = (data, onDone) => {
    updateUser(data, {
      onSuccess: () => {
        toast.success(t.updateSuccess || "Updated Successfully");
        onDone?.();
      },
      onError: () => toast.error(t.updateError || "Error updating"),
    });
  };

  const togglePrivacy = (field) => {
    const current = user.privacy?.[field] ?? true;
    save({ privacy: { ...user.privacy, [field]: !current } }, null);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t.dashboardNav?.settings || "Account Settings"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {t.settingsSubtitle || "Manage your account preferences and personal information."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          {/* Name Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {t.nameLabel || "Name"}
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
                    onClick={() => save({ name: newName }, () => setEditNameMode(false))}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isPending ? (t.savingText || "Saving...") : (t.saveButton || "Save")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setNewName(user.name);
                      setEditNameMode(false);
                    }}
                  >
                    {t.cancelButton || "Cancel"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white font-medium">{user.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditNameMode(true)}
                  className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  {t.editButton || "Edit"}
                </Button>
              </div>
            )}
          </div>

          {/* Title Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {t.titleLabel || "Professional Title"}
            </p>
            {editTitleMode ? (
              <div className="space-y-2">
                <input
                  autoFocus
                  type="text"
                  maxLength={60}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={t.titlePlaceholder || "e.g. Software Engineer"}
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                />
                <p className="text-xs text-gray-400">{t.titleHint || "What is your main role?"}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={isPending}
                    onClick={() => save({ title: newTitle.trim() }, () => setEditTitleMode(false))}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isPending ? (t.savingText || "Saving...") : (t.saveButton || "Save")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setNewTitle(user.title || "");
                      setEditTitleMode(false);
                    }}
                  >
                    {t.cancelButton || "Cancel"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className={newTitle ? "text-gray-900 dark:text-white font-medium" : "text-gray-400 italic"}>
                  {newTitle || (t.titlePlaceholder || "No title set")}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditTitleMode(true)}
                  className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                >
                  {t.editButton || "Edit"}
                </Button>
              </div>
            )}
          </div>

          {/* Privacy */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {t.privacyTitle || "Privacy"}
            </p>
            <PrivacyToggle
              label={t.showProjects || "Show Projects on Profile"}
              checked={user.privacy?.showProjects ?? true}
              onChange={() => togglePrivacy("showProjects")}
              isPending={isPending}
              isRTL={isRTL}
            />
            <PrivacyToggle
              label={t.showTasks || "Show Tasks on Profile"}
              checked={user.privacy?.showTasks ?? true}
              onChange={() => togglePrivacy("showTasks")}
              isPending={isPending}
              isRTL={isRTL}
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Password Settings */}
          <PasswordSettingsSection user={user} t={t} />

          {/* Social Links */}
          <LinksSettingsSection
            user={user}
            t={t}
            isPending={isPending}
            onSave={(data) => save(data, null)}
          />
        </div>
      </div>
    </div>
  );
}
