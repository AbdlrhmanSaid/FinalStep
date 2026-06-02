import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero({ t, isRTL }) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-gray-950">
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10 px-4 mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-start lg:pr-10 rtl:lg:pl-10 rtl:lg:pr-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
              {t.title}
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25 w-full sm:w-auto"
              >
                {t.cta}
                <ArrowRight
                  className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`}
                />
              </Link>
              <a
                href="#features"
                className="flex items-center justify-center gap-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 hover:border-indigo-600 dark:hover:border-indigo-500 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 w-full sm:w-auto"
              >
                {t.learnMore}
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
            <div className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-500">
              <Image
                src="/assets/images/fin.jpg"
                alt="Dashboard Preview"
                width={600}
                height={600}
                className="w-full h-auto rounded-xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
