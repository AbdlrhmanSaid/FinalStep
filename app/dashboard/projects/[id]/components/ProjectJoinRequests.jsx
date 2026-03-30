import { useState } from "react";
import { Users, CheckCircle, Trash, User, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProjectJoinRequests({
  data,
  content,
  isLeader,
  pendingJoinRequests,
  isResponding,
  respondJoin,
  userId,
}) {
  if (!isLeader || pendingJoinRequests?.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-blue-100 dark:border-blue-900/50 p-6 shadow-xl shadow-blue-500/5 ring-4 ring-blue-50 dark:ring-blue-900/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/40 rounded-xl relative">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full" />
          </div>
          <h3 className="font-black text-gray-900 dark:text-white text-lg">
            {content.joinRequests}
          </h3>
        </div>
        <Badge className="bg-blue-600 text-white font-black rounded-full px-2">
          {pendingJoinRequests.length}
        </Badge>
      </div>

      <div className="space-y-4">
        {pendingJoinRequests.map((req) => (
          <div key={req._id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                 {req.userId?.image ? <img src={req.userId.image} className="w-full h-full object-cover" alt=""/> : <User className="w-5 h-5 text-gray-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-gray-900 dark:text-white truncate">
                  {req.userId?.name || "Request"}
                </p>
                <Link 
                  href={`/dashboard/user/${req.userId?._id}`} 
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-0.5"
                >
                  {content.viewProfile} <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={isResponding}
                onClick={() => respondJoin({ projectId: data._id, joinId: req._id, action: "accept", userId: userId.toString() })}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
              >
                <CheckCircle className="w-3 h-3" /> {content.acceptJoin}
              </button>
              <button
                disabled={isResponding}
                onClick={() => respondJoin({ projectId: data._id, joinId: req._id, action: "reject", userId: userId.toString() })}
                className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-gray-400 hover:text-rose-500 rounded-xl transition-all disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
