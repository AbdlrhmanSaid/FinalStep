"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetTask,
  useMemberSubmit,
  useReviewMemberSubmission,
} from "@/hooks/tasks/useTasks";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { format, isBefore, isToday } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import Loading from "@/components/Loading";
import { useAppContext } from "@/contexts/AppContext";
import toast from "react-hot-toast";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
  User,
  Plus,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ─── helpers ────────────────────────────────────────────────────────────────

const getStatusStyle = (status) => {
  switch (status) {
    case "open":
      return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
    case "submitted":
      return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
    case "completed":
      return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
    case "rejected":
      return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
    case "ended":
      return "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    default:
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
  }
};

const getMemberStatusBadge = (status, isRTL) => {
  const map = {
    open: {
      label: isRTL ? "مفتوحة" : "Open",
      cls: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200",
      icon: <Clock className="w-3 h-3" />,
    },
    submitted: {
      label: isRTL ? "بانتظار المراجعة" : "Pending Review",
      cls: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300",
      icon: <Send className="w-3 h-3" />,
    },
    completed: {
      label: isRTL ? "مقبول" : "Accepted",
      cls: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
      icon: <CheckCircle className="w-3 h-3" />,
    },
    rejected: {
      label: isRTL ? "مرفوض" : "Rejected",
      cls: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
      icon: <XCircle className="w-3 h-3" />,
    },
    ended: {
      label: isRTL ? "منتهية" : "Ended",
      cls: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
      icon: <XCircle className="w-3 h-3" />,
    },
  };
  const statusKey = status === "ended" ? "ended" : status;
  return map[statusKey] || map.open;
};

