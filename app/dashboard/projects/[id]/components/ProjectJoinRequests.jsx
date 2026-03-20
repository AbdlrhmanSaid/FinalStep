import { useState } from "react";
import { Users, ChevronDown, CheckCircle, Trash, User } from "lucide-react";
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
  const [joinRequestsOpen, setJoinRequestsOpen] = useState(false);

  if (!isLeader || pendingJoinRequests?.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-blue-500">
      <button
        type="button"
        onClick={() => setJoinRequestsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-500" />
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            {content.joinRequests}
          </span>
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {pendingJoinRequests.length}
          </Badge>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${joinRequestsOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          joinRequestsOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 space-y-4 border-t border-gray-100 dark:border-gray-700">
          {pendingJoinRequests.map((req) => (
            <div
              key={req._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {req.userId?.name && req.userId.name !== "null null"
                      ? req.userId.name
                      : req.userId?.email
                          ?.split("@")[0]
                          .replace(/[0-9]/g, "") || "Unknown User"}
                  </p>
                  <Link
                    href={`/dashboard/user/${req.userId?._id}`}
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {content.viewProfile}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isResponding}
                  onClick={() =>
                    respondJoin({
                      projectId: data._id,
                      joinId: req._id,
                      action: "accept",
                      userId: userId.toString(),
                    })
                  }
                >
                  <CheckCircle className="w-4 h-4 mr-1" /> {content.acceptJoin}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isResponding}
                  onClick={() =>
                    respondJoin({
                      projectId: data._id,
                      joinId: req._id,
                      action: "reject",
                      userId: userId.toString(),
                    })
                  }
                >
                  <Trash className="w-4 h-4 mr-1" /> {content.rejectJoin}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
