"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useUpdateSection, useDeleteSection } from "@/hooks/sections/useGetSections";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

export default function EditSectionMembersDialog({
  isOpen,
  onOpenChange,
  section,
  project,
  isRTL,
}) {
  const { mutate: updateSection, isPending } = useUpdateSection();
  const { mutate: deleteSection, isPending: isDeleting } = useDeleteSection();
  const [assignedMembers, setAssignedMembers] = useState([]);

  useEffect(() => {
    if (section && isOpen) {
      setAssignedMembers(
        section.members?.map((m) => (typeof m === "object" ? m._id : m)) || [],
      );
    }
  }, [section, isOpen]);

  if (!section || !project) return null;

  const allUsers = [...(project.coLeaders || []), ...(project.members || [])];
  const teamMembers = Array.from(
    new Map(allUsers.map((user) => [user._id, user])).values(),
  );

  const handleAssign = (userId) => {
    if (!assignedMembers.includes(userId)) {
      setAssignedMembers((prev) => [...prev, userId]);
    }
  };

  const handleRemove = (userId) => {
    setAssignedMembers((prev) => prev.filter((id) => id !== userId));
  };

  const handleSave = () => {
    updateSection(
      { sectionId: section._id, data: { members: assignedMembers } },
      {
        onSuccess: () => {
          toast.success(
            isRTL
              ? "تم تحديث أعضاء القسم بنجاح"
              : "Section members updated successfully",
          );
          onOpenChange(false);
        },
        onError: () => {
          toast.error(
            isRTL ? "فشل في تحديث الأعضاء" : "Failed to update members",
          );
        },
      },
    );
  };

  const handleDelete = () => {
    if (confirm(isRTL ? "هل أنت متأكد من حذف هذا القسم؟ سيتم إزالته من جميع المهام ولن يتم حذف المهام." : "Are you sure you want to delete this section? It will be unlinked from all tasks.")) {
      deleteSection(section._id, {
        onSuccess: () => {
          toast.success(isRTL ? "تم حذف القسم بنجاح" : "Section deleted successfully");
          onOpenChange(false);
        },
        onError: () => {
          toast.error(isRTL ? "فشل حذف القسم" : "Failed to delete section");
        }
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        dir={isRTL ? "rtl" : "ltr"}
        className="sm:max-w-xl dark:bg-gray-900 dark:text-white outline-none overflow-hidden max-h-[85vh] flex flex-col p-0 gap-0"
      >
        <div className="p-6 pb-2">
          <DialogHeader className={isRTL ? "text-right" : "text-left"}>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">
                {isRTL
                  ? `إعدادات القسم: ${section.title}`
                  : `Section Settings: ${section.title}`}
              </DialogTitle>
              {!section.isDefault && (
                <Button 
                   variant="destructive" 
                   size="sm" 
                   onClick={handleDelete}
                   disabled={isDeleting || isPending}
                   className="rounded-xl flex items-center gap-1.5 font-bold h-9 bg-rose-600 hover:bg-rose-700 text-white"
                >
                  <Trash className="w-3.5 h-3.5" />
                  {isRTL ? "حذف القسم" : "Delete"}
                </Button>
              )}
            </div>
            <DialogDescription className="text-sm pt-1.5 font-medium text-gray-500">
              {isRTL
                ? "حدد الأعضاء المؤهلين لتولي المهام داخل هذا القسم. سيتم تضييق خيارات إسناد المهام في هذا القسم لهؤلاء الأعضاء فقط."
                : "Select eligible members for tasks within this section. Task assignment options in this section will be restricted to these members."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              {isRTL ? "البحث وإضافة أعضاء" : "Search & Add Members"}
            </label>
            <Command
              className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm dark:bg-gray-900"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <CommandInput
                placeholder={
                  isRTL
                    ? "ابحث بالاسم او الايميل..."
                    : "Search by name or email..."
                }
                className={`h-12 border-none ring-0 focus:ring-0 ${isRTL ? "pr-10" : "pl-10"}`}
              />
              <CommandList className="max-h-48 overflow-auto">
                {teamMembers.map((user) => {
                  const isAssigned = assignedMembers.includes(user._id);
                  const displayName =
                    user.name && user.name !== "null null"
                      ? user.name
                      : user.email?.split("@")[0];

                  return (
                    <CommandItem
                      key={user._id}
                      value={displayName}
                      onSelect={() => handleAssign(user._id)}
                      className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center justify-between gap-3 min-w-0"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
                          {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-semibold text-gray-800 dark:text-white truncate">
                          {displayName}
                        </p>
                      </div>
                      {isAssigned && (
                        <span className="shrink-0 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-wider flex items-center">
                          ✓ {isRTL ? "مضاف" : "ADDED"}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandList>
            </Command>
          </div>

          {assignedMembers.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="text-sm text-gray-600 dark:text-gray-300 font-bold">
                {isRTL ? "الأعضاء المحددين" : "Selected Members"}
              </label>
              <div className="flex flex-wrap gap-2">
                {assignedMembers.map((uid) => {
                  const user = teamMembers.find((u) => u._id === uid);
                  if (!user) return null;
                  const displayName =
                    user.name && user.name !== "null null"
                      ? user.name
                      : user.email?.split("@")[0];

                  return (
                    <Badge
                      key={uid}
                      onClick={() => handleRemove(uid)}
                      variant="secondary"
                      className="cursor-pointer px-3 py-1.5 rounded-xl hover:bg-red-50 hover:text-red-600 border border-gray-200 shadow-sm"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold mr-1.5 ml-1.5">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold mr-1 ml-1">{displayName}</span>
                      <span className="text-gray-400 font-bold ml-1">×</span>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-2 border-t border-gray-100 dark:border-gray-800">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-bold h-11 w-full md:w-auto"
          >
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            disabled={isPending}
            onClick={handleSave}
            className="rounded-xl font-bold h-11 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending
              ? isRTL
                ? "جاري الحفظ..."
                : "Saving..."
              : isRTL
                ? "حفظ الأعضاء"
                : "Save Members"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
