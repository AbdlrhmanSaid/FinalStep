import Image from "next/image";
import { Bot, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AIAssistantSection({ t, isRTL }) {
  return (
    <section className="section bg-gray-50/50 dark:bg-gray-800/50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-start">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Sparkles className="w-4 h-4" />ب<span>{t.badge}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t.title}
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 font-medium">
              {t.subtitle}
            </p>

            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {t.description}
            </p>

            <Link
              href="/dashboard"
              className="btn-primary inline-flex items-center gap-2 group"
            >
              <Bot className="w-5 h-5" />
              <span>{t.cta}</span>
              <ArrowRight
                className={`w-4 h-4 transition-transform group-hover:${isRTL ? "-translate-x-1" : "translate-x-1"} ${isRTL ? "rotate-180" : ""}`}
              />
            </Link>
          </div>

          {/* Visual/Image Content */}
          <div className="flex-1 w-full max-w-md lg:max-w-none relative">
            <div className="relative aspect-square md:aspect-video lg:aspect-square w-full rounded-3xl bg-linear-to-br from-violet-600/5 to-blue-600/5 border border-violet-500/10 dark:border-violet-500/20 shadow-2xl flex items-center justify-center p-8 overflow-hidden backdrop-blur-sm">
              {/* Pulsing rings */}
              <div
                className="absolute w-64 h-64 border border-violet-500/20 rounded-full animate-ping"
                style={{ animationDuration: "3s" }}
              ></div>
              <div
                className="absolute w-96 h-96 border border-blue-500/10 rounded-full animate-ping"
                style={{ animationDuration: "4s", animationDelay: "1s" }}
              ></div>

              <div className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-white dark:bg-gray-900 shadow-xl flex items-center justify-center p-6 border-4 border-violet-500/20">
                <Image
                  src="/assets/images/Steppi.png"
                  alt="Steppi AI Assistant"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
