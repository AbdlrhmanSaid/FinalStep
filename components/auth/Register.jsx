import { Button } from "@/components/ui/button";
import { Chrome, Github, User, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function Register({ t, isRTL }) {
  return (
    <section className="py-14 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t.subtitle}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            <div className="relative">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {t.usernameLabel}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  className="pl-10 mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder={t.usernameLabel}
                />
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {t.emailLabel}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  className="pl-10 mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder={t.emailLabel}
                />
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {t.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  className="pl-10 mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder={t.passwordLabel}
                />
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {t.confirmPasswordLabel}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  id="confirm-password"
                  className="pl-10 mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder={t.confirmPasswordLabel}
                />
              </div>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-transform duration-200 hover:scale-105">
              {t.registerButton}
            </Button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  {isRTL ? "أو" : "Or"}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 py-3 rounded-lg flex items-center justify-center transition-transform duration-200 hover:scale-105"
            >
              <Chrome className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2 text-blue-600" />
              {t.googleButton}
            </Button>
            <Button
              variant="outline"
              className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 py-3 rounded-lg flex items-center justify-center transition-transform duration-200 hover:scale-105"
            >
              <Github className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2 text-purple-600 dark:text-purple-400" />
              {t.githubButton}
            </Button>
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {t.loginLink}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
