import { GraduationCap } from "lucide-react";

export default function About({ t, isRTL }) {
  return (
    <>
      <section id="about" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="text-gray-900 dark:text-white">{t.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t.subtitle}</p>
          </div>
          <div className="about-content bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <p className="about-text text-gray-600 dark:text-gray-300">
              {t.description}
            </p>
            <div className="about-icon">
              <GraduationCap className="h-32 w-32 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
