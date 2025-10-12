"use client";
import { useState, useEffect, useRef } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  responseType?: string;
  actionSuggestions?: string[];
}

export default function EnhancedAIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "👋 Hello! I'm Mohamed's AI assistant, powered by advanced language models. I have comprehensive knowledge about his professional background, technical expertise, and project portfolio. How can I assist you today?",
          timestamp: new Date(),
          responseType: "greeting",
          actionSuggestions: [
            "What are Mohamed's technical skills?",
            "Show me his featured projects",
            "Download CV PDF now",
            "How can I hire Mohamed?",
          ],
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setShowThinking(true);

    // Simulate AI thinking time (realistic delay)
    const thinkingDelay = Math.random() * 1500 + 800; // 800-2300ms

    try {
      // Show thinking indicator
      await new Promise((resolve) => setTimeout(resolve, thinkingDelay));
      setShowThinking(false);
      setIsTyping(true);

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages.slice(-6), // Send last 6 messages for context
          visitorIntent: "GENERAL", // You can enhance this based on message analysis
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Simulate typing delay based on response length
        const typingDelay = Math.min(data.response.length * 30, 2000); // Max 2 seconds
        await new Promise((resolve) => setTimeout(resolve, typingDelay));

        setIsTyping(false);

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
          responseType: data.responseType,
          actionSuggestions: data.actionSuggestions,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setShowThinking(false);
      setIsTyping(false);

      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          "Sorry, I'm having trouble right now. Please try again later or contact Mohamed directly.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Handle special download action
    if (suggestion === "Download CV PDF now") {
      // Trigger download
      const link = document.createElement("a");
      link.href = "/Mohamed-Ibrahim-Full-Stack-Software-Developer-Resume.pdf";
      link.download = "Mohamed-Ibrahim-Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Add a message to chat
      const downloadMessage: ChatMessage = {
        role: "assistant",
        content:
          "📄 Great! I've started downloading Mohamed's CV for you. The file should appear in your downloads folder shortly. This resume includes his complete technical skills, 3+ years of experience, and detailed project portfolio.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, downloadMessage]);
      return;
    }

    // Handle normal suggestions
    setInputMessage(suggestion);
    sendMessage();
  };

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300 group animate-pulse"
          title="Chat with Mohamed's AI Assistant - Powered by Advanced AI"
        >
          <div className="relative">
            <span className="text-2xl">🧠</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="absolute bottom-full mb-2 right-0 bg-black text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat with AI Assistant
          </div>
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${
            isExpanded
              ? "bottom-4 right-4 w-[calc(100vw-2rem)] max-w-md h-[calc(100vh-8rem)] md:bottom-6 md:right-6 md:w-96 md:h-[32rem] lg:w-[28rem] lg:h-[36rem]"
              : "bottom-6 right-6 w-80 h-96"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm">🧠</span>
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center space-x-2">
                  <span>Mohamed&apos;s AI Assistant</span>
                  {(showThinking || isTyping) && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </h3>
                <p className="text-xs opacity-90">
                  {showThinking
                    ? "🤔 Analyzing your question..."
                    : isTyping
                      ? "✍️ Crafting response..."
                      : "Powered by Advanced AI"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white/70 hover:text-white hover:bg-white/20 rounded p-1 flex items-center justify-center transition-all"
                title={isExpanded ? "Minimize chat" : "Expand chat"}
              >
                {isExpanded ? (
                  // Minimize icon
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7-7m0 0l-7 7m7-7v18"
                    />
                  </svg>
                ) : (
                  // Expand icon
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white text-lg hover:bg-white/20 rounded w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-lg ${isExpanded ? "max-w-md" : "max-w-xs"} ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  <p className={`${isExpanded ? "text-base" : "text-sm"}`}>
                    {message.content}
                  </p>
                  {message.actionSuggestions && (
                    <div className="mt-2 space-y-1">
                      {message.actionSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`block w-full text-left bg-white/20 hover:bg-white/30 dark:bg-gray-600/50 dark:hover:bg-gray-600/70 px-2 py-1 rounded transition-colors ${isExpanded ? "text-sm" : "text-xs"}`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* AI Thinking Indicator */}
            {showThinking && (
              <div className="flex justify-start">
                <div
                  className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700 ${isExpanded ? "max-w-md" : "max-w-xs"}`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div
                  className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700 ${isExpanded ? "max-w-md" : "max-w-xs"}`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse"></div>
                      <div
                        className="w-1 h-4 bg-green-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-1 h-4 bg-green-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-green-600 dark:text-green-400">
                      Typing response...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Fallback loading indicator */}
            {isLoading && !showThinking && !isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about Mohamed's skills, projects, or experience..."
                className={`flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isExpanded ? "text-base" : "text-sm"}`}
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isLoading ? "..." : "→"}
              </button>
            </div>
            <p
              className={`text-gray-500 dark:text-gray-400 mt-2 ${isExpanded ? "text-sm" : "text-xs"}`}
            >
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </>
  );
}
