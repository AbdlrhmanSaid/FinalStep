import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero({ t, isRTL }) {
  return (
    <section className="hero-section bg-white dark:bg-gray-950 h-screen">
      {/* Aurora Background */}
      <div className="aurora-wrapper">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      <div className="landing-container relative z-10 flex items-center h-full">
        <div className="max-w-3xl mx-auto text-center ">
          <h1 className="hero-title animate-fade-in-up">{t.title}</h1>

          <p className="hero-subtitle animate-fade-in-up delay-100 mx-auto">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up delay-200">
            <Link
              href="/login"
              className="btn-landing-primary w-full sm:w-auto"
            >
              {t.cta}
              <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </Link>
            <a
              href="#features"
              className="btn-landing-secondary w-full sm:w-auto"
            >
              {t.learnMore}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
