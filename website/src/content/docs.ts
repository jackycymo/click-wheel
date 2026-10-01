/*
  The single source for the docs. The pages under app/(docs) render it as
  HTML; app/docs.md/route.ts renders the same data as Markdown.
  Prose may use `backticks` for inline code; nothing else is interpreted.
*/

import type { ExampleId } from "@/components/site/examples-registry";

export type Block =
  | { type: "p"; text: string }
  | { type: "code"; code: string; lang: "tsx" | "css" | "text"; title: string }
  | { type: "table"; caption: string; columns: string[]; rows: string[][]; mono?: number[] }
  | { type: "install"; item?: string }
  | { type: "example"; id: ExampleId; file: string }
  | { type: "themes" };

export interface DocSectionDef {
  id: string;
  title: string;
  blocks: Block[];
}

export interface DocPageDef {
  slug: string;
  href: string;
  group: "Basics" | "Examples";
  title: string;
  description?: string;
  sections: DocSectionDef[];
}

export const ANATOMY = `import { ClickWheel } from "@/components/click-wheel";

<ClickWheel.Root
  value={seconds}
  onValueChange={setSeconds}
  max={duration}
  unitsPerTurn={60}
  detent={5}
>
  <ClickWheel.Ring aria-label="Playback position">
    <ClickWheel.Rotor />
  </ClickWheel.Ring>
  <ClickWheel.Center aria-label="Play" onClick={togglePlay}>
    <PlayIcon />
  </ClickWheel.Center>
</ClickWheel.Root>`;

const STYLE_TAILWIND = `<ClickWheel.Ring className="rounded-full bg-muted cursor-grab data-[dragging]:cursor-grabbing data-[disabled]:opacity-50" />`;

const STYLE_CSS = `.arc {
  background: conic-gradient(
    var(--primary) calc(var(--click-wheel-fraction) * 360deg),
    transparent 0
  );
}

.groove-3 {
  background: conic-gradient(
    var(--primary) calc(clamp(0, calc(var(--click-wheel-turns) - 2), 1) * 360deg),
    transparent 0
  );
}

.needle {
  rotate: var(--click-wheel-rotation, 0deg);
}`;

const STYLE_FUNCTION = `<ClickWheel.Ring
  className={(state) => (state.dragging ? "ring ring-held" : "ring")}
  style={(state) => ({ opacity: state.disabled ? 0.5 : 1 })}
/>`;

const STYLE_RENDER = `<ClickWheel.Center render={<div />} />

<ClickWheel.Center render={<Button variant="ghost" />} />`;

const PROP_COLUMNS = ["Prop", "Type", "Default", "Description"];

