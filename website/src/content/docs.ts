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
  | { type: "file"; file: string; title: string }
  | { type: "themes" }
  | { type: "demo"; id: "haptics"; fallback: string };

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
  unitsPerTurn={60}   // one lap = one minute
  detent={5}          // a tick every five seconds
>
  <ClickWheel.Ring aria-label="Playback position">
    <ClickWheel.Rotor />
  </ClickWheel.Ring>
  <ClickWheel.Center aria-label="Play" onClick={togglePlay}>
    <PlayIcon />
  </ClickWheel.Center>
</ClickWheel.Root>`;

const STYLE_TAILWIND = `<ClickWheel.Ring className="rounded-full bg-muted cursor-grab data-[turning]:cursor-grabbing data-[disabled]:opacity-50" />`;

const STYLE_CSS = `/* The value as an arc, no JavaScript. */
.arc {
  background: conic-gradient(
    var(--primary) calc(var(--click-wheel-fraction) * 360deg),
    transparent 0
  );
}

/* One ring per revolution, like the grooves of a record.
   This one fills during the third lap. */
.groove-3 {
  background: conic-gradient(
    var(--primary) calc(clamp(0, calc(var(--click-wheel-turns) - 2), 1) * 360deg),
    transparent 0
  );
}

/* Anything can turn with the finger, not only the Rotor. */
.needle {
  rotate: var(--click-wheel-rotation, 0deg);
}`;

const STYLE_FUNCTION = `<ClickWheel.Ring
  className={(state) => (state.turning ? "ring ring-active" : "ring")}
  style={(state) => ({ opacity: state.disabled ? 0.5 : 1 })}
/>`;

const STYLE_RENDER = `// A plain hub instead of a button.
<ClickWheel.Center render={<div />} />

// Or compose with your own component.
<ClickWheel.Center render={<Button variant="ghost" />} />`;

const HAPTICS_USAGE = `import { haptic, hapticsSupported, HapticTap } from "@/components/click-wheel";

// One pulse, from anywhere.
haptic();

// Real taps tick on every iOS version. Put it inside a positioned, tappable element.
<ClickWheel.Center className="relative" onClick={togglePlay}>
  <HapticTap />
  <PlayIcon />
</ClickWheel.Center>`;

const PROP_COLUMNS = ["Prop", "Type", "Default", "Description"];

const NATIVE_ANIMATE = `import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useClickWheel } from "@/components/click-wheel-native";

