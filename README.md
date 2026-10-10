# Click Wheel

An unstyled rotary input for React. Supports drag, scroll, keyboard input, haptics and optional inertia.

[Watch the demo](https://github.com/jackycymo/click-wheel/raw/refs/heads/main/website/public/demo/click-wheel.mp4)

20-second demo with sound · [Video credits](website/public/demo/click-wheel-credits.txt)

[Docs](https://click-wheel.jackymo.me/docs) · [Examples](https://click-wheel.jackymo.me/examples/default) · [Themes](https://click-wheel.jackymo.me/examples/themes)

## Install

```sh
pnpm add click-wheel
```

Requires React 19.2 or newer.

```tsx
import { ClickWheel } from "click-wheel";
```

Use the [basic example](https://click-wheel.jackymo.me/examples/default#basic) to get started. The parts are unstyled; add your own CSS or use one of the website's themes.

Themes can also be added with the shadcn CLI:

```sh
pnpm dlx shadcn@latest add https://click-wheel.jackymo.me/r/click-wheel-shadcn.json
```

## Development

```sh
pnpm install
pnpm dev
```

MIT. See [LICENSE](packages/click-wheel/LICENSE). Demo assets retain their own licenses.
