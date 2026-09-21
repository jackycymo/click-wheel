import { Arc } from "@/examples/arc";
import { Basic } from "@/examples/basic";
import { Controlled } from "@/examples/controlled";
import { Detents } from "@/examples/detents";
import { Disabled } from "@/examples/disabled";
import { Gearing } from "@/examples/gearing";
import { Inertia } from "@/examples/inertia";
import { PlainHub } from "@/examples/plain-hub";
import { Vinyl } from "@/examples/vinyl";

/** Live previews, keyed by the id the docs content uses. */
export const EXAMPLES = {
  basic: Basic,
  gearing: Gearing,
  detents: Detents,
  inertia: Inertia,
  controlled: Controlled,
  "plain-hub": PlainHub,
  arc: Arc,
  vinyl: Vinyl,
  disabled: Disabled,
} as const;

export type ExampleId = keyof typeof EXAMPLES;
