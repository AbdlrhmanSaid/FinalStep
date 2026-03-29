"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import { translations } from "@/lib/translations";
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { User, Settings, LogOut } from "lucide-react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const context = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownPos, setDropdownPos] = useState(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateDropdownPosition = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn || !isOpen) return;
    const rect = btn.getBoundingClientRect();
    const width = 256;
    const gap = 12;
    const isRTLMenu = context?.isRTL;
    setDropdownPos({
      top: rect.bottom + gap,
      left: isRTLMenu ? rect.left : rect.right - width,
      width,
    });
  }, [isOpen, context?.isRTL]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setDropdownPos(null);
      return;
    }
    updateDropdownPosition();
    window.addEventListener("scroll", updateDropdownPosition, true);
    window.addEventListener("resize", updateDropdownPosition);
    return () => {
      window.removeEventListener("scroll", updateDropdownPosition, true);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [isOpen, updateDropdownPosition]);

  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (event) => {
      const t = event.target;
      if (
        buttonRef.current?.contains(t) ||
        dropdownRef.current?.contains(t)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mounted]);

  // Handle loading or server-side render
  if (!mounted || status === "loading") {
    return (
      <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse border border-gray-100 dark:border-gray-700" />
    );
  }

  // If no session, show nothing (Navbar handles login link separately)
  if (!session) return null;

  const isRTL = context?.isRTL;
  const t = translations[context?.language || "en"];
  const userId = context?.userId;

  const dropdownContent = (
    <>
      <div className="px-4 py-3.5 mb-1 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border-b border-gray-100 dark:border-gray-800">
        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
          {session.user?.name}
        </p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate opacity-80 mt-0.5">
          {session.user?.email}
        </p>
      </div>

      <div className="space-y-0.5">
        <Link
          href="/dashboard/profile"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-300 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all group"
        >
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 text-gray-500 group-hover:text-blue-600 transition-colors">
            <User className="w-4 h-4" />
          </div>
          {isRTL ? "الملف الشخصي" : "Profile"}
        </Link>

        <Link
          href="/dashboard/settings"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-300 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all group"
        >
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 text-gray-500 group-hover:text-indigo-600 transition-colors">
            <Settings className="w-4 h-4" />
          </div>
          {isRTL ? "الإعدادات" : "Settings"}
        </Link>
      </div>

      <div className="mt-1 pt-1 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all group"
        >
          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 group-hover:bg-red-100 transition-colors">
            <LogOut className="w-4 h-4" />
          </div>
          {t.dashboardNav?.logout || "Sign Out"}
        </button>
      </div>
    </>
  );

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onPointerDown={() => setIsOpen(!isOpen)}
        className="relative group w-9 h-9 flex items-center justify-center rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-blue-500/20 active:scale-95 z-[99999]"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-full h-full object-cover"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
      </button>

      {isOpen &&
        mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            role="menu"
            className="fixed z-[9999999] w-64 min-w-[240px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden p-1"
            style={{
              top: dropdownPos?.top ?? 0,
              left: dropdownPos?.left ?? 0,
              width: dropdownPos?.width ?? 256,
              boxShadow:
                "0 10px 40px -10px rgba(0,0,0,0.1), 0 0 20px -5px rgba(59,130,246,0.1)",
              visibility: dropdownPos ? "visible" : "hidden",
            }}
          >
            {dropdownContent}
          </div>,
          document.body,
        )}
    </div>
  );
}
