"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Loader2, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useAppContext } from "@/contexts/AppContext";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateProjectAI() {
  const { isRTL, currentUser } = useAppContext();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: isRTL
        ? "مرحباً! أنا Steppi ، المساعد الذكي الخاص بك. \nأنا هنا لمساعدتك في التخطيط لمشروعك الجديد وإنشائه بالكامل! \n\nأخبرني: **ما هو اسم المشروع الذي تفكر فيه؟ وما هي فكرته العامة؟**"
        : "Hello! I am Steppi , your AI assistant. \nI'm here to help you plan and fully create your new project! \n\nTell me: **What is the name of the project you have in mind? And what is the general idea?**",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/projects/create"
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft
              className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${isRTL ? "rotate-180" : ""}`}
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-500" />
            {isRTL ? "منشئ المشاريع الذكي" : "AI Project Creator"}
          </h1>
        </div>
      </div>

      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col h-[75vh] sm:h-[80vh] overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 scroll-smooth bg-gray-50/30 dark:bg-gray-900/30">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-4 sm:gap-6 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 ${
                  msg.role === "user"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                    : "bg-white dark:bg-gray-800"
                }`}
              >
                {msg.role === "user" ? (
                  <User size={20} />
                ) : (
                  <Image
                    src="/assets/images/Steppi.png"
                    alt="Steppi"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain p-1"
                  />
                )}
              </div>
              <div
                className={`${
                  msg.role === "user"
                    ? "max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm text-sm sm:text-base leading-relaxed bg-blue-600 text-white"
                    : msg.isError
                      ? "w-full max-w-[95%] rounded-2xl px-5 py-4 text-sm sm:text-base leading-relaxed bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/50"
                      : "w-full flex-1 rounded-xl px-2 sm:px-4 py-2 text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-100"
                }`}
                dir={msg.role === "user" ? "auto" : isRTL ? "rtl" : "ltr"}
              >
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div
                    className={`markdown-content prose prose-sm sm:prose-base dark:prose-invert max-w-none ${msg.role === "user" ? "prose-p:text-white prose-headings:text-white prose-strong:text-white" : ""}`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div
              className={`flex items-start gap-4 sm:gap-6 ${isRTL ? "flex-row" : ""}`}
            >
              <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                <Image
                  src="/assets/images/Steppi.png"
                  alt="Steppi"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="flex-1 px-2 sm:px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <form
            onSubmit={handleSendMessage}
            className="flex items-end gap-3 relative"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder={
                isRTL
                  ? "اشرح فكرة مشروعك هنا..."
                  : "Describe your project idea here..."
              }
              className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 sm:py-4 focus:outline-hidden focus:ring-2 focus:ring-violet-500/50 resize-none h-[52px] sm:h-[60px] max-h-[150px] transition-all text-sm sm:text-base text-gray-900 dark:text-white"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] shrink-0 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className={`w-6 h-6 ${isRTL ? "rotate-180" : ""}`} />
              )}
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isRTL
                ? "Steppi يمكنه ارتكاب أخطاء. يرجى مراجعة المهام والأقسام بعد الإنشاء."
                : "Steppi can make mistakes. Please review the generated tasks and sections."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
