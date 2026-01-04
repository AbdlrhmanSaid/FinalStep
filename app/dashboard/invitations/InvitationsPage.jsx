"use client";
import { useAppContext } from "../../../contexts/AppContext";
import { useGetUserInvites } from "../../../hooks/invitations/useGetUserInvites";
import Loading from "../../../components/Loading";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Mail, CheckCircle, XCircle, Folder, RefreshCw } from "lucide-react";
import { translations } from "../../../lib/translations";
import toast from "react-hot-toast";
import { useMemo } from "react";

export default function InvitationsPage() {
  const { email, language } = useAppContext();
  const content = translations[language].dashboard.invitations;

  const {
    data: invites,
    isLoading,
    refetch,
    isFetching,
  } = useGetUserInvites(email);

  // ترتيب الدعوات من الأحدث للأقدم
  const sortedInvites = useMemo(() => {
    if (!invites) return [];
    return [...invites].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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
    <div
      className={`min-h-screen bgMain flex flex-col items-center p-6 transition-colors ${
        !sortedInvites?.length ? "justify-center" : ""
      }`}
    >
      <div className="w-full max-w-2xl space-y-6">
        {sortedInvites?.length ? (
          <>
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <Mail className="w-8 h-8 text-blue-500" />
                <h2 className="text-2xl font-bold">{content.UrTitle}</h2>
              </div>
              <Button
                onClick={() => refetch()}
                disabled={isFetching}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
                />
                {isFetching ? "جاري التحديث..." : "تحديث"}
              </Button>
            </div>

            <div className="space-y-4">
              {sortedInvites.map((invite) => (
                <div
                  key={invite._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Folder className="w-5 h-5 text-yellow-500" />
                    <p className="text-lg">
                      {content.invitedTo}:
                      <strong>
                        {invite.projectId?.title || "Unknown Project"}
                      </strong>
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleRespond(invite._id, "accepted")}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {content.Accept}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleRespond(invite._id, "rejected")}
                      className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      {content.Reject}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg">{content.empty}</p>
          </div>
        )}
      </div>
    </div>
  );
}
