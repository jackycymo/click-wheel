import { afterEach, describe, expect, test } from "bun:test";
import * as React from "react";
import { createRoot, type Root as ReactRoot } from "react-dom/client";
import { ClickWheel } from "../src/web";
import { advanceFrame, pendingFrames } from "./setup";

const mounted: Array<{ root: ReactRoot; container: HTMLDivElement }> = [];

afterEach(async () => {
  for (const { root, container } of mounted.splice(0)) {
    await React.act(async () => root.unmount());
    container.remove();
  }
  expect(pendingFrames()).toBe(0);
});

async function mount(
  props: ClickWheel.RootProps = {},
  children: React.ReactNode = <ClickWheel.Ring aria-label="Test wheel" />,
) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  mounted.push({ root, container });
  const render = async (next: ClickWheel.RootProps) => {
    await React.act(async () => root.render(<ClickWheel.Root haptics={false} {...next}>{children}</ClickWheel.Root>));
  };
  await render(props);
  const ring = () => container.querySelector<HTMLElement>('[role="slider"]')!;
  const value = () => Number(ring().getAttribute("aria-valuenow"));
  const css = (name: string) => Number((container.firstElementChild as HTMLElement).style.getPropertyValue(`--click-wheel-${name}`));
  const key = async (key: string) => {
    await React.act(async () => ring().dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true })));
  };
  const pointer = async (type: string, x: number, y: number, time = 0) => {
    ring().getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100, toJSON() {} });
    const event = new PointerEvent(type, { bubbles: true, pointerId: 1, button: 0, clientX: x, clientY: y });
    Object.defineProperty(event, "timeStamp", { value: 1000 + time });
    await React.act(async () => ring().dispatchEvent(event));
  };
  const scroll = async (deltaY: number) => {
    await React.act(async () => ring().dispatchEvent(new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true })));
  };
  return { container, root, render, ring, value, css, key, pointer, scroll };
}

describe("value and progress", () => {
  test("a controlled value can reject a keyboard update without moving the arc", async () => {
    const requested: number[] = [];
    const wheel = await mount({ value: 20, onValueChange: (value) => requested.push(value) });
    await wheel.key("ArrowRight");
    expect(requested).toEqual([21]);
    expect(wheel.value()).toBe(20);
    expect(wheel.css("fraction")).toBe(0.2);
  });

  test("a controlled value is restored after rejecting a drag", async () => {
    const wheel = await mount({ value: 20 });
    await wheel.pointer("pointerdown", 100, 50);
    await wheel.pointer("pointermove", 50, 100);
    expect(wheel.css("fraction")).toBe(0.45);
    await wheel.pointer("pointerup", 50, 100);
    expect(wheel.value()).toBe(20);
    expect(wheel.css("fraction")).toBe(0.2);
  });

  test("changing bounds and gearing recomputes progress with the new props", async () => {
    const wheel = await mount({ value: 20, max: 100, unitsPerTurn: 100 });
    await wheel.render({ value: 20, max: 200, unitsPerTurn: 50 });
    expect(wheel.css("fraction")).toBe(0.1);
    expect(wheel.css("turns")).toBe(0.4);
  });

  test("gearing still updates after the wheel emits a value", async () => {
    const wheel = await mount({ defaultValue: 20 });
    await wheel.key("ArrowRight");
    await wheel.render({ defaultValue: 20, unitsPerTurn: 50 });
    expect(wheel.value()).toBe(21);
    expect(wheel.css("turns")).toBe(0.42);
  });

  test("progress stays continuous during a stepped drag and snaps when settled", async () => {
    const wheel = await mount({ defaultValue: 0, step: 10 });
    await wheel.pointer("pointerdown", 100, 50);
    await wheel.pointer("pointermove", 50, 100);
    expect(wheel.value()).toBe(30);
    expect(wheel.css("fraction")).toBe(0.25);
    await wheel.pointer("pointerup", 50, 100);
    expect(wheel.css("fraction")).toBe(0.3);
  });

  test("Home and End reach off-grid bounds and agree with the arc", async () => {
    const wheel = await mount({ min: 2, max: 100, step: 3 });
    await wheel.key("End");
    expect(wheel.value()).toBe(100);
    expect(wheel.css("fraction")).toBe(1);
    await wheel.key("Home");
    expect(wheel.value()).toBe(2);
    expect(wheel.css("fraction")).toBe(0);
  });

  test("onTick reports every boundary crossed in both directions", async () => {
    const ticks: number[] = [];
    const wheel = await mount({ min: 10, max: 100, unitsPerTurn: 120, detent: 5, onTick: (direction) => ticks.push(direction) });
    await wheel.key("PageUp");
    expect(wheel.value()).toBe(30);
    expect(ticks).toEqual([1, 1, 1, 1]);
    await wheel.key("PageDown");
    expect(ticks).toEqual([1, 1, 1, 1, -1, -1, -1, -1]);
  });
});

