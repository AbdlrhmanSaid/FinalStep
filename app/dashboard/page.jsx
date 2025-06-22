"use client";
import { useAppContext } from "../../contexts/AppContext";
import { Home, User } from "lucide-react";
import { translations } from "../../lib/translations";
import Link from "next/link";

export default function WelcomePage() {
  const { email, language } = useAppContext();
  const content = translations[language].dashboard;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white flex flex-col items-center justify-center p-6 transition-colors">
      <div className="w-full max-w-2xl text-center space-y-6">
        <div className="flex justify-center items-center gap-3">
          <Home className="w-10 h-10 text-blue-500" />
          <h1 className="text-3xl font-bold">{content.welcome.title}</h1>
        </div>
        <div className="flex justify-center items-center gap-2">
          <User className="w-5 h-5 text-gray-500" />
          <p className="text-lg">
            {content.welcome.login} <strong>{email || "Guest"}</strong>
          </p>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {content.welcome.subtitle}
        </p>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 bg-gray-50 dark:bg-gray-800 shadow-sm">
          <p className="text-lg">
            {content.welcome.p[0]}
            <Link
              href="/dashboard/invitations"
              className="text-blue-500 hover:underline"
            >
              {content.invitations.title}
            </Link>{" "}
            {content.welcome.p[1]}
          </p>
        </div>
      </div>
    </div>
  );
}