export const PAGES: DocPageDef[] = [
  {
    slug: "getting-started",
    href: "/docs",
    group: "Basics",
    title: "Getting Started",
    description:
      "Click Wheel is a rotary input component for React. A slider with gearing instead of length: one revolution moves the value by exactly as much as you say. It ships unstyled; you bring the styles.",
    sections: [
      {
        id: "installation",
        title: "Installation",
        blocks: [
          { type: "install" },
          {
            type: "p",
            text: "The command copies ten files into `components/click-wheel`, including `core.ts`, the wheel math. There are no dependencies beyond React 19.2. You can also copy the folder by hand.",
          },
        ],
      },
      {
        id: "create",
        title: "Create a click wheel",
        blocks: [
          { type: "code", code: ANATOMY, lang: "tsx", title: "player.tsx" },
          {
            type: "p",
            text: "`Root` owns the value and the gestures. `Ring` is the slider: drag around it, scroll over it, focus it. `Rotor` is decoration that rotates 1:1 with the finger. `Center` is a button; presses there never start a turn. Controlled with `value`, uncontrolled with `defaultValue`.",
          },
        ],
      },
      {
        id: "style",
        title: "Style it",
        blocks: [
          {
            type: "p",
            text: "The parts render with no classes. This is the same wheel with Tailwind classes: a ring, a tick texture that turns, a hub. Styling covers data attributes, CSS variables and the render prop.",
          },
          { type: "example", id: "basic", file: "basic.tsx" },
        ],
      },
    ],
  },
  {
    slug: "styling",
    href: "/docs/styling",
    group: "Basics",
    title: "Styling",
    description:
      "Parts render plain elements with no classes and no visual styles. State reaches your CSS three ways.",
    sections: [
      {
        id: "data-attributes",
        title: "Data attributes",
        blocks: [
          {
            type: "p",
            text: "Every part carries `data-dragging` while a pointer holds the ring, `data-coasting` while it spins on after a flick with no hand on it, and `data-disabled` when the wheel is disabled. Works with Tailwind variants or attribute selectors.",
          },
          { type: "code", code: STYLE_TAILWIND, lang: "tsx", title: "Tailwind" },
        ],
      },
      {
        id: "css-variables",
        title: "CSS variables",
        blocks: [
          {
            type: "p",
            text: "`Root` sets three variables. `--click-wheel-fraction` is the value as a number from 0 to 1. `--click-wheel-turns` is the value's distance from `min` in revolutions, so 1.5 means one and a half laps; draw one ring per lap and the arc always matches the finger. `--click-wheel-rotation` is the cumulative angle of the rotor in degrees. During a gesture they update directly from the continuous position. When it ends, progress reconciles to the accepted value, including any step rounding. Changes to bounds and gearing also update progress.",
          },
          { type: "code", code: STYLE_CSS, lang: "css", title: "wheel.css" },
          {
            type: "p",
            text: "The `Rotor` sets `will-change: transform`, so a turn moves a cached layer instead of repainting the texture on every pointer sample. Do not put a transition on its `rotate`: a ramp that restarts on every touch sample stutters on phones.",
          },
        ],
      },
      {
        id: "functions-of-state",
        title: "Functions of state",
        blocks: [
          {
            type: "p",
            text: "`className` and `style` accept a function of the part's state. The state is `{ value, dragging, coasting, disabled }`.",
          },
          { type: "code", code: STYLE_FUNCTION, lang: "tsx", title: "className as a function" },
        ],
      },
      {
        id: "render-prop",
        title: "The render prop",
        blocks: [
          {
            type: "p",
            text: "Replace a part's element or compose it with your own component. Handlers chain, class names join, other props override. Refs are composed, including callback cleanup functions. Custom components must forward the received props and ref.",
          },
          { type: "code", code: STYLE_RENDER, lang: "tsx", title: "render" },
        ],
      },
    ],
  },
  {
    slug: "api",
    href: "/docs/api",
    group: "Basics",
    title: "API Reference",
    description: "Four parts, one namespace. Every part also takes the common props at the end.",
    sections: [
      {
        id: "anatomy",
        title: "Anatomy",
        blocks: [{ type: "code", code: ANATOMY, lang: "tsx", title: "anatomy" }],
      },
      {
        id: "root",
        title: "Root",
        blocks: [
          { type: "p", text: "Renders a `div`. Holds the value, the gestures, and the CSS variables." },
          {
            type: "table",
            caption: "Root props",
            columns: PROP_COLUMNS,
            mono: [0, 1, 2],
            rows: [
              ["value", "number", "—", "Controlled value. The accepted prop determines the value and settled progress."],
              ["defaultValue", "number", "min", "Starting value when uncontrolled."],
              ["min", "number", "0", "Lower bound."],
              ["max", "number", "100", "Upper bound."],
              ["step", "number", "1", "Granularity of emitted values. Also the arrow-key step. Both bounds remain reachable even when off the step grid."],
              ["unitsPerTurn", "number", "100", "The gearing: how far one full revolution moves the value."],
              ["detent", "number", "0", "Units between detents. onTick fires for every crossing, including multiple crossings in one update. 0 disables detents."],
              ["haptics", "boolean", "true", "Pulse the motor when detents are crossed, where supported. Multiple crossings in one update share a pulse."],
              ["inertia", "boolean", "false", "Keep spinning after a flick and slow down like an iOS scroll. A touch grabs the wheel; scroll and keys stop it."],
              ["decelerationRate", "number", "0.998", "Velocity kept per millisecond while coasting. 0.998 is the iOS default; 0.99 stops fast."],
              ["disabled", "boolean", "false", "Inert. Cancels an active interaction without committing, sets data-disabled on every part, and omits the hidden input from form submission."],
              ["name", "string", "—", "Renders a hidden input with this name, for forms."],
              ["onValueChange", "(value: number, details: ChangeDetails) => void", "—", "Fires on every change while dragging, coasting, scrolling or keying."],
              ["onValueCommitted", "(value: number, details: ChangeDetails) => void", "—", "Fires once when an interaction completes, even if the value did not change. With inertia, waits until the wheel settles. Cancelled interactions do not commit."],
              ["onInteractionChange", "(active: boolean, details: InteractionDetails) => void", "—", "Brackets pointer, scroll and keyboard interactions, including coasting. Always ends, including cancellation and unmount."],
              ["onDraggingChange", "(dragging: boolean) => void", "—", "Reports only when a pointer takes or releases the ring. Use onInteractionChange to track the full interaction, including coasting, scroll and keyboard input."],
              ["onTick", "(direction: 1 | -1) => void", "—", "Fires per detent crossing. Wire up a click sound."],
            ],
          },
        ],
      },
      {
        id: "interaction-lifecycle",
        title: "Interaction lifecycle",
        blocks: [
          { type: "p", text: "`ClickWheel.ChangeDetails` contains `source`: `pointer`, `wheel`, or `keyboard`. `ClickWheel.InteractionDetails` also contains `cancelled`. An interaction starts with `onInteractionChange(true)`, emits value changes, commits once, then ends with `onInteractionChange(false)`. A pointer interaction includes its coast; grabbing that coast continues the same interaction. Scroll events are grouped until 150 ms of inactivity; each keyboard action commits immediately." },
          { type: "p", text: "Disabling, pointer cancellation, losing capture, window blur during a drag, or unmounting ends the interaction with `cancelled: true` and no commit. Already accepted values remain. Use `onInteractionChange` to suspend and resume playback-driven updates, and `onValueCommitted` to seek. `onDraggingChange` only reports whether a pointer holds the ring." },
        ],
      },
      {
        id: "ring",
        title: "Ring",
        blocks: [
          {
            type: "p",
            text: 'Renders a `div` with `role="slider"`. Pointer, scroll and keyboard input live here.',
          },
          {
            type: "table",
            caption: "Ring props",
            columns: PROP_COLUMNS,
            mono: [0, 1, 2],
            rows: [
              ["aria-label", "string", "—", "The accessible name. The ring is the slider."],
              ["getAriaValueText", "(value: number) => string", "—", "Formats the value for screen readers, e.g. seconds to “1 min 20 sec”."],
            ],
          },
        ],
      },
      {
        id: "rotor",
        title: "Rotor",
        blocks: [
          {
            type: "p",
            text: "Renders an `aria-hidden` `div` with `rotate: var(--click-wheel-rotation)`. Give it a texture; it does the turning. No props of its own.",
          },
        ],
      },
      {
        id: "center",
        title: "Center",
        blocks: [
          {
            type: "p",
            text: "Renders a `button` with `type=button`, including when composed with `render`. An explicit `type=submit` is respected. Pass `onClick` and an `aria-label`, or render a `div` for a plain hub. A disabled Root prevents Center activation even when a custom element overrides its disabled prop.",
          },
        ],
      },
      {
        id: "common-props",
        title: "Common props",
        blocks: [
          { type: "p", text: "Every part accepts these, plus the props of the element it renders." },
          {
            type: "table",
            caption: "Common props",
            columns: PROP_COLUMNS,
            mono: [0, 1, 2],
            rows: [
              ["className", "string | (state) => string", "—", "A class string, or a function of the part's state."],
              ["style", "CSSProperties | (state) => CSSProperties", "—", "A style object, or a function of the part's state."],
              ["render", "ReactElement | (props, state) => ReactElement", "—", "Replace the default element or compose with your own component. Props merge: handlers chain, classes join."],
            ],
          },
        ],
      },
      {
        id: "state",
        title: "State",
        blocks: [
          { type: "p", text: "The object passed to `className`, `style` and `render` functions, exported as `ClickWheel.State`." },
          {
            type: "table",
            caption: "State fields",
            columns: ["Field", "Type", "Description"],
            mono: [0, 1],
            rows: [
              ["value", "number", "The current value."],
              ["dragging", "boolean", "A pointer is holding the ring."],
              ["coasting", "boolean", "The ring is spinning on after a flick, with no hand on it."],
              ["disabled", "boolean", "The wheel is disabled."],
            ],
          },
        ],
      },
      {
        id: "helpers",
        title: "Helpers",
        blocks: [
          {
            type: "table",
            caption: "Haptics helpers",
            columns: ["Export", "Type", "Description"],
            mono: [0, 1],
            rows: [
              ["haptic(ms?)", "(durationMs?: number) => void", "One pulse. The duration applies to the Vibration API, default 4."],
              ["hapticsSupported()", "() => boolean", "True when this browser has any path to a pulse."],
              ["<HapticTap />", "input props", "An invisible switch that covers its parent so a real tap ticks on iOS. The click still bubbles."],
            ],
          },
        ],
      },
      {
        id: "keyboard",
        title: "Keyboard",
        blocks: [
          {
            type: "table",
            caption: "Keyboard",
            columns: ["Key", "Action"],
            mono: [0],
            rows: [
              ["Arrow Up / Arrow Right", "+ step"],
              ["Arrow Down / Arrow Left", "− step"],
              ["Page Up / Page Down", "± one sixth of a turn"],
              ["Home / End", "min / max"],
            ],
          },
          {
            type: "p",
            text: "The ring announces itself as a slider with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`. Use `getAriaValueText` for a spoken format.",
          },
        ],
      },
    ],
  },
  {
    slug: "default",
    href: "/examples/default",
    group: "Examples",
    title: "Default",
    description: "The most basic setup for a click wheel, then the props that make it yours.",
    sections: [
      {
        id: "basic",
        title: "Basic",
        blocks: [
          {
            type: "p",
            text: "The four parts with Tailwind classes. One lap is one minute; a detent every five seconds.",
          },
          { type: "example", id: "basic", file: "basic.tsx" },
        ],
      },
      {
        id: "gearing",
        title: "Gearing",
        blocks: [
          {
            type: "p",
            text: "`unitsPerTurn` decides what one lap means. Thirty seconds for surgical edits, five minutes to cross a podcast. The range never changes; only the precision does.",
          },
          { type: "example", id: "gearing", file: "gearing.tsx" },
        ],
      },
      {
        id: "detents",
        title: "Detents",
        blocks: [
          {
            type: "p",
            text: "`detent` sets the units between clicks. Each crossing fires `onTick`, which here plays a short blip. Haptics pulse once per update that crosses a detent.",
          },
          { type: "example", id: "detents", file: "detents.tsx" },
        ],
      },
      {
        id: "inertia",
        title: "Inertia",
        blocks: [
          {
            type: "p",
            text: "Opt in with `inertia` and a flick keeps the wheel spinning, slowing like an iOS scroll. Detents keep clicking as it coasts and a touch grabs it. `onDraggingChange` reports only the hand; `data-coasting` marks the spin after release; `onValueCommitted` waits until it settles. `decelerationRate` is the velocity kept per millisecond: 0.998 is the iOS default, 0.99 stops fast.",
          },
          { type: "example", id: "inertia", file: "inertia.tsx" },
        ],
      },
      {
        id: "controlled",
        title: "Controlled",
        blocks: [
          {
            type: "p",
            text: "Own the value with `value` and `onValueChange`. `onInteractionChange` tells you when the wheel owns the position, including scroll, keyboard and coasting. Freeze playback-driven readout updates while active, then seek the audio in `onValueCommitted`. Audio can keep playing throughout.",
          },
          { type: "example", id: "controlled", file: "controlled.tsx" },
        ],
      },
    ],
  },
  {
    slug: "themes",
    href: "/examples/themes",
    group: "Examples",
    title: "Themes",
    sections: [
      {
        id: "skins",
        title: "Skins",
        blocks: [{ type: "themes" }],
      },
    ],
  },
];

export function getPage(slug: string): DocPageDef | undefined {
  return PAGES.find((page) => page.slug === slug);
}

export const BASICS = PAGES.filter((page) => page.group === "Basics");
export const EXAMPLE_PAGES = PAGES.filter((page) => page.group === "Examples");

/** The shortest useful description, shared by llms.txt, metadata and the README. */
export const SUMMARY =
  "An unstyled, iPod-style rotary input for React. A slider with gearing instead of length: one revolution moves the value by `unitsPerTurn`. Parts in the Base UI style (Root, Ring, Rotor, Center), data attributes, CSS variables, haptics, zero dependencies.";
