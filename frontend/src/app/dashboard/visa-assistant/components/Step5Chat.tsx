"use client";

import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import type { RefObject } from "react";
import type { ChatMessage } from "../constants";
import { QUICK_QUESTIONS } from "../constants";

interface Props {
  destination: string;
  visaType: string;
  messages: ChatMessage[];
  chatInput: string;
  setChatInput: (v: string) => void;
  chatLoading: boolean;
  chatEndRef: RefObject<HTMLDivElement>;
  onSendMessage: (text?: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step5Chat({
  destination, visaType,
  messages, chatInput, setChatInput, chatLoading, chatEndRef,
  onSendMessage, onBack, onNext,
}: Props) {
  return (
    <div>
      <div className="border-l-4 border-primary-500 pl-4 mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ask the visa assistant</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Instant answers about your application, embassy requirements, and common mistakes
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-600 overflow-hidden mb-7 shadow-sm">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">🤖</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">Tundua Visa AI</div>
            <div className="text-xs opacity-75">
              {destination ? `${destination} ${visaType} specialist` : "Nigerian visa specialist"}
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs opacity-75">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 max-h-72 overflow-y-auto bg-gray-50 dark:bg-gray-900 flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "bot" && (
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mb-0.5">
                  AI
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-br-sm shadow-md shadow-primary-500/20"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-bl-sm shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex items-end gap-2 justify-start">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mb-0.5">AI</div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex gap-1.5">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div key={i} className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-bounce" style={{ animationDelay: `${delay}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick chips */}
        <div className="flex gap-2 flex-wrap px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => onSendMessage(q)}
              disabled={chatLoading}
              className="px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-400 hover:border-primary-400 hover:text-primary-600 dark:hover:border-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 disabled:opacity-50 transition-all duration-200"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 p-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSendMessage()}
            placeholder="Ask anything about your visa application..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
            disabled={chatLoading}
          />
          <button
            onClick={() => onSendMessage()}
            disabled={!chatInput.trim() || chatLoading}
            className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center shadow-md shadow-primary-500/25 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 transition-all duration-200 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button onClick={onNext} className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          View Timeline <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
