"use client";

import { useAppContext } from "@/contexts/AppContext";
import { FileText, Star, Clock, CheckCircle, TrendingUp, Info, ArrowRight, MousePointerClick } from "lucide-react";
import Link from "next/link";

export default function TeamReportGuide() {
  const { isRTL } = useAppContext();

  const en = {
    title: "Team Reports & Evaluation Guide",
    subtitle: "Understand how FinalStep evaluates your team and how to generate comprehensive reports.",
    howItWorks: "How does the Smart Evaluation work?",
    evaluationDesc: "FinalStep uses an automated Smart Evaluation algorithm to calculate a performance score (out of 100%) for each team member based on several factors:",
    factors: [
      {
        icon: <Clock className="w-5 h-5 text-blue-500" />,
        title: "On-Time Delivery",
        desc: "Members are rewarded for submitting tasks before the deadline. Late submissions reduce this score."
      },
      {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        title: "Quality & Acceptance",
        desc: "The ratio of accepted tasks versus rejected tasks. High acceptance rates boost the overall score."
      },
      {
        icon: <Star className="w-5 h-5 text-yellow-500" />,
        title: "Task Priority Weight",
        desc: "Completing High-priority tasks yields more points than Medium or Low-priority tasks."
      },
      {
        icon: <TrendingUp className="w-5 h-5 text-violet-500" />,
        title: "Overall Completion",
        desc: "The total number of completed tasks relative to the total assigned tasks."
      }
    ],
    howToGenerate: "How to Generate a Team Report?",
    steps: [
      "Navigate to the Projects page from the main menu.",
      "Open the project you manage (you must be a Leader or Co-leader).",
      "Inside the project dashboard, locate the Actions menu.",
      "Click on the Team Report button to view and print the detailed performance analysis."
    ],
    cta: "Go to Projects",
  };

  const ar = {
    title: "دليل تقارير الفريق ونظام التقييم",
    subtitle: "افهم كيف تقوم المنصة بتقييم فريقك وكيفية استخراج تقارير أداء شاملة.",
    howItWorks: "كيف يتم التقييم الذكي؟",
    evaluationDesc: "تستخدم منصة FinalStep خوارزمية تقييم ذكية وتلقائية لحساب نسبة الأداء (من 100%) لكل عضو في الفريق بناءً على عدة عوامل رئيسية:",
    factors: [
      {
        icon: <Clock className="w-5 h-5 text-blue-500" />,
        title: "التسليم في الموعد",
        desc: "يُكافأ العضو على تسليم المهام قبل انتهاء الوقت. التسليم المتأخر يؤثر سلباً على التقييم."
      },
      {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        title: "الجودة والقبول",
        desc: "نسبة المهام المقبولة مقارنة بالمرفوضة. قلة رفض التسليمات ترفع من التقييم العام بشكل كبير."
      },
      {
        icon: <Star className="w-5 h-5 text-yellow-500" />,
        title: "أولوية المهام",
        desc: "إنجاز المهام ذات الأولوية (العالية) يمنح العضو نقاطاً أكثر بكثير من المهام العادية أو المنخفضة."
      },
      {
        icon: <TrendingUp className="w-5 h-5 text-violet-500" />,
        title: "معدل الإنجاز العام",
        desc: "إجمالي عدد المهام التي أتمها العضو بنجاح مقارنة بإجمالي المهام الموكلة إليه."
      }
    ],
    howToGenerate: "كيف تقوم باستخراج تقرير لفريقك؟",
    steps: [
      "اذهب إلى صفحة المشاريع (Projects) من القائمة الجانبية.",
      "قم بالدخول إلى المشروع الذي تديره (يجب أن تكون القائد أو مساعد القائد).",
      "داخل لوحة تحكم المشروع، ابحث عن قسم (الإجراءات / Actions).",
      "اضغط على زر (تقرير الفريق / Team Report) لعرض وطباعة التحليل المفصل."
    ],
    cta: "الذهاب إلى المشاريع",
  };

  const content = isRTL ? ar : en;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-linear-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-violet-200" />
          <h1 className="text-3xl font-bold mb-3">{content.title}</h1>
          <p className="text-indigo-100 max-w-2xl mx-auto text-lg">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Evaluation Criteria */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
                <Star className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {content.howItWorks}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {content.evaluationDesc}
            </p>

            <div className="space-y-6">
              {content.factors.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="shrink-0 mt-1 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    {factor.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {factor.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {factor.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to Generate */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {content.howToGenerate}
              </h2>
            </div>
            
            <div className="space-y-6 flex-1">
              {content.steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold shadow-sm">
                    {idx + 1}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 text-center">
              <Link 
                href="/dashboard/projects"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all active:scale-95 shadow-md shadow-blue-500/20"
              >
                <MousePointerClick className="w-5 h-5" />
                {content.cta}
                <ArrowRight className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
