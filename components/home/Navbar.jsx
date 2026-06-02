"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Globe, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserMenu from "../UserMenu";

export default function Navbar({
  t,
  isRTL,
  isDark,
  isMenuOpen,
  toggleTheme,
  toggleLanguage,
  setIsMenuOpen,
}) {
  const { data: session } = useSession();
  const isSignedIn = !!session;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                  ${
                    scrolled
                      ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-lg shadow-indigo-900/5 border-b border-gray-200/50 dark:border-gray-800/50 py-2"
                      : "bg-transparent py-4"
                  }
                  ${isRTL ? "rtl" : "ltr"}`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-1 shrink-0 group">
              <Link
                href="/"
                className="flex items-center gap-1 shrink-0 group transition-transform duration-300"
              >
                <div className="relative overflow-hidden rounded-lg w-9 h-9 transition-transform duration-300 group-hover:scale-105 ">
                  <img
                    src={"/assets/images/icon.png"}
                    alt="FinalStep Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-2xl font-black text-gray-900 dark:text-white transition-colors duration-300">
                  Final
                  <span className="text-indigo-600 dark:text-indigo-400">
                    Step
                  </span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 p-2 flex-1 justify-center px-4 overflow-x-auto">
              <a
                href="/#"
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t.Home}
              </a>
              <a
                href="#features"
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t.features}
              </a>
              <a
                href="#about"
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t.about}
              </a>
              <a
                href="#contact"
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t.contact}
              </a>
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t.dashboard}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t.login}
                </Link>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
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
                  className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium"
                >
                  {t.features}
                </a>
                <a
                  href="#about"
                  className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium"
                >
                  {t.about}
                </a>
                <a
                  href="#contact"
                  className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium"
                >
                  {t.contact}
                </a>
                {isSignedIn ? (
                  <Link
                    href="/dashboard"
                    className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium"
                  >
                    {t.dashboard}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="block text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500 px-3 py-2 rounded-md text-base font-medium"
                  >
                    {t.login}
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
