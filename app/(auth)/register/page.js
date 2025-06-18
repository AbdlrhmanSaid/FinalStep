"use client";

import { useState, useEffect } from "react";
import Register from "@/components/auth/Register";
import { translations } from "@/lib/translations";

export default function RegisterPage() {
  const [language, setLanguage] = useState("en");
  const [mounted, setMounted] = useState(false);

  const t = translations[language];
  const isRTL = language === "ar";

  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = savedLanguage;
    }
  }, []);

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
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-800 ${
        isRTL ? "font-arabic" : ""
      }`}
    >
      <Register t={t.register} isRTL={isRTL} />
    </div>
  );
}