describe("interaction lifecycle", () => {
  test("keyboard callbacks include their source and bracket the committed value", async () => {
    const events: unknown[] = [];
    const wheel = await mount({
      onInteractionChange: (active, details) => events.push([active, details]),
      onValueChange: (value, details) => events.push(["change", value, details]),
      onValueCommitted: (value, details) => events.push(["commit", value, details]),
    });
    await wheel.key("ArrowRight");
    expect(events).toEqual([
      [true, { source: "keyboard", cancelled: false }],
      ["change", 1, { source: "keyboard" }],
      ["commit", 1, { source: "keyboard" }],
      [false, { source: "keyboard", cancelled: false }],
    ]);
  });

  test("scroll events form one interaction even when the value cannot change", async () => {
    const interactions: unknown[] = [];
    const commits: number[] = [];
    const wheel = await mount({
      value: 100,
      onInteractionChange: (active, details) => interactions.push([active, details]),
      onValueCommitted: (value) => commits.push(value),
    });
    await wheel.scroll(-10);
    await wheel.scroll(-10);
    expect(interactions).toEqual([[true, { source: "wheel", cancelled: false }]]);
    expect(commits).toEqual([]);
    await React.act(async () => { await new Promise((resolve) => setTimeout(resolve, 180)); });
    expect(commits).toEqual([100]);
    expect(interactions).toEqual([
      [true, { source: "wheel", cancelled: false }],
      [false, { source: "wheel", cancelled: false }],
    ]);
  });

  test("a flick remains active through coasting and only commits once", async () => {
    const active: boolean[] = [];
    const dragging: boolean[] = [];
    const commits: number[] = [];
    const wheel = await mount({
      max: 1000, inertia: true,
      onInteractionChange: (value) => active.push(value),
      onDraggingChange: (value) => dragging.push(value),
      onValueCommitted: (value) => commits.push(value),
    });
    await wheel.pointer("pointerdown", 100, 50, 0);
    await wheel.pointer("pointermove", 50, 100, 20);
    await wheel.pointer("pointerup", 50, 100, 21);
    expect(wheel.ring().hasAttribute("data-coasting")).toBe(true);
    expect(active).toEqual([true]);
    expect(dragging).toEqual([true, false]);
    await React.act(async () => {
      for (let time = 1037; time < 11000 && pendingFrames(); time += 16) advanceFrame(time);
    });
    expect(active).toEqual([true, false]);
    expect(commits).toHaveLength(1);
    expect(wheel.css("fraction")).toBe(wheel.value() / 1000);
  });

  test("disabling during a drag cancels it and ignores later pointer movement", async () => {
    const interactions: unknown[] = [];
    let commits = 0;
    const props = { defaultValue: 20, onValueCommitted: () => commits++, onInteractionChange: (active: boolean, details: ClickWheel.InteractionDetails) => interactions.push([active, details]) };
    const wheel = await mount(props);
    await wheel.pointer("pointerdown", 100, 50);
    await wheel.render({ ...props, disabled: true });
    await wheel.pointer("pointermove", 50, 100);
    await wheel.pointer("pointerup", 50, 100);
    expect(wheel.value()).toBe(20);
    expect(wheel.ring().hasAttribute("data-dragging")).toBe(false);
    expect(commits).toBe(0);
    expect(interactions).toEqual([
      [true, { source: "pointer", cancelled: false }],
      [false, { source: "pointer", cancelled: true }],
    ]);
  });

  test("disabling cancels a coast without emitting another value or commit", async () => {
    let commits = 0;
    const props = { inertia: true, max: 1000, onValueCommitted: () => commits++ };
    const wheel = await mount(props);
    await wheel.pointer("pointerdown", 100, 50, 0);
    await wheel.pointer("pointermove", 50, 100, 20);
    await wheel.pointer("pointerup", 50, 100, 21);
    expect(pendingFrames()).toBe(1);
    const value = wheel.value();
    await wheel.render({ ...props, disabled: true });
    await React.act(async () => advanceFrame(1037));
    expect(pendingFrames()).toBe(0);
    expect(wheel.value()).toBe(value);
    expect(commits).toBe(0);
  });

  test("unmount releases a scroll interaction without a later commit", async () => {
    const active: boolean[] = [];
    let cancelled = false;
    let commits = 0;
    const wheel = await mount({
      onInteractionChange: (value, details) => { active.push(value); cancelled = details.cancelled; },
      onValueCommitted: () => commits++,
    });
    await wheel.scroll(-10);
    await React.act(async () => wheel.root.unmount());
    mounted.pop();
    wheel.container.remove();
    await new Promise((resolve) => setTimeout(resolve, 180));
    expect(active).toEqual([true, false]);
    expect(cancelled).toBe(true);
    expect(commits).toBe(0);
  });
});

