"use client";

import { useState } from "react";
import { Menu, X, Sun, Moon, Globe, GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "../../../components/UserMenu";
import { useAppContext } from "../../../contexts/AppContext";
import { translations } from "../../../lib/translations";

export default function DashboardNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isRTL, isDark, toggleLanguage, toggleTheme, language } =
    useAppContext();
  const content = translations[language];

  const isActive = (path) => {
    if (path === "/dashboard") {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  const getLinkClasses = (path) => {
    const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeClasses = "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
    const inactiveClasses = "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400";
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  const getMobileLinkClasses = (path) => {
    const baseClasses = "block px-3 py-2 rounded-md text-base font-medium";
    const activeClasses = "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
    const inactiveClasses = "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400";
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

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
            <div className={`flex items-center space-x-8 ${isRTL ? "" : ""}`}>
              <Link
                href={"/dashboard"}
                className={getLinkClasses("/dashboard")}
              >
                {content.dashboardNav.home}
              </Link>
              <Link
                href={"/dashboard/projects"}
                className={getLinkClasses("/dashboard/projects")}
              >
                {content.dashboardNav.projects}
              </Link>
              <Link
                href={"/dashboard/invitations"}
                className={getLinkClasses("/dashboard/invitations")}
              >
                {content.dashboardNav.invitations}
              </Link>
              <Link
                href={"/dashboard/tasks"}
                className={getLinkClasses("/dashboard/tasks")}
              >
                {content.dashboardNav.team}
              </Link>
              <Link
                href={"/dashboard/profile"}
                className={getLinkClasses("/dashboard/profile")}
              >
                {content.dashboardNav.settings}
              </Link>
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
              <Link
                onClick={() => setIsMenuOpen(false)}
                href="/dashboard"
                className={getMobileLinkClasses("/dashboard")}
              >
                {content.dashboardNav.home}
              </Link>
              <Link
                onClick={() => setIsMenuOpen(false)}
                href={"/dashboard/projects"}
                className={getMobileLinkClasses("/dashboard/projects")}
              >
                {content.dashboardNav.projects}
              </Link>
              <Link
                onClick={() => setIsMenuOpen(false)}
                href={"/dashboard/invitations"}
                className={getMobileLinkClasses("/dashboard/invitations")}
              >
                {content.dashboardNav.invitations}
              </Link>
              <Link
                onClick={() => setIsMenuOpen(false)}
                href={"/dashboard/tasks"}
                className={getMobileLinkClasses("/dashboard/tasks")}
              >
                {content.dashboardNav.team}
              </Link>
              <Link
                onClick={() => setIsMenuOpen(false)}
                href={"/dashboard/profile"}
                className={getMobileLinkClasses("/dashboard/profile")}
              >
                {content.dashboardNav.settings}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

