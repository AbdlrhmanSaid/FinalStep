"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetProject } from "../../../../hooks/projects/useGetProjects";
import { useGetTasks } from "../../../../hooks/tasks/useTasks";
import { useAppContext } from "../../../../contexts/AppContext";
import { translations } from "../../../../lib/translations";
import CheckUserRole from "../../../../lib/actions/checkUserRole";
import Loading from "@/components/Loading";
import { Button } from "../../../../components/ui/button";
import {
  Printer,
  Star,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  BarChart3,
  Users,
  TrendingUp,
  AlertTriangle,
  Award,
  Zap,
  Info,
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
  const [showAlgoInfo, setShowAlgoInfo] = useState(false);

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

  const getMemberSubmission = (task, memberId) => {
    if (!task.memberSubmissions?.length) return null;
    return task.memberSubmissions.find(
      (s) => (s.userId?._id || s.userId)?.toString() === memberId?.toString(),
    );
  };

  /**
   * Comprehensive evaluation algorithm:
   *
   * Score = (OnTime × 50) + (Completion × 30) + (Quality × 20) + PriorityBonus
   *
   * OnTime      — on-time completions = 1.0, late completions = 0.4 (60% penalty)
   * Completion  — completed = 1.0, submitted (pending) = 0.5
   * Quality     — 1 – (rejections / total submissions)
   * PriorityBonus — high=+5, medium=+2, capped at +10
   *
   * Stars: ≥90→5 | ≥75→4 | ≥55→3 | ≥35→2 | >0→1 | 0→0
   */
  const computeDetailedStats = (member) => {
    const memberTasks =
      tasks?.filter(
        (t) =>
          t.projectId?._id === id &&
          t.assignedTo?.some((u) => u._id === member._id),
      ) || [];

    if (memberTasks.length === 0) {
      return {
        total: [],
        completed: [],
        completedOnTime: [],
        completedLate: [],
        submitted: [],
        rejected: [],
        active: [],
        overdue: [],
        ended: [],
        score: 0,
        rating: 0,
        pct: 0,
        onTimePct: 0,
        qualityPct: 100,
        breakdownNotes: [],
      };
    }

    const completed = [],
      completedOnTime = [],
      completedLate = [];
    const submitted = [],
      rejected = [],
      active = [],
      overdue = [],
      ended = [];
    let totalRejections = 0,
      totalSubmissions = 0;

    memberTasks.forEach((t) => {
      const sub = getMemberSubmission(t, member._id);
      const effectiveStatus = sub
        ? sub.status
        : getMemberEffectiveStatus(t, member._id);

      if (effectiveStatus === "completed") {
        completed.push(t);
        const isLate = sub?.isLateSubmission === true || sub?.lateDays > 0;
        if (isLate)
          completedLate.push({ task: t, lateDays: sub?.lateDays || 0 });
        else completedOnTime.push(t);
      } else if (effectiveStatus === "submitted") {
        submitted.push(t);
      } else if (effectiveStatus === "rejected") {
        rejected.push(t);
      } else if (effectiveStatus === "ended") {
        ended.push(t);
      } else {
        active.push(t);
      }

      if (sub) {
        if (sub.status === "rejected") totalRejections++;
        if (["submitted", "completed", "rejected"].includes(sub.status))
          totalSubmissions++;
      }
    });

    const overdueList = memberTasks.filter((t) => {
      const s = getMemberEffectiveStatus(t, member._id);
      return (
        t.dueDate &&
        s !== "completed" &&
        s !== "submitted" &&
        isBefore(new Date(t.dueDate), new Date()) &&
        !isToday(new Date(t.dueDate))
      );
    });

    const total = memberTasks.length;
    const onTimeScore =
      (completedOnTime.length * 1.0 + completedLate.length * 0.4) / total;
    const completionScore =
      (completed.length * 1.0 + submitted.length * 0.5) / total;
    const qualityScore =
      totalSubmissions > 0
        ? Math.max(0, 1 - totalRejections / totalSubmissions)
        : 1;

    let priorityBonus = 0;
    completed.forEach((t) => {
      if (t.priority === "high") priorityBonus += 5;
      else if (t.priority === "medium") priorityBonus += 2;
    });
    priorityBonus = Math.min(priorityBonus, 10);

    const baseScore =
      onTimeScore * 50 + completionScore * 30 + qualityScore * 20;
    const finalScore = Math.min(100, Math.round(baseScore + priorityBonus));

    const pct = Math.round((completed.length / total) * 100);
    const breakdownNotes = [];
    breakdownNotes.push(
      isRTL ? `نسبة الإنجاز: ${pct}%` : `Completion: ${pct}%`,
    );
    if (completedOnTime.length > 0)
      breakdownNotes.push(
        isRTL
          ? `في الوقت: ${completedOnTime.length}`
          : `On-time: ${completedOnTime.length}`,
      );
    if (completedLate.length > 0)
      breakdownNotes.push(
        isRTL
          ? `متأخر: ${completedLate.length} (-60%)`
          : `Late: ${completedLate.length} (-60% each)`,
      );
    if (totalRejections > 0)
      breakdownNotes.push(
        isRTL
          ? `مرفوض ${totalRejections} مرة`
          : `${totalRejections} rejection(s)`,
      );
    if (priorityBonus > 0)
      breakdownNotes.push(
        isRTL
          ? `مكافأة أولوية: +${priorityBonus}`
          : `Priority bonus: +${priorityBonus}`,
      );

    return {
      total: memberTasks,
      completed,
      completedOnTime,
      completedLate,
      submitted,
      rejected,
      active,
      overdue: overdueList,
      ended,
      score: finalScore,
      pct,
      onTimePct: Math.round(onTimeScore * 100),
      qualityPct: Math.round(qualityScore * 100),
      breakdownNotes,
    };
  };

  const getMemberStats = (member) => computeDetailedStats(member);

  const handleAutoEvaluate = () => {
    const next = { ...evaluations };
    allMembers.forEach((member) => {
      const stats = computeDetailedStats(member);
      if (stats.total.length === 0) {
        next[member._id] = {
          notes: isRTL ? "ليس لديه مهام لتقييمها" : "No tasks assigned",
        };
        return;
      }
      next[member._id] = { notes: stats.breakdownNotes.join(" · ") };
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
  const totalLate = allMembers.reduce(
    (acc, m) => acc + getMemberStats(m).completedLate.length,
    0,
  );
  const teamPct =
    totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const getScoreColor = (score) =>
    score >= 75 ? "#059669" : score >= 50 ? "#d97706" : "#dc2626";

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
            <Zap size={16} />
            {isRTL ? "تقييم ذكي" : "Smart Evaluate"}
          </Button>
          <button
            className="tr-algo-info-btn no-print"
            onClick={() => setShowAlgoInfo((v) => !v)}
            title={isRTL ? "كيف يعمل التقييم؟" : "How does evaluation work?"}
          >
            <Info size={15} />
            {isRTL ? "آلية التقييم" : "How it works"}
          </button>
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

        {/* ── Algorithm info panel ── */}
        {showAlgoInfo && (
          <div className="tr-algo-panel no-print" dir={isRTL ? "rtl" : "ltr"}>
            <div className="tr-algo-panel-header">
              <Award size={18} />
              <span>
                {isRTL
                  ? "آلية احتساب التقييم الذكي"
                  : "Smart Evaluation Algorithm"}
              </span>
              <button
                onClick={() => setShowAlgoInfo(false)}
                className="tr-algo-close"
              >
                ✕
              </button>
            </div>
            <div className="tr-algo-body">
              <div className="tr-algo-row">
                <span className="tr-algo-weight tr-w-green">50%</span>
                <div>
                  <strong>
                    {isRTL ? "الالتزام بالمواعيد" : "On-Time Delivery"}
                  </strong>
                  <p>
                    {isRTL
                      ? "في الوقت = نقطة كاملة · متأخر = 0.4 فقط (خصم 60%)"
                      : "On-time = 1.0 pt · Late = 0.4 pt (60% penalty)"}
                  </p>
                </div>
              </div>
              <div className="tr-algo-row">
                <span className="tr-algo-weight tr-w-blue">30%</span>
                <div>
                  <strong>{isRTL ? "نسبة الإنجاز" : "Completion Rate"}</strong>
                  <p>
                    {isRTL
                      ? "مكتملة = نقطة · مسلمة (بانتظار) = 0.5 نقطة"
                      : "Completed = 1.0 pt · Submitted (pending) = 0.5 pt"}
                  </p>
                </div>
              </div>
              <div className="tr-algo-row">
                <span className="tr-algo-weight tr-w-orange">20%</span>
                <div>
                  <strong>
                    {isRTL ? "جودة التسليم" : "Submission Quality"}
                  </strong>
                  <p>
                    {isRTL
                      ? "كل رفض يخصم من درجة الجودة"
                      : "Each rejection reduces quality score proportionally"}
                  </p>
                </div>
              </div>
              <div className="tr-algo-row">
                <span className="tr-algo-weight tr-w-purple">+10</span>
                <div>
                  <strong>
                    {isRTL ? "مكافأة الأولوية" : "Priority Bonus"}
                  </strong>
                  <p>
                    {isRTL
                      ? "عالية = +5 · متوسطة = +2 (حد أقصى +10)"
                      : "High = +5 · Medium = +2 (max +10 bonus)"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Print hint ── */}
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

          {/* ── Overview strip ── */}
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
              <span className="tr-ov-lbl">
                {isRTL ? "لم تُسلَّم" : "Overdue"}
              </span>
            </div>
            <div className="tr-ov-item">
              <AlertTriangle size={20} className="tr-ov-icon tr-ov-amber" />
              <span className="tr-ov-num tr-ov-amber">{totalLate}</span>
              <span className="tr-ov-lbl">
                {isRTL ? "سُلِّمت متأخرة" : "Late Submit"}
              </span>
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
                const evalData = evaluations[member._id] || { notes: "" };
                const name = getMemberName(member);
                const scoreColor = getScoreColor(stats.score);

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

                      {/* Score badge */}
                      {stats.total.length > 0 && (
                        <div
                          className="tr-score-badge"
                          style={{ borderColor: scoreColor, color: scoreColor }}
                        >
                          <span className="tr-score-num">{stats.score}</span>
                          <span className="tr-score-label">
                            {isRTL ? "نقطة" : "pts"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ── Score breakdown bars ── */}
                    {stats.total.length > 0 && (
                      <div className="tr-score-breakdown">
                        <div className="tr-sb-item">
                          <span className="tr-sb-label">
                            {isRTL ? "الالتزام بالمواعيد" : "On-Time"}
                          </span>
                          <div className="tr-sb-track">
                            <div
                              className="tr-sb-fill tr-sb-green"
                              style={{ width: `${stats.onTimePct}%` }}
                            />
                          </div>
                          <span className="tr-sb-pct">{stats.onTimePct}%</span>
                        </div>
                        <div className="tr-sb-item">
                          <span className="tr-sb-label">
                            {isRTL ? "الإنجاز الكلي" : "Completion"}
                          </span>
                          <div className="tr-sb-track">
                            <div
                              className="tr-sb-fill tr-sb-blue"
                              style={{ width: `${stats.pct}%` }}
                            />
                          </div>
                          <span className="tr-sb-pct">{stats.pct}%</span>
                        </div>
                        <div className="tr-sb-item">
                          <span className="tr-sb-label">
                            {isRTL ? "جودة التسليم" : "Quality"}
                          </span>
                          <div className="tr-sb-track">
                            <div
                              className="tr-sb-fill tr-sb-purple"
                              style={{ width: `${stats.qualityPct}%` }}
                            />
                          </div>
                          <span className="tr-sb-pct">{stats.qualityPct}%</span>
                        </div>
                      </div>
                    )}

                    {/* ── Mini stats ── */}
                    <div className="tr-mini-stats">
                      <div className="tr-mini-stat tr-ms-total">
                        <span className="tr-ms-num">{stats.total.length}</span>
                        <span className="tr-ms-lbl">
                          {isRTL ? "الكل" : "Total"}
                        </span>
                      </div>
                      <div className="tr-mini-stat tr-ms-done">
                        <span className="tr-ms-num">
                          {stats.completedOnTime.length}
                        </span>
                        <span className="tr-ms-lbl">
                          {isRTL ? "في الوقت" : "On-Time"}
                        </span>
                      </div>
                      <div className="tr-mini-stat tr-ms-late">
                        <span className="tr-ms-num">
                          {stats.completedLate.length}
                        </span>
                        <span className="tr-ms-lbl">
                          {isRTL ? "متأخر" : "Late"}
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
                    {/* ── Tasks breakdown ── */}
                    {(stats.completedOnTime.length > 0 ||
                      stats.completedLate.length > 0 ||
                      stats.overdue.length > 0) && (
                      <div className="tr-tasks-grid">
                        {/* On-time */}
                        {stats.completedOnTime.length > 0 && (
                          <div className="tr-tasks-box tr-tb-active">
                            <div className="tr-tb-head">
                              <CheckCircle
                                size={14}
                                className="tr-tb-icon-done"
                              />
                              <span>{isRTL ? "في الوقت" : "On-Time"}</span>
                              <span className="tr-tb-count-done">
                                {stats.completedOnTime.length}
                              </span>
                            </div>
                            <ul className="tr-tb-list">
                              {stats.completedOnTime.map((t) => (
                                <li key={t._id}>{t.title}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {/* Late */}
                        {stats.completedLate.length > 0 && (
                          <div className="tr-tasks-box tr-tb-late">
                            <div className="tr-tb-head">
                              <AlertTriangle
                                size={14}
                                className="tr-tb-icon-late"
                              />
                              <span>
                                {isRTL ? "سُلِّم متأخراً" : "Late Submit"}
                              </span>
                              <span className="tr-tb-count-late">
                                {stats.completedLate.length}
                              </span>
                            </div>
                            <ul className="tr-tb-list">
                              {stats.completedLate.map(
                                ({ task: t, lateDays }) => (
                                  <li key={t._id} className="tr-late-item">
                                    {t.title}
                                    {lateDays > 0 && (
                                      <span className="tr-late-days">
                                        {" "}
                                        (+{lateDays}
                                        {isRTL ? "ي" : "d"})
                                      </span>
                                    )}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                        {/* Overdue */}
                        {stats.overdue.length > 0 && (
                          <div className="tr-tasks-box tr-tb-over">
                            <div className="tr-tb-head">
                              <AlertCircle
                                size={14}
                                className="tr-tb-icon-over"
                              />
                              <span>{isRTL ? "لم تُسلَّم" : "Overdue"}</span>
                              <span className="tr-tb-count-over">
                                {stats.overdue.length}
                              </span>
                            </div>
                            <ul className="tr-tb-list">
                              {stats.overdue.map((t) => (
                                <li key={t._id} className="tr-over-item">
                                  {t.title}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

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
