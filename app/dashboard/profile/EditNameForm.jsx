"use client";

import { useState } from "react";
import { useUpdateCurrentUser } from "../../../hooks/users/useUpdateCurrentUser";
import { Button } from "../../../components/ui/button";
import { useAppContext } from "../../../contexts/AppContext";
import { Mail, User, Edit, Save, X, Check } from "lucide-react";
import { translations } from "../../../lib/translations";
import toast from "react-hot-toast";

const UserForm = ({ name, userId, email }) => {
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(name);
  const { language } = useAppContext();
  const content = translations[language].dashboard.userProfile;

  const { mutate: updateUser, isPending } = useUpdateCurrentUser(userId);

  const handleSave = () => {
    updateUser(
      { name: newName },
      {
        onSuccess: () => {
          toast.success(content.updateSuccess);
          setEditMode(false);
        },
        onError: () => {
          toast.error(content.updateError || "حدث خطأ أثناء التحديث");
        },
      }
    );
  };

  return (
    <div className="mx-auto p-6 bgMain min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <User className="w-6 h-6" />
          {content.pageTitle}
        </h1>

        <div className="p-6 rounded-lg shadow-md space-y-6 bg-white dark:bg-gray-800">
          {/* Email Section */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
              <Mail className="w-4 h-4" />
              {content.emailLabel}
            </div>
            <p className="text-gray-900 dark:text-white pl-6">{email}</p>
          </div>

          {/* Name Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
              <User className="w-4 h-4" />
              {content.nameLabel}
            </div>

            {editMode ? (
              <div className="space-y-3 pl-6">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 rounded border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>{content.savingText}</>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        {content.saveButton}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewName(name);
                      setEditMode(false);
                    }}
                    className="flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    {content.cancelButton}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center pl-6">
                <p className="text-gray-900 dark:text-white">{name}</p>
                <Button
                  variant="outline"
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  {content.editButton}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
