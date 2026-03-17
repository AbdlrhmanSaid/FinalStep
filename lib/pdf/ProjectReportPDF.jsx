import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { registerFonts } from "./pdfFonts";

registerFonts();

// ─── helpers ──────────────────────────────────────────────────────────────────
const isAr = (lang) => lang === "ar";
const font = (lang) => (isAr(lang) ? "NotoArabic" : "Roboto");

const safeValue = (val, fallback = "-") =>
  val === null || val === undefined || val === "null null" ? fallback : val;

const getPriorityLabel = (priority, lang) => {
  if (isAr(lang)) {
    if (priority === "high") return "عالي";
    if (priority === "medium") return "متوسط";
    return "منخفض";
  }
  return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : "-";
};

const getStatusLabel = (status, lang) => {
  if (isAr(lang)) return status === "completed" ? "مكتملة" : "قيد التنفيذ";
  return status === "completed" ? "Completed" : "Open";
};

const getPriorityColor = (priority) => {
  if (priority === "high") return "#dc2626";
  if (priority === "medium") return "#d97706";
  return "#16a34a";
};

// ─── styles ────────────────────────────────────────────────────────────────────
const buildStyles = (lang) =>
  StyleSheet.create({
    page: {
      fontFamily: font(lang),
      fontSize: 10,
      paddingHorizontal: 36,
      paddingVertical: 32,
      backgroundColor: "#f8fafc",
      direction: isAr(lang) ? "rtl" : "ltr",
    },

    // Header
    header: {
      backgroundColor: "#4f46e5",
      borderRadius: 8,
      padding: 20,
      marginBottom: 18,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 700,
      color: "#ffffff",
      marginBottom: 4,
    },
    headerProject: {
      fontSize: 13,
      color: "#c7d2fe",
      marginBottom: 2,
    },
    headerDate: {
      fontSize: 9,
      color: "#a5b4fc",
    },

    // Leader card
    leaderCard: {
      backgroundColor: "#fffbeb",
      borderRadius: 6,
      padding: 10,
      marginBottom: 12,
      borderLeft: "3px solid #f59e0b",
    },
    leaderTitle: {
      fontSize: 11,
      fontWeight: 700,
      color: "#92400e",
      marginBottom: 3,
    },
    leaderName: {
      fontSize: 10,
      color: "#78350f",
    },

    // Stats row
    statsRow: {
      flexDirection: isAr(lang) ? "row-reverse" : "row",
      gap: 8,
      marginBottom: 16,
    },
    statCard: {
      flex: 1,
      borderRadius: 6,
      padding: 10,
      alignItems: "center",
      gap: 4,
    },
    statLabel: {
      fontSize: 8,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    statValue: {
      fontSize: 22,
      fontWeight: 700,
    },

    // Section header
    sectionHeader: {
      fontSize: 12,
      fontWeight: 700,
      color: "#1e293b",
      marginBottom: 8,
      paddingBottom: 4,
      borderBottom: "1px solid #e2e8f0",
    },

    // Task card
    taskCard: {
      backgroundColor: "#ffffff",
      borderRadius: 5,
      padding: 9,
      marginBottom: 6,
      borderLeft: "3px solid #94a3b8",
      flexDirection: isAr(lang) ? "row-reverse" : "row",
      justifyContent: "space-between",
    },
    taskCardOverdue: {
      borderLeft: "3px solid #dc2626",
      backgroundColor: "#fff5f5",
    },
    taskCardCompleted: {
      borderLeft: "3px solid #16a34a",
      backgroundColor: "#f0fdf4",
    },
    taskTitle: {
      fontSize: 10,
      fontWeight: 700,
      color: "#1e293b",
      marginBottom: 3,
    },
    taskMeta: {
      fontSize: 8,
      color: "#64748b",
    },
    taskBadge: {
      fontSize: 8,
      fontWeight: 700,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 10,
      alignSelf: "flex-start",
    },

    // Summary
    summaryBox: {
      backgroundColor: "#eef2ff",
      borderRadius: 8,
      padding: 14,
      marginTop: 14,
      alignItems: "center",
    },
    summaryTitle: {
      fontSize: 12,
      fontWeight: 700,
      color: "#4338ca",
      marginBottom: 6,
    },
    summaryRate: {
      fontSize: 28,
      fontWeight: 700,
      color: "#4f46e5",
    },
    summaryNote: {
      fontSize: 9,
      color: "#6366f1",
      marginTop: 4,
    },

    // Footer
    footer: {
      marginTop: 20,
      paddingTop: 10,
      borderTop: "1px solid #e2e8f0",
      alignItems: "center",
    },
    footerText: {
      fontSize: 8,
      color: "#94a3b8",
    },
    footerBrand: {
      fontSize: 9,
      color: "#4f46e5",
      fontWeight: 700,
    },
  });

// ─── component ────────────────────────────────────────────────────────────────
export default function ProjectReportPDF({
  data,
  language,
  dateString,
  content,
}) {
  const S = buildStyles(language);
  const ar = isAr(language);
  const completionRate =
    data.totalTasks > 0
      ? Math.round((data.completedTasks / data.totalTasks) * 100)
      : 0;

  const coLeadersFiltered = (data.coLeaders || []).filter(
    (n) => n && n !== "null null",
  );

  return (
    <Document>
      <Page size="A4" style={S.page}>
        {/* ── Header ── */}
        <View style={S.header}>
          <Text style={S.headerTitle}>{content.title || "Project Report"}</Text>
          <Text style={S.headerProject}>{safeValue(data.projectTitle)}</Text>
          <Text style={S.headerDate}>{dateString}</Text>
        </View>

        {/* ── Leader ── */}
        <View style={S.leaderCard}>
          <Text style={S.leaderTitle}>{content.leader || "Leader"}</Text>
          <Text style={S.leaderName}>{safeValue(data.leader)}</Text>
        </View>

        {/* ── Co-Leaders if any ── */}
        {coLeadersFiltered.length > 0 && (
          <View style={[S.leaderCard, { borderLeftColor: "#8b5cf6" }]}>
            <Text style={[S.leaderTitle, { color: "#6d28d9" }]}>
              {content.coLeaders || "Co-Leaders"}
            </Text>
            <Text style={[S.leaderName, { color: "#5b21b6" }]}>
              {coLeadersFiltered.join("  •  ")}
            </Text>
          </View>
        )}

        {/* ── Stats ── */}
        <View style={S.statsRow}>
          <View style={[S.statCard, { backgroundColor: "#dbeafe" }]}>
            <Text style={[S.statLabel, { color: "#1d4ed8" }]}>
              {content.totalTasks || "Total"}
            </Text>
            <Text style={[S.statValue, { color: "#1d4ed8" }]}>
              {data.totalTasks || 0}
            </Text>
          </View>
          <View style={[S.statCard, { backgroundColor: "#dcfce7" }]}>
            <Text style={[S.statLabel, { color: "#15803d" }]}>
              {content.completedTasks || "Completed"}
            </Text>
            <Text style={[S.statValue, { color: "#15803d" }]}>
              {data.completedTasks || 0}
            </Text>
          </View>
          <View style={[S.statCard, { backgroundColor: "#fef3c7" }]}>
            <Text style={[S.statLabel, { color: "#92400e" }]}>
              {content.remainingTasks || "Remaining"}
            </Text>
            <Text style={[S.statValue, { color: "#92400e" }]}>
              {data.remainingTasks || 0}
            </Text>
          </View>
          <View style={[S.statCard, { backgroundColor: "#fee2e2" }]}>
            <Text style={[S.statLabel, { color: "#991b1b" }]}>
              {ar ? "متأخرة" : "Overdue"}
            </Text>
            <Text style={[S.statValue, { color: "#dc2626" }]}>
              {data.overdueTasks || 0}
            </Text>
          </View>
        </View>

        {/* ── Tasks ── */}
        <Text style={S.sectionHeader}>
          {content.taskDetails || "Tasks Overview"}
        </Text>

        {(data.tasks || []).map((task, i) => {
          const isCompleted = task.status === "completed";
          const cardStyle = isCompleted
            ? [S.taskCard, S.taskCardCompleted]
            : task.isOverdue
              ? [S.taskCard, S.taskCardOverdue]
              : [S.taskCard];

          const statusBadgeBg = isCompleted
            ? "#16a34a"
            : task.isOverdue
              ? "#dc2626"
              : "#64748b";

          return (
            <View key={i} style={cardStyle}>
              <View style={{ flex: 1 }}>
                <Text style={S.taskTitle}>{safeValue(task.title)}</Text>
                <Text style={S.taskMeta}>
                  {content.priority || "Priority"}:{" "}
                  {getPriorityLabel(task.priority, language)}
                </Text>
                {task.assignedTo?.length > 0 && (
                  <Text style={S.taskMeta}>
                    {content.assignedTo || "Assigned"}:{" "}
                    {task.assignedTo
                      .filter((n) => n && n !== "null null")
                      .join(", ")}
                  </Text>
                )}
                {task.dueDate && (
                  <Text
                    style={[
                      S.taskMeta,
                      { color: task.isOverdue ? "#dc2626" : "#64748b" },
                    ]}
                  >
                    {ar ? "الاستحقاق:" : "Due:"}{" "}
                    {new Date(task.dueDate).toLocaleDateString(
                      ar ? "ar-EG" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" },
                    )}
                  </Text>
                )}
              </View>
              <View>
                <Text
                  style={[
                    S.taskBadge,
                    { backgroundColor: statusBadgeBg, color: "#fff" },
                  ]}
                >
                  {getStatusLabel(task.status, language)}
                </Text>
              </View>
            </View>
          );
        })}

        {/* ── Summary ── */}
        <View style={S.summaryBox}>
          <Text style={S.summaryTitle}>
            {content.summary || "Report Summary"}
          </Text>
          <Text style={S.summaryRate}>{completionRate}%</Text>
          <Text style={S.summaryNote}>
            {content.progress || "Completion Rate"}
          </Text>
          {data.remainingTasks > 0 && (
            <Text style={[S.summaryNote, { color: "#dc2626", marginTop: 6 }]}>
              {ar
                ? `${data.remainingTasks} مهمة لم تكتمل بعد`
                : `${data.remainingTasks} tasks still need attention`}
            </Text>
          )}
        </View>

        {/* ── Footer ── */}
        <View style={S.footer}>
          <Text style={S.footerText}>
            {ar ? "تم إنشاء هذا التقرير بواسطة " : "Generated by "}
            <Text style={S.footerBrand}>FinalStep</Text>
          </Text>
          <Text style={S.footerText}>final-step.vercel.app</Text>
        </View>
      </Page>
    </Document>
  );
}
