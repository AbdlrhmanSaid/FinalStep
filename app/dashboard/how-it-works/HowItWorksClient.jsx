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
  ListChecks,
  Settings,
  FileText,
  Search
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
      ? "بعد تسجيل الدخول، ستجد لوحة تحكم ذكية تعرض إحصائيات متقدمة. إذا كنت تقود مشاريع، ستظهر لك بطاقات مخصصة تعرض عدد المشاريع التي تديرها وطلبات الانضمام المعلقة للمراجعة السريعة. كما تعرض اللوحة ملخصاً لمهامك، مشاريعك الحالية، ومعدل الإنجاز العام بتصميم Bento Grid عصري."
      : "Once you log in, you'll see a smart dashboard with advanced statistics. For project leaders, dedicated cards display managed projects and pending join requests for quick review. The dashboard also shows a summary of your tasks, current projects, and overall completion rate in a modern Bento Grid design.",

    projectsTitle: isRTL ? "صفحة المشاريع" : "Projects Page",
    projectsSubtitle: isRTL
      ? "يمكنك رؤية جميع مشاريعك هنا. المشاريع التي تديرها وتنتظر انضمام أعضاء جدد ستظهر عليها علامة (Badge) تنبيه حمراء توضح عدد الطلبات المعلقة."
      : "View all your projects here. Projects you lead with pending join requests will display a red notification badge showing the request count.",
    viewDetails: isRTL ? "عرض التفاصيل" : "View Details",
    viewDetailsDesc: isRTL
      ? "اضغط على أي مشروع لمشاهدة كافة تفاصيله. تم تنظيم صفحة التفاصيل بأقسام جانبية قابلة للطي (Collapsible) لتوفير مساحة عمل منظمة."
      : "Click any project to see its full details. The details page is organized with collapsible sidebar sections for a clean workspace.",
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

    tasksTitle: isRTL ? "مهام الفريق" : "Team Tasks",
    tasksText: isRTL
      ? "تتيح لك هذه الصفحة عرض جميع المهام الموكلة إليك بوضوح. يمكنك تسليم مهامك، وتتبع حالتها، وإعادة التعديل على التسليمات حتى لو تم قبولها مسبقاً من القائد، كما يدعم النظام تسليم المهام حتى بعد انتهاء الوقت المحدد (مع احتساب التأخير)."
      : "This page allows you to view all your assigned tasks clearly. You can submit your work, track its status, and even reopen/edit submissions after they've been accepted. The system also supports late submissions seamlessly (while tracking the delay).",

    reportsTitle: isRTL ? "التقارير المتطورة" : "Advanced Reports",
    reportsText: isRTL
      ? "يوفر النظام تقارير ذكية وشاملة سواء للمشاريع أو أداء الفريق، مدعومة بأنظمة تقييم تلقائية (Smart Evaluate). تم تحديث نظام الطباعة للاعتماد على طباعة المتصفح للحصول على جودة فائقة وصيغة منظمة."
      : "The system provides smart, comprehensive reports for both projects and team performance, powered by automated evaluation algorithms. The printing system has been modernized to use native browser printing for superior quality.",

    profileTitle: isRTL ? "الملف الشخصي" : "Public Profile",
    profileText: isRTL
      ? "صفحة ملفك الشخصي تعرض بياناتك العامة، والمشاريع، والروابط المهنية الخاصة بك، لتمثل واجهتك لباقي أعضاء النظام."
      : "Your public profile showcases your details, projects, and professional links, acting as your identity to other system members.",

    settingsTitle: isRTL ? "إعدادات الحساب" : "Account Settings",
    settingsText: isRTL
      ? "تم فصل الإعدادات في صفحة مخصصة تتيح لك تعديل بياناتك الشخصية، الخصوصية، وتغيير كلمة المرور. إذا كنت قد سجلت دخولك عبر جوجل لأول مرة، يمكنك إعداد كلمة مرور محلية من هنا بكل سهولة."
      : "Settings are now in a dedicated page where you can update personal info, privacy, and passwords. If you signed in via Google initially, you can set up a local password here effortlessly.",

    searchTitle: isRTL ? "البحث الشامل" : "Global Search",
    searchText: isRTL
      ? "ابحث عن أي مشروع أو شخص في النظام بسهولة عبر صفحة البحث المركزية."
      : "Find any project or person in the system easily through the centralized search page.",
  };

  return (
    <>
      <div
        className={`min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all ${
          isRTL ? "rtl" : "ltr"
        } py-16 px-4 sm:px-6 lg:px-8`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

                <div className="hiw-guide-summary mt-8 bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
          <section className="hiw-section mb-12">
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

          {/* المهام */}
          <section className="hiw-section mb-12">
            <div className="hiw-section-header">
              <div className="hiw-icon-wrapper" style={{ backgroundColor: '#f97316' }}>
                <ListChecks className="w-6 h-6 text-white" />
              </div>
              <div className="hiw-section-content">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  {t.tasksTitle}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t.tasksText}
                </p>
              </div>
            </div>
          </section>

          {/* التقارير */}
          <section className="hiw-section mb-12">
            <div className="hiw-section-header">
              <div className="hiw-icon-wrapper" style={{ backgroundColor: '#8b5cf6' }}>
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="hiw-section-content">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  {t.reportsTitle}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t.reportsText}
                </p>
              </div>
            </div>
          </section>

          {/* الإعدادات */}
          <section className="hiw-section mb-12">
            <div className="hiw-section-header">
              <div className="hiw-icon-wrapper bg-gray-500">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="hiw-section-content">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  {t.settingsTitle}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t.settingsText}
                </p>
              </div>
            </div>
          </section>

          {/* البحث */}
          <section className="hiw-section">
            <div className="hiw-section-header">
              <div className="hiw-icon-wrapper" style={{ backgroundColor: '#14b8a6' }}>
                <Search className="w-6 h-6 text-white" />
              </div>
              <div className="hiw-section-content">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  {t.searchTitle}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t.searchText}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
