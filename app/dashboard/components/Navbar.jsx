"use client";

import { useState } from "react";
import { Menu, X, Sun, Moon, Globe, GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "@/components/UserMenu";
import { useAppContext } from "@/contexts/AppContext";
import { translations } from "@/lib/translations";
import { useGetUserInvites } from "@/hooks/invitations/useGetUserInvites";
import { useGetTasks } from "@/hooks/tasks/useTasks";

export default function DashboardNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const {
    userId,
    isRTL,
    isDark,
    toggleLanguage,
    toggleTheme,
    language,
    email,
  } = useAppContext();
  const content = translations[language];

  // جلب عدد الدعوات المعلقة
  const { data: invites } = useGetUserInvites(email);
  const pendingInvitesCount = invites?.length ?? 0;

  // جلب المهام لحساب المهام التي تنتظر المراجعة
  const { data: tasks } = useGetTasks();
  const pendingReviewsCount =
    tasks?.filter((task) => {
      const isLeader =
        task.projectId?.leaderId?.toString() === userId ||
        task.projectId?.coLeaders?.some(
          (id) => (id._id || id).toString() === userId,
        );
      return isLeader && task.status === "submitted";
    })?.length ?? 0;

  const isActive = (path) => {
    if (path === "/dashboard") {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  const getLinkClasses = (path) => {
    const baseClasses =
      "relative px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap";
    const activeClasses =
      "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
    const inactiveClasses =
      "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400";

    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  const getMobileLinkClasses = (path) => {
    const baseClasses =
      "relative flex items-center gap-2 px-3 py-2.5 rounded-md text-base font-medium transition-colors";
    const activeClasses =
      "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
    const inactiveClasses =
      "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800";

    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <nav
      className={`bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <GraduationCap className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            <Link
              href={"/"}
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              FinalStep
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 p-2 flex-1 justify-center px-4 overflow-x-auto">
            <Link href={"/dashboard"} className={getLinkClasses("/dashboard")}>
              {content.dashboardNav.home}
            </Link>
            <Link
              href={"/dashboard/search"}
              className={getLinkClasses("/dashboard/search")}
            >
              {content.dashboardNav.search}
            </Link>
            <Link
              href={"/dashboard/projects"}
              className={getLinkClasses("/dashboard/projects")}
            >
              {content.dashboardNav.projects}
            </Link>

            {/* Invitations link with badge */}
            <Link
              href={"/dashboard/invitations"}
              className={getLinkClasses("/dashboard/invitations")}
            >
              {content.dashboardNav.invitations}
              {pendingInvitesCount > 0 && (
                <span className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none shadow">
                  {pendingInvitesCount > 99 ? "99+" : pendingInvitesCount}
                </span>
              )}
            </Link>

            <Link
              href={"/dashboard/tasks"}
              className={getLinkClasses("/dashboard/tasks")}
            >
              {content.dashboardNav.team}
              {pendingReviewsCount > 0 && (
                <span className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold leading-none shadow">
                  {pendingReviewsCount > 99 ? "99+" : pendingReviewsCount}
                </span>
              )}
            </Link>
            <Link
              href={"/dashboard/profile"}
              className={getLinkClasses("/dashboard/profile")}
            >
              {content.dashboardNav.settings}
            </Link>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
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
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
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
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-2">
            <div className="flex flex-col gap-1 pb-2">
              <Link
                onClick={() => setIsMenuOpen(false)}
                href="/dashboard"
                className={getMobileLinkClasses("/dashboard")}
              >
                {content.dashboardNav.home}
              </Link>
              <Link
                onClick={() => setIsMenuOpen(false)}
                href="/dashboard/search"
                className={getMobileLinkClasses("/dashboard/search")}
              >
                {content.dashboardNav.search}
              </Link>
              <Link
                onClick={() => setIsMenuOpen(false)}
                href={"/dashboard/projects"}
                className={getMobileLinkClasses("/dashboard/projects")}
              >
                {content.dashboardNav.projects}
              </Link>

              {/* Invitations with badge in mobile */}
              <Link
                onClick={() => setIsMenuOpen(false)}
                href={"/dashboard/invitations"}
                className={getMobileLinkClasses("/dashboard/invitations")}
              >
                {content.dashboardNav.invitations}
                {pendingInvitesCount > 0 && (
                  <span className="ms-auto min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold leading-none shadow">
                    {pendingInvitesCount > 99 ? "99+" : pendingInvitesCount}
                  </span>
                )}
              </Link>

              <Link
                onClick={() => setIsMenuOpen(false)}
                href={"/dashboard/tasks"}
                className={getMobileLinkClasses("/dashboard/tasks")}
              >
                {content.dashboardNav.team}
                {pendingReviewsCount > 0 && (
                  <span className="ms-auto min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold leading-none shadow">
                    {pendingReviewsCount > 99 ? "99+" : pendingReviewsCount}
                  </span>
                )}
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
