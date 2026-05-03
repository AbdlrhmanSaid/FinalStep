import { GraduationCap } from "lucide-react";
import Image from "next/image";

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
              <Image
                src="/assets/images/icon.png"
                alt="Steppi"
                width={128}
                height={128}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
