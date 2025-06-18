import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTA({ t, isRTL }) {
  return (
    <section className="py-20 bg-blue-600 dark:bg-blue-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t.title}
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
        <Button
          size="lg"
          className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
        >
          {t.button}
          <ArrowRight className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
        </Button>
      </div>
    </section>
  );
}
