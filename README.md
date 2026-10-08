# Click Wheel

An unstyled rotary input for React. Supports drag, scroll, keyboard input, haptics and optional inertia.

[![Click Wheel theme demos](website/public/demo/click-wheel.gif)](website/public/demo/click-wheel.mp4)

[Docs](https://click-wheel.vercel.app/docs) · [Examples](https://click-wheel.vercel.app/examples/default) · [Themes](https://click-wheel.vercel.app/examples/themes)

## Install

```sh
pnpm add click-wheel
```

Requires React 19.2 or newer.

```tsx
import { ClickWheel } from "click-wheel";
```

Use the [basic example](https://click-wheel.vercel.app/examples/default#basic) to get started. The parts are unstyled; add your own CSS or use one of the website's themes.

Themes can also be added with the shadcn CLI:

```sh
pnpm dlx shadcn@latest add https://click-wheel.vercel.app/r/click-wheel-shadcn.json
```

## Development

```sh
pnpm install
pnpm dev
```

The site runs at `http://localhost:3000`. Run `pnpm check`, `pnpm test`, `pnpm lint` and `pnpm build` before publishing. Tests use Bun's test runner.

After editing the package, run `pnpm build:package` to update the site's workspace dependency.

MIT. See [LICENSE](packages/click-wheel/LICENSE). Demo assets retain their own licenses.
