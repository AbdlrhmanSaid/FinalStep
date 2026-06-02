import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA({ t, isRTL }) {
  return (
    <section className="py-24 bg-indigo-600 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">{t.title}</h2>
        <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">{t.subtitle}</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-xl">
          {t.button}
          <ArrowRight className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
        </Link>
      </div>
    </section>
  );
}
