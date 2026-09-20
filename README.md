# Click Wheel

An unstyled, iPod-style click wheel for React. A slider with gearing instead
of length: one revolution moves the value by `unitsPerTurn`, so range and
precision are a prop you choose, not a function of screen space.

- Parts, not a black box: `Root`, `Ring`, `Rotor`, `Center`, in the style of
  [Base UI](https://base-ui.com). No classes, no visual styles.
- State reaches CSS as `data-turning` / `data-disabled`, the CSS variables
  `--click-wheel-fraction` and `--click-wheel-rotation`, and `className` /
  `style` functions of state. Every part takes a `render` prop.
- Pointer drag, scroll wheel, and full keyboard support. Announced as a slider.
- Opt-in inertia: flick it and it coasts like an iOS scroll, detents clicking
  as it slows. A touch grabs it again.
- Haptics on detents: Vibration API on Android, the switch trick on iOS 17.4
  to 26.4, and `<HapticTap />` for real taps on iOS 26.5+.
- Zero dependencies beyond React 19. Copy `src/components/click-wheel`.

```bash
bun install
bun dev   # http://localhost:3000 — best tried on a phone
```

## Usage

```tsx
import { ClickWheel } from "@/components/click-wheel";

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
</ClickWheel.Root>
```

## Themes

`src/themes/` holds four skins of the same parts:

| Theme   | How                                    |
| ------- | -------------------------------------- |
| Default | shadcn/ui tokens and Tailwind classes  |
| Blue    | the same classes, a different token set |
| iPod    | plain CSS, printed glyphs, a domed hub |
| TE      | plain CSS, flat disc, one orange index |

Each `wheel.tsx` is the copyable part. `demo.tsx` and `demo.css` are the
site chrome around it.

## For agents

The site is agent-readable by design. One content source renders both the
HTML docs and their Markdown twin, so they never drift.

| URL | What |
| --- | --- |
| `/llms.txt` | The index an agent reads first: summary, install, links, quick reference |
| `/llms-full.txt` | The docs plus every source file, in one document |
| `/docs.md` | The docs page as Markdown (also `Accept: text/markdown` on `/docs`) |
| `/r/registry.json` | shadcn registry index; `npx shadcn@latest add <site>/r/click-wheel.json` installs the component |

Set `NEXT_PUBLIC_SITE_URL` so the absolute links point at your deployment.

## Site

Next.js App Router, Tailwind CSS v4, Base UI for the small controls, shiki
for code. The home page is the hero demo and the theme gallery. The docs
(`/docs`, `/docs/styling`, `/docs/haptics`, `/docs/api`) and the examples
(`/examples/default`, `/examples/themes`, `/examples/other`) all render from
one content file, `src/content/docs.ts`. Example previews live in
`src/examples/`; the page reads each file from disk, so the code shown is the
code that runs.
