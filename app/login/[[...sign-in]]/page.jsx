"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import { translations } from "../../../lib/translations";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Safely access localStorage in the browser
    const storedLanguage = localStorage.getItem("language") || "en";
    const storedTheme = localStorage.getItem("theme") || "light";
    setLanguage(storedLanguage);
    setTheme(storedTheme);
  }, []);

  const t = translations[language].login;
  const isArabic = language === "ar";

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className={`max-w-md w-full space-y-8 p-8 rounded-xl shadow-lg ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div>
          <h2
            className={`mt-6 text-center text-3xl font-extrabold ${
              isArabic ? "font-arabic" : "font-sans"
            } ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            {t.title}
          </h2>
          <p
            className={`mt-2 text-center text-sm ${
              isArabic ? "font-arabic" : "font-sans"
            } ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            {t.subtitle}
          </p>
        </div>
        <SignIn
          appearance={{
            baseTheme: theme === "dark" ? dark : undefined,
            elements: {
              formButtonPrimary:
                theme === "dark"
                  ? "bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
              card: "bg-transparent shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
          }}
          path="/login"
        />
        <div className="text-center">
          <p
            className={`text-sm ${isArabic ? "font-arabic" : "font-sans"} ${
              theme === "dark" ? "text-gray-300" : "text-gray-900"
            }`}
          >
            {t.registerLink}{" "}
            <Link
              href="/signup"
              className={`font-medium ${
                theme === "dark"
                  ? "text-indigo-400 hover:text-indigo-300"
                  : "text-indigo-600 hover:text-indigo-500"
              }`}
            >
              {isArabic ? "سجل هنا" : "Register here"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
