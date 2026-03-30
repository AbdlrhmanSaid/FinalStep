"use client";

import { useState } from "react";
import { Users, Edit, Crown, Settings, Mail, ShieldAlert } from "lucide-react";
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

  const coLeaderIds = new Set((data.coLeaders || []).map((u) => u._id));
  const uniqueMembers = (data.members || []).filter((u) => !coLeaderIds.has(u._id));
  
  const allMembers = [
    ...(data.coLeaders || []).map((u) => ({ ...u, _role: "coLeader" })),
    ...uniqueMembers.map((u) => ({ ...u, _role: "member" })),
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-black text-gray-900 dark:text-white text-lg">
            {content.team}
          </h3>
        </div>
        
        {isLeader && (
          <Link href={`/dashboard/updateTeam/${data._id}`}>
            <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all">
              <Settings className="w-4 h-4" />
            </button>
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {/* Leader Row */}
        <div className="group relative flex items-center gap-3 p-2.5 rounded-2xl border border-amber-100/50 bg-amber-50/20 dark:border-amber-900/20 dark:bg-amber-900/10">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white dark:border-gray-800 flex items-center justify-center overflow-hidden">
               {data.leaderId?.image ? <img src={data.leaderId.image} className="w-full h-full object-cover" alt=""/> : <span className="text-white font-black text-xs">{data.leaderId?.name?.charAt(0)}</span>}
            </div>
            <Crown className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-500 bg-white dark:bg-gray-800 rounded-full p-0.5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <Link href={`/dashboard/user/${data.leaderId?._id}`} className="block text-xs font-black text-gray-900 dark:text-white truncate hover:text-blue-600 transition-colors">
              {data.leaderId?.name || "Unknown"}
            </Link>
            <div className="flex items-center gap-1.5">
               <span className="text-[9px] font-bold text-amber-600 uppercase tracking-tighter">
                 {data.customRoles?.[data.leaderId?._id] || content.leaderName}
               </span>
               {isLeader && (
                 <button onClick={(e) => openTitleDialog(e, data.leaderId?._id, data.customRoles?.[data.leaderId?._id] || content.leaderName)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-all">
                   <Edit className="w-3 h-3" />
                 </button>
               )}
            </div>
          </div>
        </div>

        {/* Other Members */}
        {allMembers.map((member) => (
          <div key={member._id} className="group relative flex items-center gap-3 p-2.5 rounded-2xl border border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 border-2 border-white dark:border-gray-800 flex items-center justify-center overflow-hidden">
               {member.image ? <img src={member.image} className="w-full h-full object-cover" alt=""/> : <span className="text-gray-400 font-bold text-xs">{member.name?.charAt(0)}</span>}
            </div>

            <div className="flex-1 min-w-0">
              <Link href={`/dashboard/user/${member._id}`} className="block text-xs font-black text-gray-900 dark:text-white truncate hover:text-blue-600 transition-colors">
                {member.name || "Member"}
              </Link>
              <div className="flex items-center gap-1.5">
                 <span className={`text-[9px] font-bold uppercase tracking-tighter ${member._role === 'coLeader' ? 'text-purple-500' : 'text-blue-500'}`}>
                   {data.customRoles?.[member._id] || (member._role === 'coLeader' ? content.coLeaders : (isRTL ? "عضو" : "Member"))}
                 </span>
                 {isLeader && (
                   <button onClick={(e) => openTitleDialog(e, member._id, data.customRoles?.[member._id] || "")} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-all">
                     <Edit className="w-3 h-3" />
                   </button>
                 )}
              </div>
            </div>
          </div>
        ))}

        {allMembers.length === 0 && (
          <div className="py-4 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{content.noMembers}</p>
          </div>
        )}
      </div>

      {/* Title Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(false)}>
        <DialogContent dir={isRTL ? "rtl" : "ltr"} className="bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 rounded-3xl sm:max-w-xs">
          <DialogHeader>
            <DialogTitle className="font-black">{isRTL ? "تعديل الللقب" : "Assign Title"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase text-gray-400">{isRTL ? "اللقب المخصص" : "Custom Title"}</Label>
               <Input 
                 value={titleValue} 
                 onChange={(e) => setTitleValue(e.target.value)} 
                 className="rounded-xl border-gray-100 dark:border-gray-800 font-bold" 
                 placeholder={isRTL ? "مثال: مخرج فني" : "e.g. Art Director"}
               />
            </div>
            <DialogFooter className="flex-row gap-2">
               <Button variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl flex-1 font-bold">{isRTL ? "إلغاء" : "Cancel"}</Button>
               <Button onClick={handleSaveTitle} className="rounded-xl flex-1 font-black bg-blue-600 hover:bg-blue-700">{isRTL ? "حفظ" : "Save"}</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
