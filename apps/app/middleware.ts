import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host");
  const subdomain = hostname?.replace(`.${process.env.NEXT_PUBLIC_HOST}`, "");

  if (
    !url.pathname.includes(".") && // exclude all files in the public folder
    !url.pathname.startsWith("/api") // exclude all API routes
  ) {
    url.pathname = `/${subdomain}`;
    return NextResponse.rewrite(url);
  }
}
