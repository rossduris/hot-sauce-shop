import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Export the NextAuth middleware
export const { auth: middleware } = NextAuth(authConfig);

// Configure protected routes
export const config = {
  matcher: [
    // Protected routes
    "/dashboard/:path*",
    "/profile/:path*",
    // Optional: Protect specific routes
    // "/admin/:path*",

    /*
     * Match all except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    // '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
