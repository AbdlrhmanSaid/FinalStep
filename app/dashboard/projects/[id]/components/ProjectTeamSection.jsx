"use client";

import { useState } from "react";
import { Users, ChevronDown, Edit, Crown, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProjectTeamSection({
  data,
  content,
  isRTL,
  isLeader,
  updateMemberTitle,
}) {
  const [teamOpen, setTeamOpen] = useState(false);

  // ── Dialog state ─────────────────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [titleValue, setTitleValue] = useState("");

  const openTitleDialog = (e, userId, currentTitle) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingUserId(userId);
    setTitleValue(currentTitle || "");
    setDialogOpen(true);
  };

  const handleSaveTitle = () => {
    if (editingUserId && updateMemberTitle) {
      updateMemberTitle({
        projectId: data._id,
        userId: editingUserId,
        title: titleValue,
      });
    }
    setDialogOpen(false);
    setEditingUserId(null);
    setTitleValue("");
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingUserId(null);
    setTitleValue("");
  };

  // ── Members helpers ───────────────────────────────────────────────────────
  const coLeaderIds = new Set((data.coLeaders || []).map((u) => u._id));
  const uniqueMembers = (data.members || []).filter(
    (u) => !coLeaderIds.has(u._id),
  );
  const allMembers = [
    ...(data.coLeaders || []).map((u) => ({ ...u, _role: "coLeader" })),
    ...uniqueMembers.map((u) => ({ ...u, _role: "member" })),
  ];
  const totalCount = allMembers.length + 1;

  return (
    <>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          type="button"
          onClick={() => setTeamOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-gray-800 dark:text-white">
              {content.team}
            </span>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
              {totalCount}
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${teamOpen ? "rotate-180" : ""}`}
          />
        </button>

        <div
          className={`transition-all duration-300 ease-in-out overflow-auto ${
            teamOpen ? "max-h-[600px] gap-2 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 space-y-2 bg-white dark:bg-gray-800">
            {isLeader && (
              <div className="flex justify-end mb-4">
                <Link href={`/dashboard/updateTeam/${data._id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4" />{" "}
                    {isRTL ? "إدارة الأعضاء والدعوات" : "Manage Team & Invites"}
                  </Button>
                </Link>
              </div>
            )}

            {/* Leader */}
            <Link
              href={`/dashboard/user/${data.leaderId?._id}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shrink-0 shadow-sm">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {data.leaderId?.name && data.leaderId.name !== "null null"
                    ? data.leaderId.name
                    : data.leaderId?.email?.split("@")[0].replace(/[0-9]/g, "") ||
                      "Unknown"}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                    {data.customRoles?.[data.leaderId?._id] || content.leaderName}
                  </p>
                  {isLeader && (
                    <button
                      onClick={(e) =>
                        openTitleDialog(
                          e,
                          data.leaderId?._id,
                          data.customRoles?.[data.leaderId?._id] ||
                            content.leaderName,
                        )
                      }
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      title={isRTL ? "تعديل اللقب" : "Edit title"}
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </Link>

            {allMembers.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-700" />
            )}

            {/* Co-leaders & Members */}
            {allMembers.map((member) => (
              <Link
                key={member._id}
                href={`/dashboard/user/${member._id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    member._role === "coLeader"
                      ? "bg-gradient-to-br from-purple-400 to-indigo-500"
                      : "bg-gradient-to-br from-blue-400 to-cyan-500"
                  }`}
                >
                  <span className="text-white text-sm font-bold">
                    {(member.name && member.name !== "null null"
                      ? member.name
                      : member.email?.split("@")[0].replace(/[0-9]/g, "") || "?"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {member.name && member.name !== "null null"
                      ? member.name
                      : member.email?.split("@")[0].replace(/[0-9]/g, "")}
                  </p>
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-xs font-medium ${
                        member._role === "coLeader"
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {data.customRoles?.[member._id] ||
                        (member._role === "coLeader"
                          ? content.coLeaders
                          : isRTL
                            ? "عضو"
                            : "Member")}
                    </p>
                    {isLeader && (
                      <button
                        onClick={(e) =>
                          openTitleDialog(
                            e,
                            member._id,
                            data.customRoles?.[member._id] || "",
                          )
                        }
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        title={isRTL ? "تعديل اللقب" : "Edit title"}
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}

            {allMembers.length === 0 && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                {content.noMembers}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Title Edit Dialog ───────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent
          dir={isRTL ? "rtl" : "ltr"}
          className="sm:max-w-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-white">
              {isRTL ? "تعديل اللقب" : "Edit Title"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <Label
              htmlFor="member-title"
              className="text-sm text-gray-600 dark:text-gray-300 mb-2 block"
            >
              {isRTL ? "اللقب الوظيفي" : "Job Title"}
            </Label>
            <Input
              id="member-title"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
              placeholder={isRTL ? "مثال: مطور واجهات" : "e.g. Frontend Developer"}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
            />
          </div>

          <DialogFooter className={`gap-2 ${isRTL ? "flex-row-reverse sm:flex-row-reverse" : ""}`}>
            <Button
              variant="outline"
              onClick={handleDialogClose}
              className="dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleSaveTitle}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isRTL ? "حفظ" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
