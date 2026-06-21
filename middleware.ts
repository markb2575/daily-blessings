import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";
 
export default async function authMiddleware(request: NextRequest) {
	const baseURL = process.env.PORT
		? `http://localhost:${process.env.PORT}`
		: request.nextUrl.origin;

	const { data: session } = await betterFetch<Session>(
		"/api/auth/get-session",
		{
			baseURL,
			headers: {
				cookie: request.headers.get("cookie") || "",
			},
		},
	);
 
	if (!session) {
		return NextResponse.redirect(new URL("/login", request.url));
	}
	return NextResponse.next();
}
 
export const config = {
	matcher: ["/","/classroom/:path*"],
};