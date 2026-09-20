import { registryIndex, registryItem } from "@/lib/registry";
import { REGISTRY_ITEMS } from "@/lib/site";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ name: "registry.json" }, ...REGISTRY_ITEMS.map((name) => ({ name: `${name}.json` }))];
}

/** GET /r/<name>.json — shadcn registry items. `npx shadcn@latest add <url>` installs them. */
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!name.endsWith(".json")) return new Response("Not found", { status: 404 });
  const id = name.slice(0, -".json".length);
  const item = id === "registry" ? registryIndex() : await registryItem(id);
  if (!item) return new Response("Not found", { status: 404 });
  return Response.json(item);
}
