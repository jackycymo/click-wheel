import * as React from "react";

/** Props every part accepts, following the Base UI `render` / `className` / `style` contract. */
export type PartProps<State, E extends React.ElementType> = Omit<
  React.ComponentPropsWithRef<E>,
  "className" | "style"
> & {
  /** A class string, or a function of the part's state that returns one. */
  className?: string | ((state: State) => string);
  /** A style object, or a function of the part's state that returns one. */
  style?: React.CSSProperties | ((state: State) => React.CSSProperties);
  /**
   * Replace the default element: pass an element to merge into, or a function
   * that receives the part's props and state and returns an element.
   */
  render?:
    | React.ReactElement<Record<string, unknown>>
    | ((props: Record<string, unknown>, state: State) => React.ReactElement);
};

type AnyProps = Record<string, unknown>;

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  return (node) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === "function") {
        const cleanup = ref(node);
        return typeof cleanup === "function" ? cleanup : () => ref(null);
      }
      if (ref) {
        ref.current = node;
        return () => { ref.current = null; };
      }
    });
    return () => { for (const cleanup of cleanups) cleanup?.(); };
  };
}

/** Stable merged ref, so React does not detach and re-attach refs on every render. */
export function useMergedRefs<T>(
  a: React.Ref<T> | undefined,
  b: React.Ref<T> | undefined,
): React.RefCallback<T> {
  return React.useMemo(() => mergeRefs(a, b), [a, b]);
}

/**
 * Merge internal props with the user's. Handlers chain (user first), classes
 * join, styles merge, and any other external value wins.
 */
export function mergeProps(internal: AnyProps, external: AnyProps): AnyProps {
  const out: AnyProps = { ...internal };
  for (const key of Object.keys(external)) {
    const a = internal[key];
    const b = external[key];
    if (b === undefined) continue;
    if (key === "className") {
      out.className = a ? `${a} ${b}` : b;
    } else if (key === "style") {
      out.style = { ...(a as object), ...(b as object) };
    } else if (/^on[A-Z]/.test(key) && typeof a === "function" && typeof b === "function") {
      out[key] = (...args: unknown[]) => {
        b(...args);
        a(...args);
      };
    } else {
      out[key] = b;
    }
  }
  return out;
}

/**
 * Render one part. `internal` holds the props the part needs to function;
 * `external` is what the consumer passed, including `render`.
 */
export function useRenderPart<State>(
  tag: keyof React.JSX.IntrinsicElements,
  state: State,
  external: PartProps<State, React.ElementType>,
  internal: AnyProps,
): React.ReactElement {
  const { render, className, style, ...rest } = external;
  const resolved: AnyProps = {
    ...rest,
    className: typeof className === "function" ? className(state) : className,
    style: typeof style === "function" ? style(state) : style,
  };
  const props = mergeProps(internal, resolved);
  const ref = useMergedRefs(
    props.ref as React.Ref<unknown>,
    typeof render === "object" ? render.props.ref as React.Ref<unknown> : undefined,
  );
  if (typeof render === "function") return render({ ...props, ref }, state);
  if (render) return React.cloneElement(render, { ...mergeProps(props, render.props), ref });
  return React.createElement(tag, { ...props, ref });
}
