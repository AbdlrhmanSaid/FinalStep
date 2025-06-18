import { GraduationCap } from "lucide-react";

export default function About({ t, isRTL }) {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8 ">
          <div className="flex-1">
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {t.description}
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <GraduationCap className="h-32 w-32 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
