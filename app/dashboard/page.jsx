"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Navbar from "./components/Navbar";
import ProjectCard from "./components/ProjectCard";
import EmptyState from "./components/EmptyState";
import { translations } from "../../lib/translations";
import Link from "next/link";

// Sample project data
const sampleProjects = {
  leading: [
    {
      id: 1,
      title: "E-commerce Platform",
      description:
        "Building a modern e-commerce platform with React and Node.js",
      createdAt: "2024-01-15",
      tasks: 24,
      status: "active",
    },
    {
      id: 2,
      title: "Mobile App Design",
      description:
        "Designing user interface for a fitness tracking mobile application",
      createdAt: "2024-02-01",
      tasks: 12,
      status: "pending",
    },
  ],
  participating: [
    {
      id: 3,
      title: "Marketing Campaign",
      description: "Digital marketing campaign for product launch",
      createdAt: "2024-01-20",
      tasks: 8,
      status: "completed",
    },
    {
      id: 4,
      title: "Data Analytics Dashboard",
      description:
        "Creating comprehensive analytics dashboard for business insights",
      createdAt: "2024-02-10",
      tasks: 16,
      status: "active",
    },
  ],
};

const sampleProjectsAr = {
  leading: [
    {
      id: 1,
      title: "منصة التجارة الإلكترونية",
      description: "بناء منصة تجارة إلكترونية حديثة باستخدام React و Node.js",
      createdAt: "2024-01-15",
      tasks: 24,
      status: "active",
    },
    {
      id: 2,
      title: "تصميم تطبيق الهاتف المحمول",
      description: "تصميم واجهة المستخدم لتطبيق تتبع اللياقة البدنية",
      createdAt: "2024-02-01",
      tasks: 12,
      status: "pending",
    },
  ],
  participating: [
    {
      id: 3,
      title: "حملة تسويقية",
      description: "حملة تسويق رقمي لإطلاق المنتج",
      createdAt: "2024-01-20",
      tasks: 8,
      status: "completed",
    },
    {
      id: 4,
      title: "لوحة تحليل البيانات",
      description: "إنشاء لوحة تحليلات شاملة للحصول على رؤى الأعمال",
      createdAt: "2024-02-10",
      tasks: 16,
      status: "active",
    },
  ],
};

export default function Dashboard() {
  const [isRTL, setIsRTL] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [content, setContent] = useState(translations.en);
  const [projects, setProjects] = useState(sampleProjects);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedLanguage = localStorage.getItem("language");

    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    if (savedLanguage === "ar") {
      setIsRTL(true);
      setContent(translations.ar);
      setProjects(sampleProjectsAr);
      document.documentElement.setAttribute("dir", "rtl");
    }
  }, []);

  const toggleLanguage = () => {
    const newIsRTL = !isRTL;
    setIsRTL(newIsRTL);

    if (newIsRTL) {
      setContent(translations.ar);
      setProjects(sampleProjectsAr);
      document.documentElement.setAttribute("dir", "rtl");
      localStorage.setItem("language", "ar");
    } else {
      setContent(translations.en);
      setProjects(sampleProjects);
      document.documentElement.setAttribute("dir", "ltr");
      localStorage.setItem("language", "en");
    }
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div
      className={`min-h-screen bg-white dark:bg-gray-900 transition-colors ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <Navbar
        content={content}
        isRTL={isRTL}
        toggleLanguage={toggleLanguage}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      <main className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`text-center mb-12 `}>
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 `}
          >
            {content.dashboard.welcome.title}
          </h2>
          <p
            className={`text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto `}
          >
            {content.dashboard.welcome.subtitle}
          </p>
          <button
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-2xl text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md hover:shadow-lg transition-all duration-300 ${
              isRTL ? "rtl:flex-row-reverse" : ""
            }`}
          >
            <Plus className="w-5 h-5" />
            <Link
              href={"/dashboard/createProject"}
              className={`${isRTL ? "mr-2" : "ml-2"}`}
            >
              {content.dashboard.welcome.createButton}
            </Link>
          </button>
        </div>

        {/* Projects I'm Leading */}
        <section className="mb-12">
          <h2
            className={`text-2xl font-bold text-gray-900 dark:text-white mb-6 ${
              isRTL ? "rtl:text-right" : ""
            }`}
          >
            {content.dashboard.sections.leading}
          </h2>
          {projects.leading.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.leading.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  content={content.dashboard}
                  isRTL={isRTL}
                />
              ))}
            </div>
          ) : (
            <EmptyState content={content.dashboard} isRTL={isRTL} />
          )}
        </section>

        {/* Projects I'm Participating In */}
        <section>
          <h2
            className={`text-2xl font-bold text-gray-900 dark:text-white mb-6 ${
              isRTL ? "rtl:text-right" : ""
            }`}
          >
            {content.dashboard.sections.participating}
          </h2>
          {projects.participating.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.participating.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  content={content.dashboard}
                  isRTL={isRTL}
                />
              ))}
            </div>
          ) : (
            <EmptyState content={content.dashboard} isRTL={isRTL} />
          )}
        </section>
      </main>
    </div>
  );
}
