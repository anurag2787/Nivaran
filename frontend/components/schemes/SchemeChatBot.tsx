"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { api } from "@/services/api";
import { Scheme } from "@/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  schemes?: Scheme[];
  source?: "gemini" | "local-rule";
  timestamp: string;
}

const QUICK_PROMPTS = [
  { label: "🎓 College Student Scholarships", text: "I am a college student from a low-income family. Which government scholarships can I apply for?" },
  { label: "🏠 Subsidies for Building a House", text: "I want to build a pucca house for my family. Which housing schemes provide financial subsidy?" },
  { label: "💼 Loan for Small Business / Vendor", text: "I am a street vendor and need working capital loan to expand my small stall. What schemes help me?" },
  { label: "🏥 Free Healthcare & Treatment", text: "I need free medical treatment and health insurance for my family up to ₹5 Lakh. What scheme covers this?" },
  { label: "👩 Women Entrepreneurship & Grants", text: "What government welfare schemes provide financial support and loans for women entrepreneurs?" },
];

interface SchemeChatBotProps {
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

export function SchemeChatBot({ isOpenExternal, onCloseExternal }: SchemeChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Namaste! 🙏 I am Nivaran Mitra, your official Government Scheme Discovery Advisor.\n\nTell me about yourself — your age, occupation (e.g. student, farmer, artisan, street vendor), household income, or specific need — and I'll find the exact government welfare programs you qualify for!",
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external open state if provided
  useEffect(() => {
    if (typeof isOpenExternal === "boolean") {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  const handleToggle = (openState: boolean) => {
    setIsOpen(openState);
    if (!openState && onCloseExternal) {
      onCloseExternal();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Format chat history for context
    const historyPayload = messages
      .filter((m) => m.id !== "welcome-1")
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    try {
      const response = await api.askSchemeAdvisor(trimmed, historyPayload);

      const assistantMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: response.reply,
        schemes: response.schemes || [],
        source: response.source,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content:
            "I apologize, I encountered a temporary connection issue. Please check your query or verify your backend server connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content:
          "Conversation reset. How can I help you discover citizen schemes today? Share your age, background, or what you're seeking assistance for.",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => handleToggle(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-2xl hover:shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all duration-300 border border-emerald-400/40 cursor-pointer"
          aria-label="Open AI Scheme Advisor"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
          </span>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-wide uppercase flex items-center gap-1.5">
              <span>✨ Ask Nivaran Mitra</span>
            </span>
            <span className="text-[10px] text-emerald-100 font-medium opacity-90">
              AI Scheme Advisor
            </span>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[460px] md:w-[490px] h-[640px] max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white border-b border-emerald-800/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xl shadow-inner border border-white/20">
                🇮🇳
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-tight text-white">Nivaran Mitra</h3>
                </div>
                <p className="text-[11px] text-slate-300">
                  Government Welfare Scheme Discovery Counselor
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear Conversation"
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-xs font-semibold"
              >
                Reset
              </button>
              <button
                onClick={() => handleToggle(false)}
                title="Minimize Chat"
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-sm"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const cleanContent = msg.content.replace(/\*\*/g, "");
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed shadow-xs ${
                      isUser
                        ? "bg-emerald-600 text-white rounded-br-xs font-medium"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700/60"
                    }`}
                  >
                    {/* Message Body */}
                    <div className="whitespace-pre-wrap space-y-1.5 font-sans">
                      {cleanContent}
                    </div>

                    {/* Matched Scheme Cards */}
                    {msg.schemes && msg.schemes.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <span>🎯 Matched Citizen Schemes ({msg.schemes.length}):</span>
                        </div>

                        {msg.schemes.map((scheme) => (
                          <div
                            key={scheme.id || (scheme as any)._id}
                            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                                {scheme.category}
                              </span>
                              <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                                {scheme.ministry}
                              </span>
                            </div>

                            <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 mb-1">
                              {scheme.title}
                            </h4>

                            <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mb-2">
                              {scheme.description}
                            </p>

                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                              <Link
                                href={`/schemes/${scheme.id || (scheme as any)._id}`}
                                className="text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600"
                              >
                                Details →
                              </Link>
                              <a
                                href={scheme.applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                              >
                                Apply Official ↗
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-xs border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-xs">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                    <span>Analyzing schemes for you...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Prompts on initial conversation */}
            {messages.length === 1 && !isLoading && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Suggested Questions:
                </p>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(qp.text)}
                      className="text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-500/50 transition-colors text-slate-700 dark:text-slate-200 cursor-pointer font-medium"
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your situation (e.g. 22yo student, income 1.5L)..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              >
                Send
              </button>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-1.5">
              Nivaran Mitra provides automated discovery guidance. Verify requirements on official portals.
            </p>
          </form>
        </div>
      )}
    </>
  );
}
