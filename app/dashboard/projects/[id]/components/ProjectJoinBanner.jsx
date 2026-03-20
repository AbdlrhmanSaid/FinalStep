import { Users, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectJoinBanner({
  data,
  isRandomUser,
  isInvite,
  isFinished,
  isRTL,
  content,
  handleJoinProject,
  hasRequestedJoin,
  isJoining,
}) {
  if (!isRandomUser || (!data.public && !isInvite) || isFinished) {
    return null;
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-xl flex flex-col items-center text-center gap-4 shadow-sm">
      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
        <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {isRTL ? "انضم إلى هذا المشروع" : "Join this project"}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
          {isRTL
            ? "يبدو أنك لست عضواً في هذا المشروع بعد. انضم الآن للبدء في المساهمة!"
            : "It looks like you're not a member of this project yet. Join now to start contributing!"}
        </p>
      </div>
      <Button
        onClick={handleJoinProject}
        disabled={hasRequestedJoin || isJoining}
        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6 py-4 font-bold rounded-xl transition-all h-auto"
      >
        {hasRequestedJoin ? (
          <Clock className="w-5 h-5" />
        ) : (
          <Plus className="w-5 h-5" />
        )}
        {hasRequestedJoin ? content.joinRequested : content.joinProject}
      </Button>
    </div>
  );
}
