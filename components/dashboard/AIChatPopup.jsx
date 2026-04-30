"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, User, Loader2, Expand, Minimize } from "lucide-react";
import axios from "axios";
import { useAppContext } from "@/contexts/AppContext";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AIChatPopup() {
  const { isRTL, currentUser } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isExpand, setIsExpand] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: isRTL
        ? "مرحباً! أنا المساعد الذكي، كيف يمكنني مساعدتك اليوم؟"
        : "Hello! I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitTimer, setRateLimitTimer] = useState(0);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Rate limit countdown
  useEffect(() => {
    if (rateLimitTimer > 0) {
      const timer = setTimeout(
        () => setRateLimitTimer((prev) => prev - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [rateLimitTimer]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        message: userMessage.content,
        userId: currentUser?._id,
        userName: currentUser?.name,
      });

      if (response.data.isRateLimited) {
        setRateLimitTimer(60);
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: response.data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: isRTL
            ? "عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي."
            : "Sorry, an error occurred while connecting to the AI.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 ${isRTL ? "left-6" : "right-6"} w-14 h-14 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-white rounded-full shadow-xl shadow-violet-500/20 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-999 ${isOpen ? "hidden" : "flex"} overflow-hidden border-2 border-violet-500/50`}
      >
        <Image
          src="/assets/images/Steppi.png"
          alt="Steppi "
          width={56}
          height={56}
          className="w-full h-full object-contain p-1"
        />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-999 transition-all duration-300 ease-in-out flex flex-col overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 
      ${
        isExpand
          ? "inset-0 sm:inset-4 sm:w-[calc(100%-32px)] sm:h-[calc(100%-32px)] sm:max-h-none rounded-none sm:rounded-3xl"
          : `inset-0 sm:inset-auto sm:bottom-6 ${isRTL ? "sm:left-6" : "sm:right-6"} w-full sm:w-[400px] h-dvh sm:h-[500px] sm:max-h-[80vh] rounded-none sm:rounded-3xl`
      } 
      animate-in slide-in-from-bottom-5`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-linear-to-r from-violet-600 to-indigo-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20 shrink-0">
                <Image
                  src="/assets/images/Steppi.png"
                  alt="Steppi "
                  width={40}
                  height={40}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm">Steppi </h3>
                <p className="text-xs text-white/70">
                  {isRTL ? "متصل الآن" : "Online"}
                </p>
              </div>
            </div>
            <div className="flex">
              <button
                onClick={() => setIsExpand(!isExpand)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                {isExpand ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Expand className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] w-fit ${
                  msg.role === "user" ? "ms-auto flex-row-reverse" : "me-auto"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${
                    msg.role === "user"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                      : "bg-transparent border border-violet-500/30 shadow-sm"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Image
                      src="/assets/images/Steppi.png"
                      alt="Steppi "
                      width={32}
                      height={32}
                      className="w-full h-full object-contain p-1"
                    />
                  )}
                </div>
                <div
                  className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? `bg-blue-600 text-white ${isRTL ? "rounded-tl-none" : "rounded-tr-none"}`
                      : `bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 ${isRTL ? "rounded-tr-none" : "rounded-tl-none"}`
                  } ${msg.isError ? "border-red-500 text-red-600" : ""}`}
                  dir={msg.role === "user" ? (isRTL ? "rtl" : "ltr") : "auto"}
                >
                  {msg.role === "user" ? (
                    <div
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.content}
                    </div>
                  ) : (
                    <div className="markdown-content">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => (
                            <p className="mb-2 last:mb-0" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              className="list-disc ms-5 mb-2 space-y-1"
                              {...props}
                            />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol
                              className="list-decimal ms-5 mb-2 space-y-1"
                              {...props}
                            />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="" {...props} />
                          ),
                          h1: ({ node, ...props }) => (
                            <h1
                              className="text-lg font-bold mb-2 text-violet-700 dark:text-violet-400"
                              {...props}
                            />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2
                              className="text-base font-bold mb-2 text-violet-700 dark:text-violet-400"
                              {...props}
                            />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3
                              className="text-sm font-bold mb-2 text-violet-700 dark:text-violet-400"
                              {...props}
                            />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong
                              className="font-bold text-violet-700 dark:text-violet-400"
                              {...props}
                            />
                          ),
                          a: ({ node, ...props }) => (
                            <a
                              className="text-blue-500 hover:underline"
                              target="_blank"
                              rel="noreferrer"
                              {...props}
                            />
                          ),
                          code: ({ node, inline, ...props }) =>
                            inline ? (
                              <code
                                className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-rose-500 font-mono text-xs"
                                {...props}
                              />
                            ) : (
                              <pre
                                className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg overflow-x-auto text-xs my-2 font-mono"
                                dir="ltr"
                              >
                                <code {...props} />
                              </pre>
                            ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-transparent border border-violet-500/30 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                  <Image
                    src="/assets/images/Steppi.png"
                    alt="Steppi "
                    width={32}
                    height={32}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div
                  className={`p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 ${isRTL ? "rounded-tr-none" : "rounded-tl-none"} flex items-center gap-2`}
                >
                  <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                  <span className="text-xs text-gray-500">
                    {isRTL ? "جاري التفكير..." : "Thinking..."}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2"
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (message.trim() && !isLoading && rateLimitTimer === 0) {
                    handleSendMessage(e);
                  }
                }
              }}
              rows={
                message.split("\n").length > 1
                  ? Math.min(message.split("\n").length, 4)
                  : 1
              }
              placeholder={
                rateLimitTimer > 0
                  ? (isRTL
                    ? `يرجى الانتظار ${rateLimitTimer} ثانية...`
                    : `Please wait ${rateLimitTimer}s...`)
                  : (isRTL
                    ? "اكتب رسالتك هنا..."
                    : "Type your message...")
              }
              disabled={rateLimitTimer > 0 || isLoading}
              className={`flex-1 bg-gray-100 dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white resize-none ${rateLimitTimer > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading || rateLimitTimer > 0}
              className="w-10 h-10 shrink-0 flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white rounded-xl disabled:opacity-50 transition-colors self-end"
            >
              <Send className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
