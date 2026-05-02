import { Route, Users, CircleCheck, ShieldCheck, Bot } from "lucide-react";

export default function Features({ t, isRTL }) {
  const featureIcons = [Route, Users, CircleCheck, ShieldCheck, Bot];

  return (
    <>
      <section id="features" className="section bg-white dark:bg-gray-900">
        <div className="container">
          <div className="section-header">
            <h2 className="text-gray-900 dark:text-white">{t.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t.subtitle}</p>
          </div>
          <div className="features-grid">
            {t.items.map((feature, index) => {
              const Icon = featureIcons[index];
              return (
                <div className="feature-card group" key={index}>
                  <div className="feature-icon">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400 transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
