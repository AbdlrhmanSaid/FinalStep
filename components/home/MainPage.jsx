"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import CTA from "./CTA";
import About from "./About";
import Contact from "./Contact";
import Footer from "./Footer";
import { translations } from "../../lib/translations";
import "./home.css";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const t = translations[language];
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
    <div
      className={`home-page-wrapper min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300  ${
        isRTL ? "font-arabic" : ""
      }`}
    >
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
      <Hero t={t.hero} isRTL={isRTL} />
      <Features t={t.features} isRTL={isRTL} />
      <CTA t={t.cta} isRTL={isRTL} />
      <About t={t.about} isRTL={isRTL} />
      <Contact t={t.contact} isRTL={isRTL} />
      <Footer t={t.footer} isRTL={isRTL} />
    </div>
  );
}
