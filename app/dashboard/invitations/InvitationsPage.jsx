"use client";
import { useAppContext } from "../../../contexts/AppContext";
import { useGetUserInvites } from "../../../hooks/invitations/useGetUserInvites";
import Loading from "../../../components/Loading";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Mail,
  CheckCircle2,
  XCircle,
  Folder,
  RefreshCw,
  Briefcase,
} from "lucide-react";
import { translations } from "../../../lib/translations";
import toast from "react-hot-toast";
import { useMemo } from "react";

export default function InvitationsPage() {
  const { email, language, isRTL } = useAppContext();
  const content = translations[language].dashboard.invitations;

  const {
    data: invites,
    isLoading,
    refetch,
    isFetching,
  } = useGetUserInvites(email);

  const sortedInvites = useMemo(() => {
    if (!invites) return [];
    return [...invites].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }, [invites]);

  const handleRespond = async (inviteId, action) => {
    try {
      await axios.put(`/api/invite/respond`, { inviteId, action });

      if (action === "accepted") {
        toast.success(content.acceptSuccess || "تم قبول الدعوة بنجاح!");
      } else if (action === "rejected") {
        toast.success(content.rejectSuccess || "تم رفض الدعوة");
      }

      await refetch();
    } catch (err) {
      console.error("Failed to respond:", err);
      toast.error(content.respondError || "فشل في معالجة الدعوة");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl flex items-center justify-center shadow-sm">
              <Mail className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {content.UrTitle}
                {sortedInvites?.length > 0 && (
                  <span className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-sm font-bold px-2.5 py-0.5 rounded-full">
                    {sortedInvites.length}
                  </span>
                )}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {isRTL
                  ? "قم بمراجعة دعوات الانضمام للمشاريع الموجهة إليك"
                  : "Review project invitations addressed to you"}
              </p>
            </div>
          </div>
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            variant="outline"
            className="w-full sm:w-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm h-10 px-4"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 ${isFetching ? "animate-spin" : ""}`}
            />
            {isRTL ? "تحديث الداتا" : "Refresh Data"}
          </Button>
        </div>

        {sortedInvites?.length > 0 ? (
          <div className="grid gap-4 mt-6">
            {sortedInvites.map((invite) => (
              <div
                key={invite._id}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-5 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700/50 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/50">
                    <Briefcase className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      {content.invitedTo}
                    </p>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {invite.projectId?.title || "Unknown Project"}
                    </h2>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0 md:shrink-0 w-full md:w-auto">
                  <Button
                    onClick={() => handleRespond(invite._id, "accepted")}
                    className="flex-1 md:flex-none h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    {content.Accept}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleRespond(invite._id, "rejected")}
                    className="flex-1 md:flex-none h-11 px-6 bg-white dark:bg-gray-800 dark:text-red-300 border-gray-200 dark:border-gray-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 dark:hover:border-rose-800/50 font-bold rounded-xl transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    {content.Reject}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm p-16 text-center mt-6">
            <div className="mx-auto w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-700">
              <Mail className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {isRTL ? "لا توجد دعوات جديدة" : "No New Invitations"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-base max-w-sm mx-auto font-medium">
              {content.empty}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
