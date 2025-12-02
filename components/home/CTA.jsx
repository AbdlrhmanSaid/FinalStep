import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA({ t, isRTL }) {
  return (
    <>
      <section className="cta">
        <div className="container cta-content">
          <h2> {t.title}</h2>
          <p>{t.subtitle}</p>
          <Link href="/dashboard" className="btn-white">
            {t.button}{" "}
            <ArrowRight className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
          </Link>
        </div>
      </section>
    </>
  );
}