describe("composition and forms", () => {
  test("composed buttons retain type=button unless explicitly overridden", async () => {
    const wheel = await mount({}, <>
      <ClickWheel.Center render={<button />} />
      <ClickWheel.Center render={<button type="submit" />} />
      <ClickWheel.Center render={(props) => <button {...props} />} />
    </>);
    expect([...wheel.container.querySelectorAll("button")].map((button) => button.type)).toEqual(["button", "submit", "button"]);
  });

  test("disabled custom centers cannot invoke handlers or override root disabled", async () => {
    let clicks = 0;
    const wheel = await mount({ disabled: true }, <>
      <ClickWheel.Center onClick={() => clicks++} render={<a href="#test" onClick={() => clicks++} />} />
      <ClickWheel.Center render={<button disabled={false} onClick={() => clicks++} />} />
    </>);
    const anchor = wheel.container.querySelector("a")!;
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    await React.act(async () => anchor.dispatchEvent(event));
    expect(clicks).toBe(0);
    expect(event.defaultPrevented).toBe(true);
    expect(anchor.getAttribute("aria-disabled")).toBe("true");
    expect(anchor.tabIndex).toBe(-1);
    expect(wheel.container.querySelector("button")!.disabled).toBe(true);
  });

  test("plain hubs do not acquire button attributes", async () => {
    const wheel = await mount({}, <ClickWheel.Center render={<div data-hub />} />);
    const hub = wheel.container.querySelector("[data-hub]")!;
    expect(hub.hasAttribute("type")).toBe(false);
    expect(hub.hasAttribute("role")).toBe(false);
    expect(hub.hasAttribute("tabindex")).toBe(false);
  });

  test("disabled wheels are omitted from form data", async () => {
    const wheel = await mount({ name: "position", defaultValue: 20 });
    const form = document.createElement("form");
    document.body.appendChild(form);
    form.appendChild(wheel.container);
    expect(new FormData(form).get("position")).toBe("20");
    await wheel.render({ name: "position", defaultValue: 20, disabled: true });
    expect(new FormData(form).has("position")).toBe(false);
    document.body.appendChild(wheel.container);
    form.remove();
  });

  test("merged refs stay attached across updates and run both cleanup functions", async () => {
    const attached: string[] = [];
    const cleaned: string[] = [];
    const ref = (name: string): React.RefCallback<HTMLElement> => (node) => {
      if (!node) return;
      attached.push(name);
      return () => { cleaned.push(name); };
    };
    const rootRef = ref("root");
    const partRef = ref("part");
    const renderRef = ref("render");
    const wheel = await mount({ ref: rootRef }, <ClickWheel.Ring ref={partRef} render={<div ref={renderRef} />} />);
    await wheel.key("ArrowRight");
    await wheel.key("ArrowRight");
    expect(attached.toSorted()).toEqual(["part", "render", "root"]);
    expect(cleaned).toEqual([]);
    await React.act(async () => wheel.root.unmount());
    mounted.pop();
    wheel.container.remove();
    expect(cleaned.toSorted()).toEqual(["part", "render", "root"]);
  });
});
