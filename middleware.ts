import { NextResponse, type NextRequest } from "next/server";

export default function authMiddleware(request: NextRequest) {
    const sessionCookie =
        request.cookies.get("better-auth.session_token") ??
        request.cookies.get("__Secure-better-auth.session_token");

    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/classroom/:path*"],
};