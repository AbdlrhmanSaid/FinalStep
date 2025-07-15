"use client";

import { useAppContext } from "../../../contexts/AppContext";
import { translations } from "../../../lib/translations";
import { Folder, ClipboardList, User, Mail } from "lucide-react";

export default function HowItWorks() {
  const { language, isRTL } = useAppContext();
  const content = translations[language];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all ${
        isRTL ? "rtl" : "ltr"
      } py-16 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {isRTL ? "كيف يعمل النظام" : "How the System Works"}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {isRTL
              ? "تعرف على كيفية التنقل في النظام واستخدام جميع الميزات المتاحة"
              : "Learn how to navigate the system and use all available features"}
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1: Overview */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 transition-all hover:shadow-xl">
            <div className="flex items-start gap-4 md:gap-6">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <ClipboardList className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  {isRTL ? "نظرة عامة على النظام" : "System Overview"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {isRTL
                    ? "بعد تسجيل الدخول، سيتم نقلك إلى الصفحة الرئيسية التي تتيح لك الوصول الكامل إلى تفاصيل حسابك. من هناك، يمكنك متابعة المشاريع التي تديرها أو تشارك فيها، عرض المهام المكتملة، مراجعة الدعوات المعلقة، واستعراض ملخصات المشاريع والإجراءات السريعة."
                    : "After logging in, you will be redirected to the main dashboard where you can access your account details. From there, you can view the projects you lead or participate in, track completed tasks, manage pending invitations, and explore project summaries and quick actions."}
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Projects Page */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 transition-all hover:shadow-xl">
            <div className="flex items-start gap-4 md:gap-6">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <Folder className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  {isRTL ? "صفحة المشاريع" : "Projects Page"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {isRTL
                    ? "من خلال هذه الصفحة، يمكنك استعراض المشاريع التي تقودها أو التي تم إضافتك كمشارك بها. عند الضغط على أي مشروع، ستُفتح صفحة تحتوي على كافة تفاصيله. إذا كنت القائد، ستظهر لك خيارات التحكم مثل تعديل المشروع، تعديل الأقسام المختلفة، إرسال دعوات، وحفظ التغييرات. كما يمكنك إنشاء تقرير عن المشروع، حذفه، أو وضع علامة على اكتماله."
                    : "From this page, you can view the projects you lead or are participating in. Clicking on any project will open a detailed view. If you are the project leader, you'll have access to controls such as editing project sections, sending invitations, and saving changes. You can also generate reports, delete the project, or mark it as completed."}
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Invitations */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 transition-all hover:shadow-xl">
            <div className="flex items-start gap-4 md:gap-6">
              <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <Mail className="w-6 h-6 text-red-500 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  {isRTL ? "الدعوات" : "Invitations"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {isRTL
                    ? "يمكنك من خلال صفحة الدعوات مراجعة الدعوات الخاصة بالمشاريع التي تم إرسالها إليك، واتخاذ القرار بقبولها أو رفضها بسهولة."
                    : "From the invitations page, you can review project invitations that have been sent to you, and choose to accept or reject them easily."}
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Profile Page */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 transition-all hover:shadow-xl">
            <div className="flex items-start gap-4 md:gap-6">
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <User className="w-6 h-6 text-green-500 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  {isRTL ? "الملف الشخصي" : "Profile Page"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {isRTL
                    ? "تعرض صفحة الملف الشخصي كافة بيانات المستخدم الخاصة بك بطريقة منظمة وواضحة."
                    : "The profile page presents all your user details in a clean and organized way."}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
