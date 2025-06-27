"use client";

import { useAppContext } from "../contexts/AppContext";
import { translations } from "../lib/translations";
import { motion } from "framer-motion";

export default function ModernLoading() {
  const { language } = useAppContext();
  const content = translations[language].loading;

  const dots = Array(12).fill(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 overflow-hidden">
          {dots.map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-blue-200 dark:bg-purple-800 rounded-full"
              style={{
                width: 8,
                height: 8,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 40],
                y: [0, (Math.random() - 0.5) * 40],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* بطاقة التحميل الرئيسية */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex flex-col items-center gap-6">
            {/* شعار متحرك */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </motion.div>

            {/* نص التحميل */}
            <div className="text-center space-y-2">
              <motion.h2
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl font-bold text-gray-800 dark:text-white"
              >
                {content}
              </motion.h2>
              <p className="text-gray-500 dark:text-gray-400">
                {translations[language].loadingSubtitle ||
                  "Preparing everything for you..."}
              </p>
            </div>

            {/* شريط التقدم المتحرك */}
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
              />
            </div>

            {/* نص ترفيهي متغير */}
            <motion.p
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-xs text-gray-400 dark:text-gray-500 text-center"
            >
              {translations[language].loadingTips?.[
                Math.floor(
                  Math.random() *
                    (translations[language].loadingTips?.length || 1)
                )
              ] || "Almost there..."}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
