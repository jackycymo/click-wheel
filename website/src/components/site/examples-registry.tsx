import { Basic } from "@/examples/basic";
import { Controlled } from "@/examples/controlled";
import { Detents } from "@/examples/detents";
import { Gearing } from "@/examples/gearing";
import { Inertia } from "@/examples/inertia";

/** Live previews, keyed by the id the docs content uses. */
export const EXAMPLES = {
  basic: Basic,
  gearing: Gearing,
  detents: Detents,
  inertia: Inertia,
  controlled: Controlled,
} as const;

export type ExampleId = keyof typeof EXAMPLES;
