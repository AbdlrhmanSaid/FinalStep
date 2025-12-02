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
    <section id="contact" className="section contact-section">
      <div className="container contact-container">
        <div className="section-header text-center">
          <h2 className="text-gray-900 dark:text-white">{t.title}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t.subtitle}</p>
        </div>

        <form ref={formRef} onSubmit={handleSendEmail} className="contact-form">
          <div className="form-group">
            <label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              {t.emailLabel}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder={t.emailPlaceholder || t.emailLabel}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="message"
              className="text-gray-700 dark:text-gray-300"
            >
              {t.messageLabel}
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              placeholder={t.messagePlaceholder || t.messageLabel}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full md:w-auto px-8 py-3 text-lg font-medium"
          >
            {loading ? t.sending || "Sending..." : t.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
