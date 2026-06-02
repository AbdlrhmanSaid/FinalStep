import Image from "next/image";

export default function About({ t, isRTL }) {
  return (
    <section id="about" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-start lg:pr-8 rtl:lg:pl-8 rtl:lg:pr-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t.title}
            </h2>
            <p className="text-xl text-indigo-600 dark:text-indigo-400 mb-6 font-semibold">
              {t.subtitle}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {t.description}
            </p>
          </div>
          <div className="shrink-0 relative">
            <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl"></div>
            <div className="relative w-48 h-48 md:w-64 md:h-64 bg-white dark:bg-gray-950 rounded-full border-8 border-gray-50 dark:border-gray-900 shadow-2xl flex items-center justify-center p-8">
              <Image
                src="/assets/images/icon.png"
                alt="FinalStep Logo"
                width={160}
                height={160}
                className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
