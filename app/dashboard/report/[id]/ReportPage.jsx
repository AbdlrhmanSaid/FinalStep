"use client";

import { useParams } from "next/navigation";
import { useProjectReport } from "../../../../hooks/projects/useProjectReport";
import ModernLoading from "../../../../components/Loading";
import { Printer } from "lucide-react";
import CheckUserRole from "../../../../lib/actions/checkUserRole";
import { Button } from "../../../../components/ui/button";
import { useAppContext } from "../../../../contexts/AppContext";
import { translations } from "../../../../lib/translations";
import "./ReportPage.css";

const ReportPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useProjectReport(id);
  const { language } = useAppContext();
  const content = translations[language]?.dashboard?.report || {};

  if (isLoading) return <ModernLoading />;

  if (error)
    return (
      <div className="error-message">
        {content.errorLoading || "Error loading"}: {error.message}
      </div>
    );

  if (!data?.projectTitle)
    return <div className="error-message">{content.noData}</div>;

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

  const handlePrint = async () => {
    const element = document.getElementById("page");
    if (!element) return;

    const options = {
      margin: 1,
      filename: `${data.projectTitle}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf().from(element).set(options).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const safeValue = (val, fallback = "-") =>
    val === null || val === undefined || val === "null null" ? fallback : val;

  const getPriorityLabel = (priority) => {
    if (language === "ar") {
      if (priority === "high") return "عالي";
      if (priority === "medium") return "متوسط";
      return "منخفض";
    } else {
      return priority?.charAt(0).toUpperCase() + priority?.slice(1);
    }
  };

  return (
    <CheckUserRole projectId={id}>
      <div className="report-container">
        <Button onClick={handlePrint} className="print-button">
          <Printer size={18} />
          {content.print}
        </Button>

        <div id="page" className="report-page">
          {/* عنوان التقرير */}
          <div className="report-header">
            <h1>{content.title}</h1>
            <h2>{safeValue(data.projectTitle)}</h2>
            <p
              className="report-date"
              style={{
                color: "#555",
                marginTop: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              {dateString}
            </p>
          </div>

          {/* معلومات القائد */}
          <div className="leader-info">
            <h3>{content.leader}</h3>
            <p>{safeValue(data.leader)}</p>
          </div>

          {/* مساعدو القائد */}
          {data.coLeaders?.filter((n) => n && n !== "null null").length > 0 && (
            <div className="coleaders-info">
              <h3>{content.coLeaders}</h3>
              <p>
                {data.coLeaders
                  .filter((n) => n && n !== "null null")
                  .join("، ")}
              </p>
            </div>
          )}

          {/* الإحصائيات */}
          <div className="tasks-stats">
            <div className="stat-card total-tasks">
              <h4>{content.totalTasks}</h4>
              <p>{data.totalTasks || 0}</p>
            </div>
            <div className="stat-card completed-tasks">
              <h4>{content.completedTasks}</h4>
              <p>{data.completedTasks || 0}</p>
            </div>
            <div className="stat-card remaining-tasks">
              <h4>{content.remainingTasks}</h4>
              <p>{data.remainingTasks || 0}</p>
            </div>
          </div>

          {/* المهام */}
          <div className="tasks-list">
            <h3>{content.taskDetails}</h3>
            <div className="tasks-container">
              {data.tasks?.map((task, index) => (
                <div key={index} className="task-item">
                  <div className="task-header">
                    <h4>{safeValue(task.title)}</h4>
                    <span className={`status ${task.status}`}>
                      {task.status === "completed"
                        ? content.statusCompleted
                        : content.statusOpen}
                    </span>
                  </div>

                  <div className="task-details">
                    <span className={`priority ${task.priority}`}>
                      {content.priority}: {getPriorityLabel(task.priority)}
                    </span>
                    {task.assignedTo?.length > 0 && (
                      <span className="assigned-to">
                        {content.assignedTo}:{" "}
                        {task.assignedTo
                          .filter((n) => n && n !== "null null")
                          .join("، ")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ملخص التقرير */}
          <div className="report-summary">
            <h3>{content.summary}</h3>
            <p>
              {content.progress}:{" "}
              {data.totalTasks > 0
                ? `${Math.round(
                    (data.completedTasks / data.totalTasks) * 100,
                  )}%`
                : "0%"}
            </p>
            {data.remainingTasks > 0 && (
              <p>{content.remainingMessage(data.remainingTasks)}</p>
            )}
          </div>

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
};

export default ReportPage;
