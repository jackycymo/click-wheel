import { llmsFullTxt } from "@/content/markdown";
import { readExample, readNativeExample } from "@/lib/examples";
import { readComponentFiles, readThemeFiles } from "@/lib/registry";
import { THEME_IDS } from "@/lib/site";

export const dynamic = "force-static";

/** GET /llms-full.txt — llms.txt, the docs, and every source file in one document. */
export async function GET() {
  const files = [
    ...(await readComponentFiles()),
    ...(await Promise.all(THEME_IDS.map(readThemeFiles))).flat(),
  ];
  return new Response(await llmsFullTxt(files, { example: readExample, native: readNativeExample }), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
