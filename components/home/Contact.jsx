"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-hot-toast";
import { Send } from "lucide-react";

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
      toast.error(t?.toastError || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="landing-section bg-gray-50 dark:bg-gray-900/50">
      <div className="landing-container max-w-2xl">
        <div className="text-center mb-10">
          <div className="section-divider mx-auto" />
          <h2 className="section-heading">{t.title}</h2>
          <p className="section-subheading mx-auto">{t.subtitle}</p>
        </div>

        <form ref={formRef} onSubmit={handleSendEmail} className="contact-form-wrapper">
          <div className="space-y-5">
            <div>
              <label htmlFor="contact-email" className="contact-label">
                {t.emailLabel}
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                required
                placeholder={t.emailPlaceholder || t.emailLabel}
                className="contact-input"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="contact-label">
                {t.messageLabel}
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                required
                placeholder={t.messagePlaceholder || t.messageLabel}
                className="contact-input resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-landing-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>{t.sending || "Sending..."}</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.submit}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
