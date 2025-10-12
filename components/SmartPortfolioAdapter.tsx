"use client";
import { useState, useEffect, useCallback } from "react";
import EnhancedAIChatWidget from "./ui/EnhancedChat";

interface VisitorIntent {
  intent: string;
  confidence: number;
  reasoning: string;
  suggestions: string[];
}

interface SmartPortfolioAdapterProps {
  children: React.ReactNode;
}

interface VisitorData {
  referrer: string;
  userAgent: string;
  timeOnSite: number;
  screenSize: string;
  language: string;
}

export default function SmartPortfolioAdapter({
  children,
}: SmartPortfolioAdapterProps) {
  const [visitorIntent, setVisitorIntent] = useState<VisitorIntent | null>(
    null
  );
  const [showBanner, setShowBanner] = useState(false);
  const [showHelperWidget, setShowHelperWidget] = useState(false);

  const analyzeVisitorBehavior = useCallback(async () => {
    try {
      const visitorData: VisitorData = {
        referrer: document.referrer || "direct",
        userAgent: navigator.userAgent,
        timeOnSite: Date.now(),
        screenSize: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
      };

      const behaviorMessage = generateBehaviorMessage(visitorData);
      console.log("🔍 Analyzing visitor with message:", behaviorMessage);

      const response = await fetch("/api/ai/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: behaviorMessage,
          visitorData,
        }),
      });

      if (response.ok) {
        const intent = await response.json();
        console.log("🎯 AI Intent Analysis Result:", intent);

        setVisitorIntent(intent);
        setShowBanner(true);

        // Auto-hide banner after 8 seconds, but keep helper available
        setTimeout(() => {
          setShowBanner(false);
        }, 8000);
      } else {
        throw new Error(`API responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Intent analysis failed:", error);
      // Fallback banner for testing
      setVisitorIntent({
        intent: "UNKNOWN",
        confidence: 0.8,
        reasoning:
          "Welcome to Mohamed's AI-powered portfolio! I can help you find what you're looking for.",
        suggestions: [
          "View Projects",
          "About Mohamed",
          "Contact Mohamed",
          "Ask AI Assistant",
        ],
      });
      setShowBanner(true);

      // Auto-hide banner after 8 seconds
      setTimeout(() => {
        setShowBanner(false);
      }, 8000);
    }
  }, []); // Empty dependency array for useCallback

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("🤖 Starting AI visitor analysis...");
      analyzeVisitorBehavior();
    }, 0); // Show immediately

    // Show persistent helper after banner disappears
    const helperTimer = setTimeout(() => {
      setShowHelperWidget(true);
    }, 0); // Show immediately

    return () => {
      clearTimeout(timer);
      clearTimeout(helperTimer);
    };
  }, [analyzeVisitorBehavior]);

  const generateBehaviorMessage = (data: VisitorData): string => {
    let message =
      "General portfolio visitor browsing Mohamed Ibrahim's developer portfolio";

    if (data.referrer && data.referrer !== "direct") {
      if (data.referrer.includes("linkedin.com")) {
        message =
          "Professional visitor from LinkedIn looking to hire Mohamed Ibrahim as a developer";
      } else if (data.referrer.includes("github.com")) {
        message =
          "Developer visitor from GitHub interested in Mohamed's code and collaboration";
      } else if (data.referrer.includes("google.com")) {
        message =
          "Visitor searching for web developer services or Mohamed Ibrahim's portfolio";
      }
    }

    return message;
  };

  const smartScrollToSection = (sectionId: string): boolean => {
    console.log(
      `🎯 AI Banner: Attempting to scroll to section: "${sectionId}"`
    );

    const element = document.getElementById(sectionId);

    if (element) {
      console.log(`✅ AI Banner: Found section "${sectionId}"`);

      // Get the element's position
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middle =
        absoluteElementTop - window.innerHeight / 2 + elementRect.height / 2;

      console.log(`📍 AI Banner: Scrolling to position: ${middle}`);

      // Scroll to the element
      window.scrollTo({
        top: middle,
        behavior: "smooth",
      });

      // Add visual feedback with slight delay
      setTimeout(() => {
        element.style.transition = "all 0.6s ease";
        element.style.boxShadow = "0 0 40px rgba(59, 130, 246, 0.6)";
        element.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
        element.style.borderRadius = "12px";
        element.style.transform = "scale(1.02)";

        // Show success notification
        showNotification(
          `✅ AI navigated to ${sectionId.toUpperCase()} section!`,
          "success"
        );

        setTimeout(() => {
          element.style.boxShadow = "";
          element.style.backgroundColor = "";
          element.style.borderRadius = "";
          element.style.transform = "";
        }, 3000);
      }, 100); // Small delay to ensure DOM is ready

      return true; // Successfully found section
    } else {
      console.log(`❌ AI Banner: Section "${sectionId}" not found`);
      showNotification(`❌ Section "${sectionId}" not found`, "error");
      return false; // Section not found
    }
  };

  // Add this helper function for notifications
  const showNotification = (message: string, type: "success" | "error") => {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${type === "success" ? "rgba(34, 197, 94, 0.95)" : "rgba(239, 68, 68, 0.95)"};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 14px;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log("🔥 AI Banner Button clicked:", suggestion);

    // Map suggestions to section IDs (exact matches from page.tsx)
    const sectionMap: { [key: string]: string } = {
      About: "about",
      View: "projects", // "View Projects"
      Explore: "projects", // "Explore Portfolio"
      Projects: "projects", // Direct match
      Contact: "contact",
      Download: "downloadcv",
      Skills: "skills",
      Experience: "experience",
      Resume: "downloadcv",
      CV: "downloadcv",
      Mohamed: "about", // "About Mohamed"
    };

    // Find the matching section
    let targetSection = "";
    for (const [key, value] of Object.entries(sectionMap)) {
      if (suggestion.toLowerCase().includes(key.toLowerCase())) {
        targetSection = value;
        break;
      }
    }

    if (targetSection && targetSection !== "chat") {
      console.log(`🎯 AI Banner: Navigating to ${targetSection} section`);

      // Always use the scroll function since sections exist
      const scrollSuccess = smartScrollToSection(targetSection);
      if (scrollSuccess) {
        showNotification(`� Navigated to ${targetSection} section!`, "success");
      } else {
        showNotification(
          `❌ Could not find section: ${targetSection}`,
          "error"
        );
      }
    } else if (suggestion.includes("AI") || suggestion.includes("Assistant")) {
      console.log("🤖 AI Banner: Opening chat widget info");
      showNotification(
        "🤖 AI Chat widget is the 💬 button in bottom-right corner!",
        "success"
      );
    } else {
      console.log("🎯 AI Banner: Default action - scrolling to about");
      // Default fallback - scroll to about section
      smartScrollToSection("about");
      showNotification(`🎯 Welcome! Showing About section`, "success");
      showNotification(
        `🎯 "${suggestion}" - AI suggestion received!`,
        "success"
      );
    }
  };

  const getIntentIcon = (intent: string): string => {
    switch (intent) {
      case "RECRUITER":
        return "🎯";
      case "CLIENT":
        return "💼";
      case "COLLABORATOR":
        return "🤝";
      case "STUDENT":
        return "📚";
      case "PEER":
        return "👨‍💻";
      default:
        return "🤖";
    }
  };

  const getIntentColor = (intent: string): string => {
    switch (intent) {
      case "RECRUITER":
        return "bg-gradient-to-r from-green-500 to-emerald-600";
      case "CLIENT":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      case "COLLABORATOR":
        return "bg-gradient-to-r from-purple-500 to-purple-600";
      case "STUDENT":
        return "bg-gradient-to-r from-yellow-500 to-orange-600";
      case "PEER":
        return "bg-gradient-to-r from-indigo-500 to-indigo-600";
      default:
        return "bg-gradient-to-r from-gray-600 to-blue-600";
    }
  };

  const getIntentTitle = (intent: string): string => {
    switch (intent) {
      case "RECRUITER":
        return "Hi Recruiter! 🎯";
      case "CLIENT":
        return "Hi Potential Client! 💼";
      case "COLLABORATOR":
        return "Hi Fellow Developer! 🤝";
      case "STUDENT":
        return "Hi Student! 📚";
      case "PEER":
        return "Hi Developer! 👨‍💻";
      default:
        return "Welcome! 🤖";
    }
  };

  // ...existing code...

  return (
    <>
      {/* AI-Powered Smart Banner - FIXED Z-INDEX */}
      {showBanner && visitorIntent && (
        <div className="fixed top-20 right-4 z-40 max-w-sm animate-slide-in">
          <div
            className={`${getIntentColor(visitorIntent.intent)} text-white p-4 rounded-xl shadow-xl transform transition-all duration-300 hover:scale-105`}
          >
            {/* ...existing banner content... */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {getIntentIcon(visitorIntent.intent)}
                </span>
                <div>
                  <h3 className="font-bold text-sm">
                    {getIntentTitle(visitorIntent.intent)}
                  </h3>
                  <p className="text-xs opacity-90">
                    AI Confidence: {Math.round(visitorIntent.confidence * 100)}%
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="text-white/70 hover:text-white text-lg leading-none hover:bg-white/20 rounded w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <p className="text-xs mb-3 opacity-90 leading-relaxed">
              {visitorIntent.reasoning}
            </p>

            <div className="space-y-2">
              {visitorIntent.suggestions.slice(0, 3).map((suggestion, idx) => (
                <button
                  key={idx}
                  className="block w-full text-left text-xs bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-all duration-200 hover:transform hover:scale-105 cursor-pointer hover:shadow-lg"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="font-medium">→ {suggestion}</span>
                </button>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-white/20">
              <p className="text-xs opacity-75">
                💡 Powered by AI • Auto-closes in 8s
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Persistent AI Helper Widget - FIXED Z-INDEX */}
      {showHelperWidget && !showBanner && (
        <div className="fixed top-20 right-20 z-30">
          <button
            onClick={() => setShowBanner(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-all duration-300 group"
            title="Show AI suggestions again"
          >
            <span className="text-lg">🎯</span>
            <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              AI Helper
            </div>
          </button>
        </div>
      )}

      {/* Enhanced AI Chat Widget */}
      <EnhancedAIChatWidget />

      {/* Original Portfolio Content */}
      {children}
    </>
  );
}
