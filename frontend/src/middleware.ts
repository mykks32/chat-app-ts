import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "./lib/session";

const isLoginRegisterPage = (pathname: string) => {
  return pathname === "/login" || pathname === "/register";
};

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("chat-token");
  const pathname = request.nextUrl.pathname;

  // Redirect root ("/") to /chat
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  if (!token && !isLoginRegisterPage(pathname)) {
    const response = NextResponse.redirect(new URL("/login", request.url), {
      status: 303,
    });
    return response;
  }

  if (isLoginRegisterPage(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/chat", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/chat", "/login", "/register"],
};
