import Image from "next/image";

export default function About({ t, isRTL }) {
  return (
    <section id="about" className="landing-section bg-white dark:bg-gray-950">
      <div className="landing-container">
        <div className="about-card">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-start">
              <div className="section-divider mx-auto lg:mx-0" />
              <h2 className="section-heading mb-3">{t.title}</h2>
              <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
                {t.subtitle}
              </p>
              <p className="section-subheading">{t.description}</p>
            </div>
            <div className="shrink-0">
              <div className="w-36 h-36 md:w-44 md:h-44 bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg flex items-center justify-center p-6">
                <Image
                  src="/assets/images/icon.png"
                  alt="FinalStep Logo"
                  width={140}
                  height={140}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
