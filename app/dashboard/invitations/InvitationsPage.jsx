"use client";
import { useAppContext } from "../../../contexts/AppContext";
import { useGetUserInvites } from "../../../hooks/invitations/useGetUserInvites";
import Loading from "../../../components/Loading";
import { Button } from "../../../@/components/ui/button";
import axios from "axios";
import { Mail, CheckCircle, XCircle, Folder } from "lucide-react";
import { translations } from "../../../lib/translations";

export default function InvitationsPage() {
  const { email, language } = useAppContext();
  const content = translations[language].dashboard.invitations;

  const {
    data: invites,
    isLoading,
    refetch,
    isFetching,
  } = useGetUserInvites(email);

  const handleRespond = async (inviteId, action) => {
    try {
      await axios.put(`/api/invite/respond`, { inviteId, action });
      await refetch();
    } catch (err) {
      console.error("Failed to respond:", err);
    }
  };

  if (isLoading || isFetching) return <Loading />;

  return (
    <div className="min-h-screen bgMain flex flex-col items-center justify-center p-6 transition-colors">
      <div className="w-full max-w-2xl space-y-6">
        {invites?.length ? (
          <>
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-blue-500" />
              <h2 className="text-2xl font-bold">{content.UrTitle}</h2>
            </div>

            <div className="space-y-4">
              {invites.map((invite) => (
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
