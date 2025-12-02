import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero({ t, isRTL }) {
  return (
    <>
      <section className="hero bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container hero-wrapper">
          <div className="hero-content">
            <h1 className="text-gray-600 dark:text-gray-300">{t.title}</h1>

            <p className="text-gray-600 dark:text-gray-300">{t.subtitle}</p>

            <div className="hero-buttons">
              <Link href="/login" className="btn-primary">
                {t.cta}
                <ArrowRight className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
              </Link>
              <a href="#features" className="btn-secondary">
                {t.learnMore}
              </a>
            </div>
          </div>

          <div className="hero-image">
            <Image
              src="/assets/images/fin.jpg"
              alt="Students collaborating on a project"
              width={500}
              height={500}
            />
          </div>
        </div>
      </section>
    </>
  );
}
