import {
  Settings,
  Edit,
  CheckCircle2,
  Trash,
  Copy,
  UserMinus,
  FileText,
  PieChart,
  ShieldAlert,
  Layers,
  ClipboardList,
  BellRing,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import ConfirmDeleteDialog from "@/components/dashboard/ConfirmDeleteDialog";
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
  userId,
}) {
  const [isNotifying, setIsNotifying] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const handleNotify = async () => {
    // Find the sender name
    const uidStr = userId?.toString();
    const lIdObj = data.leaderId;
    let computedUserName = "The Project Leader";
    if (lIdObj && (lIdObj._id?.toString() === uidStr || lIdObj.toString() === uidStr)) {
        computedUserName = lIdObj.name || computedUserName;
    } else {
        const coLeader = data.coLeaders?.find(c => (c._id || c).toString() === uidStr);
        if (coLeader && coLeader.name) computedUserName = coLeader.name;
    }

    setIsNotifying(true);
    try {
      const res = await fetch(`/api/projects/${data._id}/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userName: computedUserName }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      toast.success(isRTL ? "تم إرسال التنبيهات بنجاح!" : "Alerts sent successfully!");
      setIsAlertModalOpen(false);
    } catch (e) {
      toast.error(isRTL ? "فشل إرسال التنبيهات: " + e.message : "Failed to send alerts: " + e.message);
    } finally {
      setIsNotifying(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
      {/* Leader: full management panel */}
      {isLeader && (
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <Settings className="w-5 h-5 text-gray-500" />
          </div>
          <h3 className="font-black text-gray-900 dark:text-white text-lg">
            {isRTL ? "الإعدادات والإجراءات" : "Management"}
          </h3>
        </div>
      )}

      <div className="space-y-6">
        {/* Quick Tools Grid */}
        {isLeader && !isFinished && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleEdit}
              className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-700 hover:border-blue-500/30 transition-all group"
            >
              <Edit className="w-5 h-5 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300 tracking-tight">
                {content.edit}
              </span>
            </button>

            {data.hasSections !== false && (
              <Link href={`/dashboard/projects/${data._id}/sections`}>
                <button className="w-full flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-700 hover:border-violet-500/30 transition-all group">
                  <Layers className="w-5 h-5 text-violet-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300 tracking-tight">
                    {isRTL ? "الأقسام" : "Sections"}
                  </span>
                </button>
              </Link>
            )}

            <Link href={`/dashboard/projects/${data._id}/todos`}>
              <button className="w-full flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-700 hover:border-teal-500/30 transition-all group">
                <ClipboardList className="w-5 h-5 text-teal-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300 tracking-tight">
                  {isRTL ? "خطة العمل" : "Roadmap"}
                </span>
              </button>
            </Link>

            <button
              onClick={handleReport}
              className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-700 hover:border-indigo-500/30 transition-all group"
            >
              <FileText className="w-5 h-5 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300 tracking-tight">
                {content.report}
              </span>
            </button>

            <button
              onClick={() => router.push(`/dashboard/team-report/${data._id}`)}
              className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-700 hover:border-purple-500/30 transition-all group"
            >
              <PieChart className="w-5 h-5 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300 tracking-tight">
                {isRTL ? "تقرير الفريق" : "Team KPI"}
              </span>
            </button>

            <button
              onClick={() => {
                const inviteLink = `${window.location.origin}/dashboard/projects/${data._id}?invite=true`;
                navigator.clipboard.writeText(inviteLink);
                toast.success(
                  isRTL ? "تم نسخ رابط الدعوة!" : "Invite link copied!",
                );
              }}
              className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-700 hover:border-emerald-500/30 transition-all group"
            >
              <Copy className="w-5 h-5 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300 tracking-tight text-center">
                {isRTL ? "نسخ الرابط" : "Invite Link"}
              </span>
            </button>

            <ConfirmDeleteDialog
              open={isAlertModalOpen}
              onOpenChange={setIsAlertModalOpen}
              loading={isNotifying}
              trigger={
                <button
                  disabled={isNotifying}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-500/30 transition-all group disabled:opacity-50 h-full w-full"
                >
                  {isNotifying ? (
                     <div className="w-5 h-5 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mb-2" />
                  ) : (
                     <BellRing className="w-5 h-5 text-rose-500 mb-2 group-hover:scale-110 transition-transform origin-top group-hover:rotate-12" />
                  )}
                  <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300 tracking-tight text-center mt-auto">
                    {isRTL ? "زر التنبيه" : "Alert Members"}
                  </span>
                </button>
              }
              title={isRTL ? "تأكيد إرسال التنبيه" : "Confirm Sending Alert"}
              description={isRTL ? "هل أنت متأكد من إرسال تنبيه عبر الإيميل لجميع أعضاء المشروع للتأكيد على مراجعة المهام؟" : "Are you sure you want to send an email alert to all project members to review their tasks?"}
              onConfirm={handleNotify}
              cancelText={modal.cancel}
              confirmText={isRTL ? "نعم، أرسل" : "Yes, Send"}
            />
          </div>
        )}

        {/* Primary Row Actions */}
        <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-gray-800">
          {isLeader && (
            <button
              onClick={toggleStatus}
              className={`w-full flex items-center justify-center gap-3 p-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                isFinished
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/20"
                  : "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isFinished ? content.reopenProject : content.finishProject}
            </button>
          )}

          {isLeader && (
            <ConfirmDeleteDialog
              trigger={
                <button className="w-full flex items-center justify-center gap-3 p-3.5 rounded-2xl font-black text-xs uppercase tracking-widest text-rose-600 bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all">
                  <Trash className="w-4 h-4" />
                  {content.delete}
                </button>
              }
              title={modal.confirmTitle}
              description={modal.alertTitle}
              onConfirm={handleDelete}
              cancelText={modal.cancel}
              confirmText={modal.confirm}
            />
          )}

          {/* Member-only: leave button — subtle and simple */}
          {isMember && !isFinished && (
            <ConfirmDeleteDialog
              variant="warning"
              trigger={
                <button className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl text-xs font-bold text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all">
                  <UserMinus className="w-4 h-4" />
                  {content.leave}
                </button>
              }
              title={content.leaveConfirmTitle}
              description={content.leaveConfirmDesc}
              onConfirm={handleLeave}
              cancelText={modal.cancel}
              confirmText={content.leaveConfirm}
            />
          )}
        </div>
      </div>
    </div>
  );
}
