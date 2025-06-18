"use client";

import { useState } from "react";
import { Menu, X, Sun, Moon, Globe, GraduationCap } from "lucide-react";
import Link from "next/link";
import UserMenu from "../../../components/UserMenu";

export default function dashboardNav({
  content,
  isRTL,
  toggleLanguage,
  isDark,
  toggleTheme,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className={`bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <GraduationCap className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            <Link
              href={"/"}
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              FinalStep
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div
              className={`flex items-center space-x-8 ${
                isRTL ? "rtl:space-x-reverse" : ""
              }`}
            >
              <a
                href="#"
                className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {content.dashboardNav.home}
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {content.dashboardNav.projects}
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {content.dashboardNav.team}
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {content.dashboardNav.settings}
              </a>
            </div>
          </div>

          {/* Controls */}
          <div
            className={`flex items-center space-x-4 ${
              isRTL ? "rtl:space-x-reverse" : ""
            }`}
          >
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Profile */}
            <UserMenu />

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
              <a
                href="#"
                className="block text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
              >
                {content.dashboardNav.home}
              </a>
              <a
                href="#"
                className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
              >
                {content.dashboardNav.projects}
              </a>
              <a
                href="#"
                className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
              >
                {content.dashboardNav.team}
              </a>
              <a
                href="#"
                className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
              >
                {content.dashboardNav.settings}
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
