"use client";

import { useAppContext } from "../../../contexts/AppContext";
import {
  LayoutDashboard,
  Folder,
  SquareArrowOutUpRight,
  ChartNoAxesColumn,
  CircleCheck,
  Mail,
  User,
} from "lucide-react";
import "./style.css";

export default function HowItWorksClient() {
  const { language, isRTL } = useAppContext();

  const t = {
    title: isRTL ? "كيف يعمل النظام" : "How the System Works",
    subtitle: isRTL
      ? "تعرف على كيفية التنقل في النظام واستخدام جميع الميزات المتاحة"
      : "A simple guide to navigate our platform and maximize your productivity.",

    overviewTitle: isRTL ? "نظرة عامة على النظام" : "System Overview",
    overviewText: isRTL
      ? "بعد تسجيل الدخول، سيتم نقلك إلى الصفحة الرئيسية التي تتيح لك الوصول الكامل إلى تفاصيل حسابك. من هناك، يمكنك متابعة المشاريع التي تديرها أو تشارك فيها، عرض المهام المكتملة، مراجعة الدعوات المعلقة، واستعراض ملخصات المشاريع والإجراءات السريعة."
      : "Once you log in, you'll be taken directly to the main dashboard. From here, you can easily access your account information, view all the projects you lead or contribute to, track completed tasks, and manage pending invitations.",

    projectsTitle: isRTL ? "صفحة المشاريع" : "Projects Page",
    projectsSubtitle: isRTL
      ? "يمكنك هنا رؤية جميع المشاريع التي تقودها أو تشارك فيها."
      : "Here you can see all your projects - both those you lead and those you join.",
    viewDetails: isRTL ? "عرض التفاصيل" : "View Details",
    viewDetailsDesc: isRTL
      ? "اضغط على أي مشروع لمشاهدة كافة تفاصيله"
      : "Click any project to see its full details",
    leaderTitle: isRTL ? "قائد المشروع" : "Project Leader",
    leaderDesc: isRTL
      ? "إذا كنت قائد المشروع: يمكنك تعديل الأقسام، دعوة الأعضاء، وحفظ التغييرات"
      : "If you lead the project: Edit sections, invite team members, and save changes",
    manageTitle: isRTL ? "إدارة المشاريع" : "Manage Projects",
    manageDesc: isRTL
      ? "لجميع المشاريع: متابعة التقدم، إنشاء تقارير، أو وضع علامة اكتمال"
      : "For all projects: View progress, generate reports, or mark as complete",
    projectsSummary: isRTL
      ? "كل ما تحتاجه لإدارة عملك، منظم في مكان واحد."
      : "Everything you need to manage your work, organized in one place.",

    invitationsTitle: isRTL ? "الدعوات" : "Invitations",
    invitationsText: isRTL
      ? "في هذه الصفحة، يمكنك مراجعة دعوات المشاريع المرسلة إليك، واختيار قبولها أو رفضها بنقرة واحدة فقط - مما يجعل التعاون سلسًا وسهلاً."
      : "On this page, you can review project invitations sent to you. Each invitation allows you to quickly accept or decline participation with a single click - making collaboration smooth and easy.",

    profileTitle: isRTL ? "الملف الشخصي" : "Profile Page",
    profileText: isRTL
      ? "صفحة ملفك الشخصي تعرض جميع بياناتك بشكل منظم وواضح في مكان واحد."
      : "Your profile keeps all your details neatly organized in one place.",
  };

  return (
    <>
      <div
        className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all ${
          isRTL ? "rtl" : "ltr"
        } py-16 px-4 sm:px-6 lg:px-8`}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          <section className="hiw-section mb-12">
            <div className="hiw-section-header">
              <div className="hiw-icon-wrapper blue">
                <LayoutDashboard className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="hiw-section-content">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  {t.overviewTitle}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t.overviewText}
                </p>
              </div>
            </div>
          </section>

          {/* صفحة المشاريع */}
          <section className="hiw-section mb-12">
            <div className="hiw-section-header">
              <div className="hiw-icon-wrapper yellow">
                <Folder className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
              </div>
              <div className="hiw-section-content">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  {t.projectsTitle}
                </h2>
                <p className="text-gray-100 dark:text-gray-300 mb-6">
                  {t.projectsSubtitle}
                </p>

                <div className="hiw-quick-actions">
                  <div className="hiw-action-card">
                    <div className="hiw-action-icon bg-blue-600">
                      <SquareArrowOutUpRight className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-medium mt-3 text-blue-400 dark:text-white">
                      {t.viewDetails}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>
                        {isRTL ? "اضغط على أي مشروع" : "Click any project"}
                      </strong>{" "}
                      {t.viewDetailsDesc}
                    </p>
                  </div>

                  <div className="hiw-action-card">
                    <div className="hiw-action-icon bg-purple-600">
                      <ChartNoAxesColumn className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-medium mt-3 text-blue-400 dark:text-white">
                      {t.leaderTitle}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>
                        {isRTL
                          ? "إذا كنت قائد المشروع:"
                          : "If you lead the project:"}
                      </strong>{" "}
                      {t.leaderDesc}
                    </p>
                  </div>

                  <div className="hiw-action-card">
                    <div className="hiw-action-icon bg-green-600">
                      <CircleCheck className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-medium mt-3 text-blue-400 dark:text-white">
                      {t.manageTitle}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>
                        {isRTL ? "لجميع المشاريع:" : "For all projects:"}
                      </strong>{" "}
                      {t.manageDesc}
                    </p>
                  </div>
                </div>

                <div className="hiw-guide-summary mt-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                  <p className="text-center text-gray-700 dark:text-gray-300 font-medium">
                    {t.projectsSummary}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* الدعوات */}
          <section className="hiw-section mb-12">
            <div className="hiw-section-header">
              <div className="hiw-icon-wrapper red">
                <Mail className="w-6 h-6 text-red-500 dark:text-red-400" />
              </div>
              <div className="hiw-section-content">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  {t.invitationsTitle}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t.invitationsText}
                </p>
              </div>
            </div>
          </section>

          {/* الملف الشخصي */}
          <section className="hiw-section">
            <div className="hiw-section-header">
              <div className="hiw-icon-wrapper green">
                <User className="w-6 h-6 text-green-500 dark:text-green-400" />
              </div>
              <div className="hiw-section-content">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  {t.profileTitle}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t.profileText}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
