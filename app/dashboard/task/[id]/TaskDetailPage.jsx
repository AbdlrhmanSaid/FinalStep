"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useGetTask, useUpdateTask } from "../../../../hooks/tasks/useTasks";
import { translations } from "../../../../lib/translations";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { format, isBefore, isToday, differenceInDays } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import Loading from "../../../../components/Loading";
import { useAppContext } from "../../../../contexts/AppContext";
import toast from "react-hot-toast";

const TaskDetailPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: task, isLoading, isError, refetch } = useGetTask(id);
  const { mutate: updateTask, isLoading: isUpdating } = useUpdateTask();
  const { userId, language, isRTL } = useAppContext();
  const dateLocale = language === "ar" ? ar : enUS;
  const content = translations[language].dashboard.taskDetails;

  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submissionDescription, setSubmissionDescription] = useState("");
  const [submissionLinks, setSubmissionLinks] = useState("");
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);


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

  const handleSubmitTask = () => setShowSubmitForm(true);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleConfirmSubmit = () => {
    if (!submissionDescription.trim()) {
      toast.error(content.provideDescription);
      return;
    }

    const links = submissionLinks
      .split(",")
      .map((link) => link.trim())
      .filter((link) => link);

    const invalidLinks = links.filter((link) => !isValidUrl(link));
    if (invalidLinks.length > 0) {
      toast.error(`${content.invalidUrls}: ${invalidLinks.join(", ")}`);
      return;
    }

    updateTask(
      {
        taskId: id,
        userId,
        data: {
          status: "submitted",
          submission: {
            description: submissionDescription,
            links: links,
            submittedAt: new Date(),
          },
        },
      },
      {
        onSuccess: () => {
          toast.success(content.taskSubmittedSuccess);
          setShowSubmitForm(false);
          setSubmissionDescription("");
          setSubmissionLinks("");
          refetch();
        },
        onError: () => {
          toast.error("Failed to submit task");
        },
      },
    );
  };

  const handleAccept = () => {
    updateTask(
      {
        taskId: id,
        userId,
        data: {
          status: "completed",
          review: {
            reviewedBy: userId,
            reviewedAt: new Date(),
            note: content.status.completed,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success(content.taskAcceptedSuccess);
          setShowAcceptDialog(false);
          refetch();
        },
        onError: () => {
          toast.error("Failed to accept task");
        },
      },
    );
  };

  const handleReject = () => {
    if (!reviewNote.trim()) {
      toast.error(content.provideRejectionReason);
      return;
    }

    updateTask(
      {
        taskId: id,
        userId,
        data: {
          status: "rejected",
          review: {
            reviewedBy: userId,
            reviewedAt: new Date(),
            note: reviewNote,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success(content.taskRejectedSuccess);
          setShowRejectReason(false);
          setShowRejectDialog(false);
          setReviewNote("");
          refetch();
        },
        onError: () => {
          toast.error("Failed to reject task");
        },
      },
    );
  };

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
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-4xl mx-auto ">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-0 overflow-hidden">
          <CardHeader className="bg-gray-100 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                  {task.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {content.createdBy}:{" "}
                  <span className="font-medium">
                    {task.createdBy?.name || task.createdBy?.email}
                  </span>
                </p>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                  task.status,
                )}`}
              >
                {content.status[task.status] || task.status}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {content.description}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 pl-2">
                {task.description || (
                  <span className="italic text-gray-500">
                    {content.noDescription}
                  </span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {content.projectInfo}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {content.project}:{" "}
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {task.projectId?.title || "N/A"}
                  </span>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {content.priority}:{" "}
                  <span className={getPriorityStyle(task.priority)}>
                    {content.priorityLevels[task.priority] || task.priority}
                  </span>
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {content.timeline}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {content.created}:{" "}
                  {format(new Date(task.createdAt), "PPPp", {
                    locale: dateLocale,
                  })}
                </p>
                {task.updatedAt && (
                  <p className="text-gray-700 dark:text-gray-300">
                    {content.updated}:{" "}
                    {format(new Date(task.updatedAt), "PPPp", {
                      locale: dateLocale,
                    })}
                  </p>
                )}
                {task.dueDate && (
                  <p
                    className={`font-medium flex items-center gap-1 ${
                      new Date(task.dueDate) < new Date() &&
                      task.status !== "completed"
                        ? "text-red-600 dark:text-red-400"
                        : "text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    ⏰ {content.dueDate}:{" "}
                    {format(new Date(task.dueDate), "PPP", {
                      locale: dateLocale,
                    })}
                    {new Date(task.dueDate) < new Date() &&
                      task.status !== "completed" && (
                        <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">
                          {content.overdue}
                        </span>
                      )}
                  </p>
                )}
                {task.submission?.submittedAt && (
                  <p className="text-gray-700 dark:text-gray-300">
                    {content.submitted}:{" "}
                    {format(new Date(task.submission.submittedAt), "PPPp", {
                      locale: dateLocale,
                    })}
                  </p>
                )}
                {task.review?.reviewedAt && (
                  <p className="text-gray-700 dark:text-gray-300">
                    {content.reviewed}:{" "}
                    {format(new Date(task.review.reviewedAt), "PPPp", {
                      locale: dateLocale,
                    })}
                  </p>
                )}
              </div>
            </div>

            {task.submission?.description && (
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {content.submissionDetails}
                </h3>

                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {content.submissionDescription}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    {task.submission.description}
                  </p>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {content.links}
                  </h4>
                  {task.submission.links && task.submission.links.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {task.submission.links.map((link, index) => (
                        <li key={index}>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="italic text-gray-500 dark:text-gray-400">
                      {content.noLinksSubmitted}
                    </p>
                  )}
                </div>

                {task.submission.submittedAt && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {content.submittedAt}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {format(new Date(task.submission.submittedAt), "PPPp", {
                        locale: dateLocale,
                      })}
                    </p>
                  </div>
                )}
              </div>
            )}

            {(task.status === "open" || task.status === "rejected") &&
              !showSubmitForm && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleSubmitTask}
                    disabled={isUpdating}
                  >
                    {isUpdating ? content.processing : content.submitTask}
                  </Button>
                </div>
              )}

            {showSubmitForm && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {content.submissionDescription}
                  </label>
                  <textarea
                    rows={4}
                    className="w-full p-2 border dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-sm"
                    placeholder={content.describeWork}
                    value={submissionDescription}
                    onChange={(e) => setSubmissionDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {content.submissionLinks}
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-sm"
                    placeholder={content.linksPlaceholder}
                    value={submissionLinks}
                    onChange={(e) => setSubmissionLinks(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {content.enterValidUrls}
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSubmitForm(false)}
                    disabled={isUpdating}
                  >
                    {content.cancel}
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleConfirmSubmit}
                    disabled={isUpdating}
                  >
                    {isUpdating ? content.processing : content.confirmSubmit}
                  </Button>
                </div>
              </div>
            )}

            {task.status === "rejected" && task.review?.note && (
              <div className="pt-4 border-t border-gray-300 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                  {content.rejectionReason}:
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {task.review.note}
                </p>
              </div>
            )}

            {isProjectLeader && task.status === "submitted" && (
              <div className="pt-6 border-t border-gray-300 dark:border-gray-600">
                <div className="flex gap-4 justify-end">
                  {/* Accept Dialog */}
                  <div
                    className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
                      showAcceptDialog ? "block" : "hidden"
                    }`}
                  >
                    <div
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                      onClick={() => setShowAcceptDialog(false)}
                    />

                    <div className="relative z-50 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {content.acceptSubmission}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {content.confirmAccept}
                        </p>
                      </div>

                      <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => setShowAcceptDialog(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 transition-colors"
                        >
                          {content.cancel}
                        </button>
                        <button
                          onClick={handleAccept}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50"
                          disabled={isUpdating}
                        >
                          {isUpdating ? content.processing : content.accept}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reject Dialog */}
                  <div
                    className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
                      showRejectDialog ? "block" : "hidden"
                    }`}
                  >
                    <div
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                      onClick={() => setShowRejectDialog(false)}
                    />

                    <div className="relative z-50 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {content.rejectSubmission}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {content.confirmReject}
                        </p>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {content.rejectionReason}
                          </label>
                          <textarea
                            className="w-full p-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 transition-colors"
                        >
                          {content.cancel}
                        </button>
                        <button
                          onClick={handleReject}
                          disabled={isUpdating || !reviewNote.trim()}
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? content.processing : content.reject}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Buttons to trigger dialogs */}
                  <button
                    onClick={() => setShowAcceptDialog(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50"
                    disabled={isUpdating}
                  >
                    {isUpdating ? content.processing : content.accept}
                  </button>

                  <button
                    onClick={() => setShowRejectDialog(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
                    disabled={isUpdating}
                  >
                    {isUpdating ? content.processing : content.reject}
                  </button>
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
