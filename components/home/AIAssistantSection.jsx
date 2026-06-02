import Image from "next/image";
import { Bot, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AIAssistantSection({ t, isRTL }) {
  return (
    <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 lg:pr-8 rtl:lg:pl-8 rtl:lg:pr-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>{t.badge}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {t.title}
            </h2>
            
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 font-medium">
              {t.subtitle}
            </p>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {t.description}
            </p>
            
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            >
              <Bot className="w-5 h-5" />
              <span>{t.cta}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </Link>
          </div>
          
          <div className="flex-1 w-full max-w-md lg:max-w-none relative">
            <div className="relative aspect-square md:aspect-video lg:aspect-square w-full rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center p-8 overflow-hidden shadow-2xl group">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-700"></div>
               <div className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-white dark:bg-gray-950 shadow-2xl flex items-center justify-center p-8 border border-gray-100 dark:border-gray-800">
                <Image
                  src="/assets/images/Steppi.png"
                  alt="Steppi AI Assistant"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
