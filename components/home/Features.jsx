import { Route, Users, CircleCheck, ShieldCheck, Bot } from "lucide-react";

export default function Features({ t, isRTL }) {
  const featureIcons = [Route, Users, CircleCheck, ShieldCheck, Bot];

  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">{t.subtitle}</p>
        </div>
        
        <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {t.items.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              <div key={index} className="group p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
