import Link from "next/link";
import { Github, Linkedin, Mail, Globe } from "lucide-react";

export default function Footer({ t, isRTL }) {
  return (
    <footer className="relative bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-indigo-100 dark:bg-gray-800" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand & Logo */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-transform duration-300 inline-flex w-fit"
            >
              <div className="relative overflow-hidden rounded-lg w-10 h-10 transition-transform duration-300 shadow-md group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                <img
                  src="/assets/images/icon.png"
                  alt="FinalStep Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 transition-colors duration-300">
                FinalStep
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-md">
              {isRTL
                ? "منصتك المتكاملة لإدارة المشاريع والفرق بفعالية واحترافية. نظّم مهامك وحقق أهدافك."
                : "Your integrated platform for managing projects and teams effectively. Organize tasks and achieve goals."}
            </p>
            <div
              className={`flex items-center gap-4 ${isRTL ? "space-x-reverse" : ""}`}
            >
              <a
                href="https://asportfolio-mu.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-indigo-100 dark:bg-gray-800 dark:hover:bg-indigo-900/40 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 hover:scale-110"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/abdelrhman-saeid-95564a25a/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-indigo-100 dark:bg-gray-800 dark:hover:bg-indigo-900/40 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/AbdlrhmanSaid"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-indigo-100 dark:bg-gray-800 dark:hover:bg-indigo-900/40 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 hover:scale-110"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {isRTL ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#features"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500 transition-colors" />
                  {t?.nav?.features || (isRTL ? "المميزات" : "Features")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500 transition-colors" />
                  {t?.nav?.about || (isRTL ? "عن التطبيق" : "About")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500 transition-colors" />
                  {t?.nav?.contact || (isRTL ? "اتصل بنا" : "Contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {isRTL ? "تواصل معنا" : "Get in Touch"}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400 text-sm">
                <Mail className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span>abdelrhmansaid996@gmail.com</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <Link
                href="https://asportfolio-mu.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title={
                  isRTL
                    ? "تطوير بواسطة Abdelrhman Saeid"
                    : "Developed by Abdelrhman Saeid"
                }
              >
                <span>{isRTL ? "تطوير بواسطة" : "Developed by"}</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  Abdelrhman Saeid
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} FinalStep.{" "}
            {isRTL ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Link
              href="/privacy"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            <Link
              href="/terms"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {isRTL ? "الشروط والأحكام" : "Terms of Service"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
