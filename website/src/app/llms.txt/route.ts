import { llmsTxt } from "@/content/markdown";

export const dynamic = "force-static";

/** GET /llms.txt — the index an agent reads first. See https://llmstxt.org */
export function GET() {
  return new Response(llmsTxt(), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
