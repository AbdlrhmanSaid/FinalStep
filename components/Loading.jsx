"use client";

import { useAppContext } from "../contexts/AppContext";
import { translations } from "../lib/translations";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Zap } from "lucide-react";

export default function ModernLoading() {
  const { language, isDark } = useAppContext();
  const content = translations[language]?.loading || "Loading...";

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDark ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"}`}>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${isDark ? "bg-blue-500/10" : "bg-blue-500/5"}`}
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Loading Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className={`relative rounded-3xl p-10 backdrop-blur-xl border ${
          isDark 
            ? "bg-gray-800/80 border-gray-700/50 shadow-2xl shadow-blue-500/10" 
            : "bg-white/80 border-gray-200/50 shadow-2xl shadow-blue-500/20"
        }`}>
          {/* Decorative Elements */}
          <div className="absolute -top-6 -right-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className={`w-12 h-12 rounded-full ${
                isDark ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-gradient-to-br from-blue-400 to-purple-500"
              } flex items-center justify-center shadow-lg`}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
          </div>

          <div className="absolute -bottom-6 -left-6">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className={`w-12 h-12 rounded-full ${
                isDark ? "bg-gradient-to-br from-purple-500 to-pink-600" : "bg-gradient-to-br from-purple-400 to-pink-500"
              } flex items-center justify-center shadow-lg`}
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-8 min-w-[320px]">
            {/* Animated Logo/Icon */}
            <div className="relative">
              {/* Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className={`w-24 h-24 rounded-full border-4 ${
                  isDark ? "border-blue-500/30" : "border-blue-400/30"
                } border-t-transparent`} />
              </motion.div>

              {/* Middle Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2"
              >
                <div className={`w-20 h-20 rounded-full border-4 ${
                  isDark ? "border-purple-500/30" : "border-purple-400/30"
                } border-b-transparent`} />
              </motion.div>

              {/* Center Icon */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center ${
                  isDark 
                    ? "bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" 
                    : "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"
                } shadow-2xl`}
              >
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </motion.div>
            </div>

            {/* Text Content */}
            <div className="text-center space-y-3">
              <motion.h2
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {content}
              </motion.h2>
              
              <motion.p
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {translations[language]?.loadingSubtitle || "Preparing your experience..."}
              </motion.p>
            </div>

            {/* Progress Bar */}
            <div className="w-full space-y-2">
              <div className={`w-full h-2 rounded-full overflow-hidden ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              }`}>
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-full w-1/3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                />
              </div>

              {/* Loading Tips */}
              <motion.p
                key={Math.random()} // Force re-render for random tip
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`text-xs text-center ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                {translations[language]?.loadingTips?.[
                  Math.floor(Math.random() * (translations[language]?.loadingTips?.length || 1))
                ] || "Optimizing performance..."}
              </motion.p>
            </div>

            {/* Dots Animation */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className={`w-2 h-2 rounded-full ${
                    isDark ? "bg-blue-500" : "bg-blue-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
