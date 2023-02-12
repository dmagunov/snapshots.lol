import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();

  if (
    !url.pathname.includes(".") && // exclude all files in the public folder
    !url.pathname.startsWith("/api") && // exclude all API routes
    !url.pathname.startsWith("/preview") // exclude all preview routes
  ) {
    const hostname = req.headers.get("host");
    const subdomain = hostname?.replace(`.${process.env.NEXT_PUBLIC_HOST}`, "");
    url.pathname = `/${subdomain}`;
    return NextResponse.rewrite(url);
  }
}