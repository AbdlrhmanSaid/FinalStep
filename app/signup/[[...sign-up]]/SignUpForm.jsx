"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { translations } from "@/lib/translations";

export default function SignUpForm() {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || "en";
    const storedTheme = localStorage.getItem("theme") || "light";
    setLanguage(storedLanguage);
    setTheme(storedTheme);
  }, []);

  const t = translations[language].register;
  const isArabic = language === "ar";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success(isArabic ? "تم التسجيل بنجاح! الرجاء تسجيل الدخول" : "Registration successful! Please login.");
      router.push("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className={`w-full max-w-md space-y-8 p-6 sm:p-8 rounded-xl shadow-lg border ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div>
          <h2
            className={`mt-6 text-center text-2xl font-extrabold ${
              isArabic ? "font-arabic" : "font-sans"
            } ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            {t.title || "Create an account"}
          </h2>
          <p
            className={`mt-2 text-center text-sm ${
              isArabic ? "font-arabic" : "font-sans"
            } ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            {t.subtitle || "Sign up to get started."}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="name" 
                className={`block text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
              >
                {t.name || "Full Name"}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm
                  ${theme === "dark" 
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                placeholder={isArabic ? "الاسم الكامل" : "John Doe"}
              />
            </div>
            <div>
              <label 
                htmlFor="email" 
                className={`block text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
              >
                {t.email || "Email address"}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm
                  ${theme === "dark" 
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                placeholder={t.emailPlaceholder || "you@example.com"}
              />
            </div>
            <div>
              <label 
                htmlFor="password" 
                className={`block text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
              >
                {t.password || "Password"}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm
                  ${theme === "dark" 
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                ${theme === "dark" 
                  ? "bg-indigo-500 hover:bg-indigo-600" 
                  : "bg-indigo-600 hover:bg-indigo-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors`}
            >
              {loading ? (isArabic ? "جاري التسجيل..." : "Signing up...") : (isArabic ? "إنشاء حساب" : "Sign Up")}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"}`}>
                {isArabic ? "أو المتابعة عبر" : "Or continue with"}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className={`w-full flex justify-center items-center gap-3 py-2 px-4 border rounded-md shadow-sm text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                ${theme === "dark" 
                  ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" 
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isArabic ? "التسجيل مع Google" : "Sign up with Google"}
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <p
            className={`text-sm ${
              isArabic ? "font-arabic" : "font-sans"
            } ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            {t.loginLink || "Already have an account?"}{" "}
            <Link
              href="/login"
              className={`font-medium transition-colors ${
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
