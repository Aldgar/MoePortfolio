import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory store for rate limiting (use Redis in production)
const attemptStore = new Map<
  string,
  { count: number; lastAttempt: number; blocked: boolean }
>();

export function middleware(request: NextRequest) {
  // Only apply to admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxAttempts = 50; // Increased to 50 attempts per 15 minutes per IP (more lenient)

    const record = attemptStore.get(ip) || {
      count: 0,
      lastAttempt: 0,
      blocked: false,
    };

    // Reset window if expired
    if (now - record.lastAttempt > windowMs) {
      record.count = 0;
      record.blocked = false;
    }

    // Temporarily disable blocking for development
    if (record.blocked && false) {
      // Changed to false to disable blocking
      console.log(`🚨 Blocked IP ${ip} trying to access admin panel`);
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Log admin access attempts
    console.log(
      `🎛️ Admin access attempt from IP: ${ip}, count: ${record.count}`
    );

    // Increment attempt count for any admin access
    record.count++;
    record.lastAttempt = now;

    // Block if too many attempts (but disabled above)
    if (record.count > maxAttempts) {
      record.blocked = true;
      console.log(
        `🚨 IP ${ip} would be blocked for too many admin attempts (but blocking disabled)`
      );
    }

    attemptStore.set(ip, record);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
