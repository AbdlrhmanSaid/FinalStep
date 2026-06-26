import Image from "next/image";
import { Bot, Sparkles, ArrowRight, User } from "lucide-react";
import Link from "next/link";

export default function AIAssistantSection({ t, isRTL }) {
  const chatMessages = isRTL
    ? [
        { type: "user", text: "إيه المهام اللي عليا النهارده؟" },
        { type: "bot", text: "عندك 3 مهام مفتوحة: تسليم التقرير النهائي (أولوية عالية)، مراجعة التصميم، وتحديث التوثيق. التقرير موعده بكرة!" },
        { type: "user", text: "مين ممكن يساعدني في التصميم؟" },
        { type: "bot", text: "بناءً على فريقك، أحمد ومريم متاحين وعندهم خبرة في التصميم. تحب أعينهم على المهمة؟" },
      ]
    : [
        { type: "user", text: "What tasks do I have today?" },
        { type: "bot", text: "You have 3 open tasks: Submit Final Report (high priority), Review Design, and Update Docs. The report is due tomorrow!" },
        { type: "user", text: "Who can help me with the design?" },
        { type: "bot", text: "Based on your team, Ahmed and Mariam are available and have design experience. Would you like me to assign them?" },
      ];

  return (
    <section className="landing-section bg-white dark:bg-gray-950">
      <div className="landing-container">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          {/* Left: Info */}
          <div className="lg:w-5/12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.badge}</span>
            </div>

            <h2 className="section-heading mb-3">
              {t.title}
            </h2>

            <p className="text-base text-gray-600 dark:text-gray-400 mb-3 font-medium leading-relaxed">
              {t.subtitle}
            </p>

            <p className="section-subheading mb-6">
              {t.description}
            </p>

            <Link href="/dashboard" className="btn-landing-primary">
              <Bot className="w-4 h-4" />
              <span>{t.cta}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </Link>
          </div>

          {/* Right: Chat Mockup */}
          <div className="lg:w-7/12 w-full">
            <div className="ai-chat-mockup shadow-lg">
              {/* Chat Header */}
              <div className="ai-chat-header">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Image
                    src="/assets/images/Steppi.png"
                    alt="Steppi"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">Steppi</div>
                  <div className="text-xs text-green-500 font-medium">{isRTL ? "متصل الآن" : "Online"}</div>
                </div>
              </div>

              {/* Chat Body */}
              <div className="ai-chat-body">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`ai-msg ai-msg-${msg.type === "user" ? "user" : "bot"}`}>
                    <div
                      className={`ai-msg-avatar ${
                        msg.type === "user"
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          : "bg-indigo-100 dark:bg-indigo-500/20 overflow-hidden"
                      }`}
                    >
                      {msg.type === "user" ? (
                        <User className="w-3.5 h-3.5" />
                      ) : (
                        <Image
                          src="/assets/images/Steppi.png"
                          alt="Steppi"
                          width={28}
                          height={28}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <div className="ai-msg-bubble">{msg.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
