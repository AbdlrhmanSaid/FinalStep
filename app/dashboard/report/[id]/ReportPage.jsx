"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProjectReport } from "../../../../hooks/projects/useProjectReport";
import ModernLoading from "../../../../components/Loading";
import {
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  BarChart3,
  Users,
  CalendarDays,
  Tag,
} from "lucide-react";
import CheckUserRole from "../../../../lib/actions/checkUserRole";
import { Button } from "../../../../components/ui/button";
import { useAppContext } from "../../../../contexts/AppContext";
import { translations } from "../../../../lib/translations";
import "./ReportPage.css";

const ReportPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useProjectReport(id);
  const { language } = useAppContext();
  const isRTL = language === "ar";
  const content = translations[language]?.dashboard?.report || {};

  const [isPrinting, setIsPrinting] = useState(false);

  const today = new Date();
  const dateString = today.toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isLoading) return <ModernLoading />;
  if (error)
    return (
      <div className="rp-error">
        {content.errorLoading || "Error loading"}: {error.message}
      </div>
    );
  if (!data?.projectTitle)
    return <div className="rp-error">{content.noData}</div>;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  const safeValue = (val, fallback = "-") =>
    val === null || val === undefined || val === "null null" ? fallback : val;

  const getPriorityLabel = (p) => {
    if (isRTL)
      return p === "high" ? "عالي" : p === "medium" ? "متوسط" : "منخفض";
    return p?.charAt(0).toUpperCase() + p?.slice(1);
  };

  const getStatusMeta = (status) => {
    const map = {
      completed: {
        icon: <CheckCircle2 size={13} />,
        cls: "s-completed",
        label:
          translations[language]?.dashboard?.taskDetails?.status?.completed ||
          "Completed",
      },
      submitted: {
        icon: <Clock size={13} />,
        cls: "s-submitted",
        label:
          translations[language]?.dashboard?.taskDetails?.status?.submitted ||
          "Submitted",
      },
      open: {
        icon: <Clock size={13} />,
        cls: "s-open",
        label:
          translations[language]?.dashboard?.taskDetails?.status?.open ||
          "Open",
      },
      rejected: {
        icon: <XCircle size={13} />,
        cls: "s-rejected",
        label:
          translations[language]?.dashboard?.taskDetails?.status?.rejected ||
          "Rejected",
      },
      ended: {
        icon: <AlertTriangle size={13} />,
        cls: "s-ended",
        label:
          translations[language]?.dashboard?.taskDetails?.status?.ended ||
          "Ended",
      },
    };
    return (
      map[status] || { icon: <Clock size={13} />, cls: "s-open", label: status }
    );
  };

  const getPriorityMeta = (p) => {
    if (p === "high") return { cls: "p-high", label: getPriorityLabel(p) };
    if (p === "medium") return { cls: "p-medium", label: getPriorityLabel(p) };
    return { cls: "p-low", label: getPriorityLabel(p) };
  };

  const completionPct =
    data.totalTasks > 0
      ? Math.round((data.completedTasks / data.totalTasks) * 100)
      : 0;

  const formatDate = (d) => {
    if (!d) return isRTL ? "غير محدد" : "Not set";
    return new Date(d).toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <CheckUserRole projectId={id}>
      <div className="rp-container" dir={isRTL ? "rtl" : "ltr"}>
        {/* ── Top action bar ── */}
        <div className="rp-actions no-print md:flex">
          <Button
            onClick={handlePrint}
            disabled={isPrinting}
            className="rp-print-btn"
          >
            <Printer size={16} />
            {isPrinting
              ? isRTL
                ? "جارٍ الإنشاء..."
                : "Generating..."
              : content.print}
          </Button>

          {/* ── Print settings hint ── */}
          <div className="rp-print-hint mt-3 md:mt-0">
            <div className="rp-hint-body">
              <p className="rp-hint-title">
                {isRTL
                  ? "إعدادات الطباعة الصحيحة:"
                  : "Recommended print settings:"}
              </p>
              <ul className="rp-hint-list">
                <li>
                  <span className="rp-hint-key">
                    {isRTL ? "الوجهة" : "Destination"}
                  </span>{" "}
                  → <span className="rp-hint-val">Save as PDF</span>
                </li>
                <li>
                  <span className="rp-hint-key">
                    {isRTL ? "الصفحات" : "Pages"}
                  </span>{" "}
                  →{" "}
                  <span className="rp-hint-val">{isRTL ? "الكل" : "All"}</span>
                </li>
                <li>
                  <span className="rp-hint-key">
                    {isRTL ? "صفحات لكل ورقة" : "Pages per sheet"}
                  </span>{" "}
                  → <span className="rp-hint-val">1</span>
                </li>
                <li>
                  <span className="rp-hint-key">
                    {isRTL ? "الهوامش" : "Margins"}
                  </span>{" "}
                  →{" "}
                  <span className="rp-hint-val">
                    {isRTL ? "افتراضي" : "Default"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ══════════════ PRINTABLE PAGE ══════════════ */}
        <div id="page" className="rp-page">
          {/* ── Header ── */}
          <div className="rp-header">
            <div className="rp-header-badge">
              {isRTL ? "تقرير المشروع" : "Project Report"}
            </div>
            <h1 className="rp-project-title">{safeValue(data.projectTitle)}</h1>
            <p className="rp-date">{dateString}</p>
          </div>

          {/* ── Team info strip ── */}
          <div className="rp-team-strip">
            <div className="rp-team-item">
              <Users size={14} className="rp-team-icon" />
              <div>
                <span className="rp-team-label">
                  {content.leader || (isRTL ? "القائد" : "Leader")}
                </span>
                <span className="rp-team-value">{safeValue(data.leader)}</span>
              </div>
            </div>
            {data.coLeaders?.filter((n) => n && n !== "null null").length >
              0 && (
              <div className="rp-team-item">
                <Users size={14} className="rp-team-icon" />
                <div>
                  <span className="rp-team-label">
                    {content.coLeaders ||
                      (isRTL ? "مساعدو القائد" : "Co-Leaders")}
                  </span>
                  <span className="rp-team-value">
                    {data.coLeaders
                      .filter((n) => n && n !== "null null")
                      .join(" · ")}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Stats grid ── */}
          <div className="rp-stats-grid">
            <div className="rp-stat rp-stat-total">
              <span className="rp-stat-num">{data.totalTasks || 0}</span>
              <span className="rp-stat-lbl">
                {content.totalTasks ||
                  (isRTL ? "إجمالي المهام" : "Total Tasks")}
              </span>
            </div>
            <div className="rp-stat rp-stat-done">
              <span className="rp-stat-num">{data.completedTasks || 0}</span>
              <span className="rp-stat-lbl">
                {content.completedTasks || (isRTL ? "مكتملة" : "Completed")}
              </span>
            </div>
            <div className="rp-stat rp-stat-remain">
              <span className="rp-stat-num">{data.remainingTasks || 0}</span>
              <span className="rp-stat-lbl">
                {content.remainingTasks || (isRTL ? "متبقية" : "Remaining")}
              </span>
            </div>
            <div className="rp-stat rp-stat-overdue">
              <span className="rp-stat-num">{data.overdueTasks || 0}</span>
              <span className="rp-stat-lbl">
                {isRTL ? "متأخرة" : "Overdue"}
              </span>
            </div>
          </div>

          {/* ── Progress bar ── */}
          <div className="rp-progress-section">
            <div className="rp-progress-header">
              <span className="rp-progress-label">
                <BarChart3 size={14} />
                {isRTL ? "نسبة الإنجاز" : "Completion Rate"}
              </span>
              <span className="rp-progress-pct">{completionPct}%</span>
            </div>
            <div className="rp-progress-track">
              <div
                className="rp-progress-fill"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <p className="rp-progress-caption">
              {data.completedTasks || 0} {isRTL ? "من أصل" : "out of"}{" "}
              {data.totalTasks || 0} {isRTL ? "مهمة مكتملة" : "tasks completed"}
            </p>
          </div>

          {/* ── Tasks list ── */}
          <div className="rp-tasks-section">
            <h2 className="rp-section-title">
              {content.taskDetails ||
                (isRTL ? "تفاصيل المهام" : "Task Details")}
            </h2>

            <div className="rp-tasks-list">
              {data.sections?.map(section => (
                <div key={section.id || section.title} className="mb-6">
                  {data.hasSections && (
                    <h3 className="font-bold text-lg mb-4 text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-xl text-sm border border-blue-100">
                        {section.title}
                      </span>
                      <span className="text-sm font-normal text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                        {section.completedTasks} / {section.totalTasks} {isRTL ? 'مكتملة' : 'Completed'}
                      </span>
                    </h3>
                  )}
                  <div className="rp-tasks-items flex flex-col gap-3">
                    {section.tasks?.length === 0 ? (
                      <div className="text-sm text-gray-400 py-2">
                        {isRTL ? "لا توجد مهام في هذا القسم" : "No tasks in this section"}
                      </div>
                    ) : (
                      section.tasks?.map((task, i) => {
                        const sm = getStatusMeta(task.status);
                        const pm = getPriorityMeta(task.priority);
                        return (
                          <div
                            key={i}
                            className={`rp-task-card ${task.isOverdue ? "rp-task-overdue" : ""}`}
                          >
                            {/* row top */}
                            <div className="rp-task-top">
                              <span className="rp-task-index">{i + 1}</span>
                              <h3 className="rp-task-title">{safeValue(task.title)}</h3>
                              <span className={`rp-badge rp-status ${sm.cls}`}>
                                {sm.icon} {sm.label}
                              </span>
                            </div>

                            {/* row meta */}
                            <div className="rp-task-meta">
                              <span className={`rp-badge rp-priority ${pm.cls}`}>
                                <Tag size={11} />
                                {isRTL ? "الأولوية:" : "Priority:"} {pm.label}
                              </span>

                              <span className="rp-badge rp-method">
                                {task.submissionMethod === "text"
                                  ? isRTL
                                    ? " نص"
                                    : " Text"
                                  : task.submissionMethod === "link"
                                    ? isRTL
                                      ? " رابط"
                                      : " Link"
                                    : isRTL
                                      ? " نص + رابط"
                                      : " Text + Link"}
                              </span>

                              {task.dueDate && (
                                <span
                                  className={`rp-badge rp-due ${task.isOverdue ? "rp-due-late" : ""}`}
                                >
                                  <CalendarDays size={11} />
                                  {isRTL ? "الموعد:" : "Due:"}{" "}
                                  {formatDate(task.dueDate)}
                                  {task.isOverdue &&
                                    (isRTL ? " ⚠ متأخر" : " ⚠ Overdue")}
                                </span>
                              )}
                            </div>

                            {/* assigned members */}
                            {task.assignedTo?.filter((n) => n && n !== "null null")
                              .length > 0 && (
                              <div className="rp-task-assigned">
                                <Users size={11} />
                                <span>{isRTL ? "المكلفون:" : "Assigned to:"}</span>
                                <span className="rp-assigned-names">
                                  {task.assignedTo
                                    .filter((n) => n && n !== "null null")
                                    .join(" · ")}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Roadmap / Todos ── */}
          {(data.todos?.length ?? 0) > 0 && (
            <div className="rp-summary">
              <h2 className="rp-section-title">
                {isRTL ? "خطة العمل" : "Project Roadmap"}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.5rem", marginTop: "0.5rem" }}>
                {["todo", "doing", "done"].map((st) => {
                  const items = (data.todos ?? []).filter((t) => t.status === st);
                  const labels = { todo: isRTL ? "قادم" : "To Do", doing: isRTL ? "جاري" : "In Progress", done: isRTL ? "تم" : "Done" };
                  const colors = { todo: "#6b7280", doing: "#d97706", done: "#059669" };
                  return (
                    <div key={st} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "0.5rem", breakInside: "avoid" }}>
                      <p style={{ fontSize: "0.65rem", fontWeight: 900, textTransform: "uppercase", color: colors[st], marginBottom: "0.35rem", letterSpacing: "0.05em" }}>
                        {labels[st]} ({items.length})
                      </p>
                      {items.map((t) => (
                        <div key={t._id} style={{ display: "flex", alignItems: "flex-start", gap: "0.3rem", marginBottom: "0.2rem" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors[st], flexShrink: 0, marginTop: 4 }} />
                          <span style={{ fontSize: "0.68rem", color: t.status === "done" ? "#9ca3af" : "#111827", textDecoration: t.status === "done" ? "line-through" : "none" }}>
                            {t.text}
                          </span>
                        </div>
                      ))}
                      {items.length === 0 && (
                        <p style={{ fontSize: "0.6rem", color: "#d1d5db" }}>{isRTL ? "لا يوجد" : "None"}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Summary ── */}
          <div className="rp-summary">
            <h2 className="rp-section-title">
              {content.summary || (isRTL ? "ملخص التقرير" : "Report Summary")}
            </h2>
            <div className="rp-summary-body">
              <p>
                {isRTL
                  ? `تم إنجاز ${data.completedTasks || 0} مهمة من أصل ${data.totalTasks || 0}، بنسبة إنجاز ${completionPct}%.`
                  : `${data.completedTasks || 0} out of ${data.totalTasks || 0} tasks completed — ${completionPct}% done.`}
              </p>
              {data.remainingTasks > 0 && (
                <p>
                  {isRTL
                    ? `لا تزال ${data.remainingTasks} مهمة بحاجة إلى إنجاز.`
                    : `${data.remainingTasks} task${data.remainingTasks > 1 ? "s" : ""} still need attention.`}
                </p>
              )}
              {data.overdueTasks > 0 && (
                <p className="rp-summary-warn">
                  ⚠{" "}
                  {isRTL
                    ? `${data.overdueTasks} مهمة متأخرة وتجاوزت موعد التسليم.`
                    : `${data.overdueTasks} task${data.overdueTasks > 1 ? "s" : ""} are overdue.`}
                </p>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="rp-footer">
            <p>
              {isRTL ? "تم إنشاء هذا التقرير بواسطة" : "Generated by"}{" "}
              <a
                href="https://final-step.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                FinalStep
              </a>
              {" · "}
              {dateString}
            </p>
          </div>
        </div>
      </div>
    </CheckUserRole>
  );
};

export default ReportPage;
