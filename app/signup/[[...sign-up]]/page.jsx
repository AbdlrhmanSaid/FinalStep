"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import { translations } from "../../../lib/translations";
import { useEffect, useState } from "react";

export default function SignUpPage() {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || "en";
    const storedTheme = localStorage.getItem("theme") || "light";
    setLanguage(storedLanguage);
    setTheme(storedTheme);
  }, []);

  const t = translations[language].register;
  const isArabic = language === "ar";

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className={`w-11/12 min-w-[280px] max-w-lg space-y-8 p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div>
          <h2
            className={`mt-6 text-center text-2xl sm:text-3xl font-extrabold ${
              isArabic ? "font-arabic" : "font-sans"
            } ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            {t.title}
          </h2>
          <p
            className={`mt-2 text-center text-sm sm:text-base ${
              isArabic ? "font-arabic" : "font-sans"
            } ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            {t.subtitle}
          </p>
        </div>
        <SignUp
          appearance={{
            baseTheme: theme === "dark" ? dark : undefined,
            elements: {
              formButtonPrimary: `
                w-full text-sm sm:text-base
                ${
                  theme === "dark"
                    ? "bg-indigo-500 hover:bg-indigo-600"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }
                text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500
              `,
              card: "bg-transparent shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              formFieldInput:
                "w-full text-sm sm:text-base p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500",
              formFieldLabel: "text-sm sm:text-base",
            },
          }}
          path="/signup"
        />
        <div className="text-center">
          <p
            className={`text-sm sm:text-base ${
              isArabic ? "font-arabic" : "font-sans"
            } ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}
          >
            {t.loginLink}{" "}
            <Link
              href="/login"
              className={`font-medium ${
                theme === "dark"
                  ? "text-indigo-400 hover:text-indigo-300"
                  : "text-indigo-600 hover:text-indigo-500"
              }`}
            >
              {isArabic ? "تسجيل الدخول هنا" : "Log in here"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
