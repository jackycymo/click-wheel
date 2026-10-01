# click-wheel

An unstyled iPod-style click wheel for React 19.2 and newer. Parts in the Base
UI style, gearing instead of length, detents with haptics, optional inertia.

```
src/core.ts      the wheel math
src/web/         Root, Ring, Rotor, Center; data attributes, CSS variables, render prop
```

```tsx
import { ClickWheel } from "click-wheel";
```

Run `bun run check` to type-check the package and `bun run test` for behavioral
tests. The web files are also linted from the website with the React Hooks rules.
