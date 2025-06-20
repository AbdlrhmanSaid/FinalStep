// ✅ AppContext.jsx (جاهز للاستخدام مع Clerk)
"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";

const AppContext = createContext();

export function AppProvider({ children, user }) {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  const [currentUser, setCurrentUser] = useState(user || null);

  const userId = useMemo(() => currentUser?._id ?? null, [currentUser]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedLanguage = localStorage.getItem("language") || "en";

    setTheme(savedTheme);
    setLanguage(savedLanguage);

    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    document.documentElement.setAttribute(
      "dir",
      savedLanguage === "ar" ? "rtl" : "ltr"
    );
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    document.documentElement.setAttribute(
      "dir",
      newLanguage === "ar" ? "rtl" : "ltr"
    );
  };

  return (
    <AppContext.Provider
      value={{
        language,
        theme,
        isRTL: language === "ar",
        isDark: theme === "dark",
        toggleTheme,
        toggleLanguage,
        currentUser,
        setCurrentUser,
        userId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
