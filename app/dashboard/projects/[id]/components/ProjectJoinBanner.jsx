import { Clock, Plus, Sparkles } from "lucide-react";

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
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[40px] shadow-2xl shadow-blue-500/20 text-white border border-blue-500/20 group">
      {/* Dynamic Background decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full translate-y-1/3 -translate-x-1/2 blur-2xl" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full w-fit border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">
               {isRTL ? "فرصة للمساهمة" : "Open Collaboration"}
            </span>
          </div>
          
          <h3 className="text-3xl font-black tracking-tight leading-tight">
            {isRTL ? "انضم إلى فريق العمل" : "Join the Project Team"}
          </h3>
          <p className="text-blue-100/80 text-sm leading-relaxed font-medium">
             {isRTL
               ? "هذا المشروع متاح للمساهمة. يمكنك البدء في استعراض المهام والبدء في العمل بمجرد قبول طلبك."
               : "This project is open for new contributors. You can explore tasks and start working as soon as your request is approved."}
          </p>
        </div>

        <button
          onClick={handleJoinProject}
          disabled={hasRequestedJoin || isJoining}
          className="flex items-center justify-center gap-3 bg-white text-blue-600 hover:bg-blue-50 px-8 py-5 h-auto rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-black/10 transition-all active:scale-95 disabled:opacity-75 disabled:scale-100"
        >
          {hasRequestedJoin ? (
            <Clock className="w-5 h-5 animate-spin-slow" />
          ) : (
            <Plus className="w-5 h-5 font-bold" />
          )}
          {hasRequestedJoin ? (isRTL ? "تم الإرسال" : "Pending Approval") : content.joinProject}
        </button>
      </div>
    </div>
  );
}
