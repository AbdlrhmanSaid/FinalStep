import { Button } from "@/components/ui/button";
import { Moon, Sun, Globe, Menu, X, GraduationCap } from "lucide-react";
import Link from "next/link";

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
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <GraduationCap className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              FinalStep
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2 ml-16 rtl:mr-16">
            <a
              href="#features"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t.features}
            </a>
            <a
              href="#about"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t.about}
            </a>
            <a
              href="#contact"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t.contact}
            </a>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="h-5 w-5 mx-1" />
              <span className="text-sm font-medium">
                {language.toUpperCase()}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="m-0 px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Get Started Button */}
            <Link href={"/login"}>
              <Button className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
                {t.getStarted}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-3 px-4">
              <a
                href="#features"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t.features}
              </a>
              <a
                href="#about"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t.about}
              </a>
              <a
                href="#contact"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t.contact}
              </a>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
                <Link href={"/login"}>{t.getStarted}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
