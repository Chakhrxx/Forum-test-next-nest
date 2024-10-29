// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Check for access token in cookies
  const accessToken = request.cookies.get("accessToken"); // Use request.cookies instead of localStorage
  const protectedRoutes = ["/", "/post", "/blogs"];

  // Check if the route is protected and if the token is absent
  if (protectedRoutes.includes(request.nextUrl.pathname) && !accessToken) {
    return NextResponse.redirect(new URL("/sign-up", request.url));
  }

  return NextResponse.next();
}

// Specify the paths where the middleware should run
export const config = {
  matcher: ["/", "/post/:path*", "/blogs/:path*"],
};
