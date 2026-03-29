"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { translations } from "@/lib/translations";

export default function TermsPage() {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const t = translations[language] || translations["en"];
  const isRTL = language === "ar";

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const savedLanguage = localStorage.getItem("language");

    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    if (savedLanguage) {
      setLanguage(savedLanguage);
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLanguage;
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300 font-sans ${isRTL ? "rtl" : "ltr"}`}>
      <Navbar
        t={t.nav}
        isRTL={isRTL}
        isDark={isDark}
        language={language}
        isMenuOpen={isMenuOpen}
        toggleTheme={toggleTheme}
        toggleLanguage={toggleLanguage}
        setIsMenuOpen={setIsMenuOpen}
      />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-8">
          {isRTL ? "الشروط والأحكام" : "Terms of Service"}
        </h1>
        
        <div className="prose prose-blue dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6">
          <p className="text-lg leading-relaxed">
            {isRTL 
              ? "مرحباً بك في منصة FinalStep. يقصد بهذه الشروط القواعد الأساسية للاستفادة من المنصة وخدماتها." 
              : "Welcome to FinalStep. These terms govern your use of the platform and its services."}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
            {isRTL ? "1. قبول الشروط" : "1. Acceptance of Terms"}
          </h2>
          <p className="leading-relaxed">
            {isRTL
              ? "باستخدامك أو الوصولك إلى منصة FinalStep، أنت توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على أي جزء منها، يُرجى الامتناع عن استخدام المنصة."
              : "By using or accessing FinalStep, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, please discontinue using the platform."}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            {isRTL ? "2. حسابات المستخدمين" : "2. User Accounts"}
          </h2>
          <p className="leading-relaxed">
            {isRTL
              ? "أنت مسؤول عن الحفاظ على سرية حسابك وكلمة مرورك، وأنت المسؤول بالكامل عن كافة النشاطات التي تتم باستخدام حسابك. يُشترط تزويدنا بمعلومات دقيقة وكاملة للتسجيل."
              : "You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. Accurate and complete information is required for registration."}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            {isRTL ? "3. الاستخدام المقبول" : "3. Acceptable Use"}
          </h2>
          <p className="leading-relaxed">
            {isRTL
              ? "يُمنع استخدام المنصة لأي غرض غير قانوني أو ضار. المنصة مُخصصة لتبسيط إدارة المشاريع وحفظ المهام والتعاون الأكاديمي والمهني، وليس لتبادل المحتوى المسيء أو الخادع."
              : "You may not use the platform for any illegal or unauthorized purpose. The platform is designed for project management and professional/academic collaboration, not for exchanging harmful or deceitful content."}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            {isRTL ? "4. الإنهاء وإيقاف الخدمة" : "4. Termination"}
          </h2>
          <p className="leading-relaxed">
            {isRTL
              ? "نحتفظ بالحق في إنهاء أو تعليق وصولك إلى خدمتنا فورًا، دون إشعار مسبق أو مسؤولية، لأي سبب، بما في ذلك بدون حصر خرق الشروط."
              : "We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms."}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            {isRTL ? "5. التعديل على الشروط" : "5. Modification of Terms"}
          </h2>
          <p className="leading-relaxed">
            {isRTL
              ? "نحتفظ بالحق، وفقاً لتقديرنا الشخصي، في تعديل أو استبدال هذه الشروط في أي وقت. يشكل استمرارك في استخدام النظام بعد أي تعديلات قبولاً للشروط الجديدة."
              : "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. Your continued use of the platform constitutes acceptance of those changes."}
          </p>

          <p className="mt-12 text-sm text-gray-500 font-semibold">
            {isRTL ? "آخر تحديث: " : "Last updated: "} {new Date().toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </main>

      <Footer t={t} isRTL={isRTL} />
    </div>
  );
}
