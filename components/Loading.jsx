"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import { translations } from "../lib/translations";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  ListTodo,
  Users,
  Target,
  TrendingUp,
} from "lucide-react";

// Fixed positions/sizes for background particles (no Math.random() at render time)
const PARTICLES = [
  { w: 180, h: 130, l: 12, t: 10, ax: 40, ay: -20, dur: 12 },
  { w: 120, h: 200, l: 75, t: 60, ax: -30, ay: 25, dur: 14 },
  { w: 210, h: 170, l: 40, t: 80, ax: 20, ay: -40, dur: 10 },
  { w: 150, h: 140, l: 85, t: 20, ax: -40, ay: 30, dur: 16 },
  { w: 130, h: 190, l: 5, t: 45, ax: 35, ay: -15, dur: 11 },
  { w: 200, h: 120, l: 55, t: 15, ax: -25, ay: 45, dur: 13 },
  { w: 160, h: 150, l: 25, t: 70, ax: 15, ay: -35, dur: 15 },
  { w: 110, h: 220, l: 90, t: 50, ax: -45, ay: 20, dur: 9 },
  { w: 240, h: 110, l: 30, t: 30, ax: 30, ay: 40, dur: 12 },
  { w: 140, h: 180, l: 65, t: 85, ax: -20, ay: -30, dur: 14 },
  { w: 190, h: 160, l: 48, t: 5, ax: 45, ay: 15, dur: 11 },
  { w: 120, h: 130, l: 18, t: 62, ax: -35, ay: -45, dur: 16 },
];

export default function ModernLoading() {
  const { language, isDark } = useAppContext();
  const content = translations[language]?.loading || "Loading...";
  const isRTL = language === "ar";
  const [tip, setTip] = useState("");

  // Pick a random tip only on the client to avoid hydration mismatch
  useEffect(() => {
    const tips = translations[language]?.loadingTips;
    if (tips?.length) {
      setTip(tips[Math.floor(Math.random() * tips.length)]);
    } else {
      setTip(isRTL ? "جارٍ التحميل..." : "Optimizing performance...");
    }
  }, [language]);

  // Project management steps animation
  const steps = [
    { icon: ListTodo, label: isRTL ? "المهام" : "Tasks", color: "blue" },
    { icon: Users, label: isRTL ? "الفريق" : "Team", color: "purple" },
    { icon: Target, label: isRTL ? "الأهداف" : "Goals", color: "pink" },
    { icon: TrendingUp, label: isRTL ? "التقدم" : "Progress", color: "green" },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br  ${
        isDark
          ? "from-gray-900 via-gray-800 to-gray-900"
          : "from-gray-50 via-gray-100 to-gray-50"
      }`}
    >
      {/* Animated Background Particles — fixed positions to avoid hydration mismatch */}
      <div className="absolute inset-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              isDark
                ? i % 3 === 0
                  ? "bg-blue-500/10"
                  : i % 3 === 1
                    ? "bg-purple-500/10"
                    : "bg-pink-500/10"
                : i % 3 === 0
                  ? "bg-blue-500/5"
                  : i % 3 === 1
                    ? "bg-purple-500/5"
                    : "bg-pink-500/5"
            }`}
            style={{
              width: p.w,
              height: p.h,
              left: `${p.l}%`,
              top: `${p.t}%`,
            }}
            animate={{
              x: [0, p.ax],
              y: [0, p.ay],
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Loading Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[95vw] sm:max-w-[500px] mx-4"
      >
        <div
          className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 backdrop-blur-xl border shadow-2xl ${
            isDark
              ? "bg-gray-800/90 border-gray-700/50 shadow-blue-500/20"
              : "bg-white/90 border-gray-200/50 shadow-blue-500/30"
          }`}
        >
          {/* Decorative Elements - Hidden on mobile */}
          <div className="hidden sm:block absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="hidden sm:block absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -ml-12 -mb-12 blur-2xl" />

          <div className="flex flex-col items-center gap-6 sm:gap-8 w-full relative">
            {/* Brand Logo with Project Steps */}
            <div className="relative">
              {/* FinalStep Logo */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-4 sm:mb-6"
              >
                <h1
                  className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 sm:mb-2`}
                >
                  FinalStep
                </h1>
                <p
                  className={`text-xs sm:text-sm font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {isRTL ? "إدارة المشاريع بذكاء" : "Smart Project Management"}
                </p>
              </motion.div>

              {/* Project Steps Visualization */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 max-w-full px-2">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const colorClasses = {
                    blue: "from-blue-500 to-blue-600",
                    purple: "from-purple-500 to-purple-600",
                    pink: "from-pink-500 to-pink-600",
                    green: "from-green-500 to-green-600",
                  };

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.15,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          delay: index * 0.2,
                          repeat: Infinity,
                        }}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${colorClasses[step.color]} flex items-center justify-center shadow-lg flex-shrink-0`}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </motion.div>

                      {/* Connecting Line */}
                      {index < steps.length - 1 && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.15 + 0.3,
                          }}
                          className={`absolute h-0.5 w-8 ${
                            isDark ? "bg-gray-600" : "bg-gray-300"
                          }`}
                          style={{
                            left: `${(index + 1) * 25}%`,
                            top: "24px",
                          }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Animated Progress Circle */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto">
                {/* Outer Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div
                    className={`w-full h-full rounded-full border-[3px] ${
                      isDark ? "border-blue-500/40" : "border-blue-500/40"
                    } border-t-transparent`}
                  />
                </motion.div>

                {/* Middle Ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-3"
                >
                  <div
                    className={`w-full h-full rounded-full border-[3px] ${
                      isDark ? "border-purple-500/40" : "border-purple-500/40"
                    } border-b-transparent`}
                  />
                </motion.div>

                {/* Center Icon */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute inset-4 sm:inset-5 md:inset-6 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-xl`}
                >
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                </motion.div>
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center space-y-2 sm:space-y-3">
              <motion.h2
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent`}
              >
                {content}
              </motion.h2>

              <motion.p
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                className={`text-xs sm:text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {translations[language]?.loadingSubtitle ||
                  "Preparing your experience..."}
              </motion.p>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="w-full space-y-2 sm:space-y-3 px-2 sm:px-0">
              <div
                className={`w-full h-2 sm:h-2.5 rounded-full overflow-hidden ${
                  isDark ? "bg-gray-700/50" : "bg-gray-200/70"
                } shadow-inner`}
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-full w-1/2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
                />
              </div>

              {/* Loading Tip — client-only to avoid hydration mismatch */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center gap-2"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isDark ? "bg-blue-400" : "bg-blue-500"
                  }`}
                />
                <p
                  className={`text-[10px] sm:text-xs font-medium ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {tip}
                </p>
              </motion.div>
            </div>

            {/* Enhanced Dots Animation */}
            <div className="flex gap-2 sm:gap-3">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.6, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                    i % 4 === 0
                      ? "bg-blue-500"
                      : i % 4 === 1
                        ? "bg-purple-500"
                        : i % 4 === 2
                          ? "bg-pink-500"
                          : "bg-green-500"
                  } shadow-lg`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
