import fs from "node:fs/promises";
import path from "node:path";

/** Reads an example's source. Scoped to src/examples so the build traces only that folder. */
export function readExample(file: string): Promise<string> {
  return fs.readFile(path.join(process.cwd(), "src", "examples", file), "utf8");
}
