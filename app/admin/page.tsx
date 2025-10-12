"use client";
import React, { useState, useEffect, useCallback } from "react";

interface AnalyticsData {
  totalVisitors: number;
  intentBreakdown: { [key: string]: number };
  topSuggestions: { suggestion: string; clicks: number }[];
  chatConversations: number;
  averageSessionTime: number;
  conversionRate: number;
}

interface ChatLog {
  id: string;
  timestamp: Date;
  userMessage: string;
  aiResponse: string;
  visitorType?: string;
  sessionId: string;
}

interface VisitorLog {
  id: string;
  timestamp: Date;
  intent: string;
  confidence: number;
  referrer: string;
  userAgent: string;
  suggestions: string[];
  clickedSuggestion?: string;
}

interface SecurityEvent {
  id: string;
  timestamp: string;
  event: string;
  details: Record<string, unknown>;
  success: boolean;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityEvent[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "visitors" | "chats" | "security" | "settings"
  >("overview");
  const [deviceFingerprint, setDeviceFingerprint] = useState("");
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);

  // Generate device fingerprint for security
  const generateDeviceFingerprint = () => {
    if (typeof window === "undefined") return "";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillText("Device fingerprint", 2, 2);
    }

    return btoa(
      navigator.userAgent +
        navigator.language +
        screen.width +
        screen.height +
        new Date().getTimezoneOffset() +
        (canvas.toDataURL() || "")
    ).slice(0, 32);
  };

  // Security event logging
  const logSecurityEvent = useCallback(
    (event: string, details: Record<string, unknown>, success = false) => {
      if (typeof window === "undefined") return;

      const securityEvent: SecurityEvent = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        event,
        details,
        success,
      };

      const existingEvents = JSON.parse(
        localStorage.getItem("security_events") || "[]"
      );
      existingEvents.push(securityEvent);

      // Keep only last 50 events
      if (existingEvents.length > 50) {
        existingEvents.shift();
      }

      localStorage.setItem("security_events", JSON.stringify(existingEvents));
    },
    []
  );

  const fetchAnalytics = useCallback(async () => {
    try {
      // Mock data - in demo mode, show impressive but realistic numbers
      const demoMultiplier = showDemo ? 2.5 : 1;

      setAnalytics({
        totalVisitors: Math.round(127 * demoMultiplier),
        intentBreakdown: {
          RECRUITER: Math.round(34 * demoMultiplier),
          CLIENT: Math.round(28 * demoMultiplier),
          COLLABORATOR: Math.round(19 * demoMultiplier),
          STUDENT: Math.round(25 * demoMultiplier),
          PEER: Math.round(15 * demoMultiplier),
          UNKNOWN: Math.round(6 * demoMultiplier),
        },
        topSuggestions: [
          {
            suggestion: "View Projects",
            clicks: Math.round(45 * demoMultiplier),
          },
          {
            suggestion: "Contact Mohamed",
            clicks: Math.round(38 * demoMultiplier),
          },
          {
            suggestion: "About Mohamed",
            clicks: Math.round(32 * demoMultiplier),
          },
          {
            suggestion: "Ask AI Assistant",
            clicks: Math.round(22 * demoMultiplier),
          },
        ],
        chatConversations: Math.round(89 * demoMultiplier),
        averageSessionTime: 245,
        conversionRate: 23.5,
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  }, [showDemo]);

  // Activity tracker for session timeout
  const trackActivity = () => {
    setLastActivity(Date.now());
  };

  // Check authentication on load
  useEffect(() => {
    console.log("🔍 Authentication check started");
    if (typeof window === "undefined") return;

    const fingerprint = generateDeviceFingerprint();
    setDeviceFingerprint(fingerprint);

    const authToken = localStorage.getItem("admin_auth");
    const authTime = localStorage.getItem("admin_auth_time");
    const storedFingerprint = localStorage.getItem("admin_device");

    console.log("🔍 Auth tokens found:", {
      hasAuthToken: !!authToken,
      hasAuthTime: !!authTime,
      authToken: authToken?.slice(0, 10) + "...",
    });

    // Check for suspicious activity (different device)
    if (storedFingerprint && storedFingerprint !== fingerprint && authToken) {
      setShowSecurityAlert(true);
      logSecurityEvent("Suspicious device detected", {
        storedFingerprint: storedFingerprint.slice(0, 8) + "...",
        currentFingerprint: fingerprint.slice(0, 8) + "...",
      });
    }

    if (authToken && authTime) {
      const timeDiff = Date.now() - parseInt(authTime);
      const hourInMs = 60 * 60 * 1000;

      console.log("🔍 Token time check:", {
        timeDiffMinutes: Math.round(timeDiff / 60000),
        hourLimitMinutes: 60,
        isValid: timeDiff < hourInMs,
      });

      // Token expires after 1 hour
      if (timeDiff < hourInMs) {
        console.log("🔍 Setting authenticated to true");
        setIsAuthenticated(true);
        setShowDemo(authToken === "demo");
        logSecurityEvent(
          "Session resumed",
          {
            timeRemaining:
              Math.round((hourInMs - timeDiff) / 60000) + " minutes",
          },
          true
        );
        // Call these functions after state is set
        setTimeout(() => {
          fetchAnalytics();
          fetchLogs();
          loadSecurityLogs();
        }, 100);
      } else {
        console.log("🔍 Token expired, clearing auth");
        // Clear expired token
        localStorage.removeItem("admin_auth");
        localStorage.removeItem("admin_auth_time");
        localStorage.removeItem("admin_device");
        logSecurityEvent("Session expired", {
          expiredBy: Math.round((timeDiff - hourInMs) / 60000) + " minutes",
        });
      }
    } else {
      console.log("🔍 No auth tokens found");
    }

    console.log("🔍 Setting loading to false");
    setIsLoading(false);
  }, [logSecurityEvent, fetchAnalytics]);

  // Monitor authentication state changes
  useEffect(() => {
    console.log("🔍 Authentication state changed:", {
      isAuthenticated,
      showDemo,
    });
  }, [isAuthenticated, showDemo]);
  useEffect(() => {
    if (!isAuthenticated || typeof window === "undefined") return;

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    // Define logout inside useEffect to capture current state
    const handleInactivityLogout = () => {
      if (typeof window !== "undefined") {
        const sessionDuration = Math.round(
          (Date.now() -
            parseInt(localStorage.getItem("admin_auth_time") || "0")) /
            60000
        );
        logSecurityEvent(
          "Session expired due to inactivity",
          {
            sessionDuration: sessionDuration + " minutes",
            mode: showDemo ? "demo" : "admin",
          },
          true
        );

        localStorage.removeItem("admin_auth");
        localStorage.removeItem("admin_auth_time");
        localStorage.removeItem("admin_device");
      }

      // Reset all state
      setIsAuthenticated(false);
      setShowDemo(false);
      setPassword("");
      setAuthError("");
      setActiveTab("overview");
      setLoginAttempts(0);
      setIsLocked(false);
      setAnalytics(null);
      setChatLogs([]);
      setVisitorLogs([]);
      setShowSecurityAlert(false);
    };

    events.forEach((event) => {
      document.addEventListener(event, trackActivity, true);
    });

    // Check for inactivity every minute
    const activityInterval = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivity;
      const timeout = 30 * 60 * 1000; // 30 minutes

      if (timeSinceActivity > timeout) {
        handleInactivityLogout();
        alert("🔒 Session expired due to inactivity");
      }
    }, 60000);

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, trackActivity, true);
      });
      clearInterval(activityInterval);
    };
  }, [isAuthenticated, lastActivity, showDemo, logSecurityEvent]);

  const loadSecurityLogs = () => {
    if (typeof window === "undefined") return;
    const logs = JSON.parse(localStorage.getItem("security_logs") || "[]");
    setSecurityLogs(logs);
  };

  // Direct demo mode activation - bypasses password validation
  const handleDemoMode = () => {
    console.log("🎭 DEMO MODE ACTIVATED DIRECTLY");

    const loginAttempt = {
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== "undefined" ? navigator.userAgent : "",
      deviceFingerprint: deviceFingerprint.slice(0, 8) + "...",
      success: true,
    };

    logSecurityEvent(
      "Demo login successful (Public showcase)",
      loginAttempt,
      true
    );

    // Set demo mode directly
    setIsAuthenticated(true);
    setShowDemo(true);
    setAuthError("");

    // Clear any existing password
    setPassword("");

    if (typeof window !== "undefined") {
      localStorage.setItem("admin_auth", "demo");
      localStorage.setItem("admin_auth_time", Date.now().toString());
      localStorage.setItem("admin_device", deviceFingerprint);
    }

    fetchAnalytics();
    fetchLogs();
    loadSecurityLogs();

    console.log("🎭 Demo mode activated successfully");
  };

  const handleLogin = async () => {
    if (isLocked) {
      setAuthError("Too many attempts. Please wait 5 minutes.");
      return;
    }

    setAuthError("");

    const loginAttempt = {
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== "undefined" ? navigator.userAgent : "",
      deviceFingerprint: deviceFingerprint.slice(0, 8) + "...",
      success: false,
    };

    // Demo mode - READ-ONLY for recruiters/visitors
    if (password === "demo") {
      loginAttempt.success = true;
      logSecurityEvent(
        "Demo login successful (Public showcase)",
        loginAttempt,
        true
      );

      setIsAuthenticated(true);
      setShowDemo(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_auth", "demo");
        localStorage.setItem("admin_auth_time", Date.now().toString());
        localStorage.setItem("admin_device", deviceFingerprint);
      }
      fetchAnalytics();
      fetchLogs();
      loadSecurityLogs();
      return;
    }

    // Real admin authentication - FULL ACCESS for Mohamed
    const correctPassword =
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

    if (password === correctPassword) {
      loginAttempt.success = true;
      logSecurityEvent(
        "Admin login successful (Full access)",
        loginAttempt,
        true
      );

      setIsAuthenticated(true);
      setShowDemo(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_auth", "admin");
        localStorage.setItem("admin_auth_time", Date.now().toString());
        localStorage.setItem("admin_device", deviceFingerprint);
      }
      setLoginAttempts(0);
      fetchAnalytics();
      fetchLogs();
      loadSecurityLogs();
    } else {
      logSecurityEvent("Failed login attempt", loginAttempt);

      setAuthError("Invalid password");
      setLoginAttempts((prev) => prev + 1);

      // Progressive lockout
      if (loginAttempts >= 2) {
        setIsLocked(true);
        const lockoutTime = Math.min(5 * Math.pow(2, loginAttempts - 2), 60);
        setTimeout(
          () => {
            setIsLocked(false);
            setLoginAttempts(0);
          },
          lockoutTime * 60 * 1000
        );

        logSecurityEvent(`Account locked for ${lockoutTime} minutes`, {
          ...loginAttempt,
          lockoutTime,
        });
      }
    }
  };

  // Simple, reliable logout function with debugging
  const handleLogout = () => {
    console.log("🔍 LOGOUT STARTING - Mode:", showDemo ? "DEMO" : "ADMIN");
    console.log("🔍 Current State:", {
      isAuthenticated,
      showDemo,
      activeTab,
      password: password ? "***" : "empty",
    });

    try {
      // Clear localStorage immediately
      if (typeof window !== "undefined") {
        console.log("🔍 Clearing localStorage...");
        localStorage.removeItem("admin_auth");
        localStorage.removeItem("admin_auth_time");
        localStorage.removeItem("admin_device");
        console.log("🔍 LocalStorage cleared successfully");
      }

      // Reset all state immediately
      console.log("🔍 Resetting all state variables...");
      setIsAuthenticated(false);
      setShowDemo(false);
      setPassword("");
      setAuthError("");
      setActiveTab("overview");
      setLoginAttempts(0);
      setIsLocked(false);
      setAnalytics(null);
      setChatLogs([]);
      setVisitorLogs([]);
      setShowSecurityAlert(false);

      console.log("🔍 LOGOUT COMPLETE - Should show login screen now");

      // Force a small delay to ensure state update
      setTimeout(() => {
        console.log("🔍 Final check - State after logout:", {
          isAuthenticated: false,
          showDemo: false,
        });
      }, 100);
    } catch (error) {
      console.error("🚨 Logout error:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      // Enhanced demo data to showcase the AI system
      setChatLogs([
        {
          id: "1",
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          userMessage: "What makes Mohamed different from other developers?",
          aiResponse:
            "Mohamed stands out with his AI-integrated development approach. He builds intelligent systems like this portfolio that adapts to visitor intentions, uses advanced analytics, and implements cutting-edge security. His combination of technical expertise in React, Next.js, and AI integration makes him uniquely positioned for modern web development challenges.",
          visitorType: "RECRUITER",
          sessionId: "sess_rec_123",
        },
        {
          id: "2",
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          userMessage: "Can Mohamed help scale our startup's web platform?",
          aiResponse:
            "Absolutely! Mohamed excels at scalable architecture design. He can help with performance optimization, database design, real-time features, and AI integration. His experience with TypeScript, NestJS, PostgreSQL, and modern deployment strategies makes him ideal for startup growth challenges.",
          visitorType: "CLIENT",
          sessionId: "sess_cli_456",
        },
        {
          id: "3",
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          userMessage:
            "What's the best way to learn full-stack development like Mohamed?",
          aiResponse:
            "Great question! Mohamed recommends starting with TypeScript and React fundamentals, then progressing to Next.js for full-stack capabilities. Focus on building real projects, understanding database design, and gradually incorporating AI features. Practice with modern tools like Tailwind CSS, and always prioritize user experience and security.",
          visitorType: "STUDENT",
          sessionId: "sess_stu_789",
        },
        {
          id: "4",
          timestamp: new Date(Date.now() - 1000 * 60 * 90),
          userMessage: "How does this AI portfolio system work?",
          aiResponse:
            "This system uses intelligent visitor intent detection to personalize the experience. It analyzes browsing patterns, shows relevant suggestions, and adapts content dynamically. The AI chat provides contextual information while the admin panel tracks everything with advanced analytics and security monitoring.",
          visitorType: "PEER",
          sessionId: "sess_peer_321",
        },
      ]);

      setVisitorLogs([
        {
          id: "1",
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          intent: "RECRUITER",
          confidence: 0.92,
          referrer: "linkedin.com",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
          suggestions: ["View Projects", "Contact Mohamed", "Download Resume"],
          clickedSuggestion: "Contact Mohamed",
        },
        {
          id: "2",
          timestamp: new Date(Date.now() - 1000 * 60 * 25),
          intent: "CLIENT",
          confidence: 0.87,
          referrer: "google.com",
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
          suggestions: ["View Portfolio", "Get Quote", "Schedule Call"],
          clickedSuggestion: "Schedule Call",
        },
        {
          id: "3",
          timestamp: new Date(Date.now() - 1000 * 60 * 35),
          intent: "STUDENT",
          confidence: 0.78,
          referrer: "github.com",
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)...",
          suggestions: [
            "Learning Resources",
            "About Mohamed",
            "Ask AI Assistant",
          ],
          clickedSuggestion: "Ask AI Assistant",
        },
        {
          id: "4",
          timestamp: new Date(Date.now() - 1000 * 60 * 50),
          intent: "COLLABORATOR",
          confidence: 0.83,
          referrer: "twitter.com",
          userAgent: "Mozilla/5.0 (X11; Linux x86_64)...",
          suggestions: ["View Projects", "Contact Mohamed", "Ask AI Assistant"],
          clickedSuggestion: "View Projects",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case "RECRUITER":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "CLIENT":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      case "COLLABORATOR":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
      case "STUDENT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      case "PEER":
        return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Enhanced login screen with clearer access levels
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Security Alert */}
          {showSecurityAlert && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-red-500 text-xl mr-3">⚠️</span>
                <div>
                  <h4 className="font-bold text-red-800 dark:text-red-400">
                    Security Alert
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    New device detected. If this was not you, contact
                    administrator.
                  </p>
                </div>
                <button
                  onClick={() => setShowSecurityAlert(false)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎛️</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                AI Portfolio Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Intelligent analytics and visitor insights
              </p>
            </div>

            {/* Access Level Information */}
            <div className="mb-6 grid grid-cols-1 gap-3">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-green-600 dark:text-green-400 text-lg mr-2">
                    👀
                  </span>
                  <h3 className="font-bold text-green-800 dark:text-green-300">
                    Demo Access
                  </h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-200">
                  <strong>For Recruiters & Visitors:</strong> Showcase mode with
                  read-only analytics
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Password:{" "}
                  <code className="bg-green-100 dark:bg-green-900/40 px-1 rounded">
                    demo
                  </code>
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 dark:text-blue-400 text-lg mr-2">
                    🔐
                  </span>
                  <h3 className="font-bold text-blue-800 dark:text-blue-300">
                    Admin Access
                  </h3>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  <strong>For Mohamed:</strong> Full dashboard with management
                  capabilities
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Requires secure password
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Access Code
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter demo or admin password"
                  disabled={isLocked}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
                />
                {authError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {authError}
                  </p>
                )}
                {loginAttempts > 0 && !isLocked && (
                  <p className="text-yellow-600 text-sm mt-2">
                    Attempts remaining: {3 - loginAttempts}
                  </p>
                )}
              </div>

              <button
                onClick={handleLogin}
                disabled={isLocked || !password.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isLocked ? "🔒 Locked" : "🚀 Access Dashboard"}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Quick Demo Access
                </p>
                <button
                  onClick={handleDemoMode}
                  disabled={isLocked}
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium hover:underline transition-colors disabled:opacity-50"
                >
                  🎭 Try Demo Mode →
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Security Features */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center">
              🛡️ System Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                AI-powered visitor intent detection
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Real-time analytics and insights
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Advanced security monitoring
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                Interactive chat conversations
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                Comprehensive audit logging
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Demo banner with exit button
  const DemoBanner = () =>
    showDemo && (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎭</span>
            <span className="font-medium">Demo Mode Active</span>
            <span className="text-sm opacity-90">
              - Public Showcase for Recruiters & Visitors
            </span>
            <div className="ml-4 text-xs bg-white/20 px-2 py-1 rounded">
              READ-ONLY ACCESS
            </div>
          </div>
          <button
            onClick={() => {
              console.log("🔥 BACK TO LOGIN BUTTON CLICKED!");
              console.log("🔍 Current State:", {
                showDemo,
                isAuthenticated,
                mode: "DEMO_BANNER",
              });
              console.log("🔍 Forcing reliable logout from demo banner...");
              handleLogout();
            }}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
            title="Return to login screen from demo mode"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    );

  return (
    <>
      <DemoBanner />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  🎛️ AI Portfolio Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {showDemo
                    ? "Showcasing intelligent visitor analytics and AI interactions"
                    : "Monitor visitor analytics, AI interactions, and system performance"}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {showDemo && (
                  <>
                    <div className="bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-700">
                      <span className="font-medium">🎭 Demo Mode</span>
                    </div>
                    <button
                      onClick={() => {
                        console.log("🔥 EXIT DEMO BUTTON CLICKED!");
                        console.log("🔍 Current State:", {
                          showDemo,
                          isAuthenticated,
                          mode: "DEMO",
                        });
                        console.log("🔍 Forcing reliable demo exit...");
                        handleLogout();
                      }}
                      className="inline-flex items-center px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-md text-sm text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm font-medium"
                      title="Exit demo mode and return to login"
                    >
                      ← Exit Demo
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    console.log("🔥 DIRECT ADMIN LOGOUT CLICKED!");
                    console.log("🔍 Current State:", {
                      isAuthenticated,
                      showDemo,
                      mode: showDemo ? "DEMO" : "ADMIN",
                    });
                    console.log("🔍 Executing logout...");
                    handleLogout();
                  }}
                  className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-600 rounded-md text-sm text-red-700 dark:text-red-300 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm font-medium"
                  title="Logout from admin dashboard"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>{" "}
          {/* Enhanced Tabs */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              {["overview", "visitors", "chats", "security", "settings"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() =>
                      setActiveTab(
                        tab as
                          | "overview"
                          | "visitors"
                          | "chats"
                          | "security"
                          | "settings"
                      )
                    }
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab === "overview" && "📊"}
                    {tab === "visitors" && "👥"}
                    {tab === "chats" && "💬"}
                    {tab === "security" && "🔒"}
                    {tab === "settings" && "⚙️"} {tab}
                  </button>
                )
              )}
            </nav>
          </div>
          {/* Overview Tab */}
          {activeTab === "overview" && analytics && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Visitors
                      </h3>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {analytics.totalVisitors}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        +12% this week
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Chat Sessions
                      </h3>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {analytics.chatConversations}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        +8% this week
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <span className="text-2xl">⏱️</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Avg. Session
                      </h3>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {analytics.averageSessionTime}s
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        4min 5sec
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <span className="text-2xl">📈</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Conversion Rate
                      </h3>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {analytics.conversionRate}%
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        +5% this month
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Intent Breakdown */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  🎯 Visitor Intent Breakdown
                </h3>
                <div className="space-y-3">
                  {Object.entries(analytics.intentBreakdown).map(
                    ([intent, count]) => (
                      <div
                        key={intent}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm border ${getIntentColor(intent)}`}
                          >
                            {intent}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${(count / analytics.totalVisitors) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                            {count}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Top Suggestions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  🎯 Most Clicked Suggestions
                </h3>
                <div className="space-y-3">
                  {analytics.topSuggestions.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-900 dark:text-white font-medium">
                        {item.suggestion}
                      </span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${(item.clicks / analytics.topSuggestions[0].clicks) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                          {item.clicks}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Visitors Tab */}
          {activeTab === "visitors" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  👥 Recent Visitor Analytics
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Intent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Referrer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Action Taken
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {visitorLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {log.timestamp.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs border ${getIntentColor(log.intent)}`}
                          >
                            {log.intent}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            <span className="mr-2">
                              {Math.round(log.confidence * 100)}%
                            </span>
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                              <div
                                className="bg-blue-500 h-1 rounded-full"
                                style={{ width: `${log.confidence * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {log.referrer === "direct" ? "Direct" : log.referrer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {log.clickedSuggestion || "No action"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* Chats Tab */}
          {activeTab === "chats" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  💬 Recent Chat Conversations
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {chatLogs.map((chat) => (
                  <div
                    key={chat.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {chat.timestamp.toLocaleString()}
                      </span>
                      {chat.visitorType && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs border ${getIntentColor(chat.visitorType)}`}
                        >
                          {chat.visitorType}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          User:
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-200">
                          {chat.userMessage}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-300">
                          AI Assistant:
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-200">
                          {chat.aiResponse}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Security Status */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  🔒 Security Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl text-green-600 dark:text-green-400 mb-2">
                      ✅
                    </div>
                    <div className="text-sm font-medium text-green-800 dark:text-green-300">
                      Authentication
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      {showDemo ? "Demo Mode" : "Admin Mode"}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl text-blue-600 dark:text-blue-400 mb-2">
                      🛡️
                    </div>
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Rate Limiting
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      Protected
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl text-purple-600 dark:text-purple-400 mb-2">
                      🔐
                    </div>
                    <div className="text-sm font-medium text-purple-800 dark:text-purple-300">
                      Session
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">
                      Secure
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Security Events */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  🚨 Recent Security Events
                </h3>
                <div className="space-y-3">
                  {securityLogs
                    .slice(-10)
                    .reverse()
                    .map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {log.event}
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            log.success
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {log.success ? "Success" : "Failed"}
                        </span>
                      </div>
                    ))}
                  {securityLogs.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No security events logged yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Settings Tab - Show different content based on access level */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              {showDemo ? (
                // Demo mode - Read-only showcase
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    🎭 Demo Mode Information
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                      <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2">
                        For Recruiters & Visitors
                      </h4>
                      <p className="text-sm text-purple-700 dark:text-purple-200">
                        This demo showcases Mohamed&apos;s AI-powered portfolio
                        system with real-time analytics, intelligent visitor
                        detection, and interactive features. All data shown is
                        for demonstration purposes.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                          🤖 AI Features
                        </h5>
                        <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                          <li>• Visitor intent detection</li>
                          <li>• Dynamic content suggestions</li>
                          <li>• Interactive AI chat assistant</li>
                          <li>• Real-time analytics</li>
                        </ul>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h5 className="font-medium text-green-800 dark:text-green-300 mb-2">
                          📊 Analytics
                        </h5>
                        <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
                          <li>• Visitor behavior tracking</li>
                          <li>• Conversion rate monitoring</li>
                          <li>• Chat conversation logs</li>
                          <li>• Security event tracking</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Admin mode - Full configuration
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      ⚙️ AI Configuration
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Intent Detection Confidence Threshold
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          defaultValue="0.2"
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Lower values show banners more often, higher values
                          are more selective
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Banner Auto-Hide Timer (seconds)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="30"
                          defaultValue="8"
                          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-24 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Enable visitor analytics logging
                          </span>
                        </label>
                      </div>

                      <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
                        Save Settings
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      🔧 System Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          OpenAI API
                        </span>
                        <span className="flex items-center text-green-600 dark:text-green-400">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                          Connected
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          Intent Detection
                        </span>
                        <span className="flex items-center text-green-600 dark:text-green-400">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                          Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          Chat Widget
                        </span>
                        <span className="flex items-center text-green-600 dark:text-green-400">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                          Operational
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
