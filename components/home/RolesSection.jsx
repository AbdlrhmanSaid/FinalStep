import { Crown, ShieldCheck, User } from "lucide-react";

export default function RolesSection({ isRTL }) {
  const roles = isRTL
    ? [
        {
          icon: Crown,
          title: "القائد (Leader)",
          color: "#f59e0b",
          bgColor: "#fef3c7",
          darkBgColor: "rgba(245, 158, 11, 0.1)",
          permissions: [
            "إنشاء وتعديل وحذف المشروع",
            "إضافة وإزالة أعضاء الفريق",
            "إنشاء المهام وتعيينها للأعضاء",
            "مراجعة التسليمات (قبول / رفض)",
            "استخراج تقارير المشروع والفريق",
            "تعيين الأدوار (ترقية / تخفيض)",
          ],
        },
        {
          icon: ShieldCheck,
          title: "مساعد القائد (Co-Leader)",
          color: "#4f46e5",
          bgColor: "#eef2ff",
          darkBgColor: "rgba(79, 70, 229, 0.1)",
          permissions: [
            "تعديل معلومات المشروع",
            "إضافة أعضاء جدد ودعوتهم",
            "إنشاء المهام ومراجعة التسليمات",
            "قبول أو رفض طلبات الانضمام",
            "الوصول لتقارير المشروع والفريق",
          ],
        },
        {
          icon: User,
          title: "عضو (Member)",
          color: "#10b981",
          bgColor: "#d1fae5",
          darkBgColor: "rgba(16, 185, 129, 0.1)",
          permissions: [
            "عرض تفاصيل المشروع والمهام",
            "تسليم المهام المكلف بها",
            "إعادة التسليم بعد الرفض",
            "عرض حالة التسليم والمراجعة",
          ],
        },
      ]
    : [
        {
          icon: Crown,
          title: "Leader",
          color: "#f59e0b",
          bgColor: "#fef3c7",
          darkBgColor: "rgba(245, 158, 11, 0.1)",
          permissions: [
            "Create, edit, and delete the project",
            "Add and remove team members",
            "Create tasks and assign them to members",
            "Review submissions (accept / reject)",
            "Generate project and team reports",
            "Assign roles (promote / demote)",
          ],
        },
        {
          icon: ShieldCheck,
          title: "Co-Leader",
          color: "#4f46e5",
          bgColor: "#eef2ff",
          darkBgColor: "rgba(79, 70, 229, 0.1)",
          permissions: [
            "Edit project information",
            "Add new members and send invites",
            "Create tasks and review submissions",
            "Accept or reject join requests",
            "Access project and team reports",
          ],
        },
        {
          icon: User,
          title: "Member",
          color: "#10b981",
          bgColor: "#d1fae5",
          darkBgColor: "rgba(16, 185, 129, 0.1)",
          permissions: [
            "View project details and tasks",
            "Submit assigned tasks",
            "Re-submit after rejection",
            "View submission and review status",
          ],
        },
      ];

  return (
    <section className="landing-section bg-gray-50 dark:bg-gray-900/50">
      <div className="landing-container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="section-divider mx-auto" />
          <h2 className="section-heading">
            {isRTL ? "الأدوار والصلاحيات" : "Roles & Permissions"}
          </h2>
          <p className="section-subheading mx-auto">
            {isRTL
              ? "كل عضو في الفريق له دور واضح وصلاحيات محددة لضمان تنظيم العمل."
              : "Each team member has a clear role and defined permissions to keep everything organized."}
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <div
                key={index}
                className="feature-card"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `var(--role-bg, ${role.bgColor})`, color: role.color }}
                >
                  <style>{`
                    .dark [data-role-icon-${index}] { background-color: ${role.darkBgColor} !important; }
                  `}</style>
                  <div data-role-icon={index}>
                    <Icon className="w-6 h-6" strokeWidth={2} />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {role.title}
                </h3>

                <ul className="space-y-2">
                  {role.permissions.map((perm, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: role.color }}
                      />
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
