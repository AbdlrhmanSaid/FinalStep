"use client";

import { useAppContext } from "../contexts/AppContext";
import { translations } from "../lib/translations";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Zap, Rocket } from "lucide-react";

export default function ModernLoading() {
  const { language, isDark } = useAppContext();
  const content = translations[language]?.loading || "Loading...";

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br ${
      isDark 
        ? "from-gray-900 via-gray-800 to-gray-900" 
        : "from-gray-50 via-gray-100 to-gray-50"
    }`}>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              isDark 
                ? i % 3 === 0 ? "bg-blue-500/10" : i % 3 === 1 ? "bg-purple-500/10" : "bg-pink-500/10"
                : i % 3 === 0 ? "bg-blue-500/5" : i % 3 === 1 ? "bg-purple-500/5" : "bg-pink-500/5"
            }`}
            style={{
              width: Math.random() * 150 + 100,
              height: Math.random() * 150 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
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
        className="relative z-10"
      >
        <div className={`relative rounded-3xl p-12 backdrop-blur-xl border shadow-2xl ${
          isDark 
            ? "bg-gray-800/90 border-gray-700/50 shadow-blue-500/20" 
            : "bg-white/90 border-gray-200/50 shadow-blue-500/30"
        }`}>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -ml-12 -mb-12 blur-2xl" />

          <div className="flex flex-col items-center gap-8 min-w-[340px] relative">
            {/* Animated Logo/Icon */}
            <div className="relative">
              {/* Outer Ring - Blue */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className={`w-28 h-28 rounded-full border-[3px] ${
                  isDark ? "border-blue-500/40" : "border-blue-500/40"
                } border-t-transparent`} />
              </motion.div>

              {/* Middle Ring - Purple */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2"
              >
                <div className={`w-24 h-24 rounded-full border-[3px] ${
                  isDark ? "border-purple-500/40" : "border-purple-500/40"
                } border-b-transparent`} />
              </motion.div>

              {/* Inner Ring - Pink */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4"
              >
                <div className={`w-20 h-20 rounded-full border-[3px] ${
                  isDark ? "border-pink-500/40" : "border-pink-500/40"
                } border-r-transparent`} />
              </motion.div>

              {/* Center Icon with Gradient */}
              <motion.div
                animate={{ 
                  scale: [1, 1.08, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className={`relative w-28 h-28 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-2xl`}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Rocket className="w-14 h-14 text-white relative z-10" />
                
                {/* Sparkle Effects */}
                <motion.div
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
                <motion.div
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-2 -left-2"
                >
                  <Zap className="w-5 h-5 text-blue-300" />
                </motion.div>
              </motion.div>
            </div>

            {/* Text Content */}
            <div className="text-center space-y-3">
              <motion.h2
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent`}
              >
                {content}
              </motion.h2>
              
              <motion.p
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {translations[language]?.loadingSubtitle || "Preparing your experience..."}
              </motion.p>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="w-full space-y-3">
              <div className={`w-full h-2.5 rounded-full overflow-hidden ${
                isDark ? "bg-gray-700/50" : "bg-gray-200/70"
              } shadow-inner`}>
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

              {/* Loading Tips */}
              <motion.div
                key={Math.random()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center gap-2"
              >
                <div className={`w-1.5 h-1.5 rounded-full ${
                  isDark ? "bg-blue-400" : "bg-blue-500"
                }`} />
                <p className={`text-xs font-medium ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>
                  {translations[language]?.loadingTips?.[
                    Math.floor(Math.random() * (translations[language]?.loadingTips?.length || 1))
                  ] || "Optimizing performance..."}
                </p>
              </motion.div>
            </div>

            {/* Enhanced Dots Animation */}
            <div className="flex gap-3">
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
                  className={`w-2.5 h-2.5 rounded-full ${
                    i % 3 === 0 
                      ? "bg-blue-500" 
                      : i % 3 === 1 
                      ? "bg-purple-500" 
                      : "bg-pink-500"
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
