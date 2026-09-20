import fs from "node:fs/promises";
import path from "node:path";

/** Where the workspace package lives, relative to the website. */
export const PACKAGE_DIR = path.join(process.cwd(), "..", "packages", "click-wheel");

/**
 * The site imports the workspace package; readers install the registry copy.
 * Show them the path the registry writes to.
 */
export function forReaders(source: string): string {
  return source
    .replace(/from "click-wheel\/native"/g, 'from "@/components/click-wheel-native"')
    .replace(/from "click-wheel"/g, 'from "@/components/click-wheel"')
    .replace(/from "\.\.\/\.\.\/src\/native"/g, 'from "@/components/click-wheel-native"');
}

/** Reads a web example from src/examples. Scoped so the build traces only that folder. */
export async function readExample(file: string): Promise<string> {
  return forReaders(await fs.readFile(path.join(process.cwd(), "src", "examples", file), "utf8"));
}

/** Reads a React Native example from the package. The package type-checks it. */
export async function readNativeExample(file: string): Promise<string> {
  return forReaders(await fs.readFile(path.join(PACKAGE_DIR, "examples", "native", file), "utf8"));
}
