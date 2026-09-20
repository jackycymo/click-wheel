# click-wheel

The iPod click wheel for React and React Native. Unstyled parts in the Base
UI style, gearing instead of length, detents with haptics, optional inertia.

```
src/core.ts      the math both versions share
src/web/         React: Root, Ring, Rotor, Center; data attributes, CSS variables, render prop
src/native/      React Native: the same parts on Gesture Handler 3 and Reanimated
examples/native  a styled player, type-checked against the native parts
```

```tsx
import { ClickWheel } from "click-wheel";          // web
import { ClickWheel } from "click-wheel/native";   // React Native
```

Check both targets with `bun run check`. The web files are also linted from
the website with the React Hooks rules.
