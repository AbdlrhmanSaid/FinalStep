import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { registerFonts } from "./pdfFonts";

registerFonts();

const isAr = (lang) => lang === "ar";
const font = (lang) => (isAr(lang) ? "NotoArabic" : "Roboto");

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
    headerProject: { fontSize: 13, color: "#c7d2fe", marginBottom: 2 },
    headerDate: { fontSize: 9, color: "#a5b4fc" },

    // Member card
    memberCard: {
      backgroundColor: "#ffffff",
      borderRadius: 8,
      padding: 14,
      marginBottom: 14,
      borderLeft: "4px solid #6366f1",
    },

    // Member header row
    memberHeaderRow: {
      flexDirection: isAr(lang) ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 10,
      paddingBottom: 8,
      borderBottom: "1px solid #e2e8f0",
    },
    memberName: {
      fontSize: 13,
      fontWeight: 700,
      color: "#1e293b",
      marginBottom: 2,
    },
    memberRole: { fontSize: 9, color: "#6366f1", fontWeight: 700 },
    memberEmail: { fontSize: 8, color: "#94a3b8" },

    // Rating
    ratingBox: { alignItems: isAr(lang) ? "flex-start" : "flex-end" },
    ratingLabel: { fontSize: 8, color: "#94a3b8", marginBottom: 3 },
    ratingStars: { fontSize: 16, color: "#fbbf24" },
    ratingNumber: { fontSize: 8, color: "#64748b", marginTop: 2 },

    // Tasks section
    tasksRow: {
      flexDirection: isAr(lang) ? "row-reverse" : "row",
      gap: 8,
      marginBottom: 8,
    },
    tasksBox: {
      flex: 1,
      backgroundColor: "#f8fafc",
      borderRadius: 5,
      padding: 8,
    },
    tasksBoxLabel: {
      fontSize: 9,
      fontWeight: 700,
      marginBottom: 5,
      paddingBottom: 3,
      borderBottom: "1px solid #e2e8f0",
    },
    taskItem: {
      fontSize: 8.5,
      color: "#374151",
      paddingVertical: 2,
      paddingLeft: 4,
    },
    noTask: { fontSize: 8, color: "#94a3b8", fontStyle: "italic" },

    // Notes
    notesBox: {
      backgroundColor: "#fffbeb",
      borderRadius: 5,
      padding: 8,
      borderLeft: "2px solid #f59e0b",
      marginTop: 6,
    },
    notesLabel: {
      fontSize: 8,
      fontWeight: 700,
      color: "#92400e",
      marginBottom: 3,
    },
    notesText: { fontSize: 9, color: "#78350f" },

    // Completion badge
    completionBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      alignSelf: "flex-start",
      marginTop: 4,
    },
    completionText: { fontSize: 8, fontWeight: 700 },

    // Footer
    footer: {
      marginTop: 20,
      paddingTop: 10,
      borderTop: "1px solid #e2e8f0",
      alignItems: "center",
    },
    footerText: { fontSize: 8, color: "#94a3b8" },
    footerBrand: { fontSize: 9, color: "#4f46e5", fontWeight: 700 },
  });

