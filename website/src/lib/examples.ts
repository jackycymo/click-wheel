import fs from "node:fs/promises";
import path from "node:path";

/** Where the workspace package lives, relative to the website. */
export const PACKAGE_DIR = path.join(process.cwd(), "..", "packages", "click-wheel");

/** Reads a web example from src/examples. Scoped so the build traces only that folder. */
export async function readExample(file: string): Promise<string> {
  const source = await fs.readFile(path.join(process.cwd(), "src", "examples", file), "utf8");
  return source.replaceAll("@/themes/shadcn/wheel", "@/components/click-wheel-shadcn/wheel");
}
