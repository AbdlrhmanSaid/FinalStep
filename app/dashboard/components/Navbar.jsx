"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Home,
  Search,
  FolderOpen,
  Mail,
  ListChecks,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import UserMenu from "@/components/UserMenu";
import { useAppContext } from "@/contexts/AppContext";
import { translations } from "@/lib/translations";
import { useGetUserInvites } from "@/hooks/invitations/useGetUserInvites";
import { useGetTasks } from "@/hooks/tasks/useTasks";

export default function DashboardNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const mobileMenuButtonRef = useRef(null);
  const mobileMenuPanelRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);
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

  const { data: invites } = useGetUserInvites(email);
  const pendingInvitesCount = invites?.length ?? 0;

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onResize = () => {
      if (typeof window !== "undefined" && window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!mounted || !isMenuOpen) return;

    const closeIfOutside = (event) => {
      const t = event.target;
      if (
        mobileMenuButtonRef.current?.contains(t) ||
        mobileMenuPanelRef.current?.contains(t)
      ) {
        return;
      }
      setIsMenuOpen(false);
    };

    document.addEventListener("mousedown", closeIfOutside);
    document.addEventListener("touchstart", closeIfOutside);
    return () => {
      document.removeEventListener("mousedown", closeIfOutside);
      document.removeEventListener("touchstart", closeIfOutside);
    };
  }, [mounted, isMenuOpen]);

  const isActive = (path) => {
    if (path === "/dashboard") {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  const getLinkClasses = (path) => {
    const active = isActive(path);
    return `relative group flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
      active
        ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/30 shadow-sm"
        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
    }`;
  };

  const getMobileLinkClasses = (path) => {
    const active = isActive(path);
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
      active
        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
    }`;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 w-full h-20 z-[99999] overflow-visible transition-all duration-300 ease-in-out ${
          scrolled
            ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm py-1"
            : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-1.5"
        } ${isRTL ? "rtl" : "ltr"}`}
      >
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-1 shrink-0 group">
              <Link
                href={"/"}
                className="flex items-center gap-2 shrink-0 group transition-transform duration-300"
              >
                <div className="relative overflow-hidden rounded-xl w-10 h-10 shadow-sm shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 group-hover:shadow-blue-500/40">
                  <img
                    src={"/assets/images/favicon_white.png"}
                    alt="FinalStep Logo"
                    className=" object-cover h-[36px] w-[36px] m-auto"
                  />
                </div>
                <span className="text-2xl font-black tracking-tight bg-gradient-to-br from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent transition-all duration-300">
                  FinalStep
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2 p-2 flex-1 justify-center max-w-4xl mx-auto">
              <Link
                href={"/dashboard"}
                className={getLinkClasses("/dashboard")}
              >
                <Home className="w-4 h-4  mx-1.5  opacity-70" />
                {content.dashboardNav.home}
              </Link>
              <Link
                href={"/dashboard/search"}
                className={getLinkClasses("/dashboard/search")}
              >
                <Search className="w-4 h-4 mx-1.5 opacity-70" />
                {content.dashboardNav.search}
              </Link>
              <Link
                href={"/dashboard/projects"}
                className={getLinkClasses("/dashboard/projects")}
              >
                <FolderOpen className="w-4 h-4 mx-1.5 opacity-70" />
                {content.dashboardNav.projects}
              </Link>

              {/* Invitations link with badge */}
              <Link
                href={"/dashboard/invitations"}
                className={getLinkClasses("/dashboard/invitations")}
              >
                <Mail className="w-4 h-4 mx-1.5 opacity-70" />
                {content.dashboardNav.invitations}
                {pendingInvitesCount > 0 && (
                  <span className="absolute -top-1.5 -end-1.5 min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold shadow-sm shadow-red-500/30 animate-pulse border border-white dark:border-gray-900">
                    {pendingInvitesCount > 99 ? "99+" : pendingInvitesCount}
                  </span>
                )}
              </Link>

              <Link
                href={"/dashboard/tasks"}
                className={getLinkClasses("/dashboard/tasks")}
              >
                <ListChecks className="w-4 h-4 mx-1.5 opacity-70" />
                {content.dashboardNav.team}
                {pendingReviewsCount > 0 && (
                  <span className="absolute -top-1.5 -end-1.5 min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-amber-500 text-white text-[10px] font-bold shadow-sm shadow-orange-500/30 border border-white dark:border-gray-900">
                    {pendingReviewsCount > 99 ? "99+" : pendingReviewsCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 sm:p-2.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ring-1 ring-gray-200 dark:ring-gray-700"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="p-2 sm:p-2.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ring-1 ring-gray-200 dark:ring-gray-700"
                aria-label="Toggle language"
              >
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs font-bold uppercase hidden sm:inline-block">
                    {language === "ar" ? "EN" : "AR"}
                  </span>
                </div>
              </button>

              {/* Separator */}
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

              {/* Profile */}
              <UserMenu />

              {/* Mobile menu button */}
              <div className="lg:hidden ml-1 rtl:mr-1 rtl:ml-0">
                <button
                  ref={mobileMenuButtonRef}
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`p-2 rounded-xl transition-all duration-300 ${isMenuOpen ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                  aria-label="Toggle menu"
                  aria-expanded={isMenuOpen}
                >
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <span
                      className={`absolute transition-all duration-300 ${isMenuOpen ? "opacity-0 scale-50 rotate-90" : "opacity-100 scale-100 rotate-0"}`}
                    >
                      <Menu className="w-6 h-6" />
                    </span>
                    <span
                      className={`absolute transition-all duration-300 ${isMenuOpen ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90"}`}
                    >
                      <X className="w-6 h-6" />
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer to prevent content from going under the fixed navbar */}
      <div className="h-20 lg:h-[72px] w-full shrink-0"></div>

      {mounted &&
        isMenuOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={mobileMenuPanelRef}
            id="dashboard-mobile-nav-menu"
            className={`lg:hidden fixed top-20 left-0 right-0 z-[99998] max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain bg-white dark:bg-gray-900 shadow-xl border-b border-gray-100 dark:border-gray-800 ${isRTL ? "rtl" : "ltr"}`}
          >
            <div className="px-4 py-4 flex flex-col gap-2 max-w-screen-2xl mx-auto sm:px-6">
              <Link
                onClick={() => setIsMenuOpen(false)}
                href="/dashboard"
                className={getMobileLinkClasses("/dashboard")}
              >
                <div
                  className={`p-2 rounded-lg ${isActive("/dashboard") ? "bg-white dark:bg-gray-800 shadow-sm" : "bg-gray-100 dark:bg-gray-800"}`}
                >
                  <Home className="w-5 h-5" />
                </div>
                {content.dashboardNav.home}
              </Link>

              <Link
                onClick={() => setIsMenuOpen(false)}
                href="/dashboard/search"
                className={getMobileLinkClasses("/dashboard/search")}
              >
                <div
                  className={`p-2 rounded-lg ${isActive("/dashboard/search") ? "bg-white dark:bg-gray-800 shadow-sm" : "bg-gray-100 dark:bg-gray-800"}`}
                >
                  <Search className="w-5 h-5" />
                </div>
                {content.dashboardNav.search}
              </Link>

              <Link
                onClick={() => setIsMenuOpen(false)}
                href={"/dashboard/projects"}
                className={getMobileLinkClasses("/dashboard/projects")}
              >
                <div
                  className={`p-2 rounded-lg ${isActive("/dashboard/projects") ? "bg-white dark:bg-gray-800 shadow-sm" : "bg-gray-100 dark:bg-gray-800"}`}
                >
                  <FolderOpen className="w-5 h-5" />
                </div>
                {content.dashboardNav.projects}
              </Link>

              <Link
                onClick={() => setIsMenuOpen(false)}
                href={"/dashboard/invitations"}
                className={getMobileLinkClasses("/dashboard/invitations")}
              >
                <div
                  className={`p-2 rounded-lg ${isActive("/dashboard/invitations") ? "bg-white dark:bg-gray-800 shadow-sm" : "bg-gray-100 dark:bg-gray-800"}`}
                >
                  <Mail className="w-5 h-5 relative" />
                </div>
                <span className="flex-1">
                  {content.dashboardNav.invitations}
                </span>
                {pendingInvitesCount > 0 && (
                  <span className="min-w-[24px] h-[24px] px-2 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow-sm shadow-red-500/20">
                    {pendingInvitesCount > 99 ? "99+" : pendingInvitesCount}
                  </span>
                )}
              </Link>

              <Link
                onClick={() => setIsMenuOpen(false)}
                href={"/dashboard/tasks"}
                className={getMobileLinkClasses("/dashboard/tasks")}
              >
                <div
                  className={`p-2 rounded-lg ${isActive("/dashboard/tasks") ? "bg-white dark:bg-gray-800 shadow-sm" : "bg-gray-100 dark:bg-gray-800"}`}
                >
                  <ListChecks className="w-5 h-5 relative" />
                </div>
                <span className="flex-1">{content.dashboardNav.team}</span>
                {pendingReviewsCount > 0 && (
                  <span className="min-w-[24px] h-[24px] px-2 flex items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold shadow-sm shadow-orange-500/20">
                    {pendingReviewsCount > 99 ? "99+" : pendingReviewsCount}
                  </span>
                )}
              </Link>

              <Link
                onClick={() => setIsMenuOpen(false)}
                href={"/dashboard/settings"}
                className={getMobileLinkClasses("/dashboard/settings")}
              >
                <div
                  className={`p-2 rounded-lg ${isActive("/dashboard/settings") ? "bg-white dark:bg-gray-800 shadow-sm" : "bg-gray-100 dark:bg-gray-800"}`}
                >
                  <Settings className="w-5 h-5 relative" />
                </div>
                <span className="flex-1">
                  {isRTL ? "الإعدادات" : "Settings"}
                </span>
              </Link>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-start"
              >
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <LogOut className="w-5 h-5" />
                </div>
                {content.dashboardNav.logout || "تسجيل الخروج"}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
