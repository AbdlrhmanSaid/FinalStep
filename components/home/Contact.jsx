"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-hot-toast";

export default function Contact({ t, isRTL }) {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );
      toast.success(t?.toastSuccess || "Message sent successfully!");
      formRef.current.reset();
    } catch (error) {
      console.error("Email sending error:", error);
      toast.error(t?.toastError || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">{t.subtitle}</p>
        </div>

        <form ref={formRef} onSubmit={handleSendEmail} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 md:p-12 rounded-3xl shadow-lg">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {t.emailLabel}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder={t.emailPlaceholder || t.emailLabel}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-shadow"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
              >
                {t.messageLabel}
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                placeholder={t.messagePlaceholder || t.messageLabel}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-shadow resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? t.sending || "Sending..." : t.submit}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
