import { NextResponse, type NextRequest } from "next/server";

/** Content negotiation: `Accept: text/markdown` on any docs page returns the Markdown twin. */
export function proxy(request: NextRequest) {
  const accept = request.headers.get("accept") ?? "";
  if (accept.includes("text/markdown")) {
    return NextResponse.rewrite(new URL("/docs.md", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/docs", "/docs/:path*", "/examples/:path*"] };
