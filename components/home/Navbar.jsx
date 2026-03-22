"use client";

import { Button } from "../ui/button";
import { Moon, Sun, Globe, Menu, X, GraduationCap } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserMenu from "../UserMenu";

export default function Navbar({
  t,
  isRTL,
  isDark,
  language,
  isMenuOpen,
  toggleTheme,
  toggleLanguage,
  setIsMenuOpen,
}) {
  const { isSignedIn } = useUser();
  const router = useRouter();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 
                  bg-white/90 dark:bg-gray-900/95 
                  backdrop-blur-sm 
                  shadow-lg 
                  border-b border-gray-200 dark:border-gray-700 
                  transition-all duration-300
                  ${isRTL ? "rtl" : "ltr"}`}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse shrink-0 group">
              <Link
                href="/"
                className="flex items-center gap-3 shrink-0 group transition-transform duration-300"
              >
                <div className="relative overflow-hidden rounded-lg w-9 h-9 transition-transform duration-300 group-hover:scale-105 ">
                  <img
                    src={
                      isDark
                        ? "/assets/images/favicon_dark.png"
                        : "/assets/images/favicon_white.png"
                    }
                    alt="FinalStep Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent transition-all duration-300">
                  FinalStep
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className={`flex items-center gap-8 `}>
                <a
                  href="#features"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t.features}
                </a>
                <a
                  href="#about"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t.about}
                </a>
                <a
                  href="#contact"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t.contact}
                </a>
                {isSignedIn && (
                  <Link
                    href="/dashboard"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {t.dashboard}
                  </Link>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className={`flex items-center space-x-4 rtl:space-x-reverse`}>
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle language"
              >
                <Globe className="w-5 h-5" />
              </button>

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

              {/* Profile */}
              <UserMenu t={t} />

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-4 space-y-1 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <a
                  href="#features"
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
                >
                  {t.features}
                </a>
                <a
                  href="#about"
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
                >
                  {t.about}
                </a>
                <a
                  href="#contact"
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
                >
                  {t.contact}
                </a>
                {isSignedIn ? (
                  <Link
                    href="/dashboard"
                    className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
                  >
                    {t.dashboard}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 px-3 py-2 rounded-md text-base font-medium"
                  >
                    {t.getStarted}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