// Any descendant can animate from the wheel, on the UI thread.
function Needle() {
  const { rotation, fraction } = useClickWheel();
  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: \`\${rotation.value}deg\` }],
    opacity: 0.4 + fraction.value * 0.6,
  }));
  return <Animated.View style={[styles.needle, style]} />;
}`;

export const PAGES: DocPageDef[] = [
  {
    slug: "getting-started",
    href: "/docs",
    group: "Basics",
    title: "Getting Started",
    description:
      "Click Wheel is a rotary input component for React and React Native. A slider with gearing instead of length: one revolution moves the value by exactly as much as you say. It ships unstyled; you bring the styles.",
    sections: [
      {
        id: "installation",
        title: "Installation",
        blocks: [
          { type: "install" },
          {
            type: "p",
            text: "The command copies ten files into `components/click-wheel`, including `core.ts`, the math shared with the React Native version. On the web there are no dependencies beyond React 19. You can also copy the folder by hand.",
          },
          { type: "install", item: "click-wheel-native" },
          {
            type: "p",
            text: "For React Native, install this item instead. It needs Gesture Handler 3, Reanimated 3.16 or newer, and expo-haptics. The React Native page has the details.",
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
          {
            type: "p",
            text: "On React Native, import the same parts from `@/components/click-wheel-native`. The props match; styles are objects or functions of state instead of classes.",
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
      "Parts render plain elements with no classes and no visual styles. State reaches your CSS three ways. This page is the web; on React Native, styles are functions of state and Reanimated shared values. See React Native.",
    sections: [
      {
        id: "data-attributes",
        title: "Data attributes",
        blocks: [
          {
            type: "p",
            text: "Every part carries `data-turning` while the ring turns, by a finger or by inertia, and `data-disabled` when the wheel is disabled. Works with Tailwind variants or attribute selectors.",
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
            text: "`Root` sets three variables. `--click-wheel-fraction` is the value as a number from 0 to 1. `--click-wheel-turns` is the value's distance from `min` in revolutions, so 1.5 means one and a half laps; draw one ring per lap and the arc always matches the finger. `--click-wheel-rotation` is the cumulative angle of the rotor in degrees. All three update without a React render.",
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
            text: "`className` and `style` accept a function of the part's state. The state is `{ value, turning, disabled }`.",
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
            text: "Replace a part's element or compose it with your own component. Handlers chain, class names join, other props override. This is the Base UI contract.",
          },
          { type: "code", code: STYLE_RENDER, lang: "tsx", title: "render" },
        ],
      },
    ],
  },
  {
    slug: "haptics",
    href: "/docs/haptics",
    group: "Basics",
    title: "Haptics",
    description:
      "Each detent crossing pulses the motor when `haptics` is on, which is the default. There is no single web API for this, so `haptic()` takes the path that works.",
    sections: [
      {
        id: "support",
        title: "Support",
        blocks: [
          {
            type: "table",
            caption: "Haptics support by platform",
            columns: ["Platform", "Path", "Detents while turning", "Center press"],
            mono: [1],
            rows: [
              ["Android · Chrome, Firefox, Samsung", "navigator.vibrate", "Yes", "Yes"],
              ["iOS 17.4 – 26.4 · Safari", "Hidden switch toggled from script", "Yes", "Yes"],
              ["iOS 26.5+ · Safari", "Real taps on a switch only", "No", "With <HapticTap />"],
              ["Desktop", "No motor", "Silent", "Silent"],
              ["React Native · iOS and Android", "expo-haptics selectionAsync", "Yes", "Yes"],
            ],
          },
          {
            type: "p",
            text: 'On React Native every detent ticks through expo-haptics on both platforms, coasting included. The web is harder. Safari never shipped the Vibration API. Since 17.4 it renders `<input type="checkbox" switch>` as a native switch that ticks the Taptic engine when toggled, and until 26.4 a script could toggle it. iOS 26.5 closed that, so on current iPhones only a real tap on a switch vibrates. `HapticTap` is an invisible switch that covers a button; the tap ticks, the click still bubbles. A detent sound, like the clicker in the Detents example, covers the rest.',
          },
        ],
      },
      {
        id: "try-it",
        title: "Try it",
        blocks: [
          {
            type: "demo",
            id: "haptics",
            fallback: "The site has a live demo here: a button that calls `haptic()` and a button with `<HapticTap />` inside.",
          },
        ],
      },
      {
        id: "usage",
        title: "Usage",
        blocks: [{ type: "code", code: HAPTICS_USAGE, lang: "tsx", title: "haptics" }],
      },
    ],
  },
  {
    slug: "api",
    href: "/docs/api",
    group: "Basics",
    title: "API Reference",
    description: "Four parts, one namespace, on the web and on React Native. Every part also takes the common props at the end; the React Native page lists the few names that differ.",
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
          { type: "p", text: "Renders a `div` on the web and a `View` on React Native. Holds the value, the gestures, and the CSS variables or shared values." },
          {
            type: "table",
            caption: "Root props",
            columns: PROP_COLUMNS,
            mono: [0, 1, 2],
            rows: [
              ["value", "number", "—", "Controlled value."],
              ["defaultValue", "number", "min", "Starting value when uncontrolled."],
              ["min", "number", "0", "Lower bound."],
              ["max", "number", "100", "Upper bound."],
              ["step", "number", "1", "Granularity of emitted values. Also the arrow-key step."],
              ["unitsPerTurn", "number", "100", "The gearing: how far one full revolution moves the value."],
              ["detent", "number", "0", "Units between detents. Each crossing pulses haptics and fires onTick. 0 disables detents."],
              ["haptics", "boolean", "true", "Pulse the motor on each detent where the platform allows it."],
              ["inertia", "boolean", "false", "Keep spinning after a flick and slow down like an iOS scroll. A touch grabs the wheel; scroll and keys stop it."],
              ["decelerationRate", "number", "0.998", "Velocity kept per millisecond while coasting. 0.998 is the iOS default; 0.99 stops fast."],
              ["disabled", "boolean", "false", "Inert. Sets data-disabled on every part."],
              ["name", "string", "—", "Renders a hidden input with this name, for forms. Web only."],
              ["onValueChange", "(value: number) => void", "—", "Fires on every change while turning, coasting, scrolling or keying."],
              ["onValueCommitted", "(value: number) => void", "—", "Fires once when an interaction ends. With inertia, that is when the wheel settles."],
              ["onTurningChange", "(turning: boolean) => void", "—", "Fires when the ring starts turning and when it stops, including the coast after a flick. Pause a playhead here."],
              ["onTick", "(direction: 1 | -1) => void", "—", "Fires per detent crossing. Wire up a click sound."],
            ],
          },
        ],
      },
      {
        id: "ring",
        title: "Ring",
        blocks: [
          {
            type: "p",
            text: 'Renders a `div` with `role="slider"`. Pointer, scroll and keyboard input live here. On React Native it is a `View` with the pan gesture and the adjustable accessibility role; the props are `accessibilityLabel` and `getAccessibilityValueText`.',
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
            text: "Renders an `aria-hidden` `div` with `rotate: var(--click-wheel-rotation)`. On React Native it is an `Animated.View` driven by a shared value. Give it a texture; it does the turning. No props of its own.",
          },
        ],
      },
      {
        id: "center",
        title: "Center",
        blocks: [
          {
            type: "p",
            text: "Renders a `button`. Pass `onClick` and an `aria-label`. Render it as a `div` for a plain hub. On React Native it is a `Pressable` with `onPress` and `accessibilityLabel`. No props of its own.",
          },
        ],
      },
      {
        id: "common-props",
        title: "Common props",
        blocks: [
          { type: "p", text: "Every part accepts these on the web, plus the props of the element it renders. On React Native, `style` is the only one: an object or a function of state." },
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
              ["turning", "boolean", "The ring is turning: a pointer is on it, or it is still spinning after a flick."],
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
              ["haptic(ms?)", "(durationMs?: number) => void", "One pulse. Web: the duration applies to the Vibration API, default 4. React Native: one expo-haptics selection tick."],
              ["hapticsSupported()", "() => boolean", "Web only. True when this browser has any path to a pulse."],
              ["<HapticTap />", "input props", "Web only. An invisible switch that covers its parent so a real tap ticks on iOS. The click still bubbles."],
              ["useClickWheel()", "() => { state, rotation, fraction, turns }", "React Native only. The state, plus rotation, fraction and turns as shared values for your own animated styles."],
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
            text: "The ring announces itself as a slider with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`. Use `getAriaValueText` for a spoken format. Phones have no keyboard here; on React Native, VoiceOver and TalkBack step the value with the increment and decrement actions on the ring.",
          },
        ],
      },
    ],
  },
  {
    slug: "react-native",
    href: "/docs/react-native",
    group: "Basics",
    title: "React Native",
    description:
      "The same parts, the same math, on iOS and Android. Gestures and the coast run on the UI thread through Gesture Handler and Reanimated; haptics come from expo-haptics.",
    sections: [
      {
        id: "installation",
        title: "Installation",
        blocks: [
          { type: "install", item: "click-wheel-native" },
          {
            type: "p",
            text: "The command copies ten files into `components/click-wheel-native`, including `core.ts`, the math shared with the web version. It needs `react-native-gesture-handler` 3 or newer, `react-native-reanimated` 3.16 or newer, and `expo-haptics`. Not on Expo? `haptics.ts` is one function; swap it for your own.",
          },
        ],
      },
      {
        id: "usage",
        title: "Usage",
        blocks: [
          {
            type: "p",
            text: "The anatomy matches the web. `Root` holds the value, `Ring` takes the pan gesture, `Rotor` turns with the finger, `Center` is a `Pressable`. Styles are plain `StyleSheet` styles, or functions of `{ value, turning, disabled }`.",
          },
          { type: "file", file: "player.tsx", title: "Player.tsx" },
        ],
      },
      {
        id: "animate",
        title: "Animate from the wheel",
        blocks: [
          {
            type: "p",
            text: "Where the web exposes CSS variables, native exposes shared values. `useClickWheel()` returns `rotation` in degrees, `fraction` from 0 to 1, and `turns`, the value's distance from `min` in revolutions, all updated on the UI thread without a React render.",
          },
          { type: "code", code: NATIVE_ANIMATE, lang: "tsx", title: "Needle.tsx" },
        ],
      },
      {
        id: "differences",
        title: "Differences from the web",
        blocks: [
          {
            type: "table",
            caption: "Web and native compared",
            columns: ["Web", "React Native"],
            mono: [0, 1],
            rows: [
              ["className, data-turning, data-disabled", "style as a function of { value, turning, disabled }"],
              ["--click-wheel-rotation, --click-wheel-fraction, --click-wheel-turns", "useClickWheel().rotation, .fraction and .turns, shared values"],
              ["render prop", "Not needed: pass any View props; Center is a Pressable"],
              ["Scroll wheel input", "None"],
              ["Arrow keys, Home, End", "Accessibility increment and decrement actions"],
              ["aria-label, getAriaValueText", "accessibilityLabel, getAccessibilityValueText"],
              ["Haptics: Vibration API, switch trick", "expo-haptics selectionAsync on every detent, every platform"],
              ["name for forms", "None"],
            ],
          },
          {
            type: "p",
            text: "Everything else is identical: `value`, `defaultValue`, `min`, `max`, `step`, `unitsPerTurn`, `detent`, `haptics`, `inertia`, `decelerationRate`, `disabled`, and the four callbacks. Haptics are better on native: every detent ticks on iOS and Android, coasting included.",
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
    description: "The most basic setup for a click wheel, then the props that make it yours. These previews run on the web; the React Native player is on the React Native page.",
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
            text: "`detent` sets the units between clicks. Each crossing pulses the motor and fires `onTick`, which here plays a short blip.",
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
            text: "Opt in with `inertia` and a flick keeps the wheel spinning, slowing like an iOS scroll. Detents keep clicking as it coasts, a touch grabs it, and `onTurningChange` waits until it settles. `decelerationRate` is the velocity kept per millisecond: 0.998 is the iOS default, 0.99 stops fast.",
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
            text: "Own the value with `value` and `onValueChange`. `onTurningChange` tells you when a scrub starts and ends, so playback can pause under the thumb. `onValueCommitted` fires once per gesture.",
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
  {
    slug: "other",
    href: "/examples/other",
    group: "Examples",
    title: "Other",
    description: "Smaller things the parts make easy.",
    sections: [
      {
        id: "plain-hub",
        title: "Plain hub",
        blocks: [
          {
            type: "p",
            text: "Not every wheel needs a button in the middle. `render={<div />}` turns the center into a readout.",
          },
          { type: "example", id: "plain-hub", file: "plain-hub.tsx" },
        ],
      },
      {
        id: "value-arc",
        title: "Value arc",
        blocks: [
          {
            type: "p",
            text: "The CSS variables at work: a conic arc from `--click-wheel-fraction` and a needle from `--click-wheel-rotation`. Neither needs a React render.",
          },
          { type: "example", id: "arc", file: "arc.tsx" },
        ],
      },
      {
        id: "vinyl",
        title: "Vinyl",
        blocks: [
          {
            type: "p",
            text: "A progress bar that respects the gearing. `--click-wheel-turns` counts laps, so each ring is one revolution and fills as that lap completes, outer to inner like the grooves of a record. The stock skin does this when you pass `grooves`; here it is in the raw.",
          },
          { type: "example", id: "vinyl", file: "vinyl.tsx" },
        ],
      },
      {
        id: "disabled",
        title: "Disabled",
        blocks: [
          {
            type: "p",
            text: "`disabled` makes the wheel inert and puts `data-disabled` on every part.",
          },
          { type: "example", id: "disabled", file: "disabled.tsx" },
        ],
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
  "An unstyled, iPod-style rotary input for React and React Native. A slider with gearing instead of length: one revolution moves the value by `unitsPerTurn`. Parts in the Base UI style (Root, Ring, Rotor, Center), data attributes, CSS variables, haptics, zero dependencies.";
