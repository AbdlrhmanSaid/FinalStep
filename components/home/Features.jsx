import { Route, Users, CircleCheck, ShieldCheck, Bot } from "lucide-react";

export default function Features({ t, isRTL }) {
  const featureIcons = [Route, Users, CircleCheck, ShieldCheck, Bot];

  return (
    <section id="features" className="landing-section bg-gray-50 dark:bg-gray-900/50">
      <div className="landing-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="section-divider mx-auto" />
          <h2 className="section-heading">{t.title}</h2>
          <p className="section-subheading mx-auto">{t.subtitle}</p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.items.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              <div
                key={index}
                className="feature-card group"
              >
                <div className="feature-icon-box">
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
