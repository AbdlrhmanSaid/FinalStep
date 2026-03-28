"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { translations } from "@/lib/translations";
import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut } from "lucide-react";

function DropdownMenu({ session, userId, t, isRTL }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Small delay prevents immediate closure when clicking the button itself
      setTimeout(() => {
        if (ref.current && !ref.current.contains(e.target)) {
          setIsOpen(false);
        }
      }, 0);
    };

    document.addEventListener("mousedown", handleClickOutside, {
      capture: true,
    });
    document.addEventListener("touchstart", handleClickOutside, {
      capture: true,
    });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, {
        capture: true,
      });
      document.removeEventListener("touchstart", handleClickOutside, {
        capture: true,
      });
    };
  }, []);

  return (
    <div className="relative h-[36px]" ref={ref}>
      <Button
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="rounded-full w-9 h-9 p-0 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-600 dark:text-blue-400 font-bold overflow-hidden hover:bg-blue-200 ring-2 ring-transparent transition-all duration-300 shadow-sm"
      >
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          session.user?.name?.charAt(0)?.toUpperCase() || "U"
        )}
      </Button>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-blue-500/10 border border-gray-100 dark:border-gray-700 overflow-hidden z-[99999] ${isRTL ? "left-0" : "right-0"}`}
        >
          <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate border-b-0">
              {session.user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {session.user?.email}
            </p>
          </div>
          <div className="p-1.5 flex flex-col gap-0.5">
            <Link
              href={`/dashboard/user/${userId}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <User className="w-4 h-4 text-blue-500" />
              {isRTL ? "ملف الشخصي" : "Profile"}
            </Link>

            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              {isRTL ? "الإعدادات" : "Settings"}
            </Link>
          </div>
          <div className="p-1.5 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-start"
            >
              <LogOut className="w-4 h-4" />
              {t.dashboardNav?.logout || "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserMenu() {
  const { data: session, status } = useSession();
  const context = useAppContext();
  const language = context?.language || "en";
  const t = translations[language];

  if (status === "loading") return null;

  return (
    <>
      {!session ? (
        <Link href="/login">
          <Button className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105">
            {t.nav?.getStarted || "Get Started"}
          </Button>
        </Link>
      ) : (
        <DropdownMenu
          session={session}
          userId={context?.userId}
          t={t}
          isRTL={context?.isRTL}
        />
      )}
    </>
  );
}
