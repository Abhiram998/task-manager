import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "default-secret-key-1234567890"
);

// Basic in-memory rate limiting (for demo/small scale)
// In a real production app, use Redis for distributed rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string) {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 100;

    const rateData = rateLimitStore.get(ip);

    if (!rateData || now > rateData.resetTime) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
        return false;
    }

    rateData.count++;
    return rateData.count > maxRequests;
}

export async function middleware(request: NextRequest) {
    const ip = request.ip || "anonymous";

    // 1. Rate Limiting
    if (isRateLimited(ip)) {
        return NextResponse.json(
            { message: "Too many requests, please try again later." },
            { status: 429 }
        );
    }

    const token = request.cookies.get("auth-token")?.value;
    const isAuthPage = request.nextUrl.pathname.startsWith("/login") ||
        request.nextUrl.pathname.startsWith("/register");
    const isApiRoute = request.nextUrl.pathname.startsWith("/api");
    const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

    // 2. Authentication Check
    if (token) {
        try {
            await jwtVerify(token, secret);
            // If user is logged in and tries to access login/register, redirect to dashboard
            if (isAuthPage) {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        } catch (error) {
            // Invalid token
            if (isDashboardPage || (isApiRoute && !isAuthPage)) {
                const response = NextResponse.redirect(new URL("/login", request.url));
                response.cookies.delete("auth-token");
                return response;
            }
        }
    } else {
        // No token
        if (isDashboardPage) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login",
        "/register",
        "/api/:path*",
    ],
};
