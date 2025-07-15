"use client";

import { useAppContext } from "../contexts/AppContext";
import { translations } from "../lib/translations";
import { motion } from "framer-motion";

export default function ModernLoading() {
  const { language, theme } = useAppContext();
  const content = translations[language]?.loading || "Loading...";

  // ألوان متغيرة حسب الثيم
  const colors =
    theme === "dark"
      ? {
          primary: "#7C3AED",
          secondary: "#4F46E5",
          bg: "rgba(17, 24, 39, 0.8)",
          text: "#F3F4F6",
          dots: "rgba(124, 58, 237, 0.3)",
        }
      : {
          primary: "#4F46E5",
          secondary: "#7C3AED",
          bg: "rgba(255, 255, 255, 0.9)",
          text: "#111827",
          dots: "rgba(79, 70, 229, 0.2)",
        };

  const dots = Array(8).fill(0);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="relative w-full max-w-md">
        {/* تأثير الخلفية المتحركة */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {dots.map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 12,
                height: 12,
                left: `${10 + i * 10}%`,
                top: `${10 + Math.random() * 80}%`,
                backgroundColor: colors.dots,
              }}
              animate={{
                y: [0, 20, 0],
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2 + i,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* بطاقة التحميل الرئيسية */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-2xl shadow-xl p-8 backdrop-blur-sm border"
          style={{
            backgroundColor: colors.bg,
            borderColor:
              theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex flex-col items-center gap-6">
            {/* أيقونة متحركة */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                boxShadow: `0 4px 20px -2px ${colors.primary}`,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v4" />
                <path d="M12 18v4" />
                <path d="M4.93 4.93l2.83 2.83" />
                <path d="M16.24 16.24l2.83 2.83" />
                <path d="M2 12h4" />
                <path d="M18 12h4" />
                <path d="M4.93 19.07l2.83-2.83" />
                <path d="M16.24 7.76l2.83-2.83" />
              </svg>
            </motion.div>

            {/* نص التحميل */}
            <div className="text-center space-y-2">
              <motion.h2
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xl font-semibold"
                style={{ color: colors.text }}
              >
                {content}
              </motion.h2>
              <motion.p
                animate={{ opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                className="text-sm"
                style={{ color: theme === "dark" ? "#9CA3AF" : "#6B7280" }}
              >
                {translations[language]?.loadingSubtitle ||
                  "Preparing your experience..."}
              </motion.p>
            </div>

            {/* شريط التقدم */}
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{
                backgroundColor:
                  theme === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                }}
              />
            </div>

            {/* نص إضافي */}
            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-xs text-center"
              style={{ color: theme === "dark" ? "#6B7280" : "#9CA3AF" }}
            >
              {translations[language]?.loadingTips?.[
                Math.floor(
                  Math.random() *
                    (translations[language]?.loadingTips?.length || 1)
                )
              ] || "Optimizing performance..."}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
