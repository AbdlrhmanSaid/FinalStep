import { UserPlus, FolderPlus, ListChecks, BarChart3 } from "lucide-react";

export default function HowItWorks({ isRTL }) {
  const steps = isRTL
    ? [
        {
          icon: UserPlus,
          title: "سجّل حسابك",
          description: "أنشئ حسابك مجاناً في ثوانٍ باستخدام بريدك الإلكتروني أو حساب Google.",
        },
        {
          icon: FolderPlus,
          title: "أنشئ مشروعك",
          description: "حدد عنوان المشروع، الوصف، الموعد النهائي، وأضف أعضاء فريقك عبر الدعوات.",
        },
        {
          icon: ListChecks,
          title: "وزّع المهام وتابعها",
          description: "أنشئ مهام لكل عضو مع تحديد الأولويات والمواعيد. تابع التسليمات وراجعها لحظة بلحظة.",
        },
        {
          icon: BarChart3,
          title: "استخرج التقارير",
          description: "احصل على تقارير شاملة عن تقدم المشروع وأداء كل عضو مع تقييم ذكي أوتوماتيكي.",
        },
      ]
    : [
        {
          icon: UserPlus,
          title: "Create Your Account",
          description: "Sign up for free in seconds using your email or Google account.",
        },
        {
          icon: FolderPlus,
          title: "Set Up Your Project",
          description: "Define the title, description, deadline, and invite your team members via email.",
        },
        {
          icon: ListChecks,
          title: "Assign & Track Tasks",
          description: "Create tasks with priorities and due dates. Monitor submissions and review them in real-time.",
        },
        {
          icon: BarChart3,
          title: "Generate Reports",
          description: "Get comprehensive reports on project progress and smart automated team performance evaluations.",
        },
      ];

  return (
    <section className="landing-section bg-white dark:bg-gray-950">
      <div className="landing-container">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          {/* Left: Section Info */}
          <div className="lg:w-5/12">
            <div className="section-divider" />
            <h2 className="section-heading">
              {isRTL ? "كيف يعمل النظام؟" : "How It Works"}
            </h2>
            <p className="section-subheading">
              {isRTL
                ? "أربع خطوات بسيطة للبدء في إدارة مشاريعك وفريقك بكل سهولة واحترافية."
                : "Four simple steps to start managing your projects and team with ease and professionalism."}
            </p>
          </div>

          {/* Right: Steps */}
          <div className="lg:w-7/12 space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="step-item">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
