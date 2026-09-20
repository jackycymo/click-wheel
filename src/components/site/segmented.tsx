"use client";

import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";

export function Segmented<T extends string>({
  value,
  onValueChange,
  options,
  label,
}: {
  value: T;
  onValueChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
  label: string;
}) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(next: string[]) => {
        if (next[0]) onValueChange(next[0] as T);
      }}
      aria-label={label}
      className="inline-flex h-8 items-center rounded-md border bg-muted p-0.5 text-xs font-medium"
    >
      {options.map((option) => (
        <Toggle
          key={option.value}
          value={option.value}
          className="h-full rounded-sm px-2.5 text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring data-[pressed]:bg-background data-[pressed]:text-foreground data-[pressed]:shadow-xs"
        >
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
