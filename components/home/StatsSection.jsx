export default function StatsSection({ isRTL }) {
  const stats = isRTL
    ? [
        { number: "100%", label: "مجاني بالكامل" },
        { number: "∞", label: "مشاريع غير محدودة" },
        { number: "2", label: "لغة مدعومة" },
        { number: "24/7", label: "مساعد ذكي متاح" },
      ]
    : [
        { number: "100%", label: "Completely Free" },
        { number: "∞", label: "Unlimited Projects" },
        { number: "2", label: "Languages Supported" },
        { number: "24/7", label: "AI Assistant Available" },
      ];

  return (
    <section className="landing-section bg-white dark:bg-gray-950">
      <div className="landing-container">
        <div className="stats-strip">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
