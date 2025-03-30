import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "./lib/session";

export default async function middleware(request: NextRequest) {
  const user = await getCookie("user");
  const token = await getCookie("chat-token");
  const path = request.nextUrl.pathname;

  // Redirect root ("/") to /chat
  if (path === "/") {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  // Redirect to login if trying to access /chat without being logged in
  if (path === "/chat" && (!user || !token)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect logged-in user to /chat if trying to access /login or /register
  if ((path === "/login" || path === "/register") && user && token) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/chat", "/login", "/register"],
};
