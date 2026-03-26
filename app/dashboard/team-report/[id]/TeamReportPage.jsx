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
  BarChart3,
  Users,
  TrendingUp,
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

  const [evaluations, setEvaluations] = useState({});
  const [isPrinting, setIsPrinting] = useState(false);

  const handleRefresh = () => {
    refetchProject();
    if (refetchTasks) refetchTasks();
  };
  const isRefetching = isProjectFetching || isTasksFetching;

  if (isProjectLoading || isTasksLoading) return <Loading />;
  if (!project)
    return <div className="tr-error">Error loading project data</div>;

  // ── helpers ──────────────────────────────────────────────
  const coLeaderIds = new Set((project.coLeaders || []).map((u) => u._id));
  const uniqueMembers = (project.members || []).filter(
    (u) => !coLeaderIds.has(u._id),
  );
  const allMembers = uniqueMembers.map((u) => ({ ...u, _role: "member" }));

  const today = new Date();
  const dateString = today.toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getMemberEffectiveStatus = (task, memberId) => {
    if (!task.memberSubmissions?.length) return task.status;
    const mySub = task.memberSubmissions.find(
      (s) => (s.userId?._id || s.userId)?.toString() === memberId?.toString(),
    );
    return mySub ? mySub.status : task.status;
  };

  const getMemberStats = (member) => {
    const memberTasks =
      tasks?.filter(
        (t) =>
          t.projectId?._id === id &&
          t.assignedTo?.some((u) => u._id === member._id),
      ) || [];

    const completed = memberTasks.filter(
      (t) => getMemberEffectiveStatus(t, member._id) === "completed",
    );
    const submitted = memberTasks.filter(
      (t) => getMemberEffectiveStatus(t, member._id) === "submitted",
    );
    const active = memberTasks.filter(
      (t) => !["completed"].includes(getMemberEffectiveStatus(t, member._id)),
    );
    const overdue = memberTasks.filter((t) => {
      const s = getMemberEffectiveStatus(t, member._id);
      return (
        t.dueDate &&
        s !== "completed" &&
        s !== "submitted" &&
        isBefore(new Date(t.dueDate), new Date()) &&
        !isToday(new Date(t.dueDate))
      );
    });

    const pct =
      memberTasks.length > 0
        ? Math.round((completed.length / memberTasks.length) * 100)
        : 0;
    return { total: memberTasks, completed, submitted, active, overdue, pct };
  };

  const handleAutoEvaluate = () => {
    const next = { ...evaluations };
    allMembers.forEach((member) => {
      const { total, completed, overdue } = getMemberStats(member);
      if (total.length === 0) {
        next[member._id] = {
          rating: 0,
          notes: isRTL ? "ليس لديه مهام" : "No tasks assigned",
        };
        return;
      }
      const rate = completed.length / total.length;
      let rating =
        rate >= 0.9
          ? 5
          : rate >= 0.7
            ? 4
            : rate >= 0.5
              ? 3
              : rate >= 0.3
                ? 2
                : rate > 0
                  ? 1
                  : 0;
      const pct = Math.round(rate * 100);
      let notes = isRTL ? `نسبة الإنجاز: ${pct}%` : `Completion Rate: ${pct}%`;
      if (overdue.length > 0) {
        notes += isRTL
          ? ` · ${overdue.length} مهام متأخرة`
          : ` · ${overdue.length} overdue`;
        if (rating > 1) rating -= 1;
      }
      next[member._id] = { rating, notes };
    });
    setEvaluations(next);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  const updateEvaluation = (memberId, field, value) =>
    setEvaluations((prev) => ({
      ...prev,
      [memberId]: { ...prev[memberId], [field]: value },
    }));

  const getMemberName = (m) =>
    m.name && m.name !== "null null"
      ? m.name
      : m.email?.split("@")[0].replace(/[0-9]/g, "");

  // ── summary totals ────────────────────────────────────────
  const totalCompleted = allMembers.reduce(
    (acc, m) => acc + getMemberStats(m).completed.length,
    0,
  );
  const totalTasks = allMembers.reduce(
    (acc, m) => acc + getMemberStats(m).total.length,
    0,
  );
  const totalOverdue = allMembers.reduce(
    (acc, m) => acc + getMemberStats(m).overdue.length,
    0,
  );
  const teamPct =
    totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  return (
    <CheckUserRole projectId={id}>
      <div className="tr-container" dir={isRTL ? "rtl" : "ltr"}>
        {/* ── Action bar ── */}
        <div className="tr-actions no-print">
          <Button
            onClick={handlePrint}
            disabled={isPrinting}
            className="tr-btn tr-btn-print"
          >
            <Printer size={16} className={isPrinting ? "animate-pulse" : ""} />
            {isPrinting
              ? isRTL
                ? "جارٍ الإنشاء..."
                : "Generating..."
              : content.print}
          </Button>
          <Button onClick={handleAutoEvaluate} className="tr-btn tr-btn-eval">
            <Star size={16} />
            {isRTL ? "تقييم آلي" : "Auto Evaluate"}
          </Button>
          <Button
            onClick={handleRefresh}
            disabled={isRefetching}
            className="tr-btn tr-btn-refresh"
          >
            <RefreshCw
              size={16}
              className={isRefetching ? "animate-spin" : ""}
            />
            {isRTL ? "تحديث" : "Refresh"}
          </Button>
        </div>

        {/* ── Print settings hint ── */}
        <div className="tr-print-hint no-print">
          <div className="tr-hint-body">
            <p className="tr-hint-title">
              {isRTL
                ? "إعدادات الطباعة الصحيحة:"
                : "Recommended print settings:"}
            </p>
            <ul className="tr-hint-list">
              <li>
                <span className="tr-hint-key">
                  {isRTL ? "الوجهة" : "Destination"}
                </span>{" "}
                → <span className="tr-hint-val">Save as PDF</span>
              </li>
              <li>
                <span className="tr-hint-key">
                  {isRTL ? "الصفحات" : "Pages"}
                </span>{" "}
                → <span className="tr-hint-val">{isRTL ? "الكل" : "All"}</span>
              </li>
              <li>
                <span className="tr-hint-key">
                  {isRTL ? "صفحات لكل ورقة" : "Pages per sheet"}
                </span>{" "}
                → <span className="tr-hint-val">1</span>
              </li>
              <li>
                <span className="tr-hint-key">
                  {isRTL ? "الهوامش" : "Margins"}
                </span>{" "}
                →{" "}
                <span className="tr-hint-val">
                  {isRTL ? "افتراضي" : "Default"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ══════════════ PRINTABLE PAGE ══════════════ */}
        <div id="team-report-page" className="tr-page">
          {/* ── Header ── */}
          <div className="tr-header">
            <div className="tr-header-badge">
              {isRTL ? "تقرير الفريق" : "Team Report"}
            </div>
            <h1 className="tr-project-title">{project.title}</h1>
            <p className="tr-date">{dateString}</p>
          </div>

          {/* ── Team overview strip ── */}
          <div className="tr-overview">
            <div className="tr-ov-item">
              <Users size={20} className="tr-ov-icon" />
              <span className="tr-ov-num">{allMembers.length}</span>
              <span className="tr-ov-lbl">{isRTL ? "أعضاء" : "Members"}</span>
            </div>
            <div className="tr-ov-item">
              <CheckCircle size={20} className="tr-ov-icon tr-ov-green" />
              <span className="tr-ov-num tr-ov-green">{totalCompleted}</span>
              <span className="tr-ov-lbl">
                {isRTL ? "مهام مكتملة" : "Completed"}
              </span>
            </div>
            <div className="tr-ov-item">
              <AlertCircle size={20} className="tr-ov-icon tr-ov-red" />
              <span className="tr-ov-num tr-ov-red">{totalOverdue}</span>
              <span className="tr-ov-lbl">{isRTL ? "متأخرة" : "Overdue"}</span>
            </div>
            <div className="tr-ov-item">
              <TrendingUp size={20} className="tr-ov-icon tr-ov-purple" />
              <span className="tr-ov-num tr-ov-purple">{teamPct}%</span>
              <span className="tr-ov-lbl">
                {isRTL ? "نسبة الفريق" : "Team Rate"}
              </span>
            </div>
          </div>

          {/* ── Team progress bar ── */}
          <div className="tr-team-progress">
            <div className="tr-tp-header">
              <span>
                <BarChart3 size={14} />{" "}
                {isRTL ? "إنجاز الفريق الكلي" : "Overall Team Progress"}
              </span>
              <span className="tr-tp-pct">{teamPct}%</span>
            </div>
            <div className="tr-tp-track">
              <div className="tr-tp-fill" style={{ width: `${teamPct}%` }} />
            </div>
          </div>

          {/* ── Members ── */}
          {allMembers.length === 0 ? (
            <p className="tr-no-members">{content.noMembers}</p>
          ) : (
            <div className="tr-members">
              {allMembers.map((member) => {
                const stats = getMemberStats(member);
                const evalData = evaluations[member._id] || {
                  rating: 0,
                  notes: "",
                };
                const name = getMemberName(member);

                return (
                  <div key={member._id} className="tr-member-card">
                    {/* ── Card header ── */}
                    <div className="tr-member-header">
                      <div className="tr-member-avatar">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div className="tr-member-info">
                        <h3 className="tr-member-name">{name}</h3>
                        <p className="tr-member-role">
                          {project.customRoles?.[member._id] ||
                            (isRTL ? "عضو" : "Member")}
                        </p>
                        <p className="tr-member-email">{member.email}</p>
                      </div>
                      {/* rating stars */}
                      <div className="tr-stars no-print">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() =>
                              updateEvaluation(member._id, "rating", s)
                            }
                            className="tr-star-btn"
                          >
                            <Star
                              size={20}
                              color={
                                s <= evalData.rating ? "#f59e0b" : "#d1d5db"
                              }
                              fill={
                                s <= evalData.rating ? "#f59e0b" : "transparent"
                              }
                            />
                          </button>
                        ))}
                      </div>
                      {/* rating print-only */}
                      <div className="tr-stars-print print-only">
                        {"★".repeat(evalData.rating)}
                        {"☆".repeat(5 - evalData.rating)}
                      </div>
                    </div>

                    {/* ── Member progress bar ── */}
                    <div className="tr-member-progress">
                      <div className="tr-mp-row">
                        <span>{isRTL ? "نسبة الإنجاز" : "Completion"}</span>
                        <span className="tr-mp-pct">{stats.pct}%</span>
                      </div>
                      <div className="tr-mp-track">
                        <div
                          className="tr-mp-fill"
                          style={{
                            width: `${stats.pct}%`,
                            background:
                              stats.pct >= 70
                                ? "#059669"
                                : stats.pct >= 40
                                  ? "#d97706"
                                  : "#dc2626",
                          }}
                        />
                      </div>
                    </div>

                    {/* ── Stats mini ── */}
                    <div className="tr-mini-stats">
                      <div className="tr-mini-stat tr-ms-total">
                        <span className="tr-ms-num">{stats.total.length}</span>
                        <span className="tr-ms-lbl">
                          {isRTL ? "الكل" : "Total"}
                        </span>
                      </div>
                      <div className="tr-mini-stat tr-ms-done">
                        <span className="tr-ms-num">
                          {stats.completed.length}
                        </span>
                        <span className="tr-ms-lbl">
                          {isRTL ? "منجزة" : "Done"}
                        </span>
                      </div>
                      <div className="tr-mini-stat tr-ms-sub">
                        <span className="tr-ms-num">
                          {stats.submitted.length}
                        </span>
                        <span className="tr-ms-lbl">
                          {isRTL ? "مسلمة" : "Submitted"}
                        </span>
                      </div>
                      <div className="tr-mini-stat tr-ms-over">
                        <span className="tr-ms-num">
                          {stats.overdue.length}
                        </span>
                        <span className="tr-ms-lbl">
                          {isRTL ? "متأخرة" : "Overdue"}
                        </span>
                      </div>
                    </div>

                    {/* ── Tasks breakdown ── */}
                    <div className="tr-tasks-grid">
                      {/* active */}
                      <div className="tr-tasks-box tr-tb-active">
                        <div className="tr-tb-head">
                          <Clock size={14} className="tr-tb-icon-active" />
                          <span>
                            {content.activeTasks ||
                              (isRTL ? "مهام نشطة" : "Active")}
                          </span>
                          <span className="tr-tb-count">
                            {stats.active.length}
                          </span>
                        </div>
                        <ul className="tr-tb-list">
                          {stats.active.length > 0 ? (
                            stats.active.map((t) => (
                              <li key={t._id}>{t.title}</li>
                            ))
                          ) : (
                            <li className="tr-empty">
                              {content.noActiveTasks ||
                                (isRTL ? "لا توجد" : "None")}
                            </li>
                          )}
                        </ul>
                      </div>
                      {/* completed */}
                      <div className="tr-tasks-box tr-tb-done">
                        <div className="tr-tb-head">
                          <CheckCircle size={14} className="tr-tb-icon-done" />
                          <span>
                            {content.completedTasks ||
                              (isRTL ? "مكتملة" : "Completed")}
                          </span>
                          <span className="tr-tb-count-done">
                            {stats.completed.length}
                          </span>
                        </div>
                        <ul className="tr-tb-list">
                          {stats.completed.length > 0 ? (
                            stats.completed.map((t) => (
                              <li key={t._id}>{t.title}</li>
                            ))
                          ) : (
                            <li className="tr-empty">
                              {content.noCompletedTasks ||
                                (isRTL ? "لا توجد" : "None")}
                            </li>
                          )}
                        </ul>
                      </div>
                      {/* overdue */}
                      <div className="tr-tasks-box tr-tb-over">
                        <div className="tr-tb-head">
                          <AlertCircle size={14} className="tr-tb-icon-over" />
                          <span>{isRTL ? "متأخرة" : "Overdue"}</span>
                          <span className="tr-tb-count-over">
                            {stats.overdue.length}
                          </span>
                        </div>
                        <ul className="tr-tb-list">
                          {stats.overdue.length > 0 ? (
                            stats.overdue.map((t) => (
                              <li key={t._id} className="tr-over-item">
                                {t.title}
                              </li>
                            ))
                          ) : (
                            <li className="tr-empty">
                              {isRTL ? "لا يوجد" : "None"}
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* ── Notes ── */}
                    <div className="tr-notes-wrap">
                      <label className="tr-notes-label">
                        {content.notes || (isRTL ? "ملاحظات" : "Notes")}
                      </label>
                      <textarea
                        value={evalData.notes}
                        onChange={(e) =>
                          updateEvaluation(member._id, "notes", e.target.value)
                        }
                        placeholder={
                          content.writeNotes ||
                          (isRTL
                            ? "اكتب ملاحظاتك هنا..."
                            : "Write your notes...")
                        }
                        className="tr-notes-input no-print"
                      />
                      {/* print only notes */}
                      {evalData.notes && (
                        <div className="tr-notes-print print-only">
                          {evalData.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Footer ── */}
          <div className="tr-footer">
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
}
