import { useState } from "react";
import {
  Settings,
  Edit,
  ClipboardPlus,
  Users,
  CheckCircle2,
  Trash,
  Copy,
  UserMinus,
  FileText,
  PieChart,
  ShieldAlert,
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
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <Settings className="w-5 h-5 text-gray-500" />
        </div>
        <h3 className="font-black text-gray-900 dark:text-white text-lg">
          {isRTL ? "الإعدادات والإجراءات" : "Management"}
        </h3>
      </div>

      <div className="space-y-6">
        {/* Quick Tools Grid */}
        {isLeader && !isFinished && (
          <div className="grid grid-cols-2 gap-3">
             <button
               onClick={handleEdit}
               className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-700 hover:border-blue-500/30 transition-all group"
             >
               <Edit className="w-5 h-5 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
               <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300 tracking-tight">{content.edit}</span>
             </button>

             <button
               onClick={handleReport}
               className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-700 hover:border-indigo-500/30 transition-all group"
             >
               <FileText className="w-5 h-5 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
               <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300 tracking-tight">{content.report}</span>
             </button>

             <button
               onClick={() => router.push(`/dashboard/team-report/${data._id}`)}
               className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-700 hover:border-purple-500/30 transition-all group"
             >
               <PieChart className="w-5 h-5 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
               <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300 tracking-tight">{isRTL ? "تقرير الفريق" : "Team KPI"}</span>
             </button>

             {!data.public && (
               <button
                 onClick={() => {
                   const inviteLink = `${window.location.origin}/dashboard/projects/${data._id}?invite=true`;
                   navigator.clipboard.writeText(inviteLink);
                   toast.success(isRTL ? "تم نسخ رابط الدعوة!" : "Invite link copied!");
                 }}
                 className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-700 hover:border-emerald-500/30 transition-all group"
               >
                 <Copy className="w-5 h-5 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                 <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-300 tracking-tight">{isRTL ? "نسخ الرابط" : "Invite Link"}</span>
               </button>
             )}
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
             <AlertDialog>
               <AlertDialogTrigger asChild>
                 <button className="w-full flex items-center justify-center gap-3 p-3.5 rounded-2xl font-black text-xs uppercase tracking-widest text-rose-600 bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all">
                   <Trash className="w-4 h-4" />
                   {content.delete}
                 </button>
               </AlertDialogTrigger>
               <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 rounded-3xl">
                 <AlertDialogHeader>
                    <div className="mx-auto w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-2">
                       <ShieldAlert className="w-6 h-6 text-rose-600" />
                    </div>
                   <AlertDialogTitle className="font-black text-center">{modal.confirmTitle}</AlertDialogTitle>
                   <AlertDialogDescription className="text-gray-500 text-center">{modal.alertTitle}</AlertDialogDescription>
                 </AlertDialogHeader>
                 <AlertDialogFooter className="flex-row gap-2">
                   <AlertDialogCancel className="rounded-xl flex-1 font-bold">{modal.cancel}</AlertDialogCancel>
                   <AlertDialogAction onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700 rounded-xl flex-1 font-black">
                     {modal.confirm}
                   </AlertDialogAction>
                 </AlertDialogFooter>
               </AlertDialogContent>
             </AlertDialog>
           )}

           {isMember && !isFinished && (
             <AlertDialog>
               <AlertDialogTrigger asChild>
                 <button className="w-full flex items-center justify-center gap-3 p-3.5 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all">
                   <UserMinus className="w-4 h-4" />
                   {content.leave}
                 </button>
               </AlertDialogTrigger>
               <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 rounded-3xl">
                 <AlertDialogHeader>
                   <AlertDialogTitle className="font-black">{content.leaveConfirmTitle}</AlertDialogTitle>
                   <AlertDialogDescription className="text-gray-500">{content.leaveConfirmDesc}</AlertDialogDescription>
                 </AlertDialogHeader>
                 <AlertDialogFooter className="flex-row gap-2">
                   <AlertDialogCancel className="rounded-xl flex-1 font-bold">{modal.cancel}</AlertDialogCancel>
                   <AlertDialogAction onClick={handleLeave} className="bg-rose-600 hover:bg-rose-700 rounded-xl flex-1 font-black">
                     {content.leaveConfirm}
                   </AlertDialogAction>
                 </AlertDialogFooter>
               </AlertDialogContent>
             </AlertDialog>
           )}
        </div>
      </div>
    </div>
  );
}
