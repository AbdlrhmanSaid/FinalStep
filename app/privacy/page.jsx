"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { translations } from "@/lib/translations";

export default function PrivacyPage() {
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
          {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
        </h1>
        
        <div className="prose prose-blue dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6">
          <p className="text-lg leading-relaxed">
            {isRTL 
              ? "مرحباً بك في FinalStep. نحن نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية." 
              : "Welcome to FinalStep. We respect your privacy and are committed to protecting your personal data."}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4">
            {isRTL ? "1. المعلومات التي نجمعها" : "1. Information We Collect"}
          </h2>
          <p className="leading-relaxed">
            {isRTL
              ? "نجمع المعلومات التي تقدمها لنا مباشرة عند إنشاء حساب (الاسم، البريد الإلكتروني)، ومعلومات حول المشاريع والمهام التي تديرها عبر منصتنا لتحسين تجربتك."
              : "We collect information you provide directly to us when creating an account (name, email), and information about the projects and tasks you manage on our platform to enhance your experience."}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            {isRTL ? "2. كيف نستخدم معلوماتك" : "2. How We Use Your Information"}
          </h2>
          <ul className="list-disc pl-5 rtl:pr-5 rtl:pl-0 space-y-2 leading-relaxed">
            <li>{isRTL ? "لتوفير وصيانة وتحسين خدمات المنصة." : "To provide, maintain, and improve our services."}</li>
            <li>{isRTL ? "للتواصل معك وإرسال الإشعارات وتحديثات النظام." : "To communicate with you, send notifications and system updates."}</li>
            <li>{isRTL ? "لحماية أمان مستخدمينا وخدماتنا." : "To protect the security of our users and our services."}</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            {isRTL ? "3. مشاركة المعلومات" : "3. Information Sharing"}
          </h2>
          <p className="leading-relaxed">
            {isRTL
              ? "نحن لا نبيع أو نؤجر معلوماتك الشخصية لأي طرف ثالث. يتم مشاركة معلومات مثل اسمك وتقييمك ومشاريعك حصراً مع أعضاء فريقك والمشاريع التي تساهم بها وفقاً لإعدادات الخصوصية الخاصة بك."
              : "We do not sell or rent your personal information to any third party. Information such as your name, rating, and projects are only shared with your team members and projects you contribute to, according to your privacy settings."}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            {isRTL ? "4. أمان البيانات" : "4. Data Security"}
          </h2>
          <p className="leading-relaxed">
            {isRTL
              ? "نتخذ تدابير أمنية تقنية وتنظيمية قوية لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الاختراق. رغم ذلك، نود أن نلفت الانتباه إلى أنه لا توجد وسيلة نقل عبر الإنترنت آمنة 100%."
              : "We take robust technical and organizational security measures to protect your data from unauthorized access, modification, or breach. However, please be aware that no transmission method over the internet is 100% secure."}
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