// ── Star renderer ──────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <Text style={{ fontSize: 14, color: "#fbbf24", letterSpacing: 2 }}>
      {Array.from({ length: 5 }, (_, i) => (i < rating ? "★" : "☆")).join("")}
    </Text>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TeamReportPDF({
  project,
  allMembers,
  tasks,
  evaluations,
  language,
  dateString,
  content,
  id,
}) {
  const S = buildStyles(language);
  const ar = isAr(language);

  return (
    <Document>
      <Page size="A4" style={S.page}>
        {/* Header */}
        <View style={S.header}>
          <Text style={S.headerTitle}>{content.title || "Team Report"}</Text>
          <Text style={S.headerProject}>{project.title}</Text>
          <Text style={S.headerDate}>{dateString}</Text>
        </View>

        {/* Members */}
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
          const overdueTasks = memberTasks.filter((t) => {
            if (!t.dueDate || t.status === "completed") return false;
            const due = new Date(t.dueDate);
            const now = new Date();
            return due < now && due.toDateString() !== now.toDateString();
          });

          const evalData = evaluations[member._id] || { rating: 0, notes: "" };
          const memberName =
            member.name && member.name !== "null null"
              ? member.name
              : member.email?.split("@")[0].replace(/[0-9]/g, "");

          const totalTasks = memberTasks.length;
          const completionRate =
            totalTasks > 0
              ? Math.round((completedTasks.length / totalTasks) * 100)
              : 0;

          const memberRole =
            project.customRoles?.[member._id] || (ar ? "عضو" : "Member");

          return (
            <View key={member._id} style={S.memberCard}>
              {/* Member header */}
              <View style={S.memberHeaderRow}>
                <View>
                  <Text style={S.memberName}>{memberName}</Text>
                  <Text style={S.memberRole}>{memberRole}</Text>
                  <Text style={S.memberEmail}>{member.email}</Text>

                  {/* Completion badge */}
                  <View
                    style={[
                      S.completionBadge,
                      {
                        backgroundColor:
                          completionRate >= 70
                            ? "#dcfce7"
                            : completionRate >= 40
                              ? "#fef3c7"
                              : "#fee2e2",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        S.completionText,
                        {
                          color:
                            completionRate >= 70
                              ? "#15803d"
                              : completionRate >= 40
                                ? "#92400e"
                                : "#dc2626",
                        },
                      ]}
                    >
                      {ar ? "نسبة الإنجاز:" : "Completion:"} {completionRate}%
                    </Text>
                  </View>
                </View>

                {/* Rating */}
                <View style={S.ratingBox}>
                  <Text style={S.ratingLabel}>
                    {content.rating || "Rating"}
                  </Text>
                  <Stars rating={evalData.rating} />
                  <Text style={S.ratingNumber}>{evalData.rating} / 5</Text>
                </View>
              </View>

              {/* Tasks 3-column */}
              <View style={S.tasksRow}>
                {/* Active */}
                <View style={S.tasksBox}>
                  <Text style={[S.tasksBoxLabel, { color: "#d97706" }]}>
                    {content.activeTasks || "Active"} ({activeTasks.length})
                  </Text>
                  {activeTasks.length > 0 ? (
                    activeTasks.map((t) => (
                      <Text key={t._id} style={S.taskItem}>
                        • {t.title}
                      </Text>
                    ))
                  ) : (
                    <Text style={S.noTask}>
                      {content.noActiveTasks || "None"}
                    </Text>
                  )}
                </View>

                {/* Completed */}
                <View style={S.tasksBox}>
                  <Text style={[S.tasksBoxLabel, { color: "#16a34a" }]}>
                    {content.completedTasks || "Completed"} (
                    {completedTasks.length})
                  </Text>
                  {completedTasks.length > 0 ? (
                    completedTasks.map((t) => (
                      <Text key={t._id} style={S.taskItem}>
                        ✓ {t.title}
                      </Text>
                    ))
                  ) : (
                    <Text style={S.noTask}>
                      {content.noCompletedTasks || "None"}
                    </Text>
                  )}
                </View>

                {/* Overdue */}
                <View style={[S.tasksBox, { backgroundColor: "#fff5f5" }]}>
                  <Text style={[S.tasksBoxLabel, { color: "#dc2626" }]}>
                    {ar ? "متأخرة" : "Overdue"} ({overdueTasks.length})
                  </Text>
                  {overdueTasks.length > 0 ? (
                    overdueTasks.map((t) => (
                      <Text
                        key={t._id}
                        style={[S.taskItem, { color: "#dc2626" }]}
                      >
                        ⚠ {t.title}
                      </Text>
                    ))
                  ) : (
                    <Text style={S.noTask}>{ar ? "لا يوجد" : "None"}</Text>
                  )}
                </View>
              </View>

              {/* Notes */}
              {evalData.notes ? (
                <View style={S.notesBox}>
                  <Text style={S.notesLabel}>{content.notes || "Notes"}</Text>
                  <Text style={S.notesText}>{evalData.notes}</Text>
                </View>
              ) : null}
            </View>
          );
        })}

        {/* Footer */}
        <View style={S.footer}>
          <Text style={S.footerText}>
            {ar ? "تم إنشاء هذا التقرير بواسطة " : "Generated by "}
            <Text style={S.footerBrand}>FinalStep</Text>
          </Text>
          <Text style={S.footerText}>www.finalstep.site</Text>
        </View>
      </Page>
    </Document>
  );
}