function MemberSubmissionCard({
  memberSub,
  isCurrentUser,
  isProjectLeader,
  taskId,
  userId,
  content,
  isRTL,
  dateLocale,
  onRefetch,
  submissionMethod = "both",
}) {
  const [expanded, setExpanded] = useState(isCurrentUser);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submissionDesc, setSubmissionDesc] = useState(
    memberSub?.description || "",
  );
  const [submissionLinks, setSubmissionLinks] = useState(
    memberSub?.links?.length > 0 ? memberSub.links : [""],
  );
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [reviewNote, setReviewNote] = useState("");

  const { mutate: memberSubmit, isLoading: isSubmitting } = useMemberSubmit();
  const { mutate: reviewMember, isLoading: isReviewing } =
    useReviewMemberSubmission();

  const status = memberSub?.status || "open";
  const badge = getMemberStatusBadge(status, isRTL);

  const displayName =
    memberSub?.userId?.name &&
    memberSub.userId.name.trim() !== "null null" &&
    memberSub.userId.name.trim() !== "null"
      ? memberSub.userId.name
      : memberSub?.userId?.email?.split("@")[0] || "Unknown";

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (submissionMethod !== "link" && !submissionDesc.trim()) {
      toast.error(content.provideDescription);
      return;
    }
    const links = submissionLinks.map((l) => l.trim()).filter((l) => l);

    if (submissionMethod !== "text") {
      if (links.length === 0) {
        toast.error(
          isRTL
            ? "يرجى تقديم رابط واحد على الأقل"
            : "Please provide at least one link",
        );
        return;
      }
      const badLinks = links.filter((l) => !isValidUrl(l));
      if (badLinks.length > 0) {
        toast.error(`${content.invalidUrls}: ${badLinks.join(", ")}`);
        return;
      }
    }
    memberSubmit(
      {
        taskId,
        userId,
        submittingUserId: memberSub.userId?._id || memberSub.userId,
        submission: { description: submissionDesc, links },
      },
      {
        onSuccess: () => {
          toast.success(content.taskSubmittedSuccess);
          setShowSubmitForm(false);
          onRefetch();
        },
        onError: () => toast.error("Failed to submit"),
      },
    );
  };

  const handleReview = (action) => {
    if (action === "rejected" && !reviewNote.trim()) {
      toast.error(content.provideRejectionReason);
      return;
    }
    reviewMember(
      {
        taskId,
        userId,
        targetUserId: memberSub.userId?._id || memberSub.userId,
        reviewAction: action,
        reviewNote,
      },
      {
        onSuccess: () => {
          toast.success(
            action === "completed"
              ? content.taskAcceptedSuccess
              : content.taskRejectedSuccess,
          );
          setShowRejectDialog(false);
          setReviewNote("");
          onRefetch();
        },
        onError: () => toast.error("Failed to review"),
      },
    );
  };

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all ${
        isCurrentUser
          ? "border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      {/* Header */}
      <button
        className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors gap-3"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-start min-w-0">
            <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
              {displayName}
              {isCurrentUser && (
                <span className="ml-2 text-xs text-blue-500">
                  ({isRTL ? "أنت" : "You"})
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${badge.cls} whitespace-nowrap`}
          >
            {badge.icon}
            {badge.label}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
          {/* Submission details */}
          {(memberSub?.description ||
            (memberSub?.links && memberSub.links.length > 0)) && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg space-y-2">
              {memberSub?.description && (
                <>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {content.submissionDescription}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                    {memberSub.description}
                  </p>
                </>
              )}

              {memberSub.links?.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {content.links}
                  </h5>
                  <ul className="list-disc list-inside space-y-1">
                    {memberSub.links.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {memberSub.submittedAt && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {content.submittedAt}:{" "}
                  {format(new Date(memberSub.submittedAt), "PPPp", {
                    locale: dateLocale,
                  })}
                </p>
              )}

              {status === "completed" && memberSub?.review?.reviewedBy && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {content.acceptedBy}:{" "}
                    {memberSub.review.reviewedBy.name ||
                      memberSub.review.reviewedBy.email?.split("@")[0]}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Review note (if rejected) */}
          {status === "rejected" && memberSub?.review?.note && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg">
              <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                {content.rejectionReason}:
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">
                {memberSub.review.note}
              </p>
            </div>
          )}

          {/* Late submission badge */}
          {memberSub?.isLateSubmission && (
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 px-3 py-2 rounded-lg">
              <span className="text-amber-600 dark:text-amber-400 text-sm font-semibold">
                ⚠️ {isRTL ? `تم التسليم متأخراً${memberSub.lateDays > 0 ? ` (بعد ${memberSub.lateDays} يوم)` : ""}` : `Late submission${memberSub.lateDays > 0 ? ` (${memberSub.lateDays} day${memberSub.lateDays > 1 ? "s" : ""} late)` : ""}`}
              </span>
            </div>
          )}

          {/* Current user or Leader: submit or resubmit */}
          {(isCurrentUser || isProjectLeader) &&
            (status === "open" ||
              status === "rejected" ||
              status === "completed" ||
              status === "ended") && (
              <>
                {/* Late submission warning */}
                {status === "ended" && (
                  <div className="flex flex-col gap-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 px-3 py-2.5 rounded-lg">
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                      ⚠️ {isRTL ? "انتهى موعد التسليم" : "Deadline has passed"}
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-500">
                      {isRTL
                        ? "يمكنك التسليم الآن، لكن سيُحتسب كتسليم متأخر ويؤثر على تقييمك."
                        : "You can still submit, but it will be marked as a late submission and will affect your evaluation score."}
                    </p>
                  </div>
                )}
                {!showSubmitForm ? (
                  <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-700">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        setSubmissionDesc(memberSub?.description || "");
                        setSubmissionLinks(
                          memberSub?.links?.length > 0 ? memberSub.links : [""],
                        );
                        setShowSubmitForm(true);
                      }}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      {status === "completed"
                        ? isRTL
                          ? "تعديل التسليم"
                          : "Edit Submission"
                        : status === "rejected"
                          ? isRTL
                            ? "إعادة التسليم"
                            : "Resubmit"
                          : status === "ended"
                            ? isRTL
                              ? "تسليم متأخر"
                              : "Submit Late"
                            : content.submitTask}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissionMethod !== "link" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {content.submissionDescription}
                        </label>
                        <textarea
                          rows={3}
                          className="w-full p-2 border dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
                          placeholder={content.describeWork}
                          value={submissionDesc}
                          onChange={(e) => setSubmissionDesc(e.target.value)}
                        />
                      </div>
                    )}
                    {submissionMethod !== "text" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {content.submissionLinks}
                        </label>
                        <div className="space-y-2">
                          {submissionLinks.map((link, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                className="flex-1 p-2 border dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
                                placeholder={
                                  content.linksPlaceholder || "https://..."
                                }
                                value={link}
                                onChange={(e) => {
                                  const newLinks = [...submissionLinks];
                                  newLinks[idx] = e.target.value;
                                  setSubmissionLinks(newLinks);
                                }}
                              />
                              {submissionLinks.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newLinks = submissionLinks.filter(
                                      (_, i) => i !== idx,
                                    );
                                    setSubmissionLinks(newLinks);
                                  }}
                                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-transparent"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-start">
                          <button
                            type="button"
                            onClick={() =>
                              setSubmissionLinks([...submissionLinks, ""])
                            }
                            className="text-sm text-blue-600 dark:text-blue-400 inline-flex items-center gap-1 hover:underline"
                          >
                            <Plus className="w-4 h-4" />
                            {isRTL ? "إضافة رابط آخر" : "Add another link"}
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowSubmitForm(false)}
                        disabled={isSubmitting}
                      >
                        {content.cancel}
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? content.processing
                          : content.confirmSubmit}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

          {/* Leader: accept / reject */}
          {isProjectLeader && status === "submitted" && (
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isReviewing}
                onClick={() => handleReview("completed")}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                {isReviewing ? content.processing : content.accept}
              </Button>

              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isReviewing}
                onClick={() => setShowRejectDialog(true)}
              >
                <XCircle className="w-4 h-4 mr-1" />
                {content.reject}
              </Button>
            </div>
          )}

          {/* Reject dialog */}
          {showRejectDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowRejectDialog(false)}
              />
              <div className="relative z-50 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {content.rejectSubmission}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {isRTL
                      ? `رفض تسليم: ${displayName}`
                      : `Reject submission for: ${displayName}`}
                  </p>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {content.rejectionReason}
                    </label>
                    <textarea
                      className="w-full p-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                      placeholder={content.rejectionReasonPlaceholder}
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowRejectDialog(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 transition-colors"
                  >
                    {content.cancel}
                  </button>
                  <button
                    onClick={() => handleReview("rejected")}
                    disabled={isReviewing || !reviewNote.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
                  >
                    {isReviewing ? content.processing : content.reject}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page component ─────────────────────────────────────────────────────

const TaskDetailPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const {
    data: task,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetTask(id);

  const { userId, language, isRTL } = useAppContext();
  const dateLocale = language === "ar" ? ar : enUS;
  const content = translations[language].dashboard.taskDetails;

  if (isLoading) return <Loading />;
  if (isError || !task)
    return (
      <div className="p-8 text-center text-red-500">{content.taskNotFound}</div>
    );

  const isProjectLeader =
    task.projectId?.leaderId?.toString() === userId?.toString() ||
    task.projectId?.coLeaders?.some(
      (coId) => coId?.toString() === userId?.toString(),
    );

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500 dark:text-red-400";
      case "medium":
        return "text-yellow-500 dark:text-yellow-400";
      case "low":
        return "text-green-500 dark:text-green-400";
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

  // Build memberSubmissions merged with assignedTo list
  // (ensures every assigned user appears even if they haven't submitted yet)
  const mergedSubmissions = (task.assignedTo || []).map((user) => {
    const uid = user._id || user;
    const sub = (task.memberSubmissions || []).find(
      (s) => (s.userId?._id || s.userId)?.toString() === uid?.toString(),
    );
    return sub
      ? { ...sub, userId: typeof user === "object" ? user : sub.userId }
      : { userId: user, status: "open" };
  });

  const isSharedTask = (task.assignedTo || []).length > 1;

  // Progress summary for shared tasks
  const completedCount = mergedSubmissions.filter(
    (s) => s.status === "completed",
  ).length;
  const totalCount = mergedSubmissions.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-0 overflow-hidden">
          <CardHeader className="bg-gray-100 dark:bg-gray-700 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="w-full sm:w-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-1 flex items-center gap-2 flex-wrap">
                  <span className="break-words">{task.title}</span>
                  <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="p-1.5 rounded-lg bg-gray-200/50 dark:bg-gray-600/50 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-all disabled:opacity-50"
                    title={isRTL ? "تحديث" : "Refresh"}
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isFetching ? "animate-spin text-blue-500" : ""}`}
                    />
                  </button>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {content.createdBy}:{" "}
                  <span className="font-medium">
                    {task.createdBy?.name || task.createdBy?.email}
                  </span>
                </p>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusStyle(task.status)}`}
              >
                {content.status[task.status] || task.status}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-6">
            {/* Description */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {content.description}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 pl-2 whitespace-pre-wrap break-words">
                {task.description || (
                  <span className="italic text-gray-500">
                    {content.noDescription}
                  </span>
                )}
              </p>
              {task.referenceLink && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                    {isRTL ? "الرابط المرجعي" : "Reference Link"}
                  </h3>
                  <a
                    href={task.referenceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 underline break-all text-sm block"
                  >
                    {task.referenceLink}
                  </a>
                </div>
              )}
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {content.projectInfo}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  {content.project}:{" "}
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {task.projectId?.title || "N/A"}
                  </span>
                </p>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  {content.priority}:{" "}
                  <span className={getPriorityStyle(task.priority)}>
                    {content.priorityLevels[task.priority] || task.priority}
                  </span>
                </p>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  {content.requirement}:{" "}
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {task.submissionMethod === "text"
                      ? content.methodText
                      : task.submissionMethod === "link"
                        ? content.methodLink
                        : content.methodBoth}
                  </span>
                </p>

                {task.submissionDescription && (
                  <div className="mt-3 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <h4 className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">
                      {content.submissionInstructions}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                      {task.submissionDescription}
                    </p>
                  </div>
                )}

                {task.assignedTo?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {content.assignedTo}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {task.assignedTo.map((user) => {
                        const displayName =
                          user.name &&
                          user.name.trim() !== "null null" &&
                          user.name.trim() !== "null"
                            ? user.name
                            : user.email?.split("@")[0] || "Unknown";
                        return (
                          <span
                            key={user._id || Math.random().toString()}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs sm:text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          >
                            {displayName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {content.timeline}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  {content.created}:{" "}
                  {format(new Date(task.createdAt), "PPPp", {
                    locale: dateLocale,
                  })}
                </p>
                {task.updatedAt && (
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    {content.updated}:{" "}
                    {format(new Date(task.updatedAt), "PPPp", {
                      locale: dateLocale,
                    })}
                  </p>
                )}
                {task.dueDate && (
                  <p
                    className={`text-sm sm:text-base font-medium flex items-center gap-1 flex-wrap ${
                      new Date(task.dueDate) < new Date() &&
                      task.status !== "completed"
                        ? "text-red-600 dark:text-red-400"
                        : "text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    <span>⏰ {content.dueDate}:</span>
                    <span>
                      {format(new Date(task.dueDate), "PPP", {
                        locale: dateLocale,
                      })}
                    </span>
                    {new Date(task.dueDate) < new Date() &&
                      task.status !== "completed" && (
                        <span className="text-[10px] bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                          {content.overdue}
                        </span>
                      )}
                  </p>
                )}
              </div>
            </div>

            {/* ── Member Submissions section ───────────────────────────── */}
            {mergedSubmissions.length > 0 && (
              <div className="space-y-3 pt-4">
                {/* Header with progress for shared tasks */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {isSharedTask
                      ? isRTL
                        ? "تسليمات الأعضاء"
                        : "Member Submissions"
                      : isRTL
                        ? "التسليم"
                        : "Submission"}
                  </h3>

                  {isSharedTask && (
                    <div className="flex items-center gap-2">
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {completedCount}/{totalCount}{" "}
                        {isRTL ? "مقبول" : "accepted"}
                      </div>
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{
                            width: `${(completedCount / totalCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Per-member cards */}
                <div className="space-y-3">
                  {mergedSubmissions.map((memberSub, idx) => (
                    <MemberSubmissionCard
                      key={
                        memberSub.userId?._id ||
                        memberSub.userId?.toString() ||
                        idx
                      }
                      memberSub={memberSub}
                      isCurrentUser={
                        (
                          memberSub.userId?._id || memberSub.userId
                        )?.toString() === userId?.toString()
                      }
                      isProjectLeader={isProjectLeader}
                      taskId={id}
                      userId={userId}
                      content={content}
                      isRTL={isRTL}
                      dateLocale={dateLocale}
                      onRefetch={refetch}
                      submissionMethod={task.submissionMethod}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskDetailPage;
