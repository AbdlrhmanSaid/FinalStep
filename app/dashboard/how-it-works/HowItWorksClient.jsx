"use client";

import { useAppContext } from "../../../contexts/AppContext";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  FileBarChart,
  BotMessageSquare,
  ShieldCheck,
  Zap
} from "lucide-react";

export default function HowItWorksClient() {
  const { isRTL } = useAppContext();

  const content = {
    title: isRTL ? "كيف تعمل المنصة؟" : "How It Works?",
    subtitle: isRTL 
      ? "دليلك الشامل لإدارة مشاريعك وفريقك بذكاء واحترافية عبر FinalStep" 
      : "Your comprehensive guide to managing projects and teams smartly via FinalStep",
    
    features: [
      {
        id: "roles",
        icon: <ShieldCheck className="w-8 h-8 text-indigo-500" />,
        title: isRTL ? "الأدوار والصلاحيات" : "Roles & Permissions",
        color: "bg-indigo-50 dark:bg-indigo-500/10",
        borderColor: "border-indigo-100 dark:border-indigo-500/20",
        items: isRTL ? [
          "القائد (Leader): يملك كامل الصلاحيات لإنشاء المشروع، دعوة الأعضاء، إدارة الأقسام، وتعيين المهام.",
          "مساعد القائد (Co-Leader): يمتلك صلاحيات إدارية قوية لمساعدة القائد في مراجعة المهام وتوجيه الفريق.",
          "عضو الفريق (Member): يتلقى المهام، يسلم العمل المطلوب، ويتابع تقييمه الشخصي."
        ] : [
          "Leader: Has full permissions to create projects, invite members, manage sections, and assign tasks.",
          "Co-Leader: Has strong administrative permissions to help the leader review tasks and guide the team.",
          "Member: Receives tasks, submits required work, and tracks personal evaluation."
        ]
      },
      {
        id: "structure",
        icon: <FolderKanban className="w-8 h-8 text-blue-500" />,
        title: isRTL ? "هيكلة المشروع (الأقسام)" : "Project Structure (Sections)",
        color: "bg-blue-50 dark:bg-blue-500/10",
        borderColor: "border-blue-100 dark:border-blue-500/20",
        items: isRTL ? [
          "يمكن تقسيم المشروع الكبير إلى مجموعات عمل متخصصة تُسمى (أقسام / Sections).",
          "ينضم الأعضاء للأقسام التي تناسب تخصصاتهم، مما يسهل على الإدارة توجيه المهام للفريق الصحيح.",
          "يتم ربط عناصر خطة العمل (Roadmap) بالأقسام لتنظيم سير العمل."
        ] : [
          "Large projects can be divided into specialized workgroups called (Sections).",
          "Members join sections that fit their specialties, making it easier for management to assign tasks.",
          "Roadmap items are linked to sections to organize the workflow."
        ]
      },
      {
        id: "tasks",
        icon: <CheckCircle2 className="w-8 h-8 text-emerald-500" />,
        title: isRTL ? "إدارة وتسليم المهام" : "Task Management & Submissions",
        color: "bg-emerald-50 dark:bg-emerald-500/10",
        borderColor: "border-emerald-100 dark:border-emerald-500/20",
        items: isRTL ? [
          "كل عضو مكلف بمهمة يقوم بتسليم عمله (كنص أو روابط) بشكل مستقل عن زملائه.",
          "يقوم القائد بمراجعة التسليم: إما (قبول) ليتحول للمكتمل، أو (رفض) ليقوم العضو بتصحيحه وإعادة تسليمه.",
          "حتى بعد انتهاء موعد المهمة (Deadline)، يسمح النظام بالتسليم المتأخر (Late Submission) لضمان عدم توقف العمل، مع احتساب ذلك في التقييم."
        ] : [
          "Each assigned member submits their work (text or links) independently.",
          "The leader reviews the submission: either (Accept) to mark as completed, or (Reject) for the member to correct and resubmit.",
          "Even after the Deadline, the system allows Late Submissions to ensure work continues, which is factored into the evaluation."
        ]
      },
      {
        id: "evaluate",
        icon: <Award className="w-8 h-8 text-amber-500" />,
        title: isRTL ? "نظام التقييم الذكي (Smart Evaluate)" : "Smart Evaluate System",
        color: "bg-amber-50 dark:bg-amber-500/10",
        borderColor: "border-amber-100 dark:border-amber-500/20",
        items: isRTL ? [
          "يقوم النظام آلياً بتقييم أداء كل عضو بناءً على خوارزمية ذكية لا تتدخل فيها العواطف.",
          "سرعة الإنجاز (OnTime): هل تم تسليم المهمة قبل الموعد أم بتأخير؟ التسليم المتأخر يقلل النقاط.",
          "الجودة (Quality): تُقاس بقلة نسبة رفض القائد لتسليمات العضو.",
          "معدل الإنجاز (Completion): مقارنة عدد المهام المكتملة بالمهام المطلوبة."
        ] : [
          "The system automatically evaluates each member's performance based on a smart, unbiased algorithm.",
          "OnTime: Was the task submitted before the deadline or late? Late submissions reduce points.",
          "Quality: Measured by the low rejection rate of the member's submissions.",
          "Completion: Comparing completed tasks to total assigned tasks."
        ]
      },
      {
        id: "reports",
        icon: <FileBarChart className="w-8 h-8 text-rose-500" />,
        title: isRTL ? "التقارير المتقدمة والطباعة" : "Advanced Reports & Printing",
        color: "bg-rose-50 dark:bg-rose-500/10",
        borderColor: "border-rose-100 dark:border-rose-500/20",
        items: isRTL ? [
          "تقارير شاملة لأداء الفريق بالكامل توضح نقاط القوة والضعف.",
          "تقارير فردية لكل مستخدم توضح معدل تطوره ودرجات تقييمه التفصيلية.",
          "نظام طباعة مدمج واحترافي: يدعم استخراج التقارير كملفات PDF مرتبة بشكل ديناميكي لتوفير مساحات الورق."
        ] : [
          "Comprehensive team reports showing overall strengths and weaknesses.",
          "Individual reports for each user showing their progress and detailed evaluation scores.",
          "Built-in professional printing system: supports extracting reports as dynamically arranged PDF files to save paper."
        ]
      },
      {
        id: "ai",
        icon: <BotMessageSquare className="w-8 h-8 text-violet-500" />,
        title: isRTL ? "المساعد الذكي Steppi" : "Steppi AI Assistant",
        color: "bg-violet-50 dark:bg-violet-500/10",
        borderColor: "border-violet-100 dark:border-violet-500/20",
        items: isRTL ? [
          "يحتوي النظام على مساعد ذكي متواجد دائماً للإجابة على استفساراتك وتوجيهك داخل المنصة.",
          "Steppi يدرك سياق عملك: يعرف مشاريعك والمهام الموكلة إليك ويستطيع تقديم نصائح مخصصة لتنفيذها.",
          "يتعامل Steppi بصيغة توجيهية لرفع إنتاجيتك ويساعد القادة في كيفية إدارة فرق العمل بكفاءة."
        ] : [
          "The system features a built-in AI assistant always available to answer queries and guide you.",
          "Steppi is context-aware: it knows your projects and assigned tasks, providing personalized execution advice.",
          "Steppi acts as a mentor to boost your productivity and helps leaders manage teams efficiently."
        ]
      }
    ]
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? "rtl" : "ltr"} pb-24`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 bg-linear-to-br from-violet-500/10 via-transparent to-blue-500/10 dark:from-violet-500/5 dark:to-blue-500/5"></div>
        <div className="absolute top-0 -translate-y-12 rtl:-translate-x-1/3 ltr:translate-x-1/3 w-96 h-96 bg-violet-500/20 dark:bg-violet-500/10 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-violet-100 dark:bg-violet-900/30 rounded-2xl mb-6 shadow-xs border border-violet-200 dark:border-violet-800">
            <Zap className="w-8 h-8 text-violet-600 dark:text-violet-400" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
            {content.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {content.features.map((feature, idx) => (
            <div 
              key={feature.id}
              className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden`}
            >
              {/* Decorative background element */}
              <div className={`absolute top-0 ${isRTL ? "left-0" : "right-0"} w-32 h-32 ${feature.color} rounded-full blur-3xl opacity-50 -translate-y-1/2 ${isRTL ? "-translate-x-1/2" : "translate-x-1/2"} group-hover:opacity-70 transition-opacity`}></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${feature.borderColor} ${feature.color} transform group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {feature.title}
                </h3>
                
                <ul className="space-y-4">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mt-0.5 me-3">
                        <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400"></div>
                      </span>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Closing Call to action or quick tip */}
        <div className="mt-16 bg-linear-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
          <Sparkles className="w-12 h-12 text-violet-200 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4 relative z-10">
            {isRTL ? "مستعد لإدارة مشاريعك باحترافية؟" : "Ready to manage your projects like a pro?"}
          </h2>
          <p className="text-violet-100 text-lg max-w-2xl mx-auto relative z-10">
            {isRTL 
              ? "ابدأ الآن في إنشاء مشروعك الأول، واستعن بـ Steppi الذكي لتوجيهك في أي وقت تحتاج فيه للمساعدة." 
              : "Start by creating your first project now, and rely on smart Steppi to guide you whenever you need help."}
          </p>
        </div>
      </div>
    </div>
  );
}
