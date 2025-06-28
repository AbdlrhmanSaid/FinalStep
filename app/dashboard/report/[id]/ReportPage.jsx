"use client";

import { useParams } from "next/navigation";
import { useProjectReport } from "../../../../hooks/projects/useProjectReport";
import ModernLoading from "../../../../components/Loading";
import { Printer } from "lucide-react";
import CheckUserRole from "../../../../lib/actions/checkUserRole";
import html2pdf from "html2pdf.js";
import { Button } from "../../../../components/ui/button";
import "./ReportPage.css"; // استيراد ملف CSS

const ReportPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useProjectReport(id);

  if (isLoading) return <ModernLoading />;

  if (error)
    return (
      <div className="error-message">فشل تحميل التقرير: {error.message}</div>
    );

  if (!data?.projectTitle)
    return <div className="error-message">لا توجد بيانات للمشروع</div>;

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
      await html2pdf().from(element).set(options).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <CheckUserRole projectId={id}>
      <div className="report-container">
        <Button onClick={handlePrint} className="print-button">
          <Printer size={18} />
          Print
        </Button>
        <div id="page" className="report-page">
          {/* عنوان التقرير */}
          <div className="report-header">
            <h1>تقرير المشروع</h1>
            <h2>{data.projectTitle}</h2>
          </div>

          {/* معلومات القائد */}
          <div className="leader-info">
            <h3>قائد المشروع:</h3>
            <p>{data.leader}</p>
          </div>

          {/* مساعدو القائد (إذا وجدوا) */}
          {data.coLeaders.length > 0 && (
            <div className="coleaders-info">
              <h3>مساعدو القائد:</h3>
              <p>{data.coLeaders.join("، ")}</p>
            </div>
          )}

          {/* إحصائيات المهام */}
          <div className="tasks-stats">
            <div className="stat-card total-tasks">
              <h4>إجمالي المهام</h4>
              <p>{data.totalTasks}</p>
            </div>
            <div className="stat-card completed-tasks">
              <h4>المهام المكتملة</h4>
              <p>{data.completedTasks}</p>
            </div>
            <div className="stat-card remaining-tasks">
              <h4>المهام المتبقية</h4>
              <p>{data.remainingTasks}</p>
            </div>
          </div>

          {/* قائمة المهام */}
          <div className="tasks-list">
            <h3>تفاصيل المهام</h3>
            <div className="tasks-container">
              {data.tasks.map((task, index) => (
                <div key={index} className="task-item">
                  <div className="task-header">
                    <h4>{task.title}</h4>
                    <span className={`status ${task.status}`}>
                      {task.status === "completed" ? "مكتمل" : "مفتوح"}
                    </span>
                  </div>

                  <div className="task-details">
                    <span className={`priority ${task.priority}`}>
                      أولوية:{" "}
                      {task.priority === "high"
                        ? "عالي"
                        : task.priority === "medium"
                        ? "متوسط"
                        : "منخفض"}
                    </span>

                    {task.assignedTo.length > 0 && (
                      <span className="assigned-to">
                        مسؤول: {task.assignedTo.join("، ")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ملخص التقرير */}
          <div className="report-summary">
            <h3>ملخص التقرير</h3>
            <p>
              نسبة الإنجاز:{" "}
              {Math.round((data.completedTasks / data.totalTasks) * 100)}%
            </p>
            {data.remainingTasks > 0 && (
              <p>هناك {data.remainingTasks} مهام تحتاج إلى متابعة.</p>
            )}
          </div>
        </div>
      </div>
    </CheckUserRole>
  );
};

export default ReportPage;
