import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero({ t, isRTL }) {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={"/login"}>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                {t.cta}
                <ArrowRight className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
              </Button>
            </Link>
            <a
              href="#features"
              className=" py-2 px-3 text-lg bg-gray-300 dark:bg-gray-600 rounded-xl border-gray-300 dark:text-white"
            >
              {t.learnMore}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
