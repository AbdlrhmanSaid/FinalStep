import { useState } from "react";
import {
  Settings,
  ChevronDown,
  Edit,
  ClipboardPlus,
  Users,
  CheckCircle,
  Trash,
  Copy,
  UserMinus,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";

export default function ProjectActions({
  data,
  content,
  isRTL,
  isLeader,
  isMember,
  isFinished,
  modal,
  toggleStatus,
  handleDelete,
  handleLeave,
  handleEdit,
  handleReport,
  router,
}) {
  const [actionsOpen, setActionsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm mt-6">
      <button
        type="button"
        onClick={() => setActionsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-gray-500" />
          <span className="text-lg font-bold text-gray-800 dark:text-white truncate">
            {isRTL ? "إجراءات المشروع" : "Project Actions"}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${actionsOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          actionsOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 md:p-6 flex flex-col gap-6 border-t border-gray-100 dark:border-gray-700">
          {isLeader && !isFinished && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Edit Project */}
              <button
                onClick={handleEdit}
                className="flex flex-col items-center justify-center p-4 gap-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 transition-all text-center group"
              >
                <div className="p-3 bg-blue-100 dark:bg-blue-900/60 rounded-full group-hover:scale-110 transition-transform">
                  <Edit className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm">{content.edit}</span>
              </button>

              {/* Project Report */}
              <button
                onClick={handleReport}
                className="flex flex-col items-center justify-center p-4 gap-3 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 transition-all text-center group"
              >
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/60 rounded-full group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm">{content.report}</span>
              </button>

              {/* Team Report */}
              <button
                onClick={() =>
                  router.push(`/dashboard/team-report/${data._id}`)
                }
                className="flex flex-col items-center justify-center p-4 gap-3 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-400 transition-all text-center group"
              >
                <div className="p-3 bg-purple-100 dark:bg-purple-900/60 rounded-full group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm">
                  {content.teamReport ||
                    (isRTL ? "تقرير الفريق" : "Team Report")}
                </span>
              </button>

              {/* Invite Link */}
              {!data.public && (
                <button
                  onClick={() => {
                    const inviteLink = `${window.location.origin}/dashboard/projects/${data._id}?invite=true`;
                    navigator.clipboard.writeText(inviteLink);
                    toast.success(
                      content.inviteLinkCopied ||
                        (isRTL ? "تم نسخ رابط الدعوة!" : "Invite link copied!"),
                    );
                  }}
                  className="flex flex-col items-center justify-center p-4 gap-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 transition-all text-center group"
                >
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/60 rounded-full group-hover:scale-110 transition-transform">
                    <Copy className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-sm">
                    {content.copyInviteLink ||
                      (isRTL ? "نسخ الدعوة" : "Copy Invite")}
                  </span>
                </button>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-2 w-full">
            {isLeader && (
              <Button
                className={`w-full sm:w-auto flex flex-1 items-center justify-center gap-2 h-12 text-[15px] font-bold shadow-sm transition-all ${
                  isFinished
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
                onClick={toggleStatus}
              >
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span className="truncate">
                  {isFinished ? content.reopenProject : content.finishProject}
                </span>
              </Button>
            )}

            {isLeader && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto flex-1 h-12 text-[15px] font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Trash className="w-5 h-5 shrink-0" />
                    <span className="truncate">{content.delete}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-800 dark:text-white">
                      {modal.confirmTitle}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                      {modal.alertTitle}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{modal.cancel}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {modal.confirm}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {isMember && !isFinished && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto flex-1 h-12 text-[15px] font-bold border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <UserMinus className="w-5 h-5 shrink-0" />
                    <span className="truncate">{content.leave}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-800 dark:text-white">
                      {content.leaveConfirmTitle}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                      {content.leaveConfirmDesc}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{modal.cancel}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLeave}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {content.leaveConfirm}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
