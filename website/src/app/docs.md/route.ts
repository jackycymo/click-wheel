import { docsToMarkdown } from "@/content/markdown";
import { readExample, readNativeExample } from "@/lib/examples";

export const dynamic = "force-static";

/** GET /docs.md — every docs page as one Markdown document. */
export async function GET() {
  return new Response(await docsToMarkdown({ example: readExample, native: readNativeExample }), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
