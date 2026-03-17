"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetProject } from "../../../../hooks/projects/useGetProjects";
import { useGetTasks } from "../../../../hooks/tasks/useTasks";
import { useAppContext } from "../../../../contexts/AppContext";
import { translations } from "../../../../lib/translations";
import CheckUserRole from "../../../../lib/actions/checkUserRole";
import Loading from "../../../../components/Loading";
import { Button } from "../../../../components/ui/button";
import {
  Printer,
  Star,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { isBefore, isToday } from "date-fns";
import "./TeamReportPage.css";

export default function TeamReportPage() {
  const { id } = useParams();
  const {
    data: project,
    isLoading: isProjectLoading,
    refetch: refetchProject,
    isFetching: isProjectFetching,
  } = useGetProject(id);
  const {
    data: tasks,
    isLoading: isTasksLoading,
    refetch: refetchTasks,
    isFetching: isTasksFetching,
  } = useGetTasks();
  const { language, isRTL } = useAppContext();
  const content = translations[language]?.dashboard?.teamReport || {};

  // ── All hooks MUST be before any early return ─────────────────────────────
  const [evaluations, setEvaluations] = useState({});
  const [isPrinting, setIsPrinting] = useState(false);

  const handleRefresh = () => {
    refetchProject();
    if (refetchTasks) refetchTasks();
  };
  const isRefetching = isProjectFetching || isTasksFetching;

  // ── Early returns AFTER all hooks ─────────────────────────────────────────
  if (isProjectLoading || isTasksLoading) return <Loading />;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading project data</p>
      </div>
    );
  }

  // ── Derived data (after early returns, safe to use project) ───────────────
  const coLeaderIds = new Set((project.coLeaders || []).map((u) => u._id));
  const uniqueMembers = (project.members || []).filter(
    (u) => !coLeaderIds.has(u._id),
  );
  const allMembers = uniqueMembers.map((u) => ({ ...u, _role: "member" }));

  const today = new Date();
  const dateString = today.toLocaleDateString(
    language === "ar" ? "ar-EG" : "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  // ── Handlers (use allMembers safely after early returns) ──────────────────
  const handleAutoEvaluate = () => {
    const newEvaluations = { ...evaluations };
    allMembers.forEach((member) => {
      const memberTasks =
        tasks?.filter(
          (t) =>
            t.projectId?._id === id &&
            t.assignedTo?.some((u) => u._id === member._id),
        ) || [];
      const totalTasks = memberTasks.length;

      if (totalTasks === 0) {
        newEvaluations[member._id] = {
          rating: 0,
          notes: isRTL ? "ليس لديه مهام لتقييمه" : "No tasks to evaluate",
        };
        return;
      }

      const completedCount = memberTasks.filter(
        (t) => t.status === "completed",
      ).length;
      const overdueCount = memberTasks.filter(
        (t) =>
          t.dueDate &&
          t.status !== "completed" &&
          isBefore(new Date(t.dueDate), new Date()) &&
          !isToday(new Date(t.dueDate)),
      ).length;

      let completionRate = completedCount / totalTasks;
      let rating = 0;
      if (completionRate >= 0.9) rating = 5;
      else if (completionRate >= 0.7) rating = 4;
      else if (completionRate >= 0.5) rating = 3;
      else if (completionRate >= 0.3) rating = 2;
      else if (completionRate > 0) rating = 1;
      else rating = 0;

      const percentage = Math.round(completionRate * 100);
      let notes = isRTL
        ? `نسبة الإنجاز: ${percentage}%`
        : `Completion Rate: ${percentage}%`;

      if (overdueCount > 0) {
        notes += isRTL
          ? ` (لديه ${overdueCount} مهام متأخرة)`
          : ` (${overdueCount} overdue tasks)`;
        if (rating > 1) rating -= 1;
      }

      newEvaluations[member._id] = { rating, notes };
    });
    setEvaluations(newEvaluations);
  };

  const handlePrint = async () => {
    const element = document.getElementById("team-report-page");
    if (!element) return;
    setIsPrinting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf()
        .from(element)
        .set({
          margin: [10, 10, 10, 10],
          filename: `Team_Report_${project.title}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .save();
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setIsPrinting(false);
    }
  };

  const updateEvaluation = (memberId, field, value) => {
    setEvaluations((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value,
      },
    }));
  };

  return (
    <CheckUserRole projectId={id}>
      <div className="team-report-wrapper" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex gap-4 mb-6">
          <Button
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
          >
            <Printer size={18} className={isPrinting ? "animate-pulse" : ""} />
            {isPrinting
              ? isRTL
                ? "جارٍ الإنشاء..."
                : "Generating..."
              : content.print}
          </Button>

          <Button
            onClick={handleAutoEvaluate}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Star size={18} />
            {isRTL ? "تقييم آلي" : "Auto Evaluate"}
          </Button>

          <Button
            onClick={handleRefresh}
            disabled={isRefetching}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white disabled:opacity-50"
            title={isRTL ? "تحديث" : "Refresh"}
          >
            <RefreshCw
              size={18}
              className={isRefetching ? "animate-spin" : ""}
            />
            {isRTL ? "تحديث" : "Refresh"}
          </Button>
        </div>

        <div id="team-report-page" className="team-report-page">
          <div className="team-report-header">
            <h1>{content.title}</h1>
            <p>{project.title}</p>
            <p className="report-date">{dateString}</p>
          </div>

          {allMembers.length === 0 ? (
            <p
              className="no-tasks"
              style={{ textAlign: "center", padding: "2.5rem 0" }}
            >
              {content.noMembers}
            </p>
          ) : (
            <div>
              {allMembers.map((member) => {
                const memberTasks =
                  tasks?.filter(
                    (t) =>
                      t.projectId?._id === id &&
                      t.assignedTo?.some((u) => u._id === member._id),
                  ) || [];

                const activeTasks = memberTasks.filter(
                  (t) => t.status !== "completed",
                );
                const completedTasks = memberTasks.filter(
                  (t) => t.status === "completed",
                );
                const overdueTasks = memberTasks.filter(
                  (t) =>
                    t.dueDate &&
                    t.status !== "completed" &&
                    isBefore(new Date(t.dueDate), new Date()) &&
                    !isToday(new Date(t.dueDate)),
                );

                const evalData = evaluations[member._id] || {
                  rating: 0,
                  notes: "",
                };

                const memberName =
                  member.name && member.name !== "null null"
                    ? member.name
                    : member.email?.split("@")[0].replace(/[0-9]/g, "");

                return (
                  <div key={member._id} className="team-member-card">
                    <div className="team-member-row">
                      {/* Member Info & Rating */}
                      <div className="team-member-info">
                        <h3>{memberName}</h3>
                        <p className="member-role">
                          {project.customRoles?.[member._id] ||
                            translations[language].dashboard.updateProject
                              .members}
                        </p>
                        <p>{member.email}</p>

                        <label className="team-rating-label">
                          {content.rating}
                        </label>
                        <div className="team-rating-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() =>
                                updateEvaluation(member._id, "rating", star)
                              }
                              className={`star-btn ${
                                star <= evalData.rating ? "active" : ""
                              }`}
                            >
                              <Star
                                size={24}
                                color={
                                  star <= evalData.rating
                                    ? "#fbbf24"
                                    : "#d1d5db"
                                }
                                fill={
                                  star <= evalData.rating
                                    ? "#fbbf24"
                                    : "transparent"
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Task Breakdown */}
                      <div className="team-member-tasks">
                        <div className="team-tasks-box">
                          <h4>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <Clock size={16} color="#d97706" />{" "}
                              {content.activeTasks}
                            </span>
                            <span className="task-count">
                              {activeTasks.length}
                            </span>
                          </h4>
                          <ul>
                            {activeTasks.length > 0 ? (
                              activeTasks.map((t) => (
                                <li key={t._id}>{t.title}</li>
                              ))
                            ) : (
                              <li className="no-tasks">
                                {content.noActiveTasks}
                              </li>
                            )}
                          </ul>
                        </div>

                        <div className="team-tasks-box">
                          <h4>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <CheckCircle size={16} color="#059669" />{" "}
                              {content.completedTasks}
                            </span>
                            <span className="task-count">
                              {completedTasks.length}
                            </span>
                          </h4>
                          <ul>
                            {completedTasks.length > 0 ? (
                              completedTasks.map((t) => (
                                <li key={t._id}>{t.title}</li>
                              ))
                            ) : (
                              <li className="no-tasks">
                                {content.noCompletedTasks}
                              </li>
                            )}
                          </ul>
                        </div>

                        <div className="team-tasks-box">
                          <h4>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <AlertCircle size={16} color="#dc2626" />{" "}
                              {isRTL ? "مهام متأخرة" : "Overdue Tasks"}
                            </span>
                            <span
                              className="task-count"
                              style={{
                                color: "#dc2626",
                                backgroundColor: "#fef2f2",
                              }}
                            >
                              {overdueTasks.length}
                            </span>
                          </h4>
                          <ul>
                            {overdueTasks.length > 0 ? (
                              overdueTasks.map((t) => (
                                <li key={t._id} style={{ color: "#dc2626" }}>
                                  {t.title}
                                </li>
                              ))
                            ) : (
                              <li className="no-tasks">
                                {isRTL
                                  ? "لا يوجد مهام متأخرة"
                                  : "No overdue tasks"}
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* Notes Section */}
                      <div className="team-member-notes">
                        <label className="team-notes-label">
                          {content.notes}
                        </label>
                        <textarea
                          value={evalData.notes}
                          onChange={(e) =>
                            updateEvaluation(
                              member._id,
                              "notes",
                              e.target.value,
                            )
                          }
                          placeholder={content.writeNotes}
                          className="team-notes-input"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Report Footer */}
          <div
            className="report-footer"
            style={{
              marginTop: "2rem",
              textAlign: "center",
              borderTop: "1px solid #eee",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#666",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              {language === "ar"
                ? "تم إنشاء هذا التقرير بواسطة"
                : "This report was generated by"}
              <a
                href="https://final-step.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#4f46e5",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                FinalStep
              </a>
            </p>
          </div>
        </div>
      </div>
    </CheckUserRole>
  );
}
