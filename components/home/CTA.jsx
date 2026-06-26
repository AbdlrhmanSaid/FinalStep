import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA({ t, isRTL }) {
  return (
    <section className="cta-section">
      <div className="landing-container relative z-10">
        <h2>{t.title}</h2>
        <p>{t.subtitle}</p>
        <Link href="/dashboard" className="btn-cta-white">
          {t.button}
          <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
        </Link>
      </div>
    </section>
  );
}
