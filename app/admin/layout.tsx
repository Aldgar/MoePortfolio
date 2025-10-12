"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hide the main portfolio navbar when admin loads
  useEffect(() => {
    // Add admin class immediately
    document.body.classList.add("admin-mode");
    document.documentElement.classList.add("admin-page");

    // Hide navbar elements
    const navbar = document.querySelector("nav") as HTMLElement;
    const mainHeader = document.querySelector(
      "header:not(.admin-header)"
    ) as HTMLElement;

    if (navbar) {
      navbar.style.display = "none";
    }
    if (mainHeader) {
      mainHeader.style.display = "none";
    }

    // Cleanup when leaving admin
    return () => {
      if (navbar) {
        navbar.style.display = "";
      }
      if (mainHeader) {
        mainHeader.style.display = "";
      }
      document.body.classList.remove("admin-mode");
      document.documentElement.classList.remove("admin-page");
    };
  }, []);

  return (
    <>
      {/* Immediate CSS injection to prevent flash */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* Hide navbar immediately on admin pages */
          body nav,
          body header:not(.admin-header) {
            display: none !important;
          }
          
          /* Ensure admin layout is full height */
          .admin-layout {
            position: relative;
            z-index: 999;
            min-height: 100vh;
          }
          
          /* Override any existing styles */
          .admin-mode nav,
          .admin-mode header:not(.admin-header),
          .admin-page nav,
          .admin-page header:not(.admin-header) {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
          }
        `,
        }}
      />

      <div
        className="min-h-screen bg-gray-50 dark:bg-gray-900 admin-layout"
        data-admin="true"
      >
        {/* Admin-specific header */}
        <header className="admin-header bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">🎛️</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    AI Portfolio Management
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  ← Back to Portfolio
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Admin content */}
        <main className="admin-main">{children}</main>
      </div>
    </>
  );
}
