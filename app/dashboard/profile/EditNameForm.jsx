"use client";

import { useState } from "react";
import { useUpdateCurrentUser } from "@/hooks/users/useUpdateCurrentUser";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { Mail, User, Edit, Briefcase, X, Check } from "lucide-react";
import { translations } from "@/lib/translations";
import toast from "react-hot-toast";

const UserForm = ({ name, userId, email, title: initialTitle }) => {
  const [editNameMode, setEditNameMode] = useState(false);
  const [editTitleMode, setEditTitleMode] = useState(false);
  const [newName, setNewName] = useState(name);
  const [newTitle, setNewTitle] = useState(initialTitle || "");
  const { language, isRTL } = useAppContext();
  const content = translations[language].dashboard.userProfile;

  const { mutate: updateUser, isPending } = useUpdateCurrentUser(userId);

  const handleSaveName = () => {
    updateUser(
      { name: newName },
      {
        onSuccess: () => {
          toast.success(content.updateSuccess);
          setEditNameMode(false);
        },
        onError: () => {
          toast.error(content.updateError);
        },
      },
    );
  };

  const handleSaveTitle = () => {
    updateUser(
      { title: newTitle.trim() },
      {
        onSuccess: () => {
          toast.success(content.updateSuccess);
          setEditTitleMode(false);
        },
        onError: () => {
          toast.error(content.updateError);
        },
      },
    );
  };

  return (
    <div
      className="mx-auto p-6 bgMain min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="w-6 h-6" />
          {content.pageTitle}
        </h1>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-700">
          {/* Email – read-only */}
          <div className="flex items-center gap-4 p-5">
            <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                {content.emailLabel}
              </p>
              <p className="text-gray-900 dark:text-white truncate">{email}</p>
            </div>
          </div>

          {/* Name – editable */}
          <div className="flex items-start gap-4 p-5">
            <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
              <User className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {content.nameLabel}
              </p>
              {editNameMode ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveName}
                      disabled={isPending}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                    >
                      {isPending ? (
                        content.savingText
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          {content.saveButton}
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewName(name);
                        setEditNameMode(false);
                      }}
                      className="flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      {content.cancelButton}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-gray-900 dark:text-white">{name}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditNameMode(true)}
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-600 shrink-0"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    {content.editButton}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Title – editable */}
          <div className="flex items-start gap-4 p-5">
            <div className="w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0 mt-0.5">
              <Briefcase className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {content.titleLabel}
              </p>
              {editTitleMode ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    maxLength={60}
                    placeholder={content.titlePlaceholder}
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                    autoFocus
                  />
                  <p className="text-xs text-gray-400">{content.titleHint}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveTitle}
                      disabled={isPending}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
                    >
                      {isPending ? (
                        content.savingText
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          {content.saveButton}
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewTitle(initialTitle || "");
                        setEditTitleMode(false);
                      }}
                      className="flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      {content.cancelButton}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <p
                    className={
                      newTitle
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-400 italic"
                    }
                  >
                    {newTitle || content.titlePlaceholder}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditTitleMode(true)}
                    className="flex items-center gap-1 text-gray-500 hover:text-purple-600 shrink-0"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    {content.editButton}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
